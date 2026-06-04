const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password2root',
    database: process.env.MYSQL_DATABASE || 'eisr_db5'
  });

  try {
    console.log('Connected to DB!');
    
    // 1. Create a test author
    const [rows] = await connection.query('SELECT * FROM users WHERE email = "author@test.com"');
    if (rows.length === 0) {
      await connection.query('INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)', 
        ['Test Author', 'author@test.com', 'hashed_password', 'author']);
      console.log('Test Author created');
    }

    // 2. Create a test editor
    const [rows2] = await connection.query('SELECT * FROM users WHERE email = "editor@test.com"');
    if (rows2.length === 0) {
      await connection.query('INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)', 
        ['Test Editor', 'editor@test.com', 'hashed_password', 'editor']);
      console.log('Test Editor created');
    }

    console.log('Test setup complete');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await connection.end();
  }
}

test();
