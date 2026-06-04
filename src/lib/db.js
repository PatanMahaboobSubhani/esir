import mysql from 'mysql2/promise';

if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
  console.warn('[DB] Warning: Missing database environment variables. These must be set for the application to function correctly.');
}

/**
 * Global MySQL connection pool for Next.js
 * Connections are reused, improving performance.
 */
const pool = mysql.createPool({
  host:     process.env.MYSQL_HOST     || 'localhost',
  port:     process.env.MYSQL_PORT     || 3306, 
  user:     process.env.MYSQL_USER     || 'root',
  password: process.env.MYSQL_PASSWORD || 'password2root',
  database: process.env.MYSQL_DATABASE || 'eisr_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
