import { CustomerPortal } from "@polar-sh/nextjs";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { log } from "@/lib/logger";
import { findCustomerIdByExternalId } from "@/lib/polar-client";

export const GET = CustomerPortal({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_IS_SANDBOX ? "sandbox" : "production",
  getCustomerId: async () => {
    try {
      log("CustomerPortal - getting customer ID");

      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        log("CustomerPortal - no authenticated user found");
        throw new Error("No authenticated user");
      }

      log(`CustomerPortal - finding customer for external ID: ${data.user.id}`);

      const customerId = await findCustomerIdByExternalId(data.user.id);

      if (!customerId) {
        log("CustomerPortal - customer not found");
        throw new Error("Customer not found");
      }

      log(`CustomerPortal - returning customer ID: ${customerId}`);
      return customerId;
    } catch (error) {
      log("CustomerPortal - error getting customer ID", {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  },
});
