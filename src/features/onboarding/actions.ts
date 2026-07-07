"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { requireSession } from "@/lib/session";
import { requireDraftMerchant } from "@/features/onboarding/queries";
import { prisma } from "@/lib/prisma";
import { sendMerchantWelcomeEmail, sendVerificationSubmittedEmail } from "@/lib/email";
import type { PayoutMethod, SettlementSchedule } from "@prisma/client";

export interface ActionState {
  errors?: Record<string, string>;
  success?: boolean;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlugFrom(base: string, excludeId: string) {
  const baseSlug = slugify(base) || `business-${nanoid(6)}`;
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.merchant.findFirst({ where: { slug, NOT: { id: excludeId } } })) {
    slug = `${baseSlug}-${suffix++}`;
  }
  return slug;
}

function fieldErrorsFrom(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Step 1 — Welcome. Creates a bare draft merchant the very first time a user starts onboarding. */
export async function startOnboardingAction() {
  const session = await requireSession();

  const existing = await prisma.merchantMember.findFirst({ where: { userId: session.user.id } });
  if (!existing) {
    const merchant = await prisma.merchant.create({
      data: {
        legalName: "Untitled business",
        displayName: "Untitled business",
        slug: `business-${nanoid(8)}`,
        category: "",
        status: "PENDING",
        onboardingStep: 2,
        members: { create: { userId: session.user.id, role: "OWNER" } },
      },
    });
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        merchantId: merchant.id,
        action: "onboarding.started",
        targetType: "Merchant",
        targetId: merchant.id,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    await sendMerchantWelcomeEmail(session.user.email, session.user.name, `${appUrl}/onboarding`);
  }

  redirect("/onboarding/business");
}

const businessInfoSchema = z.object({
  legalName: z.string().min(2, "Enter your business's legal name"),
  tradingName: z.string().min(2, "Enter a trading name"),
  website: z.string().url("Enter a full URL, e.g. https://example.com").optional().or(z.literal("")),
  country: z.string().min(2, "Select a country"),
  addressLine1: z.string().min(2, "Enter a street address"),
  addressLine2: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "Enter a city"),
  region: z.string().min(1, "Enter a state, province, or region"),
  postalCode: z.string().min(1, "Enter a postal code"),
  contactEmail: z.string().email("Enter a valid contact email"),
  supportEmail: z.string().email("Enter a valid support email"),
  phone: z.string().min(5, "Enter a phone number"),
  businessDescription: z.string().min(20, "Describe your business in at least 20 characters"),
});

/** Step 2 — Business information. */
export async function saveBusinessInfoAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { merchant } = await requireDraftMerchant();

  const parsed = businessInfoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: fieldErrorsFrom(parsed.error) };
  }

  const data = parsed.data;
  const slug =
    merchant.slug.startsWith("business-") && merchant.displayName === "Untitled business"
      ? await uniqueSlugFrom(data.tradingName, merchant.id)
      : merchant.slug;

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      legalName: data.legalName,
      tradingName: data.tradingName,
      displayName: data.tradingName,
      slug,
      website: data.website || null,
      country: data.country,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || null,
      city: data.city,
      region: data.region,
      postalCode: data.postalCode,
      contactEmail: data.contactEmail,
      supportEmail: data.supportEmail,
      phone: data.phone,
      businessDescription: data.businessDescription,
      onboardingStep: Math.max(merchant.onboardingStep, 3),
    },
  });

  redirect("/onboarding/category");
}

/** Step 3 — Business category. */
export async function saveCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { merchant } = await requireDraftMerchant();
  const category = String(formData.get("category") ?? "").trim();

  if (!category) {
    return { errors: { category: "Choose a category to continue" } };
  }

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: { category, onboardingStep: Math.max(merchant.onboardingStep, 4) },
  });

  redirect("/onboarding/verification");
}

