import Stripe from "stripe";
import { getPaymentProviderConfig, getPaymentEnvironment } from "@/features/payment-provider/config";
import type {
  PaymentProvider,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  PaymentStatusResult,
  RefundResult,
  NormalizedWebhookEvent,
} from "@/features/payment-provider/types";

export class StripeProvider implements PaymentProvider {
  readonly name = "stripe";
  readonly environment: "sandbox" | "live";
  private client: Stripe;
  private webhookSecret: string;

  constructor() {
    const { apiKey, webhookSecret } = getPaymentProviderConfig();
    if (!apiKey) {
      throw new Error("PAYMENT_PROVIDER_API_KEY is not set — cannot construct StripeProvider.");
    }
    this.client = new Stripe(apiKey, { apiVersion: "2024-10-28.acacia" });
    this.webhookSecret = webhookSecret;
    const env = getPaymentEnvironment();
    this.environment = env === "live" ? "live" : "sandbox";
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionResult> {
    const session = await this.client.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: input.currency.toLowerCase(),
            unit_amount: Math.round(input.amount * 100),
            product_data: {
              name: input.title,
              description: input.description ?? undefined,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: input.clientEmail ?? undefined,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: { paymentId: input.paymentId },
      payment_intent_data: {
        metadata: { paymentId: input.paymentId },
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout session URL.");
    }

    return { redirectUrl: session.url, providerSessionId: session.id };
  }

  async confirmPayment(providerPaymentId: string): Promise<PaymentStatusResult> {
    // Stripe Checkout confirms automatically on the hosted page; this just
    // reflects the current state back for callers that want to confirm.
    return this.getPaymentStatus(providerPaymentId);
  }

  async refundPayment(providerPaymentId: string, amount?: number): Promise<RefundResult> {
    try {
      const refund = await this.client.refunds.create({
        payment_intent: providerPaymentId,
        ...(amount != null ? { amount: Math.round(amount * 100) } : {}),
      });
      return { success: refund.status !== "failed", providerRefundId: refund.id };
    } catch (error) {
      return { success: false, failureReason: error instanceof Error ? error.message : "Refund failed" };
    }
  }

  async getPaymentStatus(providerPaymentId: string): Promise<PaymentStatusResult> {
    const intent = await this.client.paymentIntents.retrieve(providerPaymentId);
    return {
      status: mapIntentStatus(intent.status),
      providerPaymentId: intent.id,
      amountReceived: intent.amount_received ? intent.amount_received / 100 : undefined,
    };
  }

  async handleWebhook(rawBody: string, signature: string | null): Promise<NormalizedWebhookEvent> {
    if (!signature || !this.webhookSecret) {
      throw new Error("Missing webhook signature or PAYMENT_WEBHOOK_SECRET.");
    }

    const event = this.client.webhooks.constructEvent(rawBody, signature, this.webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        return {
          type: "checkout.completed",
          providerSessionId: session.id,
          providerPaymentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
          paymentId: session.metadata?.paymentId,
        };
      }
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        return {
          type: "payment.succeeded",
          providerPaymentId: intent.id,
          paymentId: intent.metadata?.paymentId,
          amountReceived: intent.amount_received ? intent.amount_received / 100 : 0,
        };
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        return {
          type: "payment.failed",
          providerPaymentId: intent.id,
          paymentId: intent.metadata?.paymentId,
          failureReason: intent.last_payment_error?.message ?? "Payment failed",
        };
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : undefined;
        return {
          type: "payment.refunded",
          providerPaymentId: paymentIntentId ?? charge.id,
          paymentId: charge.metadata?.paymentId,
        };
      }
      default:
        return { type: "unhandled" };
    }
  }
}

function mapIntentStatus(status: Stripe.PaymentIntent.Status): PaymentStatusResult["status"] {
  switch (status) {
    case "succeeded":
      return "succeeded";
    case "processing":
      return "processing";
    case "requires_payment_method":
    case "requires_confirmation":
    case "requires_action":
    case "requires_capture":
      return "pending";
    case "canceled":
      return "cancelled";
    default:
      return "pending";
  }
}
