import Link from 'next/link';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden border-primary/15 bg-background/80 backdrop-blur">
            <CardHeader className="space-y-5 p-8 lg:p-10">
              <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/10">AI-Powered Form Analysis</Badge>
              <div className="space-y-4">
                <CardTitle className="text-4xl tracking-tight sm:text-5xl lg:text-6xl">
                  Perfect Your Pose
                  <span className="mt-2 block bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                    With AI Guidance
                  </span>
                </CardTitle>
                <CardDescription className="max-w-2xl text-base sm:text-lg">
                  Real-time yoga and physiotherapy pose analysis using AI. Get instant feedback, track your progress, and train smarter.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-8 pb-8 lg:px-10 lg:pb-10 sm:flex-row">
              <Button asChild className="sm:w-auto">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="sm:w-auto">
                <Link href="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Why trainers use PoseFix</CardTitle>
              <CardDescription>Everything is arranged around faster coaching and clearer feedback.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Real-time analysis across yoga, rehab, and stretching flows',
                'Progress tracking with client-specific trend visibility',
                'AI coaching insights surfaced directly in every session',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-4">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">✓</div>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
