import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id, s.title, s.journal_id, COALESCE(s.scheduled_at, s.created_at) as published_date,
        IFNULL(GROUP_CONCAT(sc.name ORDER BY sc.id SEPARATOR ', '), u.fullName) as authors
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN submission_contributors sc ON s.id = sc.submission_id
      WHERE (s.status = 'Published' OR s.status = 'Scheduled') AND (s.scheduled_at IS NULL OR s.scheduled_at <= ?)
      GROUP BY s.id
      ORDER BY COALESCE(s.scheduled_at, s.created_at) DESC
      LIMIT 10
    `, [new Date()]);

    return NextResponse.json({ success: true, articles: rows });
  } catch (error) {
    console.error('Fetch latest articles error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
