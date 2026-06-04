import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';
import { sendNotificationEmail } from '@/lib/mail';
import { getSubmissionNotificationTemplate } from '@/lib/email-templates';
import { journals } from '@/lib/data';

export async function GET(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const journalId = searchParams.get('journal');
    const role = searchParams.get('role') || 'author';

    let query = '';
    const params = [];
    const whereClauses = [];

    if (role === 'reviewer') {
      query = `
        SELECT DISTINCT
          s.id, s.title, s.status, s.activity, s.journal_id,
          ra.status AS assignment_status,
          DATE_FORMAT(s.created_at, '%M %d, %Y') AS date, s.created_at, s.scheduled_at
        FROM submissions s
        JOIN reviewer_assignments ra ON s.id = ra.submission_id
        JOIN users u ON ra.user_id = u.id
      `;
      whereClauses.push('(ra.user_id = ? OR u.email = ?)');
      params.push(user.userId, user.email);

      if (journalId) {
        whereClauses.push('s.journal_id = ?');
        params.push(journalId);
      }
    } else if (role === 'editor' || role === 'admin') {
      query = `
        SELECT
          id, title, status, activity, editor_comments, journal_id,
          DATE_FORMAT(created_at, '%M %d, %Y') AS date, created_at, scheduled_at
        FROM submissions
      `;

      let effectiveJournalId = journalId;

      // Automatically filter by assigned journal for Editors (Admins see everything)
      if (role === 'editor') {
        const editorEmail = user.email.toLowerCase();
        let assignedJournalId = null;
        
        for (const j of journals) {
          if (j.contactEmail && j.contactEmail.toLowerCase() === editorEmail) {
            assignedJournalId = j.id;
            break;
          }
          if (j.editorialTeam && j.editorialTeam.some(m => m.email && m.email.toLowerCase() === editorEmail)) {
            assignedJournalId = j.id;
            break;
          }
        }

        // If this editor is bound to a specific journal, restrict their view
        if (assignedJournalId) {
          effectiveJournalId = assignedJournalId;
        }
      }

      if (effectiveJournalId) {
        whereClauses.push('journal_id = ?');
        params.push(effectiveJournalId);
      }
    } else {
      query = `
        SELECT
          id, title, status, activity, editor_comments, journal_id,
          DATE_FORMAT(created_at, '%M %d, %Y') AS date, created_at, scheduled_at
        FROM submissions
      `;
      whereClauses.push('user_id = ?');
      params.push(user.userId);

      if (journalId) {
        whereClauses.push('journal_id = ?');
        params.push(journalId);
      }
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await pool.query(query, params);

    const submissions = rows.map((row) => ({
      id: row.id,
      title: row.title || 'Untitled Submission',
      status:
        role === 'reviewer' && row.assignment_status
          ? row.assignment_status
          : (row.status || 'Submitted'),
      submission_status: row.status || 'Submitted',
      activity: row.activity || 'Unassigned',
      journal_id: row.journal_id,
      date: row.date,
      created_at: row.created_at,
      scheduled_at: row.scheduled_at,
      editor_comments: row.editor_comments || '',
    }));

    return NextResponse.json(
      { success: true, submissions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  let connection;

  try {
    const body = await req.json();
    console.log('Incoming submission body:', JSON.stringify(body, null, 2));

    const title =
      body?.title ||
      body?.details?.title ||
      body?.submissionTitle ||
      '';

    const editorComments =
      body?.editorComments ||
      body?.forEditors?.comments ||
      body?.comments ||
      '';

    const contributors = Array.isArray(body?.contributors)
      ? body.contributors
      : [];

    const rawFiles = Array.isArray(body?.files)
      ? body.files
      : [];

    const journalId = body?.journalId || body?.journal || 'jcsra';
    const keywords = body?.keywords || '';

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    const normalizedFiles = rawFiles
      .filter((f) => f && typeof f === 'object')
      .map((f) => ({
        name: typeof f.name === 'string' ? f.name.trim() : '',
        type: typeof f.type === 'string' && f.type.trim() ? f.type.trim() : 'Article Text',
        path: typeof f.path === 'string' ? f.path.trim() : '',
      }))
      .filter((f) => f.name && f.path);

    const uniqueFilesMap = new Map();
    for (const file of normalizedFiles) {
      uniqueFilesMap.set(file.path, file);
    }
    const uniqueFiles = Array.from(uniqueFilesMap.values());

    console.log('Normalized files:', normalizedFiles);
    console.log('Unique files:', uniqueFiles);

    const isDraft = body?.isDraft === true;
    const status = isDraft ? 'Incomplete' : 'Submitted';

    const submissionIdFromReq = body?.submissionId;
    let submissionId;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    if (submissionIdFromReq) {
      await connection.query(
        `UPDATE submissions SET title = ?, editor_comments = ?, keywords = ?, status = ?, journal_id = ? WHERE id = ? AND user_id = ?`,
        [title.trim(), editorComments, keywords, status, journalId, submissionIdFromReq, user.userId]
      );
      
      // Clear existing files and contributors for this submission to re-sync
      await connection.query('DELETE FROM submission_files WHERE submission_id = ?', [submissionIdFromReq]);
      await connection.query('DELETE FROM submission_contributors WHERE submission_id = ?', [submissionIdFromReq]);
      
      submissionId = submissionIdFromReq;
    } else {
      const [submissionResult] = await connection.query(
        `
        INSERT INTO submissions
        (user_id, title, status, activity, editor_comments, keywords, journal_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          user.userId,
          title.trim(),
          status,
          'Unassigned',
          editorComments,
          keywords,
          journalId,
        ]
      );
      submissionId = submissionResult.insertId;
    }
    console.log('Created submission ID:', submissionId);

    if (contributors.length > 0) {
      const contributorValues = contributors
        .filter((c) => c?.name && String(c.name).trim())
        .map((c) => [
          submissionId,
          String(c.name).trim(),
          c?.email ? String(c.email).trim() : null,
        ]);

      if (contributorValues.length > 0) {
        console.log('Contributor values:', contributorValues);

        await connection.query(
          'INSERT INTO submission_contributors (submission_id, name, email) VALUES ?',
          [contributorValues]
        );
      }
    }

    let insertedFilesCount = 0;

    if (uniqueFiles.length > 0) {
      const fileValues = uniqueFiles.map((f) => [
        submissionId,
        f.name,
        f.type || 'Article Text',
        f.path,
      ]);

      console.log('File values for DB insert:', fileValues);

      if (fileValues.length > 0) {
        await connection.query(
            'INSERT IGNORE INTO submission_files (submission_id, name, type, path) VALUES ?',
          [fileValues]
        );
        insertedFilesCount = fileValues.length;
      }
    } else {
      console.warn('No valid files received for submission:', submissionId);
    }

    const [userRows] = await connection.query(
      'SELECT fullName, email FROM users WHERE id = ?',
      [user.userId]
    );

    await connection.commit();

    if (userRows.length > 0 && !isDraft) {
      const author = userRows[0];
      const portalUrl =
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const submissionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const targetJournal =
        journals.find((j) => j.id.toLowerCase() === journalId?.toLowerCase()) || journals[0];

      // ── Persistent Notifications ──
      // 1. Notify Editors/Admins about new submission
      const [editors] = await connection.query('SELECT id FROM users WHERE role IN ("editor", "admin")');
      for (const editor of editors) {
        await connection.query(
          'INSERT INTO notifications (user_id, submission_id, title, message, type) VALUES (?, ?, ?, ?, ?)',
          [
            editor.id, 
            submissionId, 
            'New Submission Received', 
            `A new manuscript "${title.substring(0, 50)}..." has been submitted by ${author.fullName}.`, 
            'update'
          ]
        );
      }

      const htmlBody = getSubmissionNotificationTemplate({
        authorName: author.fullName,
        authorEmail: author.email,
        articleTitle: title,
        submissionId,
        journalName: targetJournal.title,
        editorComments,
        submissionDate,
        portalUrl,
      });

      await sendNotificationEmail(
        process.env.SMTP_USER,
        `New Submission Received — EISR Portal (#${submissionId})`,
        `New submission "${title}" received from ${author.fullName} (ID: ${submissionId})`,
        htmlBody
      );

      await sendNotificationEmail(
        author.email,
        `Manuscript Submission Confirmation — EISR Portal (#${submissionId})`,
        `Dear ${author.fullName}, your manuscript "${title}" has been successfully submitted to the ${targetJournal.title}.`,
        `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-top: 5px solid #005f96; padding: 30px;">
            <h2 style="color: #005f96;">Submission Confirmation</h2>
            <p>Dear <strong>${author.fullName}</strong>,</p>
            <p>Thank you for submitting your manuscript to the <strong>${targetJournal.title}</strong> through the EISR Portal.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #005f96;">
              <strong>Manuscript ID:</strong> #${submissionId}<br/>
              <strong>Title:</strong> ${title}<br/>
              <strong>Date:</strong> ${submissionDate}<br/>
              <strong>Files Saved:</strong> ${insertedFilesCount}
            </div>
            <p>Your submission is currently with the Editorial Board for initial screening. You can track its progress by logging into the portal at any time.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${portalUrl}/dashboard/submissions/${submissionId}" style="background: #005f96; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Track My Submission</a>
            </div>
            <p>Best regards,<br/>The EISR Editorial Team</p>
          </div>
        `
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Submission created successfully',
        submissionId,
        filesReceived: rawFiles.length,
        filesInserted: insertedFilesCount,
      },
      { status: 201 }
    );
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }

    console.error('Create submission error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
