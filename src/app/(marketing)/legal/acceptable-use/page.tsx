import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Acceptable Use Policy — ShadoPay" };

export default function AcceptableUsePage() {
  return (
    <LegalDocument
      title="Acceptable Use Policy"
      lastUpdated="July 7, 2026"
      summary="This Acceptable Use Policy sets out the rules for using the ShadoPay platform. It applies to all merchants, team members, and API integrators."
    >
      <LegalSection title="1. General principle">
        <p>
          You may only use ShadoPay for lawful business purposes consistent with our{" "}
          <a href="/legal/merchant-agreement" className="text-accent hover:underline">Merchant Agreement</a>{" "}
          and{" "}
          <a href="/legal/content-standards" className="text-accent hover:underline">Content Standards</a>.
          We evaluate high-risk categories individually and reserve the right to decline or suspend
          any use that we determine, in our reasonable discretion, poses undue legal, financial, or
          reputational risk.
        </p>
      </LegalSection>

      <LegalSection title="2. Prohibited activities">
        <p>You may not use the Services to:</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>Facilitate illegal goods, services, or activities under applicable law.</li>
          <li>Process transactions on behalf of a business you do not own or represent without authorization.</li>
          <li>Engage in money laundering, terrorist financing, or sanctions evasion.</li>
          <li>Misrepresent your business, billing descriptor, or the nature of goods or services sold.</li>
          <li>Interfere with, disrupt, or attempt unauthorized access to the Services or other users' data.</li>
          <li>Circumvent verification, monitoring, or risk controls.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Category-specific conditions">
        <p>
          Certain high-risk categories are permitted subject to additional conditions, such as
          appropriate licensing, age verification, or jurisdiction restrictions. These conditions are
          confirmed during onboarding and set out in your Merchant Agreement. [Placeholder: attach or
          reference category-specific addenda.]
        </p>
      </LegalSection>

      <LegalSection title="4. API and integration use">
        <p>
          API keys must not be shared outside your organization or embedded in publicly accessible
          code. You are responsible for all activity conducted using your credentials.
        </p>
      </LegalSection>

      <LegalSection title="5. Enforcement">
        <p>
          Violations of this Policy may result in a warning, transaction hold, account suspension, or
          termination, at our discretion and proportionate to the severity of the violation. Serious
          violations, including suspected fraud or illegal activity, may be reported to relevant
          authorities.
        </p>
      </LegalSection>

      <LegalSection title="6. Reporting a violation">
        <p>
          If you become aware of a violation of this Policy, report it to{" "}
          <a href="mailto:legal@shadopay.dev" className="text-accent hover:underline">legal@shadopay.dev</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
