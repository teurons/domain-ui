import { redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@workspace/shadverse/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/shadverse/components/card";
import { createClient } from "@/lib/supabase/server";
import { hasProductSubscription } from "@/lib/subscription";
import { UpgradeToPro } from "@/components/upgrade-to-pro";
import { log } from "@/lib/logger";

interface SubscriptionPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubscriptionPage({
  searchParams,
}: SubscriptionPageProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const checkoutId = params.checkout_id || params.checkoutId;
  const customerSessionToken = params.customer_session_token;

  // Show success message if coming from successful checkout
  if (checkoutId || customerSessionToken) {
    log("🎉 Payment successful!", {
      checkoutId,
      customerSessionToken,
    });

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Pro! 🎉</CardTitle>
            <CardDescription>
              Thank you for upgrading! You now have access to all premium
              features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl text-green-600">✓</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your subscription is now active!
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/subscription">Continue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check subscription status
  const hasSubscription = await hasProductSubscription(data.user.id);

  log(
    `🎯 Subscription page - user: ${data.user.id}, subscription status: ${hasSubscription}`
  );

  // User has subscription - show premium features info
  if (hasSubscription) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>🎉 Pro Subscription Active</CardTitle>
            <CardDescription>
              You have access to all premium features!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="mb-4">
                Enjoy unlimited access to all Pro features and content.
              </p>
            </div>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard">Access Premium Features</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/portal" target="_blank" rel="noopener noreferrer">
                  Manage Subscription
                </Link>
              </Button>
              <div className="pt-2 text-center">
                <span className="text-muted-foreground text-sm">
                  Logged in as {data.user.email}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User doesn't have subscription - show upgrade option
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="space-y-4">
        <UpgradeToPro />
        <Card className="mx-auto w-full max-w-md">
          <CardContent className="pt-4">
            <div className="text-center">
              <span className="text-muted-foreground text-sm">
                Logged in as {data.user.email}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
