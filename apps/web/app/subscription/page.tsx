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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Welcome to Pro! 🎉</CardTitle>
            <CardDescription>
              Thank you for upgrading! You now have access to all premium
              features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <p className="text-sm text-muted-foreground">
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
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
                <Link href="/protected">Access Premium Features</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/portal" target="_blank" rel="noopener noreferrer">
                  Manage Subscription
                </Link>
              </Button>
              <div className="text-center pt-2">
                <span className="text-sm text-muted-foreground">
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="space-y-4">
        <UpgradeToPro />
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-4">
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Logged in as {data.user.email}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
