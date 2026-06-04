const mysql = require('mysql2/promise');

async function test() {
  // Use the values from your .env
  const config = {
    host: 'localhost',
    user: 'root', // Trying root first
    password: 'password2root',
    database: 'eisr_db5'
  };

  try {
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
    });
    console.log('Connected to MySQL server!');

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
    await connection.query(`USE \`${config.database}\`;`);
    console.log(`Using database ${config.database}`);

    // Create tables if they don't exist (Simplified for testing)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'author'
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title TEXT,
        status VARCHAR(50) DEFAULT 'Submitted',
        editor_comments TEXT
      )
    `);

    // 1. Create a test author
    const [rows] = await connection.query('SELECT * FROM users WHERE email = "author@test.com"');
    let authorId;
    if (rows.length === 0) {
      const [ins] = await connection.query('INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)', 
        ['Test Author', 'author@test.com', 'hashed', 'author']);
      authorId = ins.insertId;
      console.log('Test Author created ID:', authorId);
    } else {
      authorId = rows[0].id;
      console.log('Test Author exists ID:', authorId);
    }

    // 2. Create a test submission
    const [subRows] = await connection.query('SELECT * FROM submissions WHERE user_id = ?', [authorId]);
    let subId;
    if (subRows.length === 0) {
      const [insSub] = await connection.query('INSERT INTO submissions (user_id, title, status) VALUES (?, ?, ?)',
        [authorId, 'Test Manuscript for Workflow', 'Submitted']);
      subId = insSub.insertId;
      console.log('Test Submission created ID:', subId);
    } else {
      subId = subRows[0].id;
      console.log('Test Submission exists ID:', subId);
    }

    // 3. Test Decision Logic (Simulation)
    console.log('Simulating Editorial Decision: Revisions Requested...');
    const editorComments = 'Please fix the methodology section and update references.';
    await connection.query(
      'UPDATE submissions SET status = ?, editor_comments = ? WHERE id = ?',
      ['Revisions Requested', editorComments, subId]
    );
    console.log('Submission status updated to Revisions Requested');

    // 4. Verify Author can see it
    const [verify] = await connection.query('SELECT status, editor_comments FROM submissions WHERE id = ?', [subId]);
    console.log('Verification - Status:', verify[0].status);
    console.log('Verification - Comments:', verify[0].editor_comments);

    console.log('Workflow Test Successful!');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
