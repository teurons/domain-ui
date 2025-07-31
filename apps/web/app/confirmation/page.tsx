"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@workspace/shadverse/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/shadverse/components/card";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

function ConfirmationContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setUser] = useState<User | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push("/auth/login");
        return;
      }

      setUser(data.user);

      // Clean up URL parameters after a short delay
      const checkoutId =
        searchParams.get("checkout_id") || searchParams.get("checkoutId");
      const customerSessionToken = searchParams.get("customer_session_token");

      if (checkoutId || customerSessionToken) {
        console.log("🎉 Payment successful!", {
          checkoutId,
          customerSessionToken,
        });

        // Clean URL after 2 seconds
        setTimeout(() => {
          window.history.replaceState({}, "", "/confirmation");
        }, 2000);
      }

      setIsLoading(false);
    };

    checkUser();
  }, [router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
              <p>Processing your subscription...</p>
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
          <CardTitle>Welcome to Pro! 🎉</CardTitle>
          <CardDescription>
            Thank you for upgrading! You now have access to all premium
            features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/protected">Access Premium Features</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/portal" target="_blank" rel="noopener noreferrer">
              Manage Subscription
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
                <p>Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
