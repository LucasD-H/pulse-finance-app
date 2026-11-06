"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyEvolution } from "@/lib/chart-data";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

type EvolutionChartProps = {
  data: MonthlyEvolution[];
};

export function EvolutionChart({ data }: EvolutionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f87171" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />

        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 12 }}
          tickFormatter={(value: number) => currencyFormatter.format(value)}
          width={72}
        />

        <Tooltip
          cursor={{ stroke: "rgba(255,255,255,0.15)" }}
          contentStyle={{
            background: "#18181b",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            fontSize: 12,
          }}
          labelStyle={{ color: "#f4f4f5", marginBottom: 4 }}
          formatter={(value, name) => [
            currencyFormatter.format(Number(value)),
            name === "income" ? "Entradas" : "Saídas",
          ]}
        />

        <Area
          type="monotone"
          dataKey="income"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#incomeGradient)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#f87171"
          strokeWidth={2}
          fill="url(#expensesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
