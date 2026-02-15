import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.MYSQL_DATABASE || "ecobot";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initDb() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
  });
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  } finally {
    await conn.end();
  }
  const poolConn = await pool.getConnection();
  try {
    await poolConn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) DEFAULT '',
        active TINYINT(1) NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    const bcrypt = (await import("bcrypt")).default;
    const [rows] = await poolConn.query("SELECT 1 FROM users LIMIT 1");
    if (rows.length === 0) {
      const hash = await bcrypt.hash("admin", 10);
      await poolConn.query(
        "INSERT INTO users (email, password_hash, name, active) VALUES (?, ?, ?, 1)",
        ["admin@ecobot.local", hash, "Admin"]
      );
    }
  } finally {
    poolConn.release();
  }
}

export default pool;
