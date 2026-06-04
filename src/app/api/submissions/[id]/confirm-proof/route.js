import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';
import { sendNotificationEmail } from '@/lib/mail';
import { getProofConfirmedNotification } from '@/lib/email-templates';

export async function POST(req, { params }) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const { id } = await params;

    // Verify ownership: Only the author of this submission can confirm
    const [subRows] = await pool.query(
      'SELECT s.user_id, s.title, u.fullName as author_name FROM submissions s JOIN users u ON s.user_id = u.id WHERE s.id = ?',
      [id]
    );

    if (subRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
    }

    if (subRows[0].user_id !== user.userId) {
      return unauthorizedResponse();
    }

    // Update activity to signal to editor that author is done
    await pool.query(
      "UPDATE submissions SET activity = 'Proofs Confirmed by Author' WHERE id = ?",
      [id]
    );

    // Add a notification for the editors/admin
    await pool.query(
      "INSERT INTO notifications (user_id, submission_id, title, message, type) SELECT id, ?, 'Proofs Confirmed', ?, 'success' FROM users WHERE role IN ('admin', 'editor')",
      [id, `Author has confirmed final proofs for manuscript #${id}: ${subRows[0].title.substring(0, 40)}...`]
    );

    // Send Email to all Editors/Admins
    const [editors] = await pool.query("SELECT email, fullName FROM users WHERE role IN ('admin', 'editor')");
    const portalUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    for (const editor of editors) {
      const emailHtml = getProofConfirmedNotification({
        editorName: editor.fullName,
        paperTitle: subRows[0].title,
        authorName: subRows[0].author_name,
        portalUrl,
        submissionId: id
      });

      await sendNotificationEmail(
        editor.email,
        `[EISR] Proofs Confirmed: ${subRows[0].title.substring(0, 50)}...`,
        `Author has confirmed final proofs for manuscript #${id}: ${subRows[0].title}`,
        emailHtml
      );
    }

    return NextResponse.json({ success: true, message: 'Proof confirmation recorded and editors notified' });
  } catch (error) {
    console.error('Confirm proof error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
