import { Button } from "@workspace/shadverse/components/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Domain UI
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg">
          A modern Next.js application with Supabase authentication and Polar.sh
          subscription management.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/auth/login">Get Started</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/protected">View Features</Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">🔐 Secure Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Powered by Supabase with email verification and secure sessions.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">💳 Subscription Management</h3>
            <p className="text-sm text-muted-foreground">
              Integrated with Polar.sh for seamless subscription handling.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold mb-2">⚡ Modern Stack</h3>
            <p className="text-sm text-muted-foreground">
              Built with Next.js 15, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
