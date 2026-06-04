import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const setupKey = searchParams.get('key');
  
  // SECURE PRODUCTION CHECK
  // Only allow setup if the key matches 'setup-key-eisr-99'
  if (setupKey !== 'setup-key-eisr-99') {
    return NextResponse.json({ 
      success: false, 
      message: 'Unauthorized Setup Attempt. Please provide the correct setup key.' 
    }, { status: 403 });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'password2root',
    });

    const dbName = process.env.MYSQL_DATABASE || 'eisr_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'author',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure role column exists if table was created previously
    const [userCols] = await connection.query(`SHOW COLUMNS FROM users`);
    const userColNames = userCols.map(c => c.Field);
    if (!userColNames.includes('role')) {
      await connection.query(`ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'author' AFTER password`);
    }

    // Password reset tokens table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_email (email)
      )
    `);

    // Submissions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title TEXT NOT NULL,
        prefix VARCHAR(120) DEFAULT '',
        subtitle TEXT,
        abstract TEXT,
        status VARCHAR(50) DEFAULT 'Submitted',
        activity VARCHAR(100) DEFAULT 'Unassigned',
        journal_id VARCHAR(50) DEFAULT 'jcsra',
        editor_comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_journal (journal_id)
      )
    `);

    // Ensure columns exist even if table was already created earlier
    const [cols] = await connection.query(`SHOW COLUMNS FROM submissions`);
    const colNames = cols.map(c => c.Field);
    if (!colNames.includes('prefix')) await connection.query(`ALTER TABLE submissions ADD COLUMN prefix VARCHAR(120) DEFAULT '' AFTER title`);
    if (!colNames.includes('subtitle')) await connection.query(`ALTER TABLE submissions ADD COLUMN subtitle TEXT AFTER prefix`);
    if (!colNames.includes('abstract')) await connection.query(`ALTER TABLE submissions ADD COLUMN abstract TEXT AFTER subtitle`);
    if (!colNames.includes('views')) await connection.query(`ALTER TABLE submissions ADD COLUMN views INT DEFAULT 0`);

    // Submission contributors
    await connection.query(`
      CREATE TABLE IF NOT EXISTS submission_contributors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_submission (submission_id)
      )
    `);

    // Submission files
    await connection.query(`
      CREATE TABLE IF NOT EXISTS submission_files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        path VARCHAR(512),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_submission (submission_id)
      )
    `);

    // Reviewer assignments
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviewer_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT NOT NULL,
        user_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        token VARCHAR(512) DEFAULT NULL,
        deadline DATETIME DEFAULT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_submission (submission_id),
        INDEX idx_user (user_id),
        INDEX idx_token (token)
      )
    `);

    // Submission reviews
    await connection.query(`
      CREATE TABLE IF NOT EXISTS submission_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT NOT NULL,
        user_id INT NOT NULL,
        checklist_json TEXT,
        comments_authors TEXT,
        comments_editors TEXT,
        recommendation VARCHAR(50),
        rating INT DEFAULT NULL,
        file_url VARCHAR(512) DEFAULT NULL,
        is_draft TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY idx_sub_user (submission_id, user_id)
      )
    `);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully!'
    }, { status: 200 });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to setup database',
      error: error.message
    }, { status: 500 });
  }
}
