import { prisma } from "@/lib/prisma";

export async function listNotifications(merchantId: string, limit = 8) {
  return prisma.notification.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
