import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Merchant Agreement — ShadoPay" };

export default function MerchantAgreementPage() {
  return (
    <LegalDocument
      title="Merchant Agreement"
      lastUpdated="July 7, 2026"
      summary="This Merchant Agreement supplements our Terms of Service and governs your use of ShadoPay to accept payments, receive payouts, and access related merchant tooling."
    >
      <LegalSection title="1. Eligibility to process payments">
        <p>
          Live payment processing requires completion of business verification (KYB) as described in
          our{" "}
          <a href="/legal/verification-policy" className="text-accent hover:underline">Verification Policy</a>.
          We may approve, reject, or request additional information at our discretion based on the
          nature of your business, its risk profile, and applicable regulatory requirements.
        </p>
      </LegalSection>

      <LegalSection title="2. Settlement and payouts">
        <p>
          Funds from successful transactions are settled to your designated bank account according to
          the payout schedule shown in your dashboard. We may apply a reserve — a percentage of
          transaction volume held temporarily — based on your risk tier, industry, or transaction
          history. Reserve terms are disclosed to you before they take effect. [Placeholder: insert
          specific reserve release conditions.]
        </p>
      </LegalSection>

      <LegalSection title="3. Fees and adjustments">
        <p>
          Applicable transaction and payout fees are set out in your account or order form. We may
          adjust fees prospectively with notice as described in our Terms of Service. Chargebacks,
          disputes, and refunds may result in corresponding deductions from your settlement balance.
        </p>
      </LegalSection>

      <LegalSection title="4. Chargebacks and disputes">
        <p>
          You are responsible for chargebacks resulting from transactions processed through your
          account, including associated fees. We may require supporting documentation to contest a
          dispute and may withhold funds related to disputed transactions pending resolution.
        </p>
      </LegalSection>

      <LegalSection title="5. Monitoring and compliance holds">
        <p>
          Transactions are subject to ongoing monitoring described in our{" "}
          <a href="/trust#monitoring" className="text-accent hover:underline">Trust Centre</a>.
          We may place a temporary hold on funds or suspend processing where a transaction or pattern
          of transactions triggers a compliance review, pending the outcome of that review.
        </p>
      </LegalSection>

      <LegalSection title="6. Representations and warranties">
        <p>
          You represent that all information provided during verification is accurate and complete,
          that you have all licenses required to operate your business lawfully, and that goods and
          services sold through the Services comply with our{" "}
          <a href="/legal/content-standards" className="text-accent hover:underline">Content Standards</a>.
        </p>
      </LegalSection>

      <LegalSection title="7. Suspension and termination">
        <p>
          We may suspend or terminate your ability to process payments if you violate this Agreement,
          our Acceptable Use Policy, or applicable law, or if required by a payment network, banking
          partner, or regulator. Upon termination, any outstanding reserve will be released according
          to the timeline disclosed at onboarding, net of any amounts owed to us.
        </p>
      </LegalSection>

      <LegalSection title="8. Liability and indemnification">
        <p>
          You agree to indemnify ShadoPay against claims arising from your use of the Services in
          violation of this Agreement or applicable law. [Placeholder: insert mutual indemnification
          and liability cap language reviewed by counsel.]
        </p>
      </LegalSection>

      <LegalSection title="9. Relationship to other policies">
        <p>
          This Agreement incorporates by reference our Terms of Service, Acceptable Use Policy,
          Verification Policy, AML Policy, and Refund Policy. In the event of conflict specific to
          payment processing, this Agreement controls.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
