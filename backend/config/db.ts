import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST, // ❌ localhost remove
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // 🔥 IMPORTANT for Aiven
  ssl: {
    rejectUnauthorized: true,
  },
});

export const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL Database Connected Successfully');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    throw error;
  }
};

export default db;