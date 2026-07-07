# ShadoPay — Privacy-focused payment platform (MVP scaffold)

A payment platform built for lawful high-risk merchants: hosted checkout, payment links,
settlements, KYB, transaction monitoring, and an internal admin console.

This repository is an **architecture-first scaffold**. Payment processing itself
(card network integration, acquiring, ledger postings) is intentionally not implemented —
everything else (auth, data model, navigation, dashboards, compliance workflows, developer
tooling) is wired end-to-end against a real Postgres schema so payment processing can be
dropped in without restructuring the app.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui-style primitives, Lucide icons |
| Data | PostgreSQL (Neon) via Prisma ORM |
| Auth | Better Auth (email/password now, MFA-ready architecture) |
| Storage | Cloudflare R2 (KYB documents, branding assets) |
| Email | Resend |
| Charts | Recharts |
| Hosting | Vercel |

## Project structure

```
src/
  app/
    (auth)/sign-in, sign-up          — public auth pages
    (dashboard)/...                  — merchant-facing app shell + pages
    (admin)/admin/...                — internal platform console
    onboarding/                      — merchant creation flow after sign-up
    api/                             — route handlers (auth, exports, webhooks)
  components/
    ui/                              — shadcn-style primitives (button, card, table, dialog…)
    layout/                          — sidebar, topbar
    dashboard/                       — stat cards, revenue chart, transaction table
    shared/                          — cross-feature UI (status badge)
  features/
    auth/                            — sign-in/up forms
    dashboard/                       — merchant KPI queries
    transactions/                    — listing, filtering, CSV export
    payments/                        — invoices, refunds
    payment-links/                   — CRUD + server actions
    customers/                       — customer directory
    settlements/                     — payout schedule + history
    developers/                      — API keys, webhooks, request logs
    compliance/                      — KYB status, alerts, audit history
    settings/                        — business profile, team, branding
    admin/                           — platform approvals, KYB queue, audit log
  lib/                               — prisma client, auth config, R2, email, utils
  config/nav.ts                     — single source of truth for sidebar nav
  types/                            — shared DTOs
prisma/
  schema.prisma                     — full data model (see below)
  seed.ts                           — local dev seed data
```

## Data model highlights

- **Merchant** carries `status` (PENDING → IN_REVIEW → APPROVED/REJECTED/SUSPENDED),
  `riskTier`, settlement schedule/currency, and reserve percentage.
- **KybProfile** + **KybDocument** model beneficial ownership, uploaded documents (stored
  in R2, referenced by key), and a review workflow with reviewer/rejection metadata.
- **Transaction** includes `riskScore`, `flagged`, and `flagReason` fields so a monitoring
  job (rules engine, or a vendor like Sift/Sardine) can annotate rows without a schema change.
- **ComplianceAlert** is a first-class model separate from transactions, so alerts can also
  be merchant-level (e.g. chargeback rate) rather than tied to one transaction.
- **Settlement** + **SettlementItem** model payout batching separately from individual
  transactions, so reconciliation and reserve logic can evolve independently.
- **AuditLog** is written from every sensitive server action (merchant approval, API key
  creation/revocation, KYB decisions) — never edited, only appended to.

## What's intentionally not built yet

- Actual card/ACH processing, acquiring bank integration, or ledger double-entry postings.
- Real-time transaction monitoring rules (the schema supports scores/flags; the rules
  engine is a separate service to design once a processor partner is chosen).
- MFA enrollment UI (Better Auth's two-factor plugin is referenced but commented out in
  `src/lib/auth.ts` pending a choice between TOTP and WebAuthn).
- Multi-merchant switching for users who belong to more than one merchant (the session
  helper resolves the first membership; the schema already supports many-to-many).

## Getting started

```bash
pnpm install
cp .env.example .env        # fill in DATABASE_URL, BETTER_AUTH_SECRET, etc.
pnpm db:migrate              # creates tables from prisma/schema.prisma
pnpm db:seed                  # optional: seed an admin + sample merchant
pnpm dev
```

## Conventions

- Every dashboard page is a Server Component that calls a `features/<area>/queries.ts`
  function — no client-side data fetching for initial page loads.
