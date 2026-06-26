import { config } from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';

config({ path: resolve(process.cwd(), '../../.env') });

// Try without password for trust auth
const sql = postgres({
  host: 'localhost',
  port: 5432,
  database: 'posefix',
  username: 'posefix',
});

try {
  const result = await sql`SELECT version()`;
  console.log('✅ Connected:', result[0].version);
  await sql.end();
  process.exit(0);
} catch (err: any) {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
}
