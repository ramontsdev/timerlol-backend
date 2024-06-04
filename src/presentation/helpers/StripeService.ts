import Stripe from "stripe";

export const stripe = new Stripe('sk_test_51Of0ZJHg2ozKWVx1YQB8yiFrSg1SIYucoRsARceK0TErQAeiozGxnB3oAPg0PgEdlmjz5MiGZT9zeYiiKci3NdiL00wOitByw2');

export class StripeService {
  static async findCustomerById(customerId: string): Promise<Stripe.Customer | null> {
    const customer = await stripe.customers.retrieve(customerId);

    return customer as Stripe.Customer;
  }

  static async findCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    const { data } = await stripe.customers.list({ email });
    const customer = data[0];

    return customer as Stripe.Customer;
  }

  static async findSubscriptionById(subscriptionId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    return subscription;
  }

  static async findSubscriptionByCustomerId(customerId: string) {
    const { data: subscriptions } = await stripe.subscriptions.list({
      customer: customerId,
    })

    const subscription = subscriptions[0];

    return subscription;
  }

  static async findPlanByPlanId(planId: string) {
    const plan = await stripe.plans.retrieve(planId);

    return plan;
  }
}
