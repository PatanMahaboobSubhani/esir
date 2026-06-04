import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

// Add a fallback secret just for local testing, though it should be in .env.local
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_eisr_123';

export async function POST(req) {
  try {
    const { email: identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email/username and password.' },
        { status: 400 }
      );
    }

    // --- HARDCODED USER SYNC LOGIC ---
    // Check if the provided identifier matches any hardcoded env credentials
    const hardcodedUsers = [
      { email: process.env.ADMIN_EMAIL, pass: process.env.ADMIN_PASS, role: 'admin', name: 'System Admin' },
      { email: process.env.EDITOR_1_EMAIL, pass: process.env.EDITOR_1_PASS, role: 'editor', name: 'Editor One' },
      { email: process.env.EDITOR_JEISA_EMAIL, pass: process.env.EDITOR_JEISA_PASS, role: 'editor', name: 'Editor (JEISA)' },
      { email: process.env.EDITOR_JEIML_EMAIL, pass: process.env.EDITOR_JEIML_PASS, role: 'editor', name: 'Editor (JEIML)' },
      { email: process.env.REVIEWER_EMAIL, pass: process.env.REVIEWER_PASS, role: 'reviewer', name: 'Dr. Theyazn Hadi' },
      { email: process.env.REVIEWER_4_EMAIL, pass: process.env.REVIEWER_4_PASS, role: 'reviewer', name: 'Shubh Salunke' },
    ];

    const matchedHardcoded = hardcodedUsers.find(u => u.email && u.email.toLowerCase() === identifier.toLowerCase().trim());

    if (matchedHardcoded) {
      console.log('--- LOGIN DEBUG ---');
      console.log('Matched Email:', matchedHardcoded.email);
      console.log('ENV Pass (length):', matchedHardcoded.pass?.length);
      console.log('Input Pass (length):', password?.length);
      console.log('Pass Match:', matchedHardcoded.pass === password);
      console.log('------------------');
    }

    if (matchedHardcoded && matchedHardcoded.pass === password) {
      // Check if this hardcoded user exists in the DB, if not, create them
      const [existing] = await pool.query('SELECT id, fullName, username, email, role FROM users WHERE email = ?', [matchedHardcoded.email]);
      
      let finalUser;
      if (existing.length === 0) {
        // Create the user in database so they have a real ID for relations
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
          'INSERT INTO users (fullName, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
          [matchedHardcoded.name, matchedHardcoded.email.split('@')[0], matchedHardcoded.email, hashedPassword, matchedHardcoded.role]
        );
        finalUser = { id: result.insertId, fullName: matchedHardcoded.name, email: matchedHardcoded.email, role: matchedHardcoded.role };
      } else {
        finalUser = existing[0];
        // Ensure role is correctly set in DB (may have been created without role during assignment)
        if (!finalUser.role || finalUser.role !== matchedHardcoded.role) {
          await pool.query('UPDATE users SET role = ? WHERE id = ?', [matchedHardcoded.role, finalUser.id]);
          finalUser.role = matchedHardcoded.role;
        }
      }

      // *** FIX: Sync reviewer_assignments to use THIS user's ID ***
      // Handles case where assignment was created with a placeholder user_id
      if (matchedHardcoded.role === 'reviewer') {
        try {
          // Find all users that have the same email (duplicate accounts)
          const [sameEmailUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ? AND id != ?',
            [matchedHardcoded.email, finalUser.id]
          );
          if (sameEmailUsers.length > 0) {
            for (const oldUser of sameEmailUsers) {
              await pool.query(
                'UPDATE reviewer_assignments SET user_id = ? WHERE user_id = ?',
                [finalUser.id, oldUser.id]
              );
            }
          }
        } catch (syncErr) {
          // Non-critical: log but don't break login
          console.error('Assignment sync error (non-critical):', syncErr.message);
        }
      }

      // Generate JWT for the hardcoded user
      const token = jwt.sign(
        { userId: finalUser.id, email: finalUser.email, name: finalUser.fullName, role: finalUser.role },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      return NextResponse.json({ 
        success: true, 
        message: 'Login successful (Environment User Identified)!',
        token: token,
        user: { id: finalUser.id, fullName: finalUser.fullName, email: finalUser.email, role: finalUser.role }
      }, { status: 200 });
    }
    // --- END HARDCODED USER SYNC LOGIC ---

    // Fetch user from DB (for normal registered Authors)
    const [users] = await pool.query(
      'SELECT id, fullName, username, email, password, role FROM users WHERE email = ? OR username = ?',
      [identifier, identifier]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify Password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.fullName, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successful!',
        token: token,
        user: {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.', error: error.message },
      { status: 500 }
    );
  }
}
