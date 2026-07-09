"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Link2, Wallet, Code2, Eye, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={`container py-24 ${className ?? ""}`}>{children}</section>;
}

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <Section className="flex flex-col items-center pb-16 pt-20 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Built for regulated, high-risk businesses
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="mt-8 max-w-3xl text-5xl font-light leading-[1.1] tracking-tighter text-foreground sm:text-6xl"
        >
          Payments built for
          <br />
          modern businesses.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          Privacy-first payment infrastructure for companies traditional processors won&apos;t touch.
          Compliant by design. Fast to integrate. Built to scale.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.15 }}
          className="mt-10 flex items-center gap-3"
        >
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out h-12 px-8 bg-accent text-accent-foreground shadow-soft hover:shadow-glow-accent hover:-translate-y-px active:translate-y-0"
          >
            Start now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/developers"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out h-12 px-8 border border-border bg-transparent hover:bg-surface-raised text-foreground hover:-translate-y-px active:translate-y-0"
          >
            View the API
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full max-w-4xl rounded-xl border border-border bg-card/60 p-2 shadow-glass"
        >
          <div className="rounded-lg border border-border bg-surface p-8">
            <div className="flex items-center justify-between text-left">
              <div>
                <p className="text-xs text-muted-foreground">Available payout</p>
                <p className="mt-1 text-3xl font-light text-foreground">$48,213.00</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-muted text-accent">
                <Wallet className="h-5 w-5" strokeWidth={1.75} />
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Feature grid */}
      <Section className="border-t border-border">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
          <p className="text-sm text-accent">Platform</p>
          <h2 className="mt-3 max-w-xl text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Everything a modern business needs to get paid.
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Link2, title: "Payment links", body: "Share a link, get paid. No code required." },
            { icon: Wallet, title: "Fast payouts", body: "Predictable settlement schedules, held reserves you can see." },
            { icon: Code2, title: "Developer-first API", body: "Clean REST endpoints, webhooks, and sandbox mode.", href: "/developers" },
            { icon: ShieldCheck, title: "Built-in compliance", body: "KYB, transaction monitoring, and audit trails from day one.", href: "/trust" },
            { icon: Eye, title: "Full visibility", body: "Real-time dashboards for revenue, payouts, and risk." },
            { icon: Lock, title: "Privacy by design", body: "Your customer data stays yours. Nothing sold, nothing shared.", href: "/security" },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-muted text-accent">
                    <f.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <p className="mt-4 text-base text-foreground">{f.title}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
                  {f.href && (
                    <Link href={f.href} className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Trust teaser */}
      <Section className="border-t border-border text-center">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="mx-auto max-w-2xl">
          <p className="text-sm text-accent">Trust</p>
          <h2 className="mt-3 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Built for businesses other processors turn away.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We work with legitimate, regulated businesses across nutraceuticals, iGaming, adult, and
            other high-risk categories — with the compliance infrastructure to match.
          </p>
          <Link
            href="/trust"
            className="mt-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out h-10 px-4 py-2 border border-border bg-transparent hover:bg-surface-raised text-foreground hover:-translate-y-px active:translate-y-0"
          >
            Visit the Trust Centre <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </Section>
    </div>
  );
}
