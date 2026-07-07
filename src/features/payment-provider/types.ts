/**
 * Provider-agnostic payment integration layer.
 *
 * Only one provider is implemented for this pilot (Stripe — see
 * stripe-provider.ts), but every call site in the app talks to this
 * interface, not the Stripe SDK directly, so adding a second provider later
 * doesn't touch checkout, webhook routing, or the payments engine.
 */

export interface CreateCheckoutSessionInput {
  /** Our internal Payment id — always passed through as metadata so webhooks can map back to it. */
  paymentId: string;
  amount: number;
  currency: string;
  title: string;
  description?: string | null;
  clientEmail?: string | null;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResult {
  /** URL to redirect the customer's browser to. */
  redirectUrl: string;
  /** The provider's own session identifier, stored on our Payment for webhook lookups. */
  providerSessionId: string;
}

export interface PaymentStatusResult {
  status: "pending" | "processing" | "succeeded" | "failed" | "cancelled";
  providerPaymentId?: string;
  amountReceived?: number;
  failureReason?: string;
}

export interface RefundResult {
  success: boolean;
  providerRefundId?: string;
  failureReason?: string;
}

export type NormalizedWebhookEvent =
  | { type: "checkout.completed"; providerSessionId: string; providerPaymentId?: string; paymentId?: string }
  | { type: "payment.succeeded"; providerSessionId?: string; providerPaymentId: string; paymentId?: string; amountReceived: number }
  | { type: "payment.failed"; providerSessionId?: string; providerPaymentId?: string; paymentId?: string; failureReason?: string }
  | { type: "payment.refunded"; providerPaymentId: string; paymentId?: string }
  | { type: "unhandled" };

export interface PaymentProvider {
  readonly name: string;
  readonly environment: "sandbox" | "live";

  createCheckoutSession(input: CreateCheckoutSessionInput): Promise<CreateCheckoutSessionResult>;

  /** Confirms/finalizes a payment where the provider requires an explicit confirm step. */
  confirmPayment(providerPaymentId: string): Promise<PaymentStatusResult>;

  refundPayment(providerPaymentId: string, amount?: number): Promise<RefundResult>;

  getPaymentStatus(providerPaymentId: string): Promise<PaymentStatusResult>;

  /** Verifies the webhook signature and returns a normalized event, or throws if invalid. */
  handleWebhook(rawBody: string, signature: string | null): Promise<NormalizedWebhookEvent>;
}
