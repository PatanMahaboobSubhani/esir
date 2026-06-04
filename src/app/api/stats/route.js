import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { journals } from '@/lib/data';

export async function GET() {
  try {
    // Count of published articles
    const [[{ articleCount }]] = await pool.query(
      "SELECT COUNT(*) AS articleCount FROM submissions WHERE (status = 'Published' OR status = 'Scheduled') AND (scheduled_at IS NULL OR scheduled_at <= ?)",
      [new Date()]
    );

    // Total views across all published articles
    const [[{ totalViews }]] = await pool.query(
      "SELECT COALESCE(SUM(views), 0) AS totalViews FROM submissions WHERE (status = 'Published' OR status = 'Scheduled') AND (scheduled_at IS NULL OR scheduled_at <= ?)",
      [new Date()]
    );

    // Total journals (static from data.js)
    const journalCount = journals.length;

    return NextResponse.json({
      success: true,
      articles: articleCount,
      views: Number(totalViews),
      journals: journalCount,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { success: false, articles: 0, views: 0, journals: 0 },
      { status: 500 }
    );
  }
}
