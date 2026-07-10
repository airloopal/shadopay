export type PaymentEnvironment = "unconfigured" | "sandbox" | "live";

/**
 * PILOT_MODE gates the entire deployment into a visual, skeletal pilot:
 * sign-up, onboarding, payment-link creation, hosted checkout, dashboard
 * balances/transactions, and admin review all work normally, but checkout
 * never calls Stripe (or any payment provider) and never claims real money
 * moved. Payment outcomes are simulated directly through the existing
 * payments engine instead. This takes priority over PAYMENT_PROVIDER_*
 * configuration — even a fully configured live Stripe key is ignored while
 * PILOT_MODE=true, by design.
 */
export function isPilotMode(): boolean {
  return process.env.PILOT_MODE === "true";
}

/**
 * Reads provider configuration from environment variables. Nothing here is
 * ever hardcoded — an unconfigured environment is a valid, expected state
 * (e.g. local development without provider credentials) and is handled
 * explicitly by callers rather than silently falling back to fake behavior.
 *
 * For Stripe specifically: PAYMENT_PROVIDER_API_KEY is the secret key
 * (sk_test_.../sk_live_...) used to authenticate server-side API calls, and
 * PAYMENT_WEBHOOK_SECRET is the webhook signing secret (whsec_...).
 * PAYMENT_PROVIDER_SECRET isn't used by Stripe — it's reserved so a future
 * provider needing a separate client secret (e.g. an OAuth-style
 * client_id/client_secret pair) doesn't require renaming any env vars.
 */
export function getPaymentProviderConfig() {
  return {
    provider: process.env.PAYMENT_PROVIDER || "stripe",
    apiKey: process.env.PAYMENT_PROVIDER_API_KEY || "",
    secret: process.env.PAYMENT_PROVIDER_SECRET || "",
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || "",
  };
}

export function isPaymentProviderConfigured(): boolean {
  const { apiKey } = getPaymentProviderConfig();
  return Boolean(apiKey);
}

/**
 * Sandbox vs live is derived from the configured API key rather than a
 * separate flag, so it's never possible for the key and the displayed mode
 * to disagree. Stripe test secret keys are prefixed `sk_test_`, live keys
 * `sk_live_`.
 */
export function getPaymentEnvironment(): PaymentEnvironment {
  const { apiKey } = getPaymentProviderConfig();
  if (!apiKey) return "unconfigured";
  if (apiKey.includes("_test_") || apiKey.startsWith("sk_test") || apiKey.startsWith("rk_test")) {
    return "sandbox";
  }
  if (apiKey.includes("_live_") || apiKey.startsWith("sk_live") || apiKey.startsWith("rk_live")) {
    return "live";
  }
  // Unknown key shape (e.g. a different provider's key format) — default to
  // the safer sandbox assumption rather than silently allowing live claims.
  return "sandbox";
}
