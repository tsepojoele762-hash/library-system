const { Pool } = require('pg');

// Credentials structured natively for the requested environment configuration mapping
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'library_db',
  port: process.env.DB_PORT || 5432,
});

const initDB = async () => {
  try {
    // Books Table Schema Definition
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        isbn VARCHAR(50) UNIQUE NOT NULL,
        quantity INT DEFAULT 0
      );
    `);

    // Users Table Schema Definition
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        membership_id VARCHAR(50) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'Member'
      );
    `);

    // Transaction Records Schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        book_id INT REFERENCES books(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        quantity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default administrative testing token account safely
    const seedCheck = await pool.query("SELECT * FROM users WHERE membership_id = 'MEM001'");
    if (seedCheck.rows.length === 0) {
      await pool.query("INSERT INTO users (name, membership_id, role) VALUES ('System Administrator', 'MEM001', 'Admin')");
    }
  } catch (error) {
    console.error("Database connection initialization architectural failure:", error);
    process.exit(1);
  }
};

module.exports = { pool, initDB };