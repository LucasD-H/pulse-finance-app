import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SummaryCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function SummaryCard({ label, value, icon: Icon, trend }: SummaryCardProps) {
  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-6 shadow-lg shadow-black/40">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <span className="text-2xl font-semibold tracking-tight">
        {currencyFormatter.format(value)}
      </span>

      {trend && (
        <div
          className={cn(
            "flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            trend.direction === "up"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400",
          )}
        >
          {trend.direction === "up" ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {trend.value}
        </div>
      )}
    </div>
  );
}
