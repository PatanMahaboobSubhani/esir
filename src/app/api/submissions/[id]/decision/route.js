import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';
import { sendNotificationEmail } from '@/lib/mail';

/**
 * POST /api/submissions/[id]/decision
 * Records an editorial decision (Accept, Decline, Revisions Required)
 */
export async function POST(req, { params }) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  // Role Check: Only editors or admins can record decisions
  if (user.role !== 'editor' && user.role !== 'admin') {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const { decision, comments, finalFilePath } = await req.json();

    if (!decision) {
      return NextResponse.json({ success: false, message: 'Decision is required' }, { status: 400 });
    }

    // 1. Get submission and author info
    const [subRows] = await pool.query(
      'SELECT s.title, s.journal_id, u.email as authorEmail, u.fullName as authorName FROM submissions s JOIN users u ON s.user_id = u.id WHERE s.id = ?',
      [id]
    );

    if (subRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    const { title, authorEmail, authorName, journal_id } = subRows[0];

    // 2. Map decision to database status and activity
    let newStatus = 'Submitted';
    let newActivity = 'Decision Recorded';
    let decisionText = 'Under Review';
    let brandColor = '#005f96';

    switch (decision.toLowerCase()) {
      case 'accept':
        newStatus = 'Accepted';
        newActivity = 'Manuscript Accepted (Awaiting Final Check)';
        decisionText = 'Accepted';
        brandColor = '#16a34a'; // Green
        break;
      case 'decline':
        newStatus = 'Declined';
        newActivity = 'Manuscript Declined';
        decisionText = 'Declined';
        brandColor = '#dc2626'; // Red
        break;
      case 'revisions':
        newStatus = 'Revisions Requested';
        newActivity = 'Revisions Required from Author';
        decisionText = 'Revisions Required';
        brandColor = '#ca8a04'; // Yellow
        break;
      case 'publish':
        newStatus = 'Published';
        newActivity = 'Published';
        decisionText = 'Published';
        brandColor = '#005f96'; // Blue
        break;
      default:
        return NextResponse.json({ success: false, message: 'Invalid decision type' }, { status: 400 });
    }

    // 3. Update database
    await pool.query(
      'UPDATE submissions SET status = ?, activity = ?, editor_comments = ?, final_file_path = ?, published_at = ? WHERE id = ?',
      [newStatus, newActivity, comments || '', finalFilePath || null, newStatus === 'Published' ? new Date() : null, id]
    );

    // ── Persistent Notification for Author ──
    const [authorRows] = await pool.query('SELECT user_id FROM submissions WHERE id = ?', [id]);
    if (authorRows.length > 0) {
      await pool.query(
        'INSERT INTO notifications (user_id, submission_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
        [
          authorRows[0].user_id,
          id,
          'Editorial Decision Recorded',
          `The Editorial Board has recorded a decision for your manuscript "${title.substring(0, 40)}...": ${decisionText}.`,
          'info'
        ]
      );
    }

    // 4. Send Professional Email to Author
    const portalUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const journalName = journal_id?.toLowerCase() === 'jeiml' ? 'Journal of Eye-Innovation in Machine Learning' : 'Journal of Eye Innovation in Security Analysis';
    
    const { getDecisionNotificationTemplate, getAcceptedProofTemplate } = require('@/lib/email-templates');
    
    let html;
    if (decision.toLowerCase() === 'accept') {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 2);
      const deadlineDate = deadline.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      
      html = getAcceptedProofTemplate({
        authorName,
        paperTitle: title,
        deadlineDate,
        portalUrl,
        submissionId: id,
        journalName
      });
    } else {
      html = getDecisionNotificationTemplate({
        authorName,
        articleTitle: title,
        submissionId: id,
        journalName,
        decision: decisionText,
        editorComments: comments,
        portalUrl
      });
    }

    await sendNotificationEmail(
      authorEmail,
      decision.toLowerCase() === 'accept' 
        ? `Fantastic news: your article has been accepted — "${title.substring(0, 60)}..."`
        : `Editorial Decision for Manuscript #${id} — ${journalName}`,
      `The Editorial Board has reached a decision regarding your manuscript: ${decisionText}.`,
      html
    );


    return NextResponse.json({ 
      success: true, 
      message: `Decision "${decision}" recorded successfully`,
      newStatus,
      newActivity
    }, { status: 200 });

  } catch (error) {
    console.error('Decision record error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
