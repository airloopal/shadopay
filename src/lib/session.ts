import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

/**
 * Reads the current session on the server (layouts, server components,
 * route handlers). Returns null if unauthenticated — callers decide
 * whether to redirect.
 */
export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

/** Redirects to sign-in if there is no active session. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

/** Requires the current user to hold one of the given platform roles. */
export async function requireRole(...roles: UserRole[]) {
  const session = await requireSession();
  const user = session.user as typeof session.user & { role?: UserRole };
  const role = user.role ?? "MERCHANT";

if (!roles.includes(role)) {
    redirect("/dashboard");
  }
  return session;
}

/**
 * Resolves the active merchant for the signed-in user. In this MVP a user
 * belongs to exactly one merchant via MerchantMember; multi-merchant
 * switching can be added later without changing this call site.
 */
export async function getActiveMerchant(userId: string) {
  const membership = await prisma.merchantMember.findFirst({
    where: { userId },
    include: { merchant: true },
    orderBy: { createdAt: "asc" },
  });
  return membership?.merchant ?? null;
}

export async function requireActiveMerchant() {
  const session = await requireSession();
  const merchant = await getActiveMerchant(session.user.id);
  if (!merchant) redirect("/onboarding");
  return { session, merchant };
}
