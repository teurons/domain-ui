// Re-export from the new polar client for backward compatibility
export {
  getCustomerState,
  hasActiveSubscription, 
  hasProductSubscription,
  type CustomerState
} from "./polar-client";

import { log } from "./logger";
import { polarClient } from "./polar-client";

// Enhanced versions with logging for debugging
export async function hasProductSubscriptionWithLogging(
  externalCustomerId: string,
  productId?: string
): Promise<boolean> {
  log(`🔍 Checking product subscription for user: ${externalCustomerId}`, { productId });
  
  const customerState = await polarClient.getCustomerState(externalCustomerId);
  if (!customerState) {
    log(`❌ No customer state - returning false`);
    return false;
  }
  
  log(`✅ Customer state retrieved`, { 
    activeSubscriptions: customerState.active_subscriptions?.length || 0,
    subscriptions: customerState.active_subscriptions 
  });

  const hasProduct = await polarClient.hasProductSubscription(externalCustomerId, productId);
  
  log(`📊 Has product subscription: ${hasProduct}`, {
    allSubscriptions: customerState.active_subscriptions.map(sub => ({
      id: sub.id,
      product_id: sub.product_id,
      status: sub.status
    }))
  });
  
  return hasProduct;
}