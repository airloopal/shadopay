import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Content Standards — ShadoPay" };

export default function ContentStandardsPage() {
  return (
    <LegalDocument
      title="Content Standards"
      lastUpdated="July 7, 2026"
      summary="These Content Standards apply to goods, services, and content sold, promoted, or delivered through ShadoPay-powered checkouts and payment links."
    >
      <LegalSection title="1. General standard">
        <p>
          Content and goods sold through the Services must be legal in the jurisdictions where they
          are offered and must not violate the rights of any third party.
        </p>
      </LegalSection>

      <LegalSection title="2. Regulated categories">
        <p>
          Categories such as nutraceuticals, iGaming, adult content, and CBD/wellness products are
          permitted subject to category-specific conditions confirmed during onboarding, including
          applicable licensing, age-verification, and jurisdiction restrictions.
        </p>
      </LegalSection>

      <LegalSection title="3. Prohibited content">
        <p>The following are never permitted, regardless of category:</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>Content depicting or facilitating exploitation or abuse of minors.</li>
          <li>Content promoting or facilitating non-consensual acts.</li>
          <li>Counterfeit goods or goods infringing third-party intellectual property.</li>
          <li>Goods or services prohibited under applicable law in the jurisdiction of sale.</li>
          <li>Content or services facilitating fraud, hacking, or unauthorized access to systems.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Age-restricted content">
        <p>
          Merchants offering age-restricted goods or content must implement reasonable age
          verification measures appropriate to the category and jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="5. Review and enforcement">
        <p>
          We may review content associated with a merchant's account as part of onboarding or ongoing
          monitoring. Content violating these Standards may result in transaction holds, required
          remediation, or account suspension, consistent with our Acceptable Use Policy.
        </p>
      </LegalSection>

      <LegalSection title="6. Reporting content concerns">
        <p>
          Concerns about content sold through the Services can be reported to{" "}
          <a href="mailto:legal@shadopay.dev" className="text-accent hover:underline">legal@shadopay.dev</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
