import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-sm text-primary-400">
          AI-Powered Form Analysis
        </div>
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          Perfect Your Pose
          <br />
          <span className="text-primary-400">With AI Guidance</span>
        </h1>
        <p className="mb-8 text-lg text-gray-400">
          Real-time yoga and physiotherapy pose analysis using AI.
          Get instant feedback, track your progress, and train smarter.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-primary-600 px-6 py-3 font-medium transition-colors hover:bg-primary-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-700 px-6 py-3 font-medium transition-colors hover:bg-gray-800"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
