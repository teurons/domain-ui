import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    POLAR_ACCESS_TOKEN: z.string(),
    POLAR_ORG_ID: z.string(),
    POLAR_PRODUCT_ID: z.string(),
    POLAR_IS_SANDBOX: z.string().transform((val) => val === "true"),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_POLAR_PRODUCT_ID: z.string(),
  },
  runtimeEnv: {
    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
    POLAR_ORG_ID: process.env.POLAR_ORG_ID,
    POLAR_PRODUCT_ID: process.env.POLAR_PRODUCT_ID,
    POLAR_IS_SANDBOX: process.env.POLAR_IS_SANDBOX,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_POLAR_PRODUCT_ID: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
