import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Check if we're in production environment (only works server-side)
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
    // Supabase variables are now available in production
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    // Polar product ID is optional (not available in production yet)
    NEXT_PUBLIC_POLAR_PRODUCT_ID: z.string().optional(),
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
