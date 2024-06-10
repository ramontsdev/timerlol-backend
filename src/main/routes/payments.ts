import { Router } from "express";
import Stripe from "stripe";
import { prismaClient } from "../../infra/database/postgresDb";
import { paymentPlanController } from "../../presentation/controllers/payment/PaymentPlanController";
import { authenticationMiddleware } from "../../presentation/middlewares/AuthenticationMiddleware";
import { adaptRoute } from "../adapters/expressRouteAdapter";
import { middlewareAdapter } from "../adapters/middlewareAdpter";

export const paymentsRouter = Router();

const stripe = new Stripe(
  "sk_test_51Of0ZJHg2ozKWVx1YQB8yiFrSg1SIYucoRsARceK0TErQAeiozGxnB3oAPg0PgEdlmjz5MiGZT9zeYiiKci3NdiL00wOitByw2"
);

paymentsRouter.post(
  "/plans/payment-intent/:planId",
  middlewareAdapter(authenticationMiddleware),
  adaptRoute(paymentPlanController)
);

paymentsRouter.post("/webhook", async (request, response) => {
  const event = request.body;

  try {
    switch (event.type) {
      case "invoice.payment_succeeded":
        const invoicePaymentSucceeded = event.data.object as Stripe.Invoice;

        const plan = await stripe.plans.retrieve(
          invoicePaymentSucceeded.subscription_details?.metadata?.planId!
        );

        const subscription = await prismaClient.subscription.findFirst({ // Mudar isso ter o Id da assinatura interna no metadata da stripe
          where: {
            planId: plan?.metadata?.planInternalId as string,
            userId: invoicePaymentSucceeded.subscription_details?.metadata?.userId as string,
            subscriptionExternalId: invoicePaymentSucceeded.subscription as string,
          }
        })

        await prismaClient.subscription.update({
          where: {
            id: subscription?.id!,
            planId: plan?.metadata?.planInternalId as string,
            userId: invoicePaymentSucceeded.subscription_details?.metadata?.userId as string,
            subscriptionExternalId: invoicePaymentSucceeded.subscription as string,
          },
          data: {
            status: "active",
          },
        });
        break;

      case "customer.subscription.deleted":
        const customerSubscriptionDeleted = event.data.object;
        const sub = await prismaClient.subscription.findFirst({
          where: {
            planId: customerSubscriptionDeleted.plan.metadata.planInternalId! as string,
            userId: customerSubscriptionDeleted.metadata.userId! as string,
          },
        });
        await prismaClient.subscription.delete({
          where: {
            id: sub?.id,
          },
        });
        break;

      case "plan.created":
        const planCreated = event.data.object as Stripe.Plan;
        const product = await stripe.products.retrieve(
          planCreated.product as string
        );
        const internalPlan = await prismaClient.plan.create({
          data: {
            active: planCreated.active,
            billingFrequency: planCreated.interval,
            name: product.name,
            price: planCreated.amount!,
            planExternalId: planCreated.id,
          },
        });
        await stripe.plans.update(planCreated.id, {
          metadata: {
            planInternalId: internalPlan.id,
          },
        });
        await stripe.products.update(product.id, {
          metadata: {
            planInternalId: internalPlan.id,
          },
        });
        break;

      case "plan.deleted":
        const planDeleted = event.data.object as Stripe.Plan;
        await prismaClient.plan.delete({
          where: { id: planDeleted.metadata?.planInternalId },
        });
        break;

      case 'subscription_schedule.aborted':
        const subscriptionScheduleAborted = event.data.object as Stripe.Plan;
        console.dir(subscriptionScheduleAborted, { depth: 7 })
        break

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    const error = err as Error;
    return response.json({ error: error.message });
  };

  return response.json({ message: "ok" });
});
