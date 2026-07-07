"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createMerchantAction(formData: FormData) {
  const session = await requireSession();

  const legalName = String(formData.get("legalName") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim() || legalName;
  const category = String(formData.get("category") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim() || null;

  if (!legalName || !category) {
    throw new Error("Legal business name and category are required.");
  }

  const baseSlug = slugify(displayName || legalName);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.merchant.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const merchant = await prisma.merchant.create({
    data: {
      legalName,
      displayName,
      slug,
      category,
      website,
      status: "PENDING",
      members: {
        create: { userId: session.user.id, role: "OWNER" },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      merchantId: merchant.id,
      action: "merchant.created",
      targetType: "Merchant",
      targetId: merchant.id,
    },
  });

  redirect("/dashboard");
}
