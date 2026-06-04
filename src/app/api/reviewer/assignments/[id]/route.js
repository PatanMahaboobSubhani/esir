import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';

/**
 * PATCH /api/reviewer/assignments/[id]
 * Update an existing reviewer assignment (e.g., Accept, Decline)
 */
export async function PATCH(req, { params }) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, message: 'Status is required' }, { status: 400 });
    }

    // 1. Verify if the assignment exists and belongs to the user or if user is an authorized editor
    const [assignmentRows] = await pool.query(
      'SELECT submission_id, user_id FROM reviewer_assignments WHERE id = ?',
      [id]
    );

    if (assignmentRows.length === 0) {
      return NextResponse.json({ success: false, message: 'Assignment not found' }, { status: 404 });
    }

    const assignment = assignmentRows[0];

    // Simple auth check: only the assigned user can accept/decline
    if (assignment.user_id !== user.userId) {
      return unauthorizedResponse();
    }

    // 2. Update status in reviewer_assignments
    await pool.query(
      'UPDATE reviewer_assignments SET status = ? WHERE id = ?',
      [status, id]
    );

    // 3. Update activity in submissions table
    let newActivity = 'Review in Progress';
    if (status === 'declined') newActivity = 'Reviewer Declined';
    if (status === 'accepted') newActivity = 'Reviewer Accepted';

    await pool.query(
      'UPDATE submissions SET activity = ? WHERE id = ?',
      [newActivity, assignment.submission_id]
    );

    return NextResponse.json({ 
      success: true, 
      message: `Review request ${status} successfully` 
    }, { status: 200 });

  } catch (error) {
    console.error('Update assignment error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
