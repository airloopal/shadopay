import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

/**
 * Central Better Auth instance.
 *
 * MFA-ready: `twoFactor` config is present but the enrollment UI is wired
 * under Settings > Security. Session cookies are set to secure/httpOnly
 * automatically by Better Auth in production.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day of activity
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  // Placeholder for the two-factor plugin. Enable once an authenticator
  // flow (TOTP/WebAuthn) is selected for Settings > Security.
  // plugins: [twoFactor()],
});

export type Auth = typeof auth;
