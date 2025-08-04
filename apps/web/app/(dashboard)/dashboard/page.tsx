import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";
import { hasProductSubscription } from "@/lib/subscription";
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

  if (!hasSubscription) {
    log(
      "❌ User does not have subscription - redirecting to subscription page"
    );
    redirect("/subscription");
  }

  log("✅ User has subscription - showing premium content");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-md">
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
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Logged in as {data.user.email}
            </span>
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
