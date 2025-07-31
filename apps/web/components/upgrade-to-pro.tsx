"use client";

import { Button } from "@workspace/shadverse/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/shadverse/components/card";
import { useAuth } from "@/lib/auth-context";
import { getCheckoutUrl } from "@/lib/polar-client";

export function UpgradeToPro() {
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user) {
      console.log("❌ No user found, redirecting to login");
      window.location.href = "/auth/login";
      return;
    }

    console.log(`🛒 Starting checkout process for user: ${user.id}`);

    const checkoutUrl = getCheckoutUrl(user.email!, user.id);
    console.log("🔗 Redirecting to checkout:", checkoutUrl);

    window.location.href = checkoutUrl;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock premium features and get access to advanced functionality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleUpgrade} className="w-full">
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  );
}
