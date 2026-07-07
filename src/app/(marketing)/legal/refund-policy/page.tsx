import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Refund Policy — ShadoPay" };

export default function RefundPolicyPage() {
  return (
    <LegalDocument
      title="Refund Policy"
      lastUpdated="July 7, 2026"
      summary="This Refund Policy describes how refunds are requested, approved, and processed for transactions made through ShadoPay-powered checkouts and payment links."
    >
      <LegalSection title="1. Merchant-controlled refunds">
        <p>
          Individual merchants set their own refund terms for goods and services sold through their
          checkout, subject to applicable consumer protection law. Customers should first refer to
          the refund terms disclosed by the merchant at the point of sale.
        </p>
      </LegalSection>

      <LegalSection title="2. How refunds are processed">
        <p>
          Merchants may issue full or partial refunds from their dashboard. Refunds are returned to
          the original payment method used and are typically reflected within [Placeholder: insert
          expected processing window] business days, depending on the customer's bank or card issuer.
        </p>
      </LegalSection>

      <LegalSection title="3. Effect on merchant settlement">
        <p>
          Refunded amounts are deducted from the merchant's available settlement balance. If a
          refund exceeds the available balance, it may be deducted from a future payout.
        </p>
      </LegalSection>

      <LegalSection title="4. Disputes and chargebacks">
        <p>
          If a customer disputes a charge directly with their card issuer rather than requesting a
          refund from the merchant, the transaction may be marked as disputed and handled under the
          dispute process described in the Merchant Agreement.
        </p>
      </LegalSection>

      <LegalSection title="5. ShadoPay fees">
        <p>
          Processing fees associated with a refunded transaction are non-refundable to the merchant,
          except where required by law or expressly stated otherwise. [Placeholder: confirm final fee
          treatment for refunds and disputes.]
        </p>
      </LegalSection>

      <LegalSection title="6. Contact">
        <p>
          Customers should contact the merchant directly for refund requests. Merchants with
          questions about refund mechanics can contact{" "}
          <a href="mailto:support@shadopay.dev" className="text-accent hover:underline">support@shadopay.dev</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
