import { prisma } from "@/lib/prisma";

export async function getMerchantWithTeamAndBranding(merchantId: string) {
  return prisma.merchant.findUniqueOrThrow({
    where: { id: merchantId },
    include: {
      members: { include: { user: true } },
      branding: true,
    },
  });
}
