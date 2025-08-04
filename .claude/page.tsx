import { Button } from "@workspace/shadverse/components/button";
import Link from "next/link";
import MyBadge from "@workspace/domain-ui-registry/components/domain-ui/my-badge";
import PageTitle from "@workspace/domain-ui-registry/components/domain-ui/page-title";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
        <PageTitle
          title="Welcome to Domain UI"
          subtitle="A modern Next.js application with Supabase authentication and Polar.sh subscription management."
          headingVariant="gradient"
          alignment="center"
        />

        <MyBadge />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/auth/login">Get Started</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">View Features</Link>
          </Button>
        </div>

        <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 font-semibold">🔐 Secure Authentication</h3>
            <p className="text-muted-foreground text-sm">
              Powered by Supabase with email verification and secure sessions.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 font-semibold">💳 Subscription Management</h3>
            <p className="text-muted-foreground text-sm">
              Integrated with Polar.sh for seamless subscription handling.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 font-semibold">⚡ Modern Stack</h3>
            <p className="text-muted-foreground text-sm">
              Built with Next.js 15, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
