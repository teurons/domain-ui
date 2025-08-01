import { createClient } from "@/lib/supabase/client";
import { error } from "@/lib/logger";
import { useEffect, useState } from "react";

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileName = async () => {
      const { data, error: authError } = await createClient().auth.getSession();
      if (authError) {
        error("Failed to get user session for name", authError);
      }

      setName(data.session?.user.user_metadata.full_name ?? "?");
    };

    fetchProfileName();
  }, []);

  return name || "?";
};
