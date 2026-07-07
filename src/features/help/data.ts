export interface HelpArticle {
  slug: string;
  title: string;
  summary: string;
  body: string[];
}

export interface HelpCategory {
  slug: string;
  title: string;
  description: string;
  articles: HelpArticle[];
}

export const helpCategories: HelpCategory[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description: "Create your account and take your first steps on ShadoPay.",
    articles: [
      {
        slug: "creating-your-account",
        title: "Creating your ShadoPay account",
        summary: "How to sign up and set up your business profile.",
        body: [
          "Sign up with your work email and choose a password of at least 12 characters. You'll receive a verification email — confirm it before continuing.",
          "After verifying your email, you'll be asked for basic business details: legal name, category, and website. This creates your merchant profile.",
          "Once your profile is created, you'll land on your dashboard. Live payments require business verification, covered in the Verification category.",
        ],
      },
      {
        slug: "dashboard-overview",
        title: "A tour of your dashboard",
        summary: "Understanding Overview, Payments, Payouts, and more.",
        body: [
          "Your Overview page summarizes revenue, payouts, and recent activity at a glance.",
          "Payments, Transactions, and Payment Links cover how you accept money. Payouts shows when funds move to your bank account.",
          "Trust Centre tracks your verification status and any compliance alerts. Settings covers your business profile, team, and branding.",
        ],
      },
    ],
  },
  {
    slug: "verification",
    title: "Verification",
    description: "Business verification (KYB) and what to expect during review.",
    articles: [
      {
        slug: "what-is-kyb",
        title: "What is business verification (KYB)?",
        summary: "Why we verify every business before enabling live payments.",
        body: [
          "Know-Your-Business (KYB) verification confirms your company is legally registered and accurately represented before you can accept live payments.",
          "We review your registered business name, jurisdiction, business type, and beneficial ownership information.",
          "Most reviews are completed within one to two business days. You can track status in real time from your Trust Centre.",
        ],
      },
      {
        slug: "documents-you-need",
        title: "Documents you'll need to submit",
        summary: "A checklist of common verification documents.",
        body: [
          "Typical documents include a certificate of incorporation, proof of registered address, and government-issued ID for beneficial owners.",
          "Depending on your category, additional licensing documentation may be requested — for example, a gaming license or a manufacturing certificate.",
          "All documents are stored encrypted and are only accessible to authorized compliance reviewers.",
        ],
      },
    ],
  },
  {
    slug: "payments",
    title: "Payments",
    description: "Accepting payments through checkout, links, and invoices.",
    articles: [
      {
        slug: "creating-a-payment-link",
        title: "Creating a payment link",
        summary: "Share a link and get paid without writing any code.",
        body: [
          "From Payment Links, choose 'New payment link' and give it a title. You can set a fixed amount or leave it blank for the customer to enter one.",
          "Once created, copy the link and share it anywhere — email, chat, or social media.",
          "You can pause or reactivate a link at any time from the Payment Links table.",
        ],
      },
      {
        slug: "understanding-transaction-statuses",
        title: "Understanding transaction statuses",
        summary: "What Pending, Captured, Settled, and other statuses mean.",
        body: [
          "Pending means a payment has been initiated but not yet confirmed. Authorized means funds are reserved but not yet captured.",
          "Captured means the charge succeeded. Settled means the funds have moved into a completed payout.",
          "Refunded and Disputed reflect post-payment events — see the Refunds category for more detail.",
        ],
      },
    ],
  },
  {
    slug: "payouts",
    title: "Payouts",
    description: "How and when your funds are paid out.",
    articles: [
      {
        slug: "payout-schedule",
        title: "How your payout schedule works",
        summary: "Daily, weekly, biweekly, monthly, or manual payouts.",
        body: [
          "Your payout schedule is set in Settings → Settlement and determines how often funds move to your bank account.",
          "A reserve percentage may be held back temporarily as part of your risk profile — this is shown clearly on your Payouts page.",
          "Available payout reflects funds ready to be paid; pending payout reflects funds still in a processing window.",
        ],
      },
      {
        slug: "why-a-payout-was-delayed",
        title: "Why a payout might be delayed",
        summary: "Common reasons a scheduled payout doesn't arrive on time.",
        body: [
          "Payouts can be delayed by banking holidays, additional review triggered by unusual activity, or incomplete verification.",
          "If a payout is held for review, you'll see a compliance alert in your Trust Centre with the reason.",
          "If you believe a payout is delayed in error, contact Support with the payout ID from your Payouts page.",
        ],
      },
    ],
  },
  {
    slug: "api",
    title: "API",
    description: "Reference material for integrating with the ShadoPay API.",
    articles: [
      {
        slug: "authentication",
        title: "Authenticating API requests",
        summary: "Using API keys in the Authorization header.",
        body: [
          "Every request must include your API key as a Bearer token: Authorization: Bearer pk_live_...",
          "Live keys (pk_live_) move real money; sandbox keys (pk_test_) never do. Use sandbox mode while building your integration.",
          "Keys can be revoked instantly from Developers → API keys if compromised.",
        ],
      },
      {
        slug: "webhooks-101",
        title: "Webhooks 101",
        summary: "Subscribing to events and verifying signatures.",
        body: [
          "Register a webhook endpoint under Developers → Webhooks with the events you want to receive.",
          "Every webhook payload is signed — verify the signature before trusting the payload's contents.",
          "Failed deliveries are retried with backoff; you can inspect delivery attempts from the Developers tab.",
        ],
      },
    ],
  },
  {
    slug: "developers",
    title: "Developers",
    description: "Integration guidance beyond the core API reference.",
    articles: [
      {
        slug: "sandbox-mode",
        title: "Using sandbox mode",
        summary: "Build and test without touching real money.",
        body: [
          "Sandbox mode uses pk_test_ keys and mirrors production behavior without moving real funds.",
          "Sandbox transactions never affect your live payout balance and are clearly labeled in the dashboard.",
          "We recommend fully testing checkout, webhooks, and refund flows in sandbox before switching to live keys.",
        ],
      },
      {
        slug: "rate-limits",
        title: "API rate limits",
        summary: "Understanding request limits and handling 429 responses.",
        body: [
          "API requests are rate-limited per API key to protect platform stability.",
          "If you receive a 429 response, back off and retry using exponential backoff.",
          "Contact support if your integration requires sustained higher throughput.",
        ],
      },
    ],
  },
  {
    slug: "account",
    title: "Account",
    description: "Managing your team, roles, and business profile.",
    articles: [
      {
        slug: "inviting-team-members",
        title: "Inviting team members",
        summary: "Adding Admins, Analysts, and Support roles.",
        body: [
          "From Settings → Team, invite a teammate by email and assign a role: Admin, Analyst, or Support.",
          "Admins can manage settings and team members; Analysts have read access to reporting; Support can assist with day-to-day tickets.",
          "You can change or revoke a teammate's access at any time.",
        ],
      },
      {
        slug: "updating-business-profile",
        title: "Updating your business profile",
        summary: "Changing your display name, website, and category.",
        body: [
          "Business profile fields are editable from Settings → Business profile.",
          "Changing your registered legal name or jurisdiction may trigger a re-verification review.",
          "Branding, including your primary color and support contact, is managed separately under Settings → Branding.",
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Security",
    description: "Keeping your ShadoPay account secure.",
    articles: [
      {
        slug: "securing-your-account",
        title: "Securing your account",
        summary: "Best practices while we roll out MFA.",
        body: [
          "Use a unique, strong password of at least 12 characters and avoid reusing passwords across services.",
          "Two-factor authentication is on our near-term roadmap — this article will be updated once it's available.",
          "Review your team's access regularly and revoke API keys that are no longer in use.",
        ],
      },
      {
        slug: "reporting-suspicious-activity",
        title: "Reporting suspicious activity",
        summary: "What to do if you notice something unusual on your account.",
        body: [
          "If you notice a transaction, login, or API key you don't recognize, contact Support immediately.",
          "For suspected security vulnerabilities in ShadoPay itself, see our responsible disclosure process in the Trust Centre.",
        ],
      },
    ],
  },
  {
    slug: "refunds",
    title: "Refunds",
    description: "Issuing refunds and understanding disputes.",
    articles: [
      {
        slug: "issuing-a-refund",
        title: "Issuing a refund",
        summary: "Full and partial refunds from the Payments tab.",
        body: [
          "From Payments → Refunds, locate the transaction and issue a full or partial refund.",
          "Refunded amounts are deducted from your next available payout.",
          "Refund status updates in real time — see the Refunds tab for current state.",
        ],
      },
      {
        slug: "handling-a-dispute",
        title: "Handling a dispute",
        summary: "What happens when a customer disputes a charge.",
        body: [
          "A disputed transaction is flagged with a Disputed status and reviewed by our compliance team.",
          "You may be asked to provide supporting evidence, such as proof of delivery or a service agreement.",
          "Dispute outcomes and any resulting adjustments are reflected in your transaction history.",
        ],
      },
    ],
  },
  {
    slug: "general",
    title: "General",
    description: "Everything else.",
    articles: [
      {
        slug: "contacting-support",
        title: "Contacting support",
        summary: "The fastest way to reach the right team.",
        body: [
          "Use the Support page in your dashboard for account-specific issues — include relevant transaction or payout IDs to speed things up.",
          "For sales, partnerships, legal, or media inquiries, use the categorized contact options on our public Contact page.",
        ],
      },
      {
        slug: "closing-your-account",
        title: "Closing your account",
        summary: "What happens if you offboard from ShadoPay.",
        body: [
          "Contact Support to begin offboarding. Any pending payouts are settled before the account is closed.",
          "Historical transaction and compliance records are retained as required by law even after closure.",
        ],
      },
    ],
  },
];

export function findArticleBySlug(slug: string) {
  for (const category of helpCategories) {
    const article = category.articles.find((a) => a.slug === slug);
    if (article) return { article, category };
  }
  return null;
}

export function allArticles() {
  return helpCategories.flatMap((c) => c.articles.map((a) => ({ ...a, categorySlug: c.slug, categoryTitle: c.title })));
}
