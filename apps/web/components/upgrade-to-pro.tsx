"use client";

import { Button } from "@workspace/shadverse/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/shadverse/components/card";
import { createClient } from "@/lib/supabase/client";

export function UpgradeToPro() {
  const handleUpgrade = async () => {
    const productId = process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID;
    console.log(`🛒 Starting checkout process with product: ${productId}`);
    
    // Get the current user for email pre-fill
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log(`❌ No user found, redirecting to login`);
      window.location.href = "/auth/login";
      return;
    }
    
    console.log(`👤 User info for checkout:`, { 
      id: user.id, 
      email: user.email 
    });
    
    const params = new URLSearchParams({
      products: productId!,
      customerEmail: user.email!,
      customerExternalId: user.id,
    });
    
    const checkoutUrl = `/checkout?${params.toString()}`;
    console.log(`🔗 Redirecting to checkout:`, checkoutUrl);
    
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
