const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

async function check() {
  const connection = await mysql.createConnection({
    host: env.MYSQL_HOST || '127.0.0.1',
    port: parseInt(env.MYSQL_PORT) || 3306,
    user: env.MYSQL_USER || 'root',
    password: env.MYSQL_PASSWORD || 'password2root',
    database: env.MYSQL_DATABASE || 'eisr_db'
  });

  try {
    console.log('--- Database Submission Statuses ---');
    const [rows] = await connection.query('SELECT id, status, activity FROM submissions');
    
    rows.forEach(r => {
        console.log(`ID: ${r.id} | Status: "${r.status}" | Activity: "${r.activity}"`);
    });

    const revisionsSubmitted = rows.filter(s => (s.status || '').toLowerCase().includes('revisions submitted')).length;
    const incomplete = rows.filter(s => (s.status || '').toLowerCase().includes('incomplete')).length;

    console.log('\n--- Logic Counts ---');
    console.log('Revisions Submitted:', revisionsSubmitted);
    console.log('Incomplete Submissions:', incomplete);

  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    await connection.end();
  }
}

check();
