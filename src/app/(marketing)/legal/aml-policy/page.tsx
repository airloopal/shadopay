import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "AML Policy — ShadoPay" };

export default function AmlPolicyPage() {
  return (
    <LegalDocument
      title="Anti-Money Laundering (AML) Policy"
      lastUpdated="July 7, 2026"
      summary="ShadoPay is committed to preventing the use of its platform for money laundering, terrorist financing, or other illicit financial activity. This Policy summarizes our program at a high level."
    >
      <LegalSection title="1. Program overview">
        <p>
          Our AML program includes business verification (KYB), ongoing transaction monitoring,
          sanctions screening, and a manual review process for flagged activity. [Placeholder: insert
          the name of the designated AML compliance officer or function once appointed.]
        </p>
      </LegalSection>

      <LegalSection title="2. Customer due diligence">
        <p>
          Before enabling live payments, we collect and verify information about the merchant's legal
          registration, beneficial ownership, and business activity, as described in our{" "}
          <a href="/legal/verification-policy" className="text-accent hover:underline">Verification Policy</a>.
          Enhanced due diligence may be required for higher-risk categories or ownership structures.
        </p>
      </LegalSection>

      <LegalSection title="3. Sanctions screening">
        <p>
          Merchants and beneficial owners are screened against applicable sanctions and watch lists
          during onboarding and periodically thereafter. We do not knowingly onboard or continue
          serving sanctioned individuals or entities.
        </p>
      </LegalSection>

      <LegalSection title="4. Transaction monitoring">
        <p>
          Transactions are continuously screened for indicators of potential money laundering,
          structuring, or fraud, including unusual velocity, geographic mismatches, and patterns
          inconsistent with a merchant's disclosed business activity. Flagged transactions are
          escalated to manual review.
        </p>
      </LegalSection>

      <LegalSection title="5. Recordkeeping">
        <p>
          We retain records related to verification, transaction monitoring, and reported activity for
          the period required by applicable law. [Placeholder: insert specific retention period, e.g.
          five years from account closure, once confirmed for applicable jurisdictions.]
        </p>
      </LegalSection>

      <LegalSection title="6. Reporting obligations">
        <p>
          Where required by applicable law, suspicious activity may be reported to relevant financial
          intelligence units or regulators. [Placeholder: confirm applicable reporting regime, e.g.
          FinCEN SAR filing, once ShadoPay's regulatory registration is finalized.]
        </p>
      </LegalSection>

      <LegalSection title="7. Training">
        <p>
          Personnel involved in compliance review receive training appropriate to their role.
          [Placeholder: insert training cadence once formalized.]
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
