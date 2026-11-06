"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryTotal } from "@/lib/category-breakdown";

const COLORS = [
  "#10b981",
  "#f87171",
  "#60a5fa",
  "#fbbf24",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#fb923c",
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type CategoryBreakdownChartProps = {
  data: CategoryTotal[];
};

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
        Sem despesas registradas ainda
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
      <ResponsiveContainer width="100%" height={240} className="lg:max-w-60">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value) => currencyFormatter.format(Number(value))}
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="flex flex-1 flex-col gap-2">
        {data.map((entry, index) => (
          <li key={entry.category} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              {entry.category}
            </span>
            <span className="flex items-center gap-2">
              <span className="font-medium">{currencyFormatter.format(entry.total)}</span>
              <span className="w-12 text-right text-xs text-muted">
                {entry.percentage.toFixed(0)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
