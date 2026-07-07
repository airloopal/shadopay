import { prisma } from "@/lib/prisma";

export async function getComplianceOverview(merchantId: string) {
  const [kyb, openAlerts, recentAuditLogs] = await Promise.all([
    prisma.kybProfile.findUnique({
      where: { merchantId },
      include: { documents: true },
    }),
    prisma.complianceAlert.findMany({
      where: { merchantId, status: { in: ["OPEN", "IN_REVIEW"] } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.auditLog.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return { kyb, openAlerts, recentAuditLogs };
}
