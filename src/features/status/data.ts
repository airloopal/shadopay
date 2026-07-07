export type ServiceStatus = "operational" | "degraded" | "outage";

export interface ServiceHistoryDay {
  date: string;
  status: ServiceStatus;
}

export interface ServiceEntry {
  name: string;
  status: ServiceStatus;
  uptime90d: number;
  history: ServiceHistoryDay[];
}

export interface IncidentEntry {
  id: string;
  title: string;
  status: "resolved" | "monitoring" | "investigating";
  date: string;
  summary: string;
}

function generateHistory(days: number, incidentIndexes: number[] = []): ServiceHistoryDay[] {
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    const status: ServiceStatus = incidentIndexes.includes(i) ? "degraded" : "operational";
    return { date: date.toISOString(), status };
  });
}

export const services: ServiceEntry[] = [
  { name: "API", status: "operational", uptime90d: 99.98, history: generateHistory(90, [62]) },
  { name: "Checkout", status: "operational", uptime90d: 99.99, history: generateHistory(90) },
  { name: "Dashboard", status: "operational", uptime90d: 99.97, history: generateHistory(90, [40, 41]) },
  { name: "Payouts", status: "operational", uptime90d: 99.95, history: generateHistory(90, [15]) },
  { name: "Authentication", status: "operational", uptime90d: 99.99, history: generateHistory(90) },
  { name: "Email", status: "operational", uptime90d: 99.9, history: generateHistory(90, [30, 31, 32]) },
  { name: "Webhook delivery", status: "operational", uptime90d: 99.93, history: generateHistory(90, [70]) },
];

export const incidents: IncidentEntry[] = [
  {
    id: "inc-1042",
    title: "Elevated webhook delivery latency",
    status: "resolved",
    date: "2026-06-18",
    summary:
      "Webhook delivery experienced delays of up to 4 minutes for a subset of merchants due to a queue backlog. Delivery was fully restored and the backlog was drained within 45 minutes.",
  },
  {
    id: "inc-1031",
    title: "Dashboard intermittent slow loading",
    status: "resolved",
    date: "2026-06-02",
    summary:
      "Some merchants experienced slower-than-normal dashboard load times following a database migration. Query performance was restored after a rollback.",
  },
  {
    id: "inc-1019",
    title: "Scheduled payout delay",
    status: "resolved",
    date: "2026-05-14",
    summary:
      "A batch of scheduled payouts was delayed by several hours due to an issue with our banking partner's processing window. All affected payouts completed the same day.",
  },
];
