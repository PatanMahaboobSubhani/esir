import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:     process.env.MYSQL_HOST     || 'localhost',
  user:     process.env.MYSQL_USER     || 'root',
  password: process.env.MYSQL_PASSWORD || 'password2root',
  database: process.env.MYSQL_DATABASE || 'eisr_db',
});

async function migrate() {
  try {
    console.log('Adding journal_id column if not exists...');
    await pool.query("ALTER TABLE submissions ADD COLUMN journal_id VARCHAR(50) DEFAULT 'jcsra'");
    console.log('Success!');
  } catch (e) {
    if (e.code === 'ER_DUP_COLUMN_NAME') {
      console.log('Column already exists, skipping.');
    } else {
      console.error('Migration failed:', e);
    }
  } finally {
    process.exit();
  }
}

migrate();
