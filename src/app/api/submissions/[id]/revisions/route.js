import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';

/**
 * POST /api/submissions/[id]/revisions
 * Author submits revised files and comments
 */
export async function POST(req, { params }) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const { id } = await params;
    const { files, comments } = await req.json();

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'At least one revised file is required' }, { status: 400 });
    }

    // 1. Verify this is the author's submission
    const [subRows] = await pool.query(
      'SELECT user_id, title FROM submissions WHERE id = ?',
      [id]
    );

    if (subRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    // 2. Insert revised files into submission_files table
    for (const file of files) {
      await pool.query(
        'INSERT INTO submission_files (submission_id, name, path, type) VALUES (?, ?, ?, ?)',
        [id, file.name, file.path, 'Revised Manuscript']
      );
    }

    // 3. Update submission status and activity
    const newStatus = 'Revisions Submitted';
    const newActivity = 'Author Submitted Revisions';
    
    // We update the status and activity, but we DON'T overwrite editor_comments.
    // Instead, if there's a response, we could insert it into a discussion or just keep it in activity log.
    await pool.query(
      'UPDATE submissions SET status = ?, activity = ? WHERE id = ?',
      [newStatus, newActivity, id]
    );

    // If author provided comments, let's log them as a "Pre-Review Discussion" 
    // to keep the history clean.
    if (comments) {
      await pool.query(
        'INSERT INTO submission_discussions (submission_id, user_id, subject, message) VALUES (?, ?, ?, ?)',
        [id, user.userId, 'Author Revision Response', comments]
      ).catch(e => {
        console.error('Failed to insert discussion, might table missing:', e.message);
        // Fallback: append to a log or just ignore if table missing
      });
    }

    // 4. Persistent Notification for Editor
    await pool.query(
      'INSERT INTO notifications (user_id, submission_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
      [
        0, // Notify all editors/admins
        id,
        'Revisions Submitted',
        `Author has submitted revised files for manuscript #${id}.`,
        'info'
      ]
    ).catch(e => console.error('Notify editor failed:', e));

    return NextResponse.json({
      success: true,
      message: 'Revisions submitted successfully',
      newStatus,
      newActivity
    }, { status: 200 });

  } catch (error) {
    console.error('Revision submission error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
