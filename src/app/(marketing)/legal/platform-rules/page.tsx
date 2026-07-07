import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Platform Rules — ShadoPay" };

export default function PlatformRulesPage() {
  return (
    <LegalDocument
      title="Platform Rules"
      lastUpdated="July 7, 2026"
      summary="These Platform Rules set out operating requirements for merchants using ShadoPay, supplementing the Merchant Agreement and Acceptable Use Policy."
    >
      <LegalSection title="1. Accurate business representation">
        <p>
          Your business name, category, website, and billing descriptor must accurately reflect the
          goods or services you sell. Misleading descriptors that obscure the nature of a transaction
          from customers are not permitted.
        </p>
      </LegalSection>

      <LegalSection title="2. Checkout and disclosure requirements">
        <p>
          Hosted checkout and payment links must clearly disclose the amount charged, the goods or
          services provided, and your refund terms before a customer completes payment.
        </p>
      </LegalSection>

      <LegalSection title="3. Chargeback thresholds">
        <p>
          Merchants exceeding a chargeback rate of [Placeholder: insert threshold, e.g. 1%] of
          transaction volume in a rolling period may be placed under additional monitoring, subject to
          a reserve, or suspended pending review.
        </p>
      </LegalSection>

      <LegalSection title="4. Reserve and hold conditions">
        <p>
          We may apply or adjust a reserve percentage based on risk indicators, including chargeback
          rate, category, and transaction volume changes. Reserve terms are disclosed in your
          dashboard and Merchant Agreement.
        </p>
      </LegalSection>

      <LegalSection title="5. API usage rules">
        <p>
          Automated use of the API must comply with published rate limits and may not be used to
          circumvent monitoring or verification controls.
        </p>
      </LegalSection>

      <LegalSection title="6. Change notifications">
        <p>
          Merchants must notify ShadoPay of material changes to their business — including ownership,
          category, or processing volume expectations — as these may affect risk assessment and
          verification status.
        </p>
      </LegalSection>

      <LegalSection title="7. Enforcement">
        <p>
          Violations of these Platform Rules are handled consistent with the enforcement provisions in
          our Acceptable Use Policy and Merchant Agreement.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
