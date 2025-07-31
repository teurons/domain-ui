import { createClient } from "@/lib/supabase/client";
import type { User, AuthError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export interface AuthSession {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

class SupabaseAuthClient {
  private supabase = createClient();

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async signUp(
    email: string,
    password: string,
    options?: { redirectTo?: string }
  ) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: options?.redirectTo,
      },
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    return { user: data.user, error };
  }

  async resetPassword(email: string, redirectTo?: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo,
      }
    );
    return { data, error };
  }

  async updatePassword(password: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password,
    });
    return { data, error };
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const {
      data: { subscription },
    } = this.supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }
}

export const authClient = new SupabaseAuthClient();

// React hook for session management
export function useSession(): AuthSession {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { user: currentUser, error: userError } =
          await authClient.getUser();
        if (userError) {
          setError(userError);
        } else {
          setUser(currentUser);
        }
      } catch (err) {
        setError(err as AuthError);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const unsubscribe = authClient.onAuthStateChange((newUser) => {
      setUser(newUser);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  return { user, loading, error };
}

// Export individual functions for convenience
export const {
  signIn,
  signUp,
  signOut,
  getUser,
  resetPassword,
  updatePassword,
} = authClient;