- Mutations are Server Actions in `features/<area>/actions.ts`, called directly from
  `<form action={...}>` where possible; anything needing a return value (e.g. revealing a
  freshly generated API key) uses a small client wrapper with `useTransition`.
- Money is stored as Prisma `Decimal` and serialized to `string` at the query boundary
  before reaching client components, to avoid floating point drift.
- Status enums are rendered through `<StatusBadge status={...} />`, which centralizes the
  color mapping so every feature area reads statuses the same way.

## Phase 1.1 — Premium redesign

The architecture, routing, auth, and database schema from the original scaffold are
unchanged. This pass restyled the product and renamed sections for a more premium feel:

- **Brand system**: new dark palette (`#0A0A0A` background, `#D4AF37` gold accent), 18px
  radius, light-weight display type — all applied through the same semantic Tailwind
  tokens (`bg-surface`, `text-muted-foreground`, etc.), so no component had to be rewritten
  to pick up the new look.
- **Navigation renamed** (labels only — hrefs untouched): Dashboard → Overview, Merchants →
  Businesses, Customers → Clients, Settlements → Payouts, Compliance → Trust Centre.
- **Motion**: added `framer-motion` for page transitions, a collapsible/animated sidebar,
  an animated notification centre, and animated dashboard counters
  (`components/ui/animated-counter.tsx`).
- **New surfaces**: a public marketing landing page (`features/marketing/`), a hosted
  checkout flow with form/processing/success/receipt screens
  (`features/checkout/`, `app/pay/[slug]`), and a notification centre
  (`features/notifications/`).
- **Redesigned pages**: Overview (revenue/payout KPIs, live transaction feed, quick
  actions, verification status), Payment Links (search, status filter, pagination, copy
  link), and Trust Centre (verification documents, monitoring status, risk alerts).

## Phase 1.2 — Company foundation (public site, legal, trust, help, status)

Still no changes to auth, database schema, or the merchant/admin app routing. This pass
turned the single-page landing site into a full corporate site living under a new
`(marketing)` route group, sharing one nav/footer layout:

- **Public pages**: Home, About, Solutions, Pricing, Developers, Security, Trust Centre
  (`/trust`), Documentation, Contact, Careers, Partners, Status, Help Centre, News, Blog
  (News/Blog added as "coming soon" placeholders since the footer links to them).
- **Footer** (`features/marketing/marketing-footer.tsx`): Stripe-style grouped sitemap —
  Company, Legal, Developers, Support — plus a live "all systems operational" indicator.
- **Legal Centre** (`/legal`): 14 original policy documents (Terms, Privacy, Cookies,
  Acceptable Use, Merchant Agreement, Refund Policy, Security Policy, AML Policy,
  Verification Policy, Complaint Procedure, DPA, Subprocessor List, Platform Rules,
  Content Standards), all built on a shared `LegalDocument`/`LegalSection` layout for
  consistent formatting. Every page ends with a notice that it's an MVP template pending
  legal counsel review, and jurisdiction-specific gaps are marked with `[Placeholder: ...]`.
- **Trust Centre** (`/trust`): expanded into an 11-section portal (security overview,
  encryption, infrastructure, availability, compliance roadmap, incident response,
  responsible disclosure, system status, business verification, monitoring, merchant
  protection) with a sticky in-page nav.
- **Status page** (`/status`, `features/status/`): per-service operational state, 90-day
  uptime history bars, and an incident log — backed by static dummy data in
  `features/status/data.ts`, ready to swap for a real monitoring feed later.
- **Help Centre** (`/help`, `features/help/`): 10 categories with placeholder articles,
  client-side search, and individual article pages at `/help/[slug]`.
- **Contact** (`/contact`): categorized channels (Sales, Support, Partnerships, Legal,
  Media, Responsible Disclosure) plus a simple message form (UI only, not wired to email
  yet).

All of the above reuse the same design tokens, `Card`/`Button` primitives, and
`MarketingPageHeader` component introduced in Phase 1.1 — no new colors or type scales
were introduced.

## Phase 3 — Merchant onboarding & core payment platform

No changes to the public website, Legal Centre, Trust Centre, or the overall project
architecture. This phase built the first functional merchant journey on top of the existing
scaffold and design system:

