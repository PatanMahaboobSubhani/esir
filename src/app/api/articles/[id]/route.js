import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const [rows] = await pool.query(`
      SELECT 
        s.id, s.title, s.prefix, s.subtitle, s.journal_id, COALESCE(s.scheduled_at, s.created_at) as published_date,
        s.views, s.abstract, s.keywords, s.references_list AS 'references', s.final_file_path,
        (SELECT sf.path FROM submission_files sf WHERE sf.submission_id = s.id LIMIT 1) as file_path,
        IFNULL(
          (SELECT GROUP_CONCAT(sc.name ORDER BY sc.id SEPARATOR ', ') FROM submission_contributors sc WHERE sc.submission_id = s.id),
          u.fullName
        ) as authors
      FROM submissions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ? AND (s.status = 'Published' OR s.status = 'Scheduled') AND (s.scheduled_at IS NULL OR s.scheduled_at <= ?)
      GROUP BY s.id
    `, [id, new Date()]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, article: rows[0] });
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
