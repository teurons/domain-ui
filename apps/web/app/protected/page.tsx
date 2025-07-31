import { redirect } from "next/navigation";
import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";
import { hasProductSubscription } from "@/lib/subscription";
import { Button } from "@workspace/shadverse/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/shadverse/components/card";
import { log } from "@/lib/logger";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  log(
    `🔐 Protected page accessed by user: ${data.user.id} (${data.user.email})`
  );
  const hasSubscription = await hasProductSubscription(data.user.id);
  log(`🎯 Protected page - subscription status: ${hasSubscription}`);

  if (hasSubscription) {
    log("✅ User has subscription - showing premium content");
  } else {
    log("❌ User does not have subscription - showing upgrade prompt");
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Premium Features</CardTitle>
            <CardDescription>
              This content is only available to Pro subscribers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/upgrade">Upgrade to Pro</Link>
            </Button>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Logged in as {data.user.email}
              </span>
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>🎉 Premium Features</CardTitle>
          <CardDescription>
            Welcome to the exclusive Pro content!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            You have access to all premium features as a Pro subscriber.
          </p>
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/portal" target="_blank" rel="noopener noreferrer">
                Manage Subscription
              </Link>
            </Button>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Logged in as {data.user.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
