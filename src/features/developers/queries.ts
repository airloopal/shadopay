import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function listApiKeys(merchantId: string) {
  return prisma.apiKey.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listWebhooks(merchantId: string) {
  return prisma.webhookEndpoint.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listRequestLogs(merchantId: string, take = 25) {
  return prisma.apiRequestLog.findMany({
    where: { apiKey: { merchantId } },
    include: { apiKey: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}

/** Generates a new API key. Returns the plaintext key exactly once — only the hash is persisted. */
export async function generateApiKey(merchantId: string, name: string, mode: "LIVE" | "SANDBOX") {
  const secret = crypto.randomBytes(24).toString("hex");
  const prefix = mode === "LIVE" ? "pk_live_" : "pk_test_";
  const plaintext = `${prefix}${secret}`;
  const hashedKey = crypto.createHash("sha256").update(plaintext).digest("hex");

  const record = await prisma.apiKey.create({
    data: {
      merchantId,
      name,
      mode,
      keyPrefix: plaintext.slice(0, 12),
      hashedKey,
    },
  });

  return { record, plaintext };
}

export async function revokeApiKey(id: string, merchantId: string) {
  return prisma.apiKey.update({
    where: { id, merchantId },
    data: { revokedAt: new Date() },
  });
}

export async function createWebhookEndpoint(merchantId: string, url: string, events: string[]) {
  const secret = `whsec_${crypto.randomBytes(20).toString("hex")}`;
  return prisma.webhookEndpoint.create({
    data: { merchantId, url, events, secret },
  });
}
