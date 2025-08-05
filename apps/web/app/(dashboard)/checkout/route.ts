import { Checkout } from "@polar-sh/nextjs";
import { env } from "@/lib/env";
import { getBaseUrl } from "@/lib/get-base-url";

export const GET = Checkout({
  accessToken: env.POLAR_ACCESS_TOKEN || "",
  server: env.POLAR_IS_SANDBOX ? "sandbox" : "production",
  successUrl: `${getBaseUrl()}/subscription?checkout_id={CHECKOUT_ID}`,
});
