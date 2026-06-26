import { config } from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';

config({ path: resolve(process.cwd(), '../../.env') });

const sql = postgres(process.env.DATABASE_URL!);

try {
  const result = await sql`SELECT version()`;
  console.log('✅ Connected:', result[0].version);
  await sql.end();
  process.exit(0);
} catch (err: any) {
  console.error('❌ Connection failed:', err.message);
  console.error('DATABASE_URL:', process.env.DATABASE_URL);
  process.exit(1);
}
