import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';
import { sendNotificationEmail } from '@/lib/mail';
import { countries } from '@/lib/countries';

export async function POST(req) {
  try {
    const body = await req.json();

    const givenName = body.givenName || '';
    const familyName = body.familyName || '';
    const affiliation = body.affiliation || '';
    const countryCode = body.country || '';
    
    // Map country code to full name
    const countryObj = countries.find(c => c.code === countryCode);
    const countryName = countryObj ? countryObj.name : countryCode;

    const fullName =
      body.fullName || `${givenName} ${familyName}`.trim();

    const { username, email, password } = body;

    // --- STRICT VALIDATION ---
    if (!givenName || givenName.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Given Name must be at least 2 characters.' }, { status: 400 });
    }
    if (!affiliation || affiliation.trim().length < 3) {
      return NextResponse.json({ success: false, message: 'Affiliation must be at least 3 characters.' }, { status: 400 });
    }
    if (!countryCode) {
      return NextResponse.json({ success: false, message: 'Please select your country.' }, { status: 400 });
    }
    if (!username || username.trim().length < 4) {
      return NextResponse.json({ success: false, message: 'Username must be at least 4 characters.' }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ success: false, message: 'Username can only contain letters, numbers, and underscores.' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });
    }
    if (!password || password.length < 5) {
      return NextResponse.json({ success: false, message: 'Password must be at least 5 characters long.' }, { status: 400 });
    }
    const passwordRegex = /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^_\-]).{4,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Password must start with an uppercase letter and include at least one number and one special character (@$!%*?&#).' 
      }, { status: 400 });
    }

    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email or username already exists.',
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users
      (fullName, username, email, password, role, givenName, familyName, affiliation, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        username,
        email,
        hashedPassword,
        'author',
        givenName,
        familyName || null,
        affiliation,
        countryCode,
      ]
    );

    await sendNotificationEmail(
      email,
      'Registration Successful - EISR Portal',
      `Hello ${fullName}, your account has been created successfully.`,
      `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0B1F3A;">Registration Successful</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Your account has been created successfully on the EISR Portal.</p>
          <p>You can now log in and continue using the portal.</p>
        </div>
      `
    );

    // Notify Admin about new user with FULL DATA
    await sendNotificationEmail(
      process.env.SMTP_USER,
      'New User Registration - EISR Portal',
      `A new user has registered: ${fullName} (${username})`,
      `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #0B1F3A; border-bottom: 2px solid #eee; padding-bottom: 10px;">New User Registration Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Full Name:</td><td>${fullName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Given Name:</td><td>${givenName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Family Name:</td><td>${familyName || 'Not Provided'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Username:</td><td>${username}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Affiliation:</td><td>${affiliation}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Country:</td><td>${countryName} (${countryCode})</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Role:</td><td>author</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">
            This is an automated notification from the EISR Portal.
          </p>
        </div>
      `
    );

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully!',
        userId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
