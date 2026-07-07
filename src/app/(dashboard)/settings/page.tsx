import { requireActiveMerchant } from "@/lib/session";
import { getMerchantWithTeamAndBranding } from "@/features/settings/queries";
import {
  updateBusinessProfileAction,
  updateSettlementPreferencesAction,
  updateBrandingAction,
  inviteTeamMemberAction,
} from "@/features/settings/actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const { merchant } = await requireActiveMerchant();
  const full = await getMerchantWithTeamAndBranding(merchant.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your business profile, team, and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Business profile</TabsTrigger>
          <TabsTrigger value="settlement">Settlement</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Business profile</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <form action={updateBusinessProfileAction} className="max-w-lg space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input id="displayName" name="displayName" defaultValue={full.displayName} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" defaultValue={full.website ?? ""} placeholder="https://" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Business category</Label>
                  <Input id="category" name="category" defaultValue={full.category} />
                </div>
                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlement">
          <Card>
            <CardHeader><CardTitle>Settlement preferences</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <form action={updateSettlementPreferencesAction} className="max-w-lg space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="settlementSchedule">Payout schedule</Label>
                  <select
                    id="settlementSchedule"
                    name="settlementSchedule"
                    defaultValue={full.settlementSchedule}
                    className="h-10 w-full rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BIWEEKLY">Biweekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="settlementCurrency">Settlement currency</Label>
                  <Input id="settlementCurrency" name="settlementCurrency" defaultValue={full.settlementCurrency} />
                </div>
                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Security</CardTitle></CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="font-medium text-foreground">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Add an authenticator app to your account.</p>
                </div>
                <Badge variant="warning">Not enabled</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                MFA enrollment (TOTP/WebAuthn) is wired at the architecture level via Better Auth&apos;s
                two-factor plugin and will be enabled here in a follow-up milestone.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification settings</CardTitle></CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
              <p>Choose which events send an email to your team.</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Successful settlement payouts</li>
                <li>Compliance alerts requiring review</li>
                <li>KYB status changes</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader><CardTitle>Team members</CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-0">
              <form action={inviteTeamMemberAction} className="flex items-end gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="email">Invite by email</Label>
                  <Input id="email" name="email" type="email" placeholder="teammate@company.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    className="h-10 rounded-sm border border-border bg-surface-raised px-3 text-sm text-foreground"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="ANALYST">Analyst</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                </div>
                <Button type="submit">Invite</Button>
              </form>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {full.members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{m.user.email}</TableCell>
                      <TableCell><Badge>{m.role}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <form action={updateBrandingAction} className="max-w-lg space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="primaryColor">Primary color</Label>
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    defaultValue={full.branding?.primaryColor ?? "#4F46E5"}
                    className="h-10 w-20 p-1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="supportEmail">Support email</Label>
                  <Input id="supportEmail" name="supportEmail" defaultValue={full.branding?.supportEmail ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="supportUrl">Support URL</Label>
                  <Input id="supportUrl" name="supportUrl" defaultValue={full.branding?.supportUrl ?? ""} />
                </div>
                <Button type="submit">Save branding</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
