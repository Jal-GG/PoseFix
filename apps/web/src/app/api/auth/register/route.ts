import { db } from '@posefix/db';
import { users } from '@posefix/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['client', 'trainer']),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ message: 'Invalid input', errors: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;

    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return Response.json({ message: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(users)
      .values({ name, email, passwordHash, role })
      .returning({ id: users.id });

    return Response.json({ id: user.id }, { status: 201 });
  } catch (e) {
    console.error('Registration error:', e);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
