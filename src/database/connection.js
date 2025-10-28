import pool from "./db.js";

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful:', result.rows[0]);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    pool.end();
  }
}

export {testConnection};
