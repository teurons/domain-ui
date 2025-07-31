import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UpgradeToPro } from "@/components/upgrade-to-pro";
import { hasProductSubscription } from "@/lib/subscription";
import { log } from "@/lib/logger";

export default async function UpgradePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  log(`💰 Upgrade page accessed by user: ${data.user.id} (${data.user.email})`);
  const hasSubscription = await hasProductSubscription(data.user.id);
  log(`🎯 Upgrade page - subscription status: ${hasSubscription}`);

  if (hasSubscription) {
    log("✅ User already has subscription, redirecting to protected page");
    redirect("/protected");
  } else {
    log("❌ User does not have subscription - showing upgrade form");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <UpgradeToPro />
    </div>
  );
}
