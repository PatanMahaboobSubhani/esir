import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';

export async function GET(req, { params }) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const [rows] = await pool.query(
      `SELECT d.*, u.fullName as author, u.role as authorRole 
       FROM discussions d 
       LEFT JOIN users u ON d.user_id = u.id 
       WHERE d.submission_id = ? 
       ORDER BY d.created_at ASC`,
      [id]
    );

    return NextResponse.json({ success: true, discussions: rows });
  } catch (error) {
    console.error('Fetch discussions error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  const { subject, message } = await req.json();

  if (!subject || !message) {
    return NextResponse.json({ success: false, message: 'Subject and message are required' }, { status: 400 });
  }

  try {
    await pool.query(
      'INSERT INTO discussions (submission_id, user_id, subject, message) VALUES (?, ?, ?, ?)',
      [id, user.userId, subject, message]
    );

    return NextResponse.json({ success: true, message: 'Discussion started successfully' });
  } catch (error) {
    console.error('Create discussion error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
