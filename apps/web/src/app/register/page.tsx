import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import RegisterForm from './register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect('/sessions');

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-border/80 bg-card/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Create an account</CardTitle>
            <CardDescription>Enter your information to get started with PoseFix</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
