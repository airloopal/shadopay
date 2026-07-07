import { LegalDocument, LegalSection } from "@/features/legal/legal-document";

export const metadata = { title: "Cookie Policy — ShadoPay" };

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      lastUpdated="July 7, 2026"
      summary="This Cookie Policy explains how ShadoPay uses cookies and similar technologies on our website and dashboard."
    >
      <LegalSection title="1. What cookies are">
        <p>
          Cookies are small text files stored on your device that help websites function, remember
          preferences, and understand usage. We also use similar technologies such as local storage.
        </p>
      </LegalSection>

      <LegalSection title="2. Categories of cookies we use">
        <ul className="list-inside list-disc space-y-1.5">
          <li><span className="text-foreground">Strictly necessary:</span> required for authentication, session management, and core security functions. These cannot be disabled.</li>
          <li><span className="text-foreground">Functional:</span> remember preferences such as sidebar state or dashboard layout.</li>
          <li><span className="text-foreground">Analytics:</span> help us understand how the Services are used so we can improve them. [Placeholder: list specific analytics providers once selected.]</li>
        </ul>
        <p>We do not use cookies for third-party advertising.</p>
      </LegalSection>

      <LegalSection title="3. Managing cookies">
        <p>
          Most browsers allow you to control cookies through their settings. Disabling strictly
          necessary cookies may prevent core features, including sign-in, from functioning correctly.
        </p>
      </LegalSection>

      <LegalSection title="4. Changes to this Policy">
        <p>
          We may update this Policy as our use of cookies evolves. Material changes will be reflected
          by updating the date at the top of this page.
        </p>
      </LegalSection>

      <LegalSection title="5. Contact">
        <p>
          Questions about this Policy can be directed to{" "}
          <a href="mailto:legal@shadopay.dev" className="text-accent hover:underline">legal@shadopay.dev</a>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
