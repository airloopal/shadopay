"use server";

import { revalidatePath } from "next/cache";
import { requireActiveMerchant } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function markNotificationReadAction(id: string) {
  const { merchant } = await requireActiveMerchant();
  await prisma.notification.updateMany({
    where: { id, merchantId: merchant.id },
    data: { readAt: new Date() },
  });
  revalidatePath("/dashboard");
}

export async function markAllNotificationsReadAction() {
  const { merchant } = await requireActiveMerchant();
  await prisma.notification.updateMany({
    where: { merchantId: merchant.id, readAt: null },
    data: { readAt: new Date() },
  });
  revalidatePath("/dashboard");
}
