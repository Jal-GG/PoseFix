import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RegisterForm from './register-form';

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect('/sessions');

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Create Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