- **Onboarding wizard** (`/onboarding`, `features/onboarding/`): 7 steps — Welcome, Business
  Information, Business Category, Verification, Payout Preferences, Branding, Complete — each
  its own route so progress is bookmarkable and resumable. `Merchant.onboardingStep` tracks
  progress server-side; every "Continue" click persists that step immediately (autosave via
  Server Actions, not just at the end), and returning users are redirected back to exactly
  where they left off. Validation uses `zod` + `useActionState` for inline field errors.
- **Business Category**: a searchable, card-based selector (`category-selector-form.tsx`)
  blending the brief's example categories with ShadoPay's existing high-risk verticals from
  the Solutions page, stored as a plain string on `Merchant.category` for future compliance
  workflows to key off of.
- **Verification step**: business registration number, government ID and proof-of-address
  "uploads" (recorded as `KybDocument` metadata only — filename and a placeholder key; no
  file storage or external verification provider is wired up yet, per the brief), and a
  website-review notice. Submitting creates/updates a `KybProfile` with status Not Started /
  Submitted / Under Review / Approved / Rejected.
- **Payout Preferences**: settlement currency, frequency (Daily/Weekly/Monthly), and a new
  `Merchant.payoutMethod` enum (Bank Transfer / Wire Transfer / Other) — storage only, no
  payout integration.
- **Branding**: logo (metadata-only "upload"), brand color, a new `MerchantBranding.receiptName`
  field, support email/URL — all now read live by the hosted checkout page.
- **Payment Links** (`/payment-links`): real create/list/pause flow extended with reference,
  success URL, cancel URL, and expiry date, validated with `zod` + `useActionState` via
  `create-link-form.tsx`.
- **Hosted checkout** (`/pay/[slug]`): now shows the merchant's reference, receipt name, and
  brand color pulled from `MerchantBranding`; expired/inactive links show a friendly message
  instead of a raw 404; added a full Cancel flow alongside the existing Success/Receipt
  screens, with "Return to merchant" links driven by the payment link's success/cancel URLs.
  Still no real payment processing — the Pay button only drives this front-end experience.
- **Dashboard**: added a "Profile completion" checklist card (links back into whichever
  onboarding step is incomplete) and a "Recent payment links" widget, alongside the existing
  verification-status and quick-actions cards.
- **Database**: additive-only changes — new columns on `Merchant` (business profile fields,
  `onboardingStep`, `onboardingCompletedAt`, `payoutMethod`), `receiptName` on
  `MerchantBranding`, and `reference`/`successUrl`/`cancelUrl` on `PaymentLink`. A new
  `PayoutMethod` enum was added. See `prisma/migrations/20260707120000_phase3_merchant_onboarding/`
  for the corresponding SQL — hand-authored in this environment since there's no live database
  to run `prisma migrate dev` against; run that command locally to verify/regenerate it (or
  `prisma migrate resolve --applied` first if earlier phases synced their schema via `db push`
  rather than migrations).

## Phase 4 — Core payments engine

No changes to the public website, Legal Centre, Trust Centre, design system, or existing
onboarding/payment-link functionality. This phase built the internal orchestration layer
every future real payment rail will plug into — still sandbox-only, no card collection, no
real processing, no crypto.

- **New models** (`prisma/schema.prisma`, additive only): `Payment` (the lifecycle object —
  DRAFT → PENDING → PROCESSING → SUCCEEDED/FAILED/EXPIRED/CANCELLED, with SUCCEEDED →
  REFUNDED), `CheckoutSession`, `PaymentEvent` (timeline log), `LedgerEntry`,
  `MerchantWallet` (available/pending/processing/reserve balances + lifetime volume/fees),
  and `Receipt`. `Transaction` (existing model) gained `paymentId`, `fee`, and `netAmount`
  so it stays the reporting/detail record while `Payment` is the orchestration object.
- **The engine** (`features/payments-engine/engine.ts`) is the single code path allowed to
  change a Payment's status. Every transition in one call: updates `Payment.status`, writes
  a `PaymentEvent`, writes an `AuditLog` entry, updates the `MerchantWallet` balances,
  writes `LedgerEntry` rows, and keeps the attached `Transaction` in sync — exactly the
  Phase 4 brief's "every status change must..." checklist, enforced structurally rather
  than by convention.
