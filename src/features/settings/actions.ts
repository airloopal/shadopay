"use server";

import { revalidatePath } from "next/cache";
import { requireActiveMerchant } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { SettlementSchedule } from "@prisma/client";

export async function updateBusinessProfileAction(formData: FormData) {
  const { merchant } = await requireActiveMerchant();

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      displayName: String(formData.get("displayName") ?? merchant.displayName),
      website: String(formData.get("website") ?? "") || null,
      category: String(formData.get("category") ?? merchant.category),
    },
  });

  revalidatePath("/settings");
}

export async function updateSettlementPreferencesAction(formData: FormData) {
  const { merchant } = await requireActiveMerchant();

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: {
      settlementSchedule: formData.get("settlementSchedule") as SettlementSchedule,
      settlementCurrency: String(formData.get("settlementCurrency") ?? merchant.settlementCurrency),
    },
  });

  revalidatePath("/settings");
}

export async function updateBrandingAction(formData: FormData) {
  const { merchant } = await requireActiveMerchant();

  await prisma.merchantBranding.upsert({
    where: { merchantId: merchant.id },
    create: {
      merchantId: merchant.id,
      primaryColor: String(formData.get("primaryColor") ?? "#4F46E5"),
      supportEmail: String(formData.get("supportEmail") ?? "") || null,
      supportUrl: String(formData.get("supportUrl") ?? "") || null,
    },
    update: {
      primaryColor: String(formData.get("primaryColor") ?? "#4F46E5"),
      supportEmail: String(formData.get("supportEmail") ?? "") || null,
      supportUrl: String(formData.get("supportUrl") ?? "") || null,
    },
  });

  revalidatePath("/settings");
}

export async function inviteTeamMemberAction(formData: FormData) {
  const { merchant } = await requireActiveMerchant();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = (formData.get("role") ?? "ANALYST") as "ADMIN" | "ANALYST" | "SUPPORT";

  if (!email) throw new Error("Email is required.");

  const user = await prisma.user.upsert({
    where: { email },
    create: { name: email.split("@")[0] ?? email, email, role: "MERCHANT_ANALYST" },
    update: {},
  });

  await prisma.merchantMember.upsert({
    where: { merchantId_userId: { merchantId: merchant.id, userId: user.id } },
    create: { merchantId: merchant.id, userId: user.id, role },
    update: { role },
  });

  revalidatePath("/settings");
}
