import { Plan } from "@prisma/client";
import Stripe from "stripe";
import { User } from "../../../domain/models/user";
import { IFindUserById } from "../../../domain/use-cases/user/find-user-by-id";
import { prismaClient } from "../../../infra/database/postgresDb";
import { DbFindUserById } from "../../../infra/database/repositories/user/DbFindUserById";
import { StripeService, stripe } from "../../helpers/StripeService";
import { badRequest, notFound, ok, unauthorized } from "../../helpers/httpHelpers";
import { IController } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

class PaymentPlanController implements IController {
  constructor(
    private readonly findUserByIdRepository: IFindUserById,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { planId } = httpRequest.params
    if (!planId) {
      return badRequest({ error: 'PlanId is required' })
    }

    const { accountId } = httpRequest;
    if (!accountId) {
      return unauthorized();
    }

    const user = await this.findUserByIdRepository.findById(accountId);
    if (!user) {
      return unauthorized();
    }

    const plan = await prismaClient.plan.findUnique({ where: { id: planId } })
    if (!plan) {
      return notFound({ error: 'Plan not found' })
    }

    const customer = await StripeService.findCustomerByEmail(user.email);
    if (!customer) {
      const { subscriptionId, clientSecret, hostedInvoiceUrl } = await this.handleNewCustomer(user, plan);

      return ok({ subscriptionId, clientSecret, hostedInvoiceUrl });
    }

    const subscription = await StripeService.findSubscriptionByCustomerId(customer.id);
    if (!subscription) {
      const { subscriptionId, clientSecret, hostedInvoiceUrl } = await this.handleNewSubscription(user, customer, plan);
      return ok({ subscriptionId, clientSecret, hostedInvoiceUrl })
    }

    const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
    const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent as string);

    return ok({
      subscriptionId: subscription.id,
      // @ts-ignore
      clientSecret: paymentIntent.client_secret,
      hostedInvoiceUrl: invoice.hosted_invoice_url
    })
  }

  private async handleNewCustomer(user: User, plan: Plan) {
    const newCustomer = await stripe.customers.create({
      name: user.name,
      email: user.email,
      metadata: {
        userId: user.id
      },
    });

    return await this.handleNewSubscription(user, newCustomer, plan);
  }

  private async handleNewSubscription(user: User, customer: Stripe.Customer, plan: Plan) {
    const newSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: plan.planExternalId,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription', payment_method_types: ['card'] },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: user.id,
        planId: plan.planExternalId,
      }
    })

    await prismaClient.subscription.create({
      data: {
        status: 'pending',
        subscriptionExternalId: newSubscription.id,
        planId: plan.id,
        userId: user.id,
      }
    })

    return {
      subscriptionId: newSubscription.id,
      // @ts-ignore
      clientSecret: newSubscription.latest_invoice.payment_intent.client_secret,
      hostedInvoiceUrl: (newSubscription.latest_invoice as Stripe.Invoice).hosted_invoice_url
    }
  }
}

const dbFindUserById = new DbFindUserById();
export const paymentPlanController = new PaymentPlanController(dbFindUserById);
