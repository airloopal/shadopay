import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { stepByNumber } from "@/features/onboarding/steps";
import type { Merchant, MerchantBranding, KybProfile } from "@prisma/client";

export async function requireDraftMerchant() {
  const session = await requireSession();

  const membership = await prisma.merchantMember.findFirst({
    where: { userId: session.user.id },
    include: { merchant: true },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    redirect("/onboarding/welcome");
  }

  return { session, merchant: membership.merchant };
}

export function redirectToCurrentStep(onboardingStep: number): never {
  const step = stepByNumber(onboardingStep);
  const slug = step?.slug ?? "welcome";

  redirect(`/onboarding/${slug}`);
}

export interface ProfileCompletionInput {
  merchant: Merchant;
  branding: MerchantBranding | null;
  kyb: KybProfile | null;
}

export interface ProfileCompletionItem {
  label: string;
  complete: boolean;
  href: string;
}

export function getProfileCompletion({
  merchant,
  branding,
  kyb,
}: ProfileCompletionInput) {
  const items: ProfileCompletionItem[] = [
    {
      label: "Business information",
      complete: Boolean(
        merchant.legalName && merchant.contactEmail && merchant.country
      ),
      href: "/onboarding/business",
    },
    {
      label: "Business category",
      complete: Boolean(merchant.category),
      href: "/onboarding/category",
    },
    {
      label: "Verification documents",
      complete: Boolean(kyb),
      href: "/onboarding/verification",
    },
    {
      label: "Payout preferences",
      complete: Boolean(merchant.payoutMethod),
      href: "/onboarding/payout",
    },
    {
      label: "Branding",
      complete: Boolean(branding?.receiptName),
      href: "/onboarding/branding",
    },
  ];

  const completedCount = items.filter((item) => item.complete).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  return {
    items,
    percentage,
    completedCount,
    total: items.length,
  };
}
