import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Data Processing Addendum — ShadoPay" };

export default function DataProcessingAddendumPage() {
  return (
    <LegalDocument
      title="Data Processing Addendum"
      lastUpdated="July 7, 2026"
      summary="This Data Processing Addendum ('DPA') forms part of the agreement between ShadoPay ('Processor') and the merchant ('Controller') and governs ShadoPay's processing of personal data on the merchant's behalf, such as customer data collected via hosted checkout."
    >
      <LegalSection title="1. Roles of the parties">
        <p>
          For personal data of the merchant's end customers processed through hosted checkout,
          payment links, and related features, the merchant acts as the data controller and ShadoPay
          acts as a data processor, processing such data only on the merchant's documented
          instructions as set out in this DPA and the Terms of Service.
        </p>
      </LegalSection>

      <LegalSection title="2. Scope and purpose of processing">
        <p>
          ShadoPay processes end-customer personal data (such as name, email, and payment details)
          solely to provide the Services — including processing transactions, detecting fraud, and
          complying with applicable law — and not for any independent purpose of its own.
        </p>
      </LegalSection>

      <LegalSection title="3. Confidentiality">
        <p>
          ShadoPay ensures that personnel authorized to process personal data are bound by
          confidentiality obligations.
        </p>
      </LegalSection>

      <LegalSection title="4. Security measures">
        <p>
          ShadoPay implements technical and organizational measures described in our{" "}
          <a href="/legal/security-policy" className="text-accent hover:underline">Security Policy</a>{" "}
          to protect personal data against unauthorized access, loss, or disclosure.
        </p>
      </LegalSection>

      <LegalSection title="5. Subprocessors">
        <p>
          ShadoPay may engage subprocessors listed in our{" "}
          <a href="/legal/subprocessors" className="text-accent hover:underline">Subprocessor List</a>{" "}
          to assist in providing the Services. ShadoPay remains responsible for subprocessors'
          compliance with data protection obligations equivalent to those in this DPA.
        </p>
      </LegalSection>

      <LegalSection title="6. Assistance with data subject requests">
        <p>
          ShadoPay will provide reasonable assistance to the merchant in responding to verified data
          subject requests relating to end-customer personal data processed through the Services.
        </p>
      </LegalSection>

      <LegalSection title="7. Data breach notification">
        <p>
          ShadoPay will notify the merchant without undue delay upon becoming aware of a confirmed
          personal data breach affecting the merchant's data, consistent with our incident response
          process described in the{" "}
          <a href="/trust#incident-response" className="text-accent hover:underline">Trust Centre</a>.
        </p>
      </LegalSection>

      <LegalSection title="8. International transfers">
        <p>
          [Placeholder: insert applicable international transfer mechanism, e.g. Standard Contractual
          Clauses, once finalized for relevant jurisdictions.]
        </p>
      </LegalSection>

      <LegalSection title="9. Return or deletion of data">
        <p>
          Upon termination of the underlying agreement, ShadoPay will delete or return end-customer
          personal data as instructed by the merchant, except where retention is required by
          applicable law.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
