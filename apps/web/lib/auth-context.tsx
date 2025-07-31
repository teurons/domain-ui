"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSession, type AuthSession } from "@/lib/auth-client";

const AuthContext = createContext<AuthSession | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession();

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}