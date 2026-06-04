import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';

export async function POST(req, { params }) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  if (user.role !== 'editor' && user.role !== 'admin') {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const { scheduledAt, finalFilePath, citationsScopus, citationsGoogle, doi } = await req.json();

    if (!scheduledAt) {
      return NextResponse.json({ success: false, message: 'Scheduled date is required' }, { status: 400 });
    }

    // Determine if it should be Published or Scheduled based on time
    const scheduledDateObj = new Date(scheduledAt);
    const isFuture = scheduledDateObj > new Date();
    
    const newStatus = isFuture ? 'Scheduled' : 'Published';
    const newActivity = isFuture ? 'Scheduled for Publication' : 'Published';

    // Format scheduledAt to standard YYYY-MM-DD HH:mm:ss in UTC
    const formattedScheduledAt = scheduledDateObj.getUTCFullYear() + '-' +
      String(scheduledDateObj.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(scheduledDateObj.getUTCDate()).padStart(2, '0') + ' ' +
      String(scheduledDateObj.getUTCHours()).padStart(2, '0') + ':' +
      String(scheduledDateObj.getUTCMinutes()).padStart(2, '0') + ':' +
      String(scheduledDateObj.getUTCSeconds()).padStart(2, '0');

    // Format current time to UTC for published_at
    const nowUtc = new Date();
    const formattedPublishedAt = isFuture ? null : (
      nowUtc.getUTCFullYear() + '-' +
      String(nowUtc.getUTCMonth() + 1).padStart(2, '0') + '-' +
      String(nowUtc.getUTCDate()).padStart(2, '0') + ' ' +
      String(nowUtc.getUTCHours()).padStart(2, '0') + ':' +
      String(nowUtc.getUTCMinutes()).padStart(2, '0') + ':' +
      String(nowUtc.getUTCSeconds()).padStart(2, '0')
    );

    // Update the submission
    await pool.query(
      'UPDATE submissions SET status = ?, activity = ?, scheduled_at = ?, published_at = ?, final_file_path = ?, citations_scopus = ?, citations_google = ?, doi = ? WHERE id = ?',
      [newStatus, newActivity, formattedScheduledAt, formattedPublishedAt, finalFilePath || null, citationsScopus || 0, citationsGoogle || 0, doi || null, id]
    );

    // Also send a notification to the author
    const [subRows] = await pool.query('SELECT user_id, title FROM submissions WHERE id = ?', [id]);
    if (subRows.length > 0) {
      await pool.query(
        'INSERT INTO notifications (user_id, submission_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
        [
          subRows[0].user_id,
          id,
          isFuture ? 'Manuscript Scheduled' : 'Manuscript Published',
          isFuture 
            ? `Your manuscript "${subRows[0].title.substring(0, 40)}..." has been scheduled for publication on ${scheduledAt}.`
            : `Congratulations! Your manuscript "${subRows[0].title.substring(0, 40)}..." has been published.`,
          'success'
        ]
      );
    }


    return NextResponse.json({ 
      success: true, 
      message: 'Manuscript status updated to Published' 
    }, { status: 200 });

  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
