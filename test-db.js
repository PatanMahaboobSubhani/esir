const mysql = require('mysql2/promise');

async function test() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '[PASSWORD]',
      database: 'eisr_db',
    });

    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM submissions");
    console.log("Submissions count:", rows[0].count);

    const [published] = await pool.query("SELECT COUNT(*) AS count FROM submissions WHERE status = 'Published'");
    console.log("Published count:", published[0].count);

    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err.message);
    process.exit(1);
  }
}

test();
