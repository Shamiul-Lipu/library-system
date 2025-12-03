import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.database_url}`,
});

export const initDB = async () => {
  try {
    // USERS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);

    // BOOKS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        genre VARCHAR(50) NOT NULL CHECK (
          genre IN ('FICTION','NON_FICTION','SCIENCE','HISTORY','BIOGRAPHY','FANTASY')
        ),
        description TEXT,
        copies INT NOT NULL CHECK (copies >= 0),
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);

    // BORROWS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS borrows (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        book_id INT REFERENCES books(id) ON DELETE CASCADE,
        quantity INT NOT NULL CHECK (quantity > 0),
        due_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);

    console.log("✅ All tables initialized successfully");
  } catch (error: any) {
    console.error("❌ Error initializing DB:", error.message);
  }
};
