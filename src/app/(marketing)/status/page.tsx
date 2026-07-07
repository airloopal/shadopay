import { CheckCircle2 } from "lucide-react";
import { MarketingPageHeader } from "@/features/marketing/marketing-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UptimeHistory } from "@/features/status/uptime-history";
import { services, incidents } from "@/features/status/data";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Status — ShadoPay" };

const statusLabel: Record<string, string> = {
  operational: "Operational",
  degraded: "Degraded performance",
  outage: "Outage",
};

const incidentBadge: Record<string, "success" | "warning" | "danger"> = {
  resolved: "success",
  monitoring: "warning",
  investigating: "danger",
};

export default function StatusPage() {
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <div>
      <MarketingPageHeader
        eyebrow="Status"
        title="System status"
        description="Live status for every ShadoPay service. Data shown reflects the last 90 days."
      />

      <div className="container py-16">
        <div className="mb-10 flex items-center gap-3 rounded-lg border border-border bg-card/60 p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-success-muted text-success">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-foreground">{allOperational ? "All systems operational" : "Some systems degraded"}</p>
            <p className="text-xs text-muted-foreground">Updated moments ago</p>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service.name}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  <p className="text-sm text-foreground">{service.name}</p>
                  <Badge variant="success">{statusLabel[service.status]}</Badge>
                </div>

                <div className="flex items-center gap-4">
                  <UptimeHistory history={service.history} />
                  <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                    {service.uptime90d}% uptime
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-light text-foreground">Incident history</h2>
          <div className="mt-6 space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground">{incident.title}</p>
                    <Badge variant={incidentBadge[incident.status]}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(incident.date)}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{incident.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
