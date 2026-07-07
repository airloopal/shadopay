import { getKybQueue } from "@/features/admin/queries";
import { approveKybAction, rejectKybAction } from "@/features/admin/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export default async function AdminKybPage() {
  const queue = await getKybQueue();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Verification queue</h1>
        <p className="text-sm text-muted-foreground">{queue.length} profiles awaiting a decision</p>
      </div>

      <div className="space-y-4">
        {queue.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              The queue is empty. Nothing pending review.
            </CardContent>
          </Card>
        )}
        {queue.map((profile) => (
          <Card key={profile.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base font-medium text-foreground">
                  {profile.merchant.displayName}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {profile.registeredName} · {profile.jurisdiction} · Submitted {formatDate(profile.submittedAt)}
                </p>
              </div>
              <StatusBadge status={profile.status} />
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-4 pt-0">
              <form action={rejectKybAction.bind(null, profile.id)} className="flex flex-1 items-end gap-2">
                <Input name="reason" placeholder="Rejection / info-needed reason" className="flex-1" />
                <Button variant="danger" size="sm" type="submit">Reject</Button>
              </form>
              <form action={approveKybAction.bind(null, profile.id)}>
                <Button size="sm" type="submit">Approve</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
