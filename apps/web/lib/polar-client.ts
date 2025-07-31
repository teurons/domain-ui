import { api } from "./polar";
import { logError } from "./logger";

export interface PolarCustomer {
  id: string;
  externalId?: string;
  email: string;
  name?: string;
}

export interface PolarSubscription {
  id: string;
  product_id: string;
  status: string;
  created_at: string;
  current_period_start: string;
  current_period_end: string;
}

export interface CustomerState {
  active_subscriptions: PolarSubscription[];
}

class PolarClient {
  private apiUrl =
    process.env.POLAR_IS_SANDBOX === "true"
      ? "https://sandbox-api.polar.sh"
      : "https://api.polar.sh";

  /**
   * Get customer state by external ID (Supabase user ID)
   */
  async getCustomerState(
    externalCustomerId: string
  ): Promise<CustomerState | null> {
    try {
      const response = await fetch(
        `${this.apiUrl}/v1/customers/external/${externalCustomerId}/state`,
        {
          headers: {
            Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
          },
        }
      );

      if (response.status === 404) {
        return null; // Customer doesn't exist yet
      }

      if (!response.ok) {
        throw new Error(
          `Polar API error: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    } catch {
      // Error is silently ignored - customer state will be null
      return null;
    }
  }

  /**
   * Check if user has any active subscription
   */
  async hasActiveSubscription(externalCustomerId: string): Promise<boolean> {
    const customerState = await this.getCustomerState(externalCustomerId);
    return customerState
      ? customerState.active_subscriptions.length > 0
      : false;
  }

  /**
   * Check if user has subscription for a specific product
   */
  async hasProductSubscription(
    externalCustomerId: string,
    productId: string = process.env.POLAR_PRODUCT_ID || ""
  ): Promise<boolean> {
    const customerState = await this.getCustomerState(externalCustomerId);
    if (!customerState) {
      return false;
    }

    return customerState.active_subscriptions.some(
      (sub) => sub.product_id === productId && sub.status === "active"
    );
  }

  /**
   * Find Polar customer by external ID and return their internal customer ID
   */
  async findCustomerIdByExternalId(
    externalCustomerId: string
  ): Promise<string | null> {
    try {
      // First check if customer exists via state API
      const customerState = await this.getCustomerState(externalCustomerId);
      if (!customerState) {
        return null;
      }

      // Get customer list to find the internal customer ID
      const customerResponse = await api.customers.list({
        limit: 100,
      });

      const customer = customerResponse.result?.items?.find(
        (c) => c.externalId === externalCustomerId
      );

      return customer?.id || null;
    } catch (error) {
      logError("Error finding customer ID:", error);
      return null;
    }
  }

  /**
   * Create checkout URL with proper external customer ID linking
   */
  getCheckoutUrl(
    userEmail: string,
    externalCustomerId: string,
    productId?: string
  ): string {
    const params = new URLSearchParams({
      products: productId || process.env.POLAR_PRODUCT_ID || "",
      customerEmail: userEmail,
      customerExternalId: externalCustomerId,
    });

    return `/checkout?${params.toString()}`;
  }

  /**
   * Get portal URL for customer management
   */
  getPortalUrl(): string {
    return "/portal";
  }
}

export const polarClient = new PolarClient();

// Export convenience functions with proper binding
export const getCustomerState = (externalCustomerId: string) =>
  polarClient.getCustomerState(externalCustomerId);

export const hasActiveSubscription = (externalCustomerId: string) =>
  polarClient.hasActiveSubscription(externalCustomerId);

export const hasProductSubscription = (
  externalCustomerId: string,
  productId?: string
) => polarClient.hasProductSubscription(externalCustomerId, productId);

export const findCustomerIdByExternalId = (externalCustomerId: string) =>
  polarClient.findCustomerIdByExternalId(externalCustomerId);

export const getCheckoutUrl = (
  userEmail: string,
  externalCustomerId: string,
  productId?: string
) => polarClient.getCheckoutUrl(userEmail, externalCustomerId, productId);

export const getPortalUrl = () => polarClient.getPortalUrl();