/** Step 4 — Verification. Documents are recorded as metadata only (name/type) — no file storage or external providers are wired up yet. */
export async function saveVerificationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { merchant } = await requireDraftMerchant();

  const registrationNumber = String(formData.get("registrationNumber") ?? "").trim() || undefined;
  const idFile = formData.get("governmentId") as File | null;
  const addressFile = formData.get("proofOfAddress") as File | null;

  const hasIdFile = idFile && idFile.size > 0;
  const hasAddressFile = addressFile && addressFile.size > 0;

  if (registrationNumber || hasIdFile || hasAddressFile) {
    const kyb = await prisma.kybProfile.upsert({
      where: { merchantId: merchant.id },
      create: {
        merchantId: merchant.id,
        registeredName: merchant.legalName,
        registrationNumber,
        jurisdiction: merchant.country ?? "Unspecified",
        businessType: merchant.category || "Unspecified",
        beneficialOwners: [],
        status: hasIdFile && hasAddressFile ? "PENDING" : "ADDITIONAL_INFO_REQUIRED",
      },
      update: {
        registrationNumber,
        jurisdiction: merchant.country ?? "Unspecified",
        businessType: merchant.category || "Unspecified",
        ...(hasIdFile && hasAddressFile ? { status: "PENDING", submittedAt: new Date() } : {}),
      },
    });

    if (hasIdFile) {
      await prisma.kybDocument.create({
        data: {
          kybProfileId: kyb.id,
          type: "government_id",
          fileKey: `pending-upload/${merchant.id}/${nanoid(10)}-${idFile!.name}`,
          fileName: idFile!.name,
        },
      });
    }
    if (hasAddressFile) {
      await prisma.kybDocument.create({
        data: {
          kybProfileId: kyb.id,
          type: "proof_of_address",
          fileKey: `pending-upload/${merchant.id}/${nanoid(10)}-${addressFile!.name}`,
          fileName: addressFile!.name,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        merchantId: merchant.id,
        action: "kyb.submitted",
        targetType: "KybProfile",
        targetId: kyb.id,
      },
    });

    if (hasIdFile && hasAddressFile && merchant.contactEmail) {
      await sendVerificationSubmittedEmail(merchant.contactEmail, merchant.tradingName ?? merchant.displayName);
    }
  }

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: { onboardingStep: Math.max(merchant.onboardingStep, 5) },
  });

  redirect("/onboarding/payout");
}

const payoutSchema = z.object({
  settlementCurrency: z.enum(["USD", "EUR", "GBP"]),
  settlementSchedule: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  payoutMethod: z.enum(["BANK_TRANSFER", "WIRE_TRANSFER", "OTHER"]),
});

/** Step 5 — Payout preferences. Storage only — no payout integrations yet. */
export async function savePayoutAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { merchant } = await requireDraftMerchant();

  const parsed = payoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: fieldErrorsFrom(parsed.error) };
  }

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      settlementCurrency: parsed.data.settlementCurrency,
      settlementSchedule: parsed.data.settlementSchedule as SettlementSchedule,
      payoutMethod: parsed.data.payoutMethod as PayoutMethod,
      onboardingStep: Math.max(merchant.onboardingStep, 6),
    },
  });

  redirect("/onboarding/branding");
}

const brandingSchema = z.object({
  receiptName: z.string().min(2, "Enter a name to show on receipts"),
  primaryColor: z.string().min(4, "Choose a brand color"),
  supportEmail: z.string().email("Enter a valid support email"),
  supportUrl: z.string().url("Enter a full URL, e.g. https://example.com").optional().or(z.literal("")),
});

/** Step 6 — Branding. Logo is recorded as metadata only — no file storage wired up yet. */
export async function saveBrandingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { merchant } = await requireDraftMerchant();

  const parsed = brandingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: fieldErrorsFrom(parsed.error) };
  }

  const logoFile = formData.get("logo") as File | null;
  const data = parsed.data;

  await prisma.merchantBranding.upsert({
    where: { merchantId: merchant.id },
    create: {
      merchantId: merchant.id,
      receiptName: data.receiptName,
      primaryColor: data.primaryColor,
      supportEmail: data.supportEmail,
      supportUrl: data.supportUrl || null,
      ...(logoFile && logoFile.size > 0 ? { logoKey: `pending-upload/${merchant.id}/${nanoid(10)}-${logoFile.name}` } : {}),
    },
    update: {
      receiptName: data.receiptName,
      primaryColor: data.primaryColor,
      supportEmail: data.supportEmail,
      supportUrl: data.supportUrl || null,
      ...(logoFile && logoFile.size > 0 ? { logoKey: `pending-upload/${merchant.id}/${nanoid(10)}-${logoFile.name}` } : {}),
    },
  });

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: { onboardingStep: Math.max(merchant.onboardingStep, 7) },
  });

  redirect("/onboarding/complete");
}

/** Step 7 — Complete. Marks onboarding as finished; the merchant can still edit everything later from Settings. */
export async function completeOnboardingAction(formData: FormData) {
  const { merchant } = await requireDraftMerchant();

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: { onboardingStep: 7, onboardingCompletedAt: new Date() },
  });

  await prisma.notification.create({
    data: {
      merchantId: merchant.id,
      title: "Onboarding complete",
      body: "Your business profile is set up. Create your first payment link to get started.",
      type: "success",
    },
  });

  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");
  redirect(redirectTo);
}
