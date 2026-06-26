import { config } from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';

config({ path: resolve(process.cwd(), '../../.env') });

// For trust auth, try connection string without password
const sql = postgres('postgresql://posefix@localhost:5432/posefix');

try {
  const result = await sql`SELECT version()`;
  console.log('✅ Connected:', result[0].version);
  await sql.end();
  process.exit(0);
} catch (err: any) {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
}
