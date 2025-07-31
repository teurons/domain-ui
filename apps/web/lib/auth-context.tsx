"use client";

import { createContext, use, type ReactNode } from "react";
import { useSession, type AuthSession } from "@/lib/auth-client";

const AuthContext = createContext<AuthSession | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession();

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