- **Fees** (`features/payments-engine/fees.ts`): 2.9% + $0.30, matching the illustrative
  rate already shown on the public Pricing page, so the numbers agree across the product.
- **Hosted checkout** (`app/pay/[slug]`, `features/checkout/checkout-flow.tsx`): now creates
  a real `CheckoutSession` + `Payment` (+ `Transaction`) on load, and the Pay/Cancel buttons
  drive the engine through `submitPaymentAction`/`cancelPaymentAction`
  (`features/payments-engine/actions.ts`) instead of faking client-side state. Every screen,
  animation, and timing from Phase 3 is unchanged — only the data behind it is now real.
- **Hosted receipts** (`app/receipts/[receiptNumber]`): a real, shareable receipt page backed
  by the `Receipt` table, separate from the in-checkout receipt step.
- **Transaction detail** (merchant: `app/(dashboard)/transactions/[id]`) and **payment
  detail** (admin: `app/(admin)/admin/payments/[id]`) share `PaymentTimeline` and
  `LedgerEntriesTable` (`components/payments/`) to show the full event timeline and ledger
  for a payment. The admin payment detail page also has a clearly-labeled "sandbox only"
  manual status override so every lifecycle state — including failed/expired/refunded, which
  the customer-facing checkout never triggers on its own — can be exercised on demand.
- **Search & filters**: merchant Transactions and admin Payments both filter by status,
  currency, amount range, reference, and client email; admin also has an all-up Ledger view.
- **Dashboard**: "Available payout" and "Pending payout" now read from `MerchantWallet`
  (`availableBalance`, and `pendingBalance + processingBalance + reserveBalance`
  respectively) instead of the `Settlement` model — the wallet is now the authoritative
  record of where a merchant's money sits.
- **Seed data** (`prisma/seed.ts`): rewritten to generate a realistic spread of payments
  (six succeeded, one refunded, one failed, one cancelled, one left mid-processing) with
  matching transactions, ledger entries, receipts, and a populated wallet, so the dashboard
  and admin views aren't empty on first run.

### Bugs found and fixed during review
- A `checkoutSession.updateMany({ where: { id: payment.checkoutSessionId ?? undefined } })`
  would, for any payment without a checkout session, have matched and updated **every**
  checkout session on the platform (Prisma treats an `undefined` filter value as "no
  filter"). Replaced with a guarded `update` scoped to a real id.
- `serializeDecimal` returned `T` — the same type it was given — even though it converts
  Decimal fields to strings at runtime, so callers silently kept a `Decimal`-typed field
  that was actually a `string`. Fixed to return an accurately-typed
  `Omit<T, K> & Record<K, string | null>`, which surfaced one incorrect
  `as typeof receipt` cast (now removed) and two call sites missing a cast (now fixed by
  widening `formatCurrency` to accept `string | null | undefined`).
- The seed script's "left mid-processing" demo payment updated the wallet and ledger for a
  PROCESSING hold but never updated `Payment.status`/`Transaction.status` away from their
  initial DRAFT/PENDING values — it would have displayed as "Draft" while money was
  reserved. Fixed to set `PROCESSING`/`AUTHORIZED` explicitly.

### What to run locally
There's no live database in this sandbox, so none of the above could be verified against a
real Postgres instance or a real `tsc` run (network access for `npm install` is also
disabled here). Before relying on this:
```bash
pnpm install
pnpm typecheck                 # tsc --noEmit — please run this first
pnpm db:migrate                # applies prisma/migrations/20260707140000_phase4_payments_engine
pnpm db:seed
pnpm dev
```
If your database was previously synced with `prisma db push` rather than migrations, you'll
need to baseline it first (`prisma migrate resolve --applied <migration-name>` for each
existing migration folder) before `db:migrate` will apply cleanly.

### Manual test flow
Sign in as the seeded merchant → Payment Links → create a link → open `/pay/<slug>` → click
Pay → observe the success/receipt screens → check Transactions (fee/net columns, click
through to detail for the timeline + ledger) → check Overview (wallet-backed payout figures,
"Recent payment links") → sign in as `admin@shadopay.dev` → Admin → Payments → open the same
payment → use the sandbox status override to move it to REFUNDED → confirm the ledger,
wallet, and receipt status all update.
