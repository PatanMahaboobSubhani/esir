import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Select 1 + 1 just to check if the connection to MySQL is successful
    const [rows] = await pool.query('SELECT 1 + 1 AS connectionStatus');
    
    return NextResponse.json({ 
      success: true, 
      message: 'MySQL Database connected successfully!', 
      data: rows 
    }, { status: 200 });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to connect to MySQL database', 
      error: error.message 
    }, { status: 500 });
  }
}
