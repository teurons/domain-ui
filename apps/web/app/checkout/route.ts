import { Checkout } from "@polar-sh/nextjs";
import { env } from "@/lib/env";

export const GET = Checkout({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_IS_SANDBOX ? "sandbox" : "production",
  successUrl: `${env.NEXT_PUBLIC_APP_URL}/confirmation?checkout_id={CHECKOUT_ID}`,
});