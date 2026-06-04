import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';

// GET existing review for a submission
export async function GET(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(req.url);
  const subId = searchParams.get('submissionId');

  if (!subId) {
    return NextResponse.json({ success: false, message: 'Submission ID is required' }, { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      'SELECT checklist_json, comments_authors, comments_editors, recommendation, rating, file_url, is_draft FROM submission_reviews WHERE submission_id = ? AND user_id = ?',
      [subId, user.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: true, review: null }, { status: 200 });
    }

    return NextResponse.json({ success: true, review: rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Fetch review error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// SAVE or SUBMIT review
export async function POST(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { submissionId, checklist, commentsAuthors, commentsEditors, recommendation, rating, fileUrl, isDraft } = body;

    if (!submissionId) {
      return NextResponse.json({ success: false, message: 'Submission ID is required' }, { status: 400 });
    }

    // Auth check: Is this user assigned to this submission?
    const [assignmentRows] = await pool.query(
      'SELECT id FROM reviewer_assignments WHERE submission_id = ? AND user_id = ?',
      [submissionId, user.userId]
    );

    if (assignmentRows.length === 0) {
      return NextResponse.json({ success: false, message: 'You are not assigned to this manuscript' }, { status: 403 });
    }

    // Upsert review
    await pool.query(`
      INSERT INTO submission_reviews (submission_id, user_id, checklist_json, comments_authors, comments_editors, recommendation, rating, file_url, is_draft)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        checklist_json = VALUES(checklist_json),
        comments_authors = VALUES(comments_authors),
        comments_editors = VALUES(comments_editors),
        recommendation = VALUES(recommendation),
        rating = VALUES(rating),
        file_url = VALUES(file_url),
        is_draft = VALUES(is_draft)
    `, [
      submissionId, 
      user.userId, 
      JSON.stringify(checklist || {}), 
      commentsAuthors || '', 
      commentsEditors || '', 
      recommendation || '',
      rating || null,
      fileUrl || null,
      isDraft ? 1 : 0
    ]);

    // If NOT draft, update assignment status
    if (!isDraft) {
      await pool.query(
        'UPDATE reviewer_assignments SET status = "Completed" WHERE submission_id = ? AND user_id = ?',
        [submissionId, user.userId]
      );
      
      // Update submission activity to reflect that a review has been turned in
      await pool.query(
        'UPDATE submissions SET activity = "Review Submitted" WHERE id = ?',
        [submissionId]
      );

      // Notify Editor/Admin via Persistent Notification
      await pool.query(
        'INSERT INTO notifications (user_id, submission_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
        [
          0, // 0 usually maps to admins/editors or we could fetch the specific editor_id
          submissionId,
          'Review Submitted',
          `A reviewer has completed their evaluation for manuscript #${submissionId}.`,
          'info'
        ]
      ).catch(e => console.error('Notify editor failed:', e));

      // Notify Editor/Admin via Email
      const { sendNotificationEmail } = require('@/lib/mail');
      const [subInfo] = await pool.query('SELECT title FROM submissions WHERE id = ?', [submissionId]);
      
      await sendNotificationEmail(
        process.env.SMTP_USER, // Admin Email
        `Review Submitted — Manuscript #${submissionId}`,
        `A reviewer has submitted their evaluation for manuscript "${subInfo[0]?.title}".`,
        `
          <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #005f96;">Review Completed</h2>
            <p>Hello Editor,</p>
            <p>A reviewer has just submitted their final evaluation for the following manuscript:</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #005f96;">
              <strong>Manuscript ID:</strong> #${submissionId}<br/>
              <strong>Title:</strong> ${subInfo[0]?.title}
            </div>
            <p>You can now view the recommendation, rating, and comments in the editorial dashboard to record your final decision.</p>
            <div style="margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/submissions/${submissionId}" style="background: #005f96; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Submission & Decision Form</a>
            </div>
          </div>
        `
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: isDraft ? 'Review saved as draft' : 'Review submitted successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Post review error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
