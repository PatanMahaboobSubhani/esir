import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-123';

const renderPage = (title, header, message, color = "#2e7d32", actionText = "", actionLink = "") => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #1a1a1a; }
        .card { background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); max-width: 480px; width: 90%; text-align: center; border-top: 4px solid ${color}; }
        h1 { margin: 0 0 1rem; font-size: 1.5rem; color: ${color}; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em; }
        p { margin: 0 0 1.5rem; line-height: 1.6; color: #4b5563; }
        .btn { display: inline-block; padding: 0.75rem 1.75rem; background: #1a1a1a; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; transition: all 0.2s; }
        .btn:hover { background: #333; transform: translateY(-1px); }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>${header}</h1>
        <p>${message}</p>
        ${actionText ? `<a href="${actionLink}" class="btn">${actionText}</a>` : ''}
      </div>
    </body>
  </html>
`;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse(renderPage('Error', 'Missing Token', 'The invitation token is missing. Please check your email link.', '#dc2626'), { headers: { 'Content-Type': 'text/html' } });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { reviewerId, submissionId } = payload;

    const [rows] = await pool.query(
      'SELECT id, status FROM reviewer_assignments WHERE submission_id = ? AND user_id = ? AND token = ?',
      [submissionId, reviewerId, token]
    );

    if (rows.length === 0) {
      return new NextResponse(renderPage('Error', 'Link Invalid', 'This invitation link is invalid or has expired.', '#dc2626'), { headers: { 'Content-Type': 'text/html' } });
    }

    const assignment = rows[0];

    if (assignment.status !== 'Pending') {
      const statusMsg = assignment.status === 'Accepted' 
        ? 'You have already accepted this review invitation.'
        : 'You have already declined this review invitation.';
      return new NextResponse(renderPage('Status Update', 'Action Recorded', statusMsg, '#4BA6B9', 'Go to Dashboard', '/dashboard'), { headers: { 'Content-Type': 'text/html' } });
    }

    await pool.query('UPDATE reviewer_assignments SET status = "Declined" WHERE id = ?', [assignment.id]);
    await pool.query('UPDATE submissions SET activity = "Reviewer Declined" WHERE id = ?', [submissionId]);

    return new NextResponse(renderPage('Declined', 'Review Declined', 'Thank you for letting us know. We understand that you cannot review at this time.', '#4BA6B9'), { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    console.error('Decline review error:', error);
    const msg = error.name === 'TokenExpiredError' 
      ? 'This invitation link has expired (valid for 7 days).'
      : 'An internal error occurred. Please try again later.';
    return new NextResponse(renderPage('Error', 'Decline Failed', msg, '#dc2626'), { headers: { 'Content-Type': 'text/html' } });
  }
}
