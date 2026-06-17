import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
    <div className="mx-auto max-w-7xl">
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-lg font-bold text-primary-400">
              PoseFix
            </Link>
            <nav className="hidden items-center gap-4 sm:flex">
              <Link
                href="/dashboard"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/live"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Live Monitor
              </Link>
              <Link
                href="/dashboard/templates"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Templates
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{session.user.name}</span>
            <Link
              href="/api/auth/signout"
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-800"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
