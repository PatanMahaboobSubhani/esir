import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';

export async function DELETE(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    if (!status || status !== 'Incomplete') {
      return NextResponse.json({ success: false, message: 'Invalid status for bulk delete' }, { status: 400 });
    }

    // Only allow authors to delete their own incomplete submissions
    const [result] = await pool.query(
      'DELETE FROM submissions WHERE user_id = ? AND status = ?',
      [user.userId, status]
    );

    return NextResponse.json({ 
      success: true, 
      message: `${result.affectedRows} submissions deleted`, 
      count: result.affectedRows 
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
