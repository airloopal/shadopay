import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Complaint Procedure — ShadoPay" };

export default function ComplaintProcedurePage() {
  return (
    <LegalDocument
      title="Complaint Procedure"
      lastUpdated="July 7, 2026"
      summary="This procedure explains how merchants and customers can raise a complaint about ShadoPay and how we handle it."
    >
      <LegalSection title="1. What can be raised">
        <p>
          You may raise a complaint about any aspect of the Services, including account decisions,
          transaction handling, payout timing, or the conduct of our team.
        </p>
      </LegalSection>

      <LegalSection title="2. How to submit a complaint">
        <p>
          Submit a complaint via{" "}
          <a href="mailto:support@shadopay.dev" className="text-accent hover:underline">support@shadopay.dev</a>{" "}
          or through the Support page in your dashboard. Please include your account details, a
          description of the issue, and any relevant transaction or reference IDs.
        </p>
      </LegalSection>

      <LegalSection title="3. Acknowledgment and timeline">
        <p>
          We acknowledge complaints within [Placeholder: insert acknowledgment window, e.g. 2 business
          days] and aim to provide a substantive response within [Placeholder: insert resolution
          window, e.g. 10 business days]. Complex matters, such as those requiring compliance review,
          may take longer — we will keep you informed of progress.
        </p>
      </LegalSection>

      <LegalSection title="4. Escalation">
        <p>
          If you are not satisfied with the initial response, you may request escalation to a senior
          member of our team by replying to the original response and requesting escalation.
        </p>
      </LegalSection>

      <LegalSection title="5. External resolution">
        <p>
          If a complaint remains unresolved after escalation, you may be entitled to refer it to an
          applicable regulator or dispute resolution body. [Placeholder: insert relevant ombudsman or
          regulator contact details once ShadoPay's regulatory registrations are finalized.]
        </p>
      </LegalSection>

      <LegalSection title="6. Recordkeeping">
        <p>
          We maintain records of complaints and their resolution to help us identify and address
          recurring issues.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
