import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@payflow.dev" },
    create: {
      email: "admin@payflow.dev",
      name: "Platform Admin",
      role: "PLATFORM_ADMIN",
      emailVerified: true,
    },
    update: {},
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@acmehighrisk.com" },
    create: {
      email: "owner@acmehighrisk.com",
      name: "Jordan Lee",
      role: "MERCHANT_OWNER",
      emailVerified: true,
    },
    update: {},
  });

  const merchant = await prisma.merchant.upsert({
    where: { slug: "acme-high-risk" },
    create: {
      legalName: "Acme High Risk Ventures LLC",
      displayName: "Acme Ventures",
      slug: "acme-high-risk",
      category: "Nutraceuticals",
      status: "APPROVED",
      settlementCurrency: "USD",
      settlementSchedule: "WEEKLY",
      reservePercentage: 5,
      members: { create: { userId: owner.id, role: "OWNER" } },
    },
    update: {},
  });

  console.log({ admin: admin.email, owner: owner.email, merchant: merchant.slug });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
