import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
    }

    // 1. Check user exists
    const [users] = await pool.query('SELECT id, fullName, role FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      // Return generic message for security (don't reveal if email exists)
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.'
      });
    }

    const user = users[0];

    // --- SECURITY RESTRICTION: Block reset for sensitive roles ---
    const restrictedRoles = ['admin', 'editor', 'reviewer'];
    if (restrictedRoles.includes(user.role?.toLowerCase())) {
      return NextResponse.json({
        success: false,
        message: 'Administrative and Editorial accounts cannot reset passwords through this automated portal. Please contact the system administrator directly for password recovery.'
      }, { status: 403 });
    }

    // 2. Delete old tokens for this email
    await pool.query('DELETE FROM password_resets WHERE email = ?', [email]);

    // 3. Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
      [email, token, expiresAt]
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    // 4. Send email if SMTP configured, otherwise return link for dev
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"EISR Portal" <${smtpUser}>`,
        to: email,
        subject: 'Reset Your EISR Password',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 20px">
            <img src="${appUrl}/logo.png" alt="EISR" style="height:48px;margin-bottom:24px"/>
            <h2 style="color:#1A1A1A;margin:0 0 8px">Reset your password</h2>
            <p style="color:#555;margin:0 0 24px">Hi ${user.fullName}, click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetLink}" style="display:inline-block;background:#4BA6B9;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px">Reset Password</a>
            <p style="color:#999;font-size:12px;margin-top:32px">If you didn't request this, you can safely ignore this email.<br>Link: ${resetLink}</p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: 'Password reset link sent to your email!'
      });
    } else {
      // Dev mode: return link directly
      return NextResponse.json({
        success: true,
        message: 'Reset link generated (no SMTP configured — see devLink).',
        devLink: resetLink,
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 });
  }
}
