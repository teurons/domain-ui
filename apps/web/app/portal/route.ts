import { CustomerPortal } from "@polar-sh/nextjs";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { log } from "@/lib/logger";

export const GET = CustomerPortal({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_IS_SANDBOX ? "sandbox" : "production",
  getCustomerId: async (request) => {
    try {
      log("CustomerPortal - getting customer ID");
      
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data?.user) {
        log("CustomerPortal - no authenticated user found");
        throw new Error("No authenticated user");
      }
      
      // Customer exists, now we need to get their actual Polar customer ID
      log(`CustomerPortal - finding customer for external ID: ${data.user.id}`);
      
      // Import polar to get customer list
      const { polar } = await import("@/lib/polar");
      
      const customerResponse = await polar.customers.list({
        limit: 100,
      });

      // Find customer with matching external_id
      const customer = customerResponse.result?.items?.find(
        (c: any) => c.external_id === data.user.id || c.externalId === data.user.id
      );

      if (!customer) {
        log("CustomerPortal - customer not found in list");
        throw new Error("Customer not found");
      }

      log(`CustomerPortal - returning customer ID: ${customer.id}`);
      return customer.id;
      
    } catch (error) {
      log("CustomerPortal - error getting customer ID", { error: error instanceof Error ? error.message : error });
      throw error;
    }
  },
});