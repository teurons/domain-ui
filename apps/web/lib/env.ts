import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Check if we're in production environment
const isProduction = process.env.VERCEL_ENV === "production";

export const env = createEnv({
  server: {
    // Make Polar variables optional in production until auth/payments are deployed
    POLAR_ACCESS_TOKEN: isProduction ? z.string().optional() : z.string(),
    POLAR_ORG_ID: isProduction ? z.string().optional() : z.string(),
    POLAR_PRODUCT_ID: isProduction ? z.string().optional() : z.string(),
    POLAR_IS_SANDBOX: isProduction
      ? z
          .string()
          .optional()
          .transform((val) => val === "true")
      : z.string().transform((val) => val === "true"),
  },
  client: {
    // Make Supabase variables optional in production until auth is deployed
    NEXT_PUBLIC_SUPABASE_URL: isProduction
      ? z.string().url().optional()
      : z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: isProduction
      ? z.string().optional()
      : z.string(),
    NEXT_PUBLIC_POLAR_PRODUCT_ID: isProduction
      ? z.string().optional()
      : z.string(),
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
