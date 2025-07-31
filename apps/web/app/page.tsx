import { Button } from "@workspace/shadverse/components/button";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold">Domain UI</h1>
        
        {user ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center">
              Welcome back, <span className="font-semibold">{user.email}</span>!
            </p>
            <div className="flex gap-2">
              <Link href="/protected">
                <Button size="sm" variant="outline">Protected Page</Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              Welcome! Please sign in to continue.
            </p>
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button size="sm">Login</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm" variant="outline">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
