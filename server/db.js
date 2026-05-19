import pkg from 'pg';
const { Pool } = pkg;
import { neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');

dotenv.config({ path: envPath });

// Use neonConfig for serverless environments if needed
// neonConfig.fetchConnectionCache = true;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('[DB] Error acquiring client', err.stack);
  }
  console.log('[DB] Database connected successfully to Neon');
  release();
});

export const query = (text, params) => {
  console.log(`[DB] Executing query: ${text}`);
  return pool.query(text, params);
};
