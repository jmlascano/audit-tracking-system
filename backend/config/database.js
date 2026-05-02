import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

export const query = (sqlString, params = []) => sql.unsafe(sqlString, params);

export const testConnection = async () => {
  try {
    await sql`SELECT 1`;
    console.log("\x1b[36m\x1b[1m✅ Database connected successfully!\x1b[0m");
    console.log(`\x1b[33mDatabase: \x1b[36mSupabase Postgres\x1b[0m\n`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

export default { query };
