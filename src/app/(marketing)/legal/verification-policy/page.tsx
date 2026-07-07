import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Verification Policy — ShadoPay" };

export default function VerificationPolicyPage() {
  return (
    <LegalDocument
      title="Verification Policy"
      lastUpdated="July 7, 2026"
      summary="This Policy describes how ShadoPay verifies businesses (KYB) before enabling live payment processing, and the ongoing verification obligations that follow."
    >
      <LegalSection title="1. Why we verify">
        <p>
          Verification protects merchants, customers, and the platform by confirming that businesses
          using ShadoPay are legally registered, accurately represented, and operating within
          applicable regulatory requirements for their category.
        </p>
      </LegalSection>

      <LegalSection title="2. Information collected">
        <p>During onboarding, we request:</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>Registered legal business name, registration number, and jurisdiction of incorporation.</li>
          <li>Business type and category of goods or services sold.</li>
          <li>Beneficial ownership information for individuals holding a significant ownership interest.</li>
          <li>Supporting documents, such as a certificate of incorporation, proof of address, and government-issued identification.</li>
          <li>Category-specific licensing documentation, where applicable.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Review process">
        <p>
          Submitted information is reviewed by our compliance team. Reviews typically conclude within
          one to two business days. Outcomes are one of: approved, rejected, or a request for
          additional information, each with a stated reason visible in the merchant's Trust Centre.
        </p>
      </LegalSection>

      <LegalSection title="4. Ongoing verification">
        <p>
          Material changes to a merchant's business — such as a change in ownership, registered
          address, or category — may trigger re-verification. We may also periodically re-verify
          merchants as part of standard compliance refresh cycles. [Placeholder: insert refresh
          cadence, e.g. annually or risk-based.]
        </p>
      </LegalSection>

      <LegalSection title="5. Rejection and appeal">
        <p>
          If verification is rejected, the merchant is informed of the reason to the extent permitted
          by law. Merchants may submit additional information or documentation for reconsideration by
          contacting{" "}
          <a href="mailto:legal@shadopay.dev" className="text-accent hover:underline">legal@shadopay.dev</a>.
        </p>
      </LegalSection>

      <LegalSection title="6. Data handling">
        <p>
          Verification documents are stored in encrypted, access-controlled storage and are only
          accessible to authorized compliance personnel, consistent with our{" "}
          <a href="/legal/privacy" className="text-accent hover:underline">Privacy Policy</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
