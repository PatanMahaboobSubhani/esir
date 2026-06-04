import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * POST /api/articles/[id]/view
 * Increments the view count for a published article by 1.
 */
export async function POST(req, { params }) {
  try {
    const { id } = await params;

    await pool.query(
      "UPDATE submissions SET views = views + 1 WHERE id = ? AND (status = 'Published' OR (status = 'Scheduled' AND (scheduled_at IS NULL OR scheduled_at <= ?)))",
      [id, new Date()]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('View increment error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
