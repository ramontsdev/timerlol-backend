export type BillingStatus = 'active' | 'canceled' | 'processing' | 'pending'

export type SubscriptionModal = {
  id: string;
  userId: string;
  planId: string;
  status: BillingStatus;
  subscriptionExternalId: string;
}
