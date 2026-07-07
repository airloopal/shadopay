import { StripeProvider } from "@/features/payment-provider/stripe-provider";
import { getPaymentProviderConfig, isPaymentProviderConfigured, getPaymentEnvironment } from "@/features/payment-provider/config";
import type { PaymentProvider } from "@/features/payment-provider/types";

export { isPaymentProviderConfigured, getPaymentEnvironment };
export type { PaymentEnvironment } from "@/features/payment-provider/config";

let cached: PaymentProvider | null = null;

/**
 * Returns the configured PaymentProvider. Only Stripe is implemented for
 * this pilot; PAYMENT_PROVIDER exists so a second provider can be added
 * later without touching any call site.
 *
 * Throws if no provider is configured — callers must check
 * `isPaymentProviderConfigured()` first and show an explicit "not
 * configured" state rather than silently faking a payment.
 */
export function getPaymentProvider(): PaymentProvider {
  if (!isPaymentProviderConfigured()) {
    throw new Error(
      "No payment provider is configured. Set PAYMENT_PROVIDER_API_KEY (and PAYMENT_WEBHOOK_SECRET) to enable checkout."
    );
  }

  if (cached) return cached;

  const { provider } = getPaymentProviderConfig();
  switch (provider) {
    case "stripe":
      cached = new StripeProvider();
      return cached;
    default:
      throw new Error(`Unsupported PAYMENT_PROVIDER "${provider}". Only "stripe" is implemented.`);
  }
}
