import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Security Policy — ShadoPay" };

export default function SecurityPolicyPage() {
  return (
    <LegalDocument
      title="Security Policy"
      lastUpdated="July 7, 2026"
      summary="This Security Policy describes the technical and organizational measures ShadoPay maintains to protect merchant and customer data. A plain-language overview is also available in our Trust Centre."
    >
      <LegalSection title="1. Access control">
        <p>
          Access to production systems and data is restricted on a least-privilege basis. Internal
          administrative actions — including merchant approvals, KYB decisions, and API key
          management — are gated by role and logged to an immutable audit trail.
        </p>
      </LegalSection>

      <LegalSection title="2. Encryption">
        <p>
          Data in transit is encrypted using TLS 1.2 or higher. Data at rest, including verification
          documents and merchant records, is encrypted using provider-managed encryption keys.
        </p>
      </LegalSection>

      <LegalSection title="3. Application security">
        <p>
          Changes to production systems go through code review prior to deployment. [Placeholder:
          insert details of security testing cadence, e.g. static analysis, dependency scanning, or
          third-party penetration testing once scheduled.]
        </p>
      </LegalSection>

      <LegalSection title="4. Data segregation">
        <p>
          Merchant data is logically segregated by account. Sandbox and live environments are fully
          isolated from one another.
        </p>
      </LegalSection>

      <LegalSection title="5. Incident response">
        <p>
          Suspected security incidents are triaged, contained, and investigated by our team. Affected
          merchants are notified without undue delay once impact is understood, consistent with our
          contractual and legal obligations, followed by a post-incident review.
        </p>
      </LegalSection>

      <LegalSection title="6. Vulnerability reporting">
        <p>
          We welcome responsible disclosure of suspected vulnerabilities. See our{" "}
          <a href="/trust#responsible-disclosure" className="text-accent hover:underline">Trust Centre</a>{" "}
          for how to report an issue.
        </p>
      </LegalSection>

      <LegalSection title="7. Subprocessors">
        <p>
          Third parties that may process data on our behalf are listed in our{" "}
          <a href="/legal/subprocessors" className="text-accent hover:underline">Subprocessor List</a>,
          each of which is bound by contractual security and confidentiality obligations.
        </p>
      </LegalSection>

      <LegalSection title="8. Compliance roadmap">
        <p>
          As an early-stage platform, we are actively building toward formal security certifications.
          Current status is published transparently in our{" "}
          <a href="/trust#compliance-roadmap" className="text-accent hover:underline">Trust Centre</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
