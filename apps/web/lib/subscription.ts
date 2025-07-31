import { env } from "./env";
import { log } from "./logger";

export interface CustomerState {
  active_subscriptions: Array<{
    id: string;
    product_id: string;
    status: string;
    // Add other subscription properties as needed
  }>;
  // Add other customer state properties as needed
}

export async function getCustomerState(
  externalCustomerId: string
): Promise<CustomerState | null> {
  try {
    const apiUrl = env.POLAR_IS_SANDBOX 
      ? "https://sandbox-api.polar.sh" 
      : "https://api.polar.sh";
      
    const url = `${apiUrl}/v1/customers/external/${externalCustomerId}/state`;
    
    log(`🔍 Fetching customer state for external ID: ${externalCustomerId}`, { url });
      
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}`,
      },
    });

    log(`📡 Polar API Response: ${response.status} ${response.statusText}`);

    if (response.status === 404) {
      log(`❌ Customer not found in Polar (external ID: ${externalCustomerId})`);
      return null;
    }

    if (!response.ok) {
      log(`⚠️ API call failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const customerState = await response.json();
    log(`✅ Customer state retrieved`, { 
      activeSubscriptions: customerState.active_subscriptions?.length || 0,
      subscriptions: customerState.active_subscriptions 
    });

    return customerState;
  } catch (error) {
    log(`💥 Error fetching customer state`, { error: error instanceof Error ? error.message : error });
    return null;
  }
}

export async function hasActiveSubscription(
  externalCustomerId: string
): Promise<boolean> {
  log(`🔍 Checking if user has active subscription: ${externalCustomerId}`);
  const customerState = await getCustomerState(externalCustomerId);
  if (!customerState) {
    log(`❌ No customer state - returning false`);
    return false;
  }
  const hasActive = customerState.active_subscriptions.length > 0;
  log(`📊 Has active subscription: ${hasActive}`);
  return hasActive;
}

export async function hasProductSubscription(
  externalCustomerId: string,
  productId: string = env.POLAR_PRODUCT_ID
): Promise<boolean> {
  log(`🔍 Checking product subscription for user: ${externalCustomerId}`, { productId });
  const customerState = await getCustomerState(externalCustomerId);
  if (!customerState) {
    log(`❌ No customer state - returning false`);
    return false;
  }
  
  const hasProduct = customerState.active_subscriptions.some(
    (sub) => sub.product_id === productId
  );
  
  log(`📊 Has product subscription (${productId}): ${hasProduct}`, {
    allSubscriptions: customerState.active_subscriptions.map(sub => ({
      id: sub.id,
      product_id: sub.product_id,
      status: sub.status
    }))
  });
  
  return hasProduct;
}
