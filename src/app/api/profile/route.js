import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyRequestUser, unauthorizedResponse } from '@/lib/auth';

export async function GET(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const [rows] = await pool.query(
      `SELECT
        id,
        fullName,
        username,
        email,
        role,
        givenName,
        familyName,
        affiliation,
        country,
        mailingAddress,
        orcid,
        bio,
        phone,
        createdAt
      FROM users
      WHERE id = ?`,
      [user.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, profile: rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const user = verifyRequestUser(req);
  if (!user) return unauthorizedResponse();

  try {
    const { givenName, familyName, affiliation, country, bio, phone } = await req.json();

    const fullName = `${givenName}${familyName ? ' ' + familyName : ''}`;

    await pool.query(
      `UPDATE users 
       SET givenName = ?, familyName = ?, fullName = ?, affiliation = ?, country = ?, bio = ?, phone = ?
       WHERE id = ?`,
      [givenName, familyName, fullName, affiliation, country, bio, phone, user.userId]
    );

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
