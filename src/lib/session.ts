import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireRole(...roles: UserRole[]) {
  const session = await requireSession();
  const user = session.user as typeof session.user & { role?: UserRole };
  const role = user.role ?? roles[0];

  if (!role || !roles.includes(role)) {
    redirect("/dashboard");
  }

  return session;
}

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

  if (!merchant) {
    redirect("/onboarding");
  }

  return { session, merchant };
}
