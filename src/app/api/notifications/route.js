import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';

export async function GET(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [user.userId]
    );

    return NextResponse.json({ success: true, notifications: rows });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const { id, markAll } = await req.json();

    if (markAll) {
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [user.userId]);
    } else if (id) {
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [id, user.userId]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
