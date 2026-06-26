import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'trainer' && session.user.role !== 'admin')) {
    redirect('/sessions');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary shadow-sm">
                <svg
                  className="block h-5 w-5 shrink-0 text-primary-foreground"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="hidden text-sm font-semibold tracking-wide sm:inline-block">PoseFix</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/live"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Live Monitor
              </Link>
              <Link
                href="/dashboard/templates"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Templates
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary ring-1 ring-primary/10">
                {session.user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium">{session.user.name}</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/api/auth/signout">Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 md:py-8 lg:py-10">{children}</main>
    </div>
  );
}
