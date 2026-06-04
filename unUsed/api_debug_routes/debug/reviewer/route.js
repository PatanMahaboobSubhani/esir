import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser } from '@/lib/auth';

// TEMPORARY DEBUG ENDPOINT - REMOVE AFTER FIXING
// Visit: /api/debug/reviewer (with Authorization header from browser localStorage)
export async function GET(req) {
  const user = verifyRequestUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Not logged in. Pass Authorization: Bearer <token>' });
  }

  try {
    // 1. Show current logged-in user info from JWT
    const jwtInfo = {
      userId: user.userId,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    // 2. Find user in DB by this user's ID
    const [dbUserById] = await pool.query('SELECT id, email, role, fullName FROM users WHERE id = ?', [user.userId]);

    // 3. Find user in DB by this user's email
    const [dbUserByEmail] = await pool.query('SELECT id, email, role, fullName FROM users WHERE email = ?', [user.email]);

    // 4. All reviewer_assignments in DB (last 20)
    const [allAssignments] = await pool.query(
      `SELECT ra.id, ra.submission_id, ra.user_id, ra.status, 
              u.email as reviewer_email, u.fullName as reviewer_name,
              s.title as submission_title
       FROM reviewer_assignments ra
       JOIN users u ON ra.user_id = u.id
       JOIN submissions s ON ra.submission_id = s.id
       ORDER BY ra.id DESC LIMIT 20`
    );

    // 5. Assignments for this user specifically (by user_id)
    const [byUserId] = await pool.query(
      `SELECT ra.id, ra.submission_id, ra.user_id, ra.status, s.title
       FROM reviewer_assignments ra
       JOIN submissions s ON ra.submission_id = s.id
       WHERE ra.user_id = ?`,
      [user.userId]
    );

    // 6. Assignments for this user by email
    const [byEmail] = await pool.query(
      `SELECT ra.id, ra.submission_id, ra.user_id, ra.status, s.title, u.email
       FROM reviewer_assignments ra
       JOIN users u ON ra.user_id = u.id
       JOIN submissions s ON ra.submission_id = s.id
       WHERE u.email = ?`,
      [user.email]
    );

    return NextResponse.json({
      debug: true,
      step1_jwt_token_contains: jwtInfo,
      step2_db_user_found_by_userId: dbUserById,
      step3_db_user_found_by_email: dbUserByEmail,
      step4_all_reviewer_assignments_in_db: allAssignments,
      step5_assignments_matching_userId: byUserId,
      step6_assignments_matching_email: byEmail,
      diagnosis: {
        userId_match_count: byUserId.length,
        email_match_count: byEmail.length,
        total_assignments_in_db: allAssignments.length,
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message, stack: error.stack });
  }
}
