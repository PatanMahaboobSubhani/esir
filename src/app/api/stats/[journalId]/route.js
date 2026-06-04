import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req, { params }) {
  const { journalId } = await params;

  try {
    // 1. Articles Count
    const [[{ articleCount }]] = await pool.query(
      "SELECT COUNT(*) AS articleCount FROM submissions WHERE journal_id = ? AND (status = 'Published' OR status = 'Scheduled') AND (scheduled_at IS NULL OR scheduled_at <= ?)",
      [journalId, new Date()]
    );

    // 2. Total Views
    const [[{ totalViews }]] = await pool.query(
      "SELECT COALESCE(SUM(views), 0) AS totalViews FROM submissions WHERE journal_id = ? AND (status = 'Published' OR status = 'Scheduled') AND (scheduled_at IS NULL OR scheduled_at <= ?)",
      [journalId, new Date()]
    );

    // 3. Unique Authors
    const [[{ authorCount }]] = await pool.query(
      "SELECT COUNT(DISTINCT user_id) AS authorCount FROM submissions WHERE journal_id = ? AND (status = 'Published' OR status = 'Scheduled') AND (scheduled_at IS NULL OR scheduled_at <= ?)",
      [journalId, new Date()]
    );

    // 4. Authors Distribution (Countries)
    const [[{ countryCount }]] = await pool.query(
      "SELECT COUNT(DISTINCT u.country) AS countryCount FROM submissions s JOIN users u ON s.user_id = u.id WHERE s.journal_id = ? AND (s.status = 'Published' OR s.status = 'Scheduled') AND (s.scheduled_at IS NULL OR s.scheduled_at <= ?)",
      [journalId, new Date()]
    );

    // 5. Acceptance Rate
    const [[{ publishedCount }]] = await pool.query(
      "SELECT COUNT(*) AS publishedCount FROM submissions WHERE journal_id = ? AND (status = 'Published' OR status = 'Scheduled') AND (scheduled_at IS NULL OR scheduled_at <= ?)",
      [journalId, new Date()]
    );
    const [[{ totalSubmissions }]] = await pool.query(
      "SELECT COUNT(*) AS totalSubmissions FROM submissions WHERE journal_id = ?",
      [journalId]
    );

    const acceptanceRate = totalSubmissions > 0 
      ? Math.round((publishedCount / totalSubmissions) * 100) 
      : 0;

    // 6. Citations Calculation (Average per article)
    const [[{ totalScopus, totalGoogle }]] = await pool.query(
      "SELECT SUM(citations_scopus) AS totalScopus, SUM(citations_google) AS totalGoogle FROM submissions WHERE journal_id = ? AND (status = 'Published' OR status = 'Scheduled')",
      [journalId]
    );

    const avgScopus = articleCount > 0 ? (totalScopus / articleCount).toFixed(1) : '0.0';
    const avgGoogle = articleCount > 0 ? (totalGoogle / articleCount).toFixed(1) : '0.0';

    return NextResponse.json({
      success: true,
      stats: {
        articles: articleCount,
        views: Number(totalViews),
        authors: authorCount,
        distribution: countryCount,
        acceptance: `${acceptanceRate}%`,
        citationsScopus: avgScopus,
        citationsGoogle: avgGoogle,
      }
    });

  } catch (error) {
    console.error('Journal stats fetch error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch stats' }, { status: 500 });
  }
}
