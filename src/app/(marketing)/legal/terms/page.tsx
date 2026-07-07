import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Terms of Service — ShadoPay" };

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      lastUpdated="July 7, 2026"
      summary="These Terms of Service ('Terms') govern access to and use of the ShadoPay website, dashboard, and API (together, the 'Services'), operated by ShadoPay, Inc. ('ShadoPay', 'we', 'us'). By creating an account or otherwise using the Services, you agree to these Terms."
    >
      <LegalSection title="1. Acceptance of these Terms">
        <p>
          These Terms form a binding agreement between you and ShadoPay. If you are entering into
          these Terms on behalf of a company or other legal entity, you represent that you have the
          authority to bind that entity, in which case "you" refers to that entity.
        </p>
        <p>
          If you do not agree to these Terms, you may not access or use the Services. Additional
          terms specific to processing payments are set out in our{" "}
          <a href="/legal/merchant-agreement" className="text-accent hover:underline">Merchant Agreement</a>,
          which is incorporated into these Terms by reference for merchants using processing features.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility and account registration">
        <p>
          You must be at least 18 years old and capable of forming a binding contract to use the
          Services. You agree to provide accurate, current, and complete information during
          registration and to keep that information up to date.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for
          all activity that occurs under your account. Notify us immediately of any unauthorized use.
        </p>
      </LegalSection>

      <LegalSection title="3. Business verification">
        <p>
          Certain features, including live payment processing, require completion of our business
          verification (KYB) process described in our{" "}
          <a href="/legal/verification-policy" className="text-accent hover:underline">Verification Policy</a>.
          We may suspend or decline access to these features pending or following review.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p>
          You agree to use the Services only for lawful purposes and in accordance with our{" "}
          <a href="/legal/acceptable-use" className="text-accent hover:underline">Acceptable Use Policy</a>{" "}
          and{" "}
          <a href="/legal/content-standards" className="text-accent hover:underline">Content Standards</a>.
          We reserve the right to suspend or terminate access for any violation of these policies.
        </p>
      </LegalSection>

      <LegalSection title="5. Fees">
        <p>
          Fees applicable to your use of the Services are set out in your order form, the Pricing
          page, or your Merchant Agreement, as applicable. Fees are exclusive of applicable taxes
          unless stated otherwise. [Placeholder: insert specific fee adjustment and notice provisions.]
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual property">
        <p>
          ShadoPay retains all right, title, and interest in and to the Services, including all
          related intellectual property. Subject to your compliance with these Terms, we grant you a
          limited, non-exclusive, non-transferable license to access and use the Services.
        </p>
      </LegalSection>

      <LegalSection title="7. Confidentiality">
        <p>
          Each party agrees to protect the other party's confidential information with the same
          degree of care it uses for its own similar information, and in no case less than reasonable
          care, and to use such information only as necessary to perform under these Terms.
        </p>
      </LegalSection>

      <LegalSection title="8. Disclaimers">
        <p>
          The Services are provided "as is" and "as available" without warranties of any kind, express
          or implied, including implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement, except as expressly stated in these Terms.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          To the maximum extent permitted by law, ShadoPay will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
          arising out of or related to your use of the Services. [Placeholder: insert a liability cap
          appropriate to your risk profile and jurisdiction.]
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          Either party may terminate these Terms as set out in your order form or Merchant Agreement.
          We may suspend or terminate your access immediately if we reasonably believe you have
          violated these Terms, applicable law, or pose a risk to the Services or other users.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing law and disputes">
        <p>
          These Terms are governed by the laws of [Placeholder: insert governing jurisdiction],
          without regard to its conflict of laws principles. [Placeholder: insert dispute resolution
          mechanism, e.g. arbitration clause or venue selection.]
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to these Terms">
        <p>
          We may update these Terms from time to time. Material changes will be notified through the
          Services or by email at least [Placeholder: insert notice period] before taking effect.
          Continued use of the Services after changes take effect constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Questions about these Terms can be directed to{" "}
          <a href="mailto:legal@shadopay.dev" className="text-accent hover:underline">legal@shadopay.dev</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
