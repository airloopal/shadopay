import { DollarSign, TrendingUp, Wallet, Clock, CheckCircle2, RotateCcw } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { LiveTransactionFeed } from "@/components/dashboard/live-transaction-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { VerificationStatusCard } from "@/components/dashboard/verification-status-card";
import { OnboardingProgressCard } from "@/components/dashboard/onboarding-progress-card";
import { RecentPaymentLinks } from "@/components/dashboard/recent-payment-links";
import { requireActiveMerchant } from "@/lib/session";
import {
  getDashboardStats,
  getRecentTransactions,
  getMonthlyRevenueSeries,
  getRecentActivity,
} from "@/features/dashboard/queries";
import { getProfileCompletion } from "@/features/onboarding/queries";
import { listPaymentLinks } from "@/features/payment-links/queries";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const { merchant } = await requireActiveMerchant();

  const [stats, transactions, revenueSeries, activity, kyb, branding, recentLinks] = await Promise.all([
    getDashboardStats(merchant.id),
    getRecentTransactions(merchant.id),
    getMonthlyRevenueSeries(merchant.id),
    getRecentActivity(merchant.id),
    prisma.kybProfile.findUnique({ where: { merchantId: merchant.id } }),
    prisma.merchantBranding.findUnique({ where: { merchantId: merchant.id } }),
    listPaymentLinks(merchant.id, { page: 1, pageSize: 5 }),
  ]);

  const currency = merchant.settlementCurrency;
  const profile = getProfileCompletion({ merchant, branding, kyb });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://pay.shadopay.dev";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s how {merchant.displayName} is performing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Revenue today"
          value={formatCurrency(stats.todaysVolume, currency)}
          numericValue={stats.todaysVolume}
          format={(n) => formatCurrency(n, currency)}
          icon={DollarSign}
        />
        <StatCard
          label="Revenue this month"
          value={formatCurrency(stats.revenueThisMonth, currency)}
          numericValue={stats.revenueThisMonth}
          format={(n) => formatCurrency(n, currency)}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Available payout"
          value={formatCurrency(stats.availablePayout, currency)}
          numericValue={stats.availablePayout}
          format={(n) => formatCurrency(n, currency)}
          icon={Wallet}
        />
        <StatCard
          label="Pending payout"
          value={formatCurrency(stats.pendingPayout, currency)}
          numericValue={stats.pendingPayout}
          format={(n) => formatCurrency(n, currency)}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          label="Successful payments"
          value={stats.successfulPayments.toLocaleString()}
          numericValue={stats.successfulPayments}
          format={(n) => Math.round(n).toLocaleString()}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Refund rate"
          value={`${stats.refundRate}%`}
          numericValue={stats.refundRate}
          format={(n) => `${n.toFixed(1)}%`}
          icon={RotateCcw}
          tone={stats.refundRate > 5 ? "danger" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RevenueChart data={revenueSeries} currency={currency} />
          <RecentPaymentLinks links={recentLinks.links} appUrl={appUrl} />
          <LiveTransactionFeed transactions={transactions} />
        </div>

        <div className="space-y-6">
          <OnboardingProgressCard
            percentage={profile.percentage}
            items={profile.items}
            isComplete={Boolean(merchant.onboardingCompletedAt) && profile.percentage === 100}
          />
          <VerificationStatusCard status={kyb?.status ?? null} />
          <QuickActions />
          <RecentActivity items={activity} />
        </div>
      </div>
    </div>
  );
}
