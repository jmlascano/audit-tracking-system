import mariadb from 'mariadb';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'org_mgt',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  connectionLimit: 10,
  acquireTimeout: 10000
});

const query = async (sql, params = []) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const db_name = process.env.DB_NAME;
const db_port = process.env.DB_PORT;

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("\x1b[36m\x1b[1m✅ Database connected successfully!\x1b[0m");
    console.log(`\x1b[33mHost: \x1b[36m${host}\x1b[0m`);
    console.log(`\x1b[33mUser: \x1b[36m${user}\x1b[0m`);
    console.log(`\x1b[33mDatabase: \x1b[36m${db_name}\x1b[0m`);
    console.log(`\x1b[33mPort: \x1b[1m\x1b[32m${db_port}\x1b[0m\n`);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize connection test
export { testConnection };
testConnection();

export default { query };