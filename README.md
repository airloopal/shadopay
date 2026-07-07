# PayFlow — Privacy-focused payment platform (MVP scaffold)

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
