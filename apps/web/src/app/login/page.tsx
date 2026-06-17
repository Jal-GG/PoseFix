import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from './login-form';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === 'trainer' || session.user.role === 'admin' ? '/dashboard' : '/sessions');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>
        <LoginForm />
      </div>
    </div>
  );
}
