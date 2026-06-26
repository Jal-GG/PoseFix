import { config } from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';

config({ path: resolve(process.cwd(), '../../.env') });

const sql = postgres('postgresql://posefix@localhost:5432/posefix', {
  ssl: false,
  connection: {
    application_name: 'test'
  }
});

try {
  const result = await sql`SELECT version()`;
  console.log('✅ Connected:', result[0].version);
  await sql.end();
  process.exit(0);
} catch (err: any) {
  console.error('❌ Connection failed:', err.message);
  console.error('Full error:', err);
  process.exit(1);
}
