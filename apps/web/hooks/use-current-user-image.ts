import { createClient } from "@/lib/supabase/client";
import { error } from "@/lib/logger";
import { useEffect, useState } from "react";

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      const { data, error: authError } = await createClient().auth.getSession();
      if (authError) {
        error("Failed to get user session for avatar", authError);
      }

      setImage(data.session?.user.user_metadata.avatar_url ?? null);
    };
    fetchUserImage();
  }, []);

  return image;
};
