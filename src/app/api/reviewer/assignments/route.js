import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';
import { sendReviewerInvitation } from '@/lib/mail';
import { journals } from '@/lib/data';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-123';


/**
 * POST /api/reviewer/assignments
 * Create a new reviewer assignment and send invitation email
 */
export async function POST(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const { submissionId, reviewerId, reviewerEmail, reviewerName, responseDueDate, reviewDueDate } = await req.json();

    if (!submissionId || !reviewerEmail || !reviewerName) {
      return NextResponse.json({ success: false, message: 'Submission ID, Reviewer Email and Reviewer Name are required' }, { status: 400 });
    }

    // 1. Fetch submission details for the email
    const [subRows] = await pool.query(
      'SELECT title, editor_comments, journal_id FROM submissions WHERE id = ?',
      [submissionId]
    );
    
    if (subRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }
    
    const submission = subRows[0];
    const articleTitle = submission.title;
    const abstract = submission.abstract || 'Original submission abstract not available. Follow link below to view details.';

    const targetJournal = journals.find(j => j.id === submission.journal_id) || journals[0];
    const journalName = targetJournal.title;

    // 2. Ensure reviewer exists
    let realReviewerId = reviewerId;
    if (!realReviewerId || realReviewerId === 999) {
      const [userRows] = await pool.query('SELECT id FROM users WHERE email = ?', [reviewerEmail]);
      if (userRows.length > 0) {
        realReviewerId = userRows[0].id;
      } else {
        const tempPassword = 'ReviewerPassword123!'; 
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const [insertUser] = await pool.query(
          'INSERT INTO users (fullName, email, password, username) VALUES (?, ?, ?, ?)',
          [reviewerName, reviewerEmail, hashedPassword, reviewerEmail.split('@')[0]]
        );
        realReviewerId = insertUser.insertId;
      }
    }

    const tokenPayload = { reviewerId: realReviewerId, submissionId };
    const acceptToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
    
    // Default deadlines if not provided
    const respDeadline = responseDueDate ? new Date(responseDueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const revDeadline = reviewDueDate ? new Date(reviewDueDate) : new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);

    const [result] = await pool.query(
      'INSERT INTO reviewer_assignments (submission_id, user_id, status, token, deadline, response_deadline, review_deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [submissionId, realReviewerId, 'Pending', acceptToken, respDeadline, respDeadline, revDeadline]
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const acceptLink = `${baseUrl}/api/review/accept?token=${acceptToken}`;
    const declineLink = `${baseUrl}/api/review/decline?token=${acceptToken}`;

    const [authorRows] = await pool.query(
      'SELECT u.email, u.fullName, u.id FROM users u JOIN submissions s ON s.user_id = u.id WHERE s.id = ?',
      [submissionId]
    );
    
    await pool.query(
      'UPDATE submissions SET status = ?, activity = ? WHERE id = ?',
      ['Under Review', 'Reviewers Assigned', submissionId]
    );

    if (authorRows.length > 0) {
      const author = authorRows[0];
      
      // ── Persistent Notifications ──
      // 1. Notify Author
      await pool.query(
        'INSERT INTO notifications (user_id, submission_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
        [author.id, submissionId, 'Review Process Started', `Your manuscript "${articleTitle.substring(0, 40)}..." is now Under Review.`, 'info']
      ).catch(e => console.error('Notify author failed:', e));

      // 2. Notify Reviewer
      await pool.query(
        'INSERT INTO notifications (user_id, submission_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
        [realReviewerId, submissionId, 'New Review Assignment', `You have been invited to review the manuscript "${articleTitle.substring(0, 40)}...".`, 'action_required']
      ).catch(e => console.error('Notify reviewer failed:', e));
    }

    const emailResult = await sendReviewerInvitation({
      to: reviewerEmail,
      reviewerName: reviewerName,
      journalName: journalName,
      articleTitle: articleTitle,
      abstract: abstract,
      responseDueDate: responseDueDate || respDeadline.toLocaleDateString(),
      reviewDueDate: reviewDueDate || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      submissionId: submissionId,
      editorName: user.username || 'Managing Editor',
      acceptLink: acceptLink,
      declineLink: declineLink,
    });

    return NextResponse.json({
      success: true,
      message: 'Assignment created and invitation sent',
      assignmentId: result.insertId,
      emailSent: emailResult.success
    }, { status: 201 });

  } catch (error) {
    console.error('Create assignment error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get('submissionId');

    let query = `
      SELECT ra.*, ra.response_deadline, ra.review_deadline, u.fullName as reviewerName, u.email as reviewerEmail 
      FROM reviewer_assignments ra
      JOIN users u ON ra.user_id = u.id
    `;
    const params = [];

    if (submissionId) {
      query += ' WHERE ra.submission_id = ?';
      params.push(submissionId);
    }

    const [rows] = await pool.query(query, params);
    return NextResponse.json({ success: true, assignments: rows }, { status: 200 });
  } catch (error) {
    console.error('Fetch assignments error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
