import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Privacy Policy — ShadoPay" };

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      lastUpdated="July 7, 2026"
      summary="This Privacy Policy explains how ShadoPay, Inc. collects, uses, discloses, and safeguards personal data when you use our website, dashboard, and API."
    >
      <LegalSection title="1. Scope">
        <p>
          This Policy applies to personal data we collect from merchants, merchant team members,
          prospective customers, and end customers of our merchants who interact with hosted checkout
          pages. It does not apply to information merchants collect and control independently outside
          the Services.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>We collect the following categories of information:</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>Account information: name, email, business details, and role.</li>
          <li>Verification information: registration documents, beneficial ownership details, and government-issued identification submitted during business verification.</li>
          <li>Transaction information: amounts, timestamps, statuses, and associated metadata processed through the Services.</li>
          <li>Usage information: log data, device information, and interactions with the dashboard and API.</li>
          <li>Communications: support requests, contact form submissions, and correspondence with our team.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <p>We use personal data to:</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>Provide, maintain, and improve the Services.</li>
          <li>Verify merchant identity and comply with legal and regulatory obligations, including anti-money laundering requirements.</li>
          <li>Detect, investigate, and prevent fraud, abuse, and security incidents.</li>
          <li>Communicate with you about your account, updates, and support requests.</li>
          <li>Analyze usage to improve product design and reliability.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Legal basis for processing">
        <p>
          Where applicable law requires a legal basis, we rely on: performance of a contract with you,
          compliance with a legal obligation (including AML/KYB requirements), our legitimate
          interests in operating and securing the Services, and, where required, your consent.
          [Placeholder: confirm specific legal bases per jurisdiction, e.g. under GDPR Art. 6.]
        </p>
      </LegalSection>

      <LegalSection title="5. Sharing of information">
        <p>
          We do not sell personal data. We share information with service providers who process data
          on our behalf (see our{" "}
          <a href="/legal/subprocessors" className="text-accent hover:underline">Subprocessor List</a>),
          with regulators or law enforcement where required by law, and with successors in the event
          of a merger, acquisition, or asset sale, subject to equivalent protections.
        </p>
      </LegalSection>

      <LegalSection title="6. International data transfers">
        <p>
          Where personal data is transferred across borders, we implement appropriate safeguards
          consistent with applicable law. [Placeholder: insert transfer mechanism, e.g. Standard
          Contractual Clauses, adequacy decisions.]
        </p>
      </LegalSection>

      <LegalSection title="7. Data retention">
        <p>
          We retain personal data for as long as necessary to provide the Services and to comply with
          legal, accounting, and regulatory requirements — including retention periods commonly
          required for financial and AML recordkeeping. [Placeholder: insert specific retention
          schedules once finalized with counsel.]
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>
          Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict
          processing of your personal data, and to receive a copy of it in a portable format. To
          exercise these rights, contact{" "}
          <a href="mailto:legal@shadopay.dev" className="text-accent hover:underline">legal@shadopay.dev</a>.
          Certain rights may be limited where retention is required for legal or regulatory reasons.
        </p>
      </LegalSection>

      <LegalSection title="9. Security">
        <p>
          We maintain technical and organizational measures designed to protect personal data,
          described in more detail in our{" "}
          <a href="/legal/security-policy" className="text-accent hover:underline">Security Policy</a>{" "}
          and public{" "}
          <a href="/trust" className="text-accent hover:underline">Trust Centre</a>.
        </p>
      </LegalSection>

      <LegalSection title="10. Children's privacy">
        <p>
          The Services are not directed to individuals under 18, and we do not knowingly collect
          personal data from children.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to this Policy">
        <p>
          We may update this Policy from time to time. Material changes will be communicated through
          the Services or by email before taking effect.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about this Policy can be directed to{" "}
          <a href="mailto:legal@shadopay.dev" className="text-accent hover:underline">legal@shadopay.dev</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
