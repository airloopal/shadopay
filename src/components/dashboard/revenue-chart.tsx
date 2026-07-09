"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { RevenuePoint } from "@/types";

export function RevenueChart({ data, currency = "USD" }: { data: RevenuePoint[]; currency?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
      </CardHeader>
      <CardContent className="h-72 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v, currency).replace(/\.00$/, "")}
              width={72}
            />
            <Tooltip
              contentStyle={{
                background: "#161F2E",
                border: "1px solid #1F2937",
                borderRadius: 12,
                color: "#F3F4F6",
              }}
              formatter={(value) => {
  const numericValue =
    typeof value === "number" ? value : Number(value ?? 0);

  return [formatCurrency(numericValue, currency), "Revenue"];
}}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#4F46E5"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
