
import { Router } from "express";
import Stripe from 'stripe';
import { DbFindUserById } from "../../infra/database/repositories/user/DbFindUserById";
import { meController } from "../../presentation/controllers/users/MeController";
import { authenticationMiddleware } from "../../presentation/middlewares/AuthenticationMiddleware";
import { adaptRoute } from "../adapters/expressRouteAdapter";
import { middlewareAdapter } from "../adapters/middlewareAdpter";

export const usersRoutes = Router();

const stripe = new Stripe('sk_test_51Of0ZJHg2ozKWVx1YQB8yiFrSg1SIYucoRsARceK0TErQAeiozGxnB3oAPg0PgEdlmjz5MiGZT9zeYiiKci3NdiL00wOitByw2');

const dbFindUserById = new DbFindUserById();

usersRoutes.get('/users/me', middlewareAdapter(authenticationMiddleware), adaptRoute(meController))
usersRoutes.post('/payment-sheet', middlewareAdapter(authenticationMiddleware), async (request, response) => {

  const user = await dbFindUserById.findById(request.metadata.accountId);
  if (!user) {
    return response.status(401).json({ error: 'unauthorized.' })
  }

  const customer = await stripe.customers.create({
    name: user.name,
    email: user.email,
    metadata: {
      accountId: user.id
    },
  });

  const { data } = await stripe.plans.list();

  const plan = data[0];

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{
      price: plan.id,
    }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  })

  console.log("============== subscription ==============")
  console.dir(subscription, { depth: 7 });
  console.log("============== // ==============")

  return response.json({
    subscriptionId: subscription.id,
    clientSecret: subscription.latest_invoice.payment_intent.client_secret,
  })
})
