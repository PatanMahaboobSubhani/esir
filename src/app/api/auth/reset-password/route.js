import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, message: 'Token and password are required.' }, { status: 400 });
    }

    // --- PASSWORD STRENGTH VALIDATION (Sync with registration policy) ---
    if (password.length < 5) {
      return NextResponse.json({ success: false, message: 'Password must be at least 5 characters long.' }, { status: 400 });
    }
    const passwordRegex = /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{4,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Password must start with an uppercase letter and include at least one number and one special character.' 
      }, { status: 400 });
    }

    // 1. Find valid token
    const [rows] = await pool.query(
      'SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Reset link is invalid or has expired. Please request a new one.'
      }, { status: 400 });
    }

    const { email } = rows[0];

    // 2. Hash new password and update user
    const hashed = await bcrypt.hash(password, 12);
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);

    // 3. Mark token as used
    await pool.query('UPDATE password_resets SET used = 1 WHERE token = ?', [token]);

    return NextResponse.json({ success: true, message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 });
  }
}
