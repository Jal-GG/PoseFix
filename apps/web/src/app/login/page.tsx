import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LoginForm from './login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === 'trainer' || session.user.role === 'admin' ? '/dashboard' : '/sessions');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-border/80 bg-card/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
