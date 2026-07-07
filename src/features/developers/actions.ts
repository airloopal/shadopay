"use server";

import { revalidatePath } from "next/cache";
import { requireActiveMerchant } from "@/lib/session";
import { generateApiKey, revokeApiKey, createWebhookEndpoint } from "@/features/developers/queries";
import { prisma } from "@/lib/prisma";

/**
 * Creates a new API key and stashes the plaintext value in a short-lived
 * server-side store so the UI can reveal it once. In this MVP we simply
 * write it to an audit log metadata field is NOT done (never store secrets
 * in the audit log) — instead we return via redirect query is avoided too.
 * The calling page reads the return value directly since this runs as a
 * form action bound to a client confirmation flow.
 */
export async function createApiKeyAction(formData: FormData) {
  const { merchant } = await requireActiveMerchant();
  const name = String(formData.get("name") ?? "").trim() || "Untitled key";
  const mode = (formData.get("mode") === "SANDBOX" ? "SANDBOX" : "LIVE") as "LIVE" | "SANDBOX";

  const { plaintext } = await generateApiKey(merchant.id, name, mode);

  await prisma.auditLog.create({
    data: {
      merchantId: merchant.id,
      action: "api_key.created",
      targetType: "ApiKey",
      targetId: name,
    },
  });

  revalidatePath("/developers");
  return { plaintext };
}

export async function revokeApiKeyAction(id: string) {
  const { merchant } = await requireActiveMerchant();
  await revokeApiKey(id, merchant.id);
  await prisma.auditLog.create({
    data: {
      merchantId: merchant.id,
      action: "api_key.revoked",
      targetType: "ApiKey",
      targetId: id,
    },
  });
  revalidatePath("/developers");
}

export async function createWebhookAction(formData: FormData) {
  const { merchant } = await requireActiveMerchant();
  const url = String(formData.get("url") ?? "").trim();
  const events = String(formData.get("events") ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (!url.startsWith("https://")) {
    throw new Error("Webhook URLs must use https://");
  }

  await createWebhookEndpoint(merchant.id, url, events.length ? events : ["payment.succeeded"]);
  revalidatePath("/developers");
}
