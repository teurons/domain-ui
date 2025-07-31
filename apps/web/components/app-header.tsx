"use client";

import { Button } from "@workspace/shadverse/components/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

export default function AppHeader() {
  const { user, loading, error } = useAuth();

  const renderAuthStatus = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      );
    }

    if (error) {
      return <div className="text-sm text-destructive">Error: {error}</div>;
    }

    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">
                {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0)}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-medium">
                {user.user_metadata?.name || "User"}
              </p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/protected">Dashboard</Link>
            </Button>

            <LogoutButton />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/auth/login">Sign In</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="p-4 border-b bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Your App
            </Link>
          </div>

          {/* Auth Status */}
          <div className="flex items-center space-x-4">
            {renderAuthStatus()}
          </div>
        </div>
      </div>
    </div>
  );
}
