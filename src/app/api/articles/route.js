import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const journalId = searchParams.get('journal');

    let query = `
      SELECT 
        s.id, s.title, s.journal_id, COALESCE(s.scheduled_at, s.created_at) as published_date,
        s.views, s.doi,
        IFNULL(GROUP_CONCAT(sc.name ORDER BY sc.id SEPARATOR ', '), u.fullName) as authors
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN submission_contributors sc ON s.id = sc.submission_id
      WHERE (s.status = 'Published' OR s.status = 'Scheduled') 
        AND (s.scheduled_at IS NULL OR s.scheduled_at <= ?)
    `;

    const params = [new Date()];
    if (journalId) {
      query += ` AND s.journal_id = ?`;
      params.push(journalId);
    }

    query += ` GROUP BY s.id ORDER BY COALESCE(s.scheduled_at, s.created_at) DESC`;

    const [rows] = await pool.query(query, params);

    return NextResponse.json({ success: true, articles: rows });
  } catch (error) {
    console.error('Fetch articles error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
