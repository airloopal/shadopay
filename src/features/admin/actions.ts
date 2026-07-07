"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/session";
import { decideMerchant, decideKyb } from "@/features/admin/queries";

export async function approveMerchantAction(merchantId: string) {
  const session = await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE");
  await decideMerchant(merchantId, "APPROVED", session.user.id);
  revalidatePath("/admin/merchants");
  revalidatePath("/admin");
}

export async function rejectMerchantAction(merchantId: string) {
  const session = await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE");
  await decideMerchant(merchantId, "REJECTED", session.user.id);
  revalidatePath("/admin/merchants");
  revalidatePath("/admin");
}

export async function suspendMerchantAction(merchantId: string) {
  const session = await requireRole("PLATFORM_ADMIN");
  await decideMerchant(merchantId, "SUSPENDED", session.user.id);
  revalidatePath("/admin/merchants");
}

export async function approveKybAction(kybProfileId: string) {
  const session = await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE");
  await decideKyb(kybProfileId, "APPROVED", session.user.id);
  revalidatePath("/admin/kyb");
}

export async function rejectKybAction(kybProfileId: string, formData: FormData) {
  const session = await requireRole("PLATFORM_ADMIN", "PLATFORM_COMPLIANCE");
  const reason = String(formData.get("reason") ?? "").trim() || undefined;
  await decideKyb(kybProfileId, "REJECTED", session.user.id, reason);
  revalidatePath("/admin/kyb");
}
