import Link from "next/link";
import { Landmark } from "lucide-react";
import { requireActiveMerchant } from "@/lib/session";
import { getMerchantWithTeamAndBranding } from "@/features/settings/queries";
import { updateProfileAction, updateBusinessDetailsAction } from "@/features/settings/actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";

export default async function SettingsPage() {
  const { session, merchant } = await requireActiveMerchant();
  const full = await getMerchantWithTeamAndBranding(merchant.id);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-light tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and business details.</p>
      </div>

      <Tabs defaultValue="profile">
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <form action={updateProfileAction} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-muted text-lg font-medium text-accent">
                    {initials(session.user.name)}
                  </div>
                  <div>
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-lg border border-border bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground opacity-60"
                    >
                      Upload photo — Coming soon
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" defaultValue={session.user.name} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" defaultValue={merchant.phone ?? ""} placeholder="07…" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={session.user.email} disabled className="opacity-60" />
                  <p className="text-xs text-muted-foreground">Contact support to change your sign-in email.</p>
                </div>

                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader><CardTitle>Business details</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <form action={updateBusinessDetailsAction} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-accent-muted text-lg font-medium text-accent">
                    {initials(full.displayName)}
                  </div>
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-lg border border-border bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground opacity-60"
                  >
                    Upload logo — Coming soon
                  </button>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tradingName">Business or trading name</Label>
                  <Input id="tradingName" name="tradingName" defaultValue={full.tradingName ?? full.displayName} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category">Business type</Label>
                  <Input id="category" name="category" defaultValue={full.category} placeholder="e.g. Hairdresser, Gardener, DJ" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="businessDescription">Short description</Label>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    rows={3}
                    defaultValue={full.businessDescription ?? ""}
                    placeholder="A line or two about what you do"
                    className="w-full rounded-sm border border-border bg-surface-raised p-3 text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="supportEmail">Support email</Label>
                  <Input id="supportEmail" name="supportEmail" defaultValue={full.branding?.supportEmail ?? ""} />
                </div>

                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3 pt-0">
              {[
                { label: "Payment received", checked: true },
                { label: "Payment failed", checked: true },
                { label: "Invoice paid", checked: true },
                { label: "Weekly summary", checked: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-md border border-border p-3">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <input type="checkbox" defaultChecked={item.checked} disabled className="h-4 w-4 opacity-60" />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Fine-grained notification preferences are coming soon — for now you&apos;ll receive all of these by email.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card>
            <CardHeader><CardTitle>Connected bank</CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center justify-between rounded-md border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-muted-foreground">
                    <Landmark className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">No bank connected</p>
                    <p className="text-xs text-muted-foreground">—</p>
                  </div>
                </div>
                <Badge variant="default">Not connected</Badge>
              </div>
              <Link
                href="/connected-bank"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-medium text-accent-foreground shadow-soft transition-all duration-200 hover:shadow-glow-accent"
              >
                Connect your bank
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center justify-between rounded-md border border-accent/40 bg-accent-muted p-3">
                <span className="text-sm text-foreground">Dark</span>
                <Badge variant="accent">Active</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3 opacity-60">
                <span className="text-sm text-foreground">Light</span>
                <Badge variant="default">Coming soon</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3 opacity-60">
                <span className="text-sm text-foreground">System</span>
                <Badge variant="default">Coming soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
