
import { Router } from "express";
import Stripe from 'stripe';
import { prismaClient } from "../../infra/database/postgresDb";
import { DbFindUserById } from "../../infra/database/repositories/user/DbFindUserById";
import { meController } from "../../presentation/controllers/users/MeController";
import { authenticationMiddleware } from "../../presentation/middlewares/AuthenticationMiddleware";
import { adaptRoute } from "../adapters/expressRouteAdapter";
import { middlewareAdapter } from "../adapters/middlewareAdpter";

export const usersRoutes = Router();

const stripe = new Stripe('sk_test_51Of0ZJHg2ozKWVx1YQB8yiFrSg1SIYucoRsARceK0TErQAeiozGxnB3oAPg0PgEdlmjz5MiGZT9zeYiiKci3NdiL00wOitByw2');

const dbFindUserById = new DbFindUserById();

class StripeService {
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
}

usersRoutes.get('/users/me', middlewareAdapter(authenticationMiddleware), adaptRoute(meController))

usersRoutes.post('/payment-sheet/:planId', middlewareAdapter(authenticationMiddleware), async (request, response) => {

  const user = await dbFindUserById.findById(request.metadata.accountId);
  if (!user) {
    return response.status(401).json({ error: 'unauthorized.' })
  }

  const { data: plans } = await stripe.plans.list();

  console.log({ plans })

  const plan = plans.find(pl => pl?.metadata?.planInternalId === request.params.planId);
  if (!plan) {
    return response.status(400).json({ error: 'Invalid plan.' })
  }

  const customer = await StripeService.findCustomerByEmail(user.email);

  if (!customer) {
    const newCustomer = await stripe.customers.create({
      name: user.name,
      email: user.email,
      metadata: {
        userId: user.id
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: newCustomer.id,
      items: [{
        price: plan.id,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription', payment_method_types: ['card'] },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: user.id,
        planId: plan.id,
      }
    })

    return response.json({
      subscriptionId: subscription.id,
      // @ts-ignore
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    })
  }

  const subscription = await StripeService.findSubscriptionByCustomerId(customer.id);
  if (subscription) {
    const { data: paymentIntents } = await stripe.paymentIntents.list({
      customer: customer.id
    })
    const paymentIntent = paymentIntents[0];

    return response.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret
    })
  }

  const newSubscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{
      price: plan.id,
    }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription', payment_method_types: ['card'] },
    expand: ['latest_invoice.payment_intent'],
    metadata: {
      userId: user.id,
      planId: plan.id,
    }
  })

  return response.json({
    subscriptionId: newSubscription.id,
    // @ts-ignore
    clientSecret: newSubscription.latest_invoice.payment_intent.client_secret,
  })
})

usersRoutes.post('/webhook', async (request, response) => {
  const event = request.body;

  switch (event.type) {
    case 'invoice.payment_succeeded':
      const invoicePaymentSucceeded = event.data.object as Stripe.Invoice;
      console.log('====== invoice.payment_succeeded ======')
      console.dir({ invoicePaymentSucceeded }, { depth: 7 })
      console.log('============ // ============')
      console.dir({ subscription_details: invoicePaymentSucceeded.subscription_details }, { depth: 5 })

      const plan = await stripe.plans.retrieve(invoicePaymentSucceeded.subscription_details?.metadata?.planId!);

      await prismaClient.subscription.create({
        data: {
          userId: invoicePaymentSucceeded.subscription_details?.metadata?.userId as string,
          planId: plan?.metadata?.planInternalId as string,
          status: 'active',
        }
      });
      break;

    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = event.data.object;
      console.dir({ customerSubscriptionDeleted }, { depth: 7 })
      console.log({
        planId: customerSubscriptionDeleted.plan.metadata.planInternalId! as string,
        userId: customerSubscriptionDeleted.metadata.userId! as string,
      })
      const sub = await prismaClient.subscription.findFirst({
        where: {
          planId: customerSubscriptionDeleted.plan.metadata.planInternalId! as string,
          userId: customerSubscriptionDeleted.metadata.userId! as string,
        }
      })
      await prismaClient.subscription.delete({
        where: {
          id: sub?.id
        }
      })
      break;

    case 'payment_intent.canceled':
      const payment_intentCanceled = event.data.object;
      console.dir({ payment_intentCanceled }, { depth: 7 })
      break;

    case 'plan.created':
      const planCreated = event.data.object as Stripe.Plan;
      const product = await stripe.products.retrieve(planCreated.product as string);
      const internalPlan = await prismaClient.plan.create({
        data: {
          active: planCreated.active,
          billingFrequency: planCreated.interval,
          name: product.name,
          price: planCreated.amount!,
        }
      });
      await stripe.plans.update(planCreated.id, {
        metadata: {
          planInternalId: internalPlan.id
        }
      });
      await stripe.products.update(product.id, {
        metadata: {
          planInternalId: internalPlan.id
        }
      });
      break;

    case 'plan.deleted':
      const planDeleted = event.data.object as Stripe.Plan;
      await prismaClient.plan.delete({
        where: { id: planDeleted.metadata?.planInternalId }
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return response.json({ message: "ok" })
})
