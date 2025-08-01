import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { info } from "@/lib/logger";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    info(
      "Unauthenticated user trying to access dashboard - redirecting to login"
    );
    redirect("/auth/login");
  }

  info(`Dashboard accessed by user: ${data.user.id} (${data.user.email})`);

  return <>{children}</>;
}
