"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { SummaryCard } from "@/components/summary-card";
import { EvolutionChart } from "@/components/evolution-chart";
import { useTransactions } from "@/hooks/use-transactions";
import { buildMonthlyEvolution } from "@/lib/chart-data";

export default function DashboardPage() {
  const { transactions, isLoading, error } = useTransactions();
  const monthlyEvolution = buildMonthlyEvolution(transactions);

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted">
          Visão geral das suas finanças.
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard label="Saldo total" value={balance} icon={Wallet} />
        <SummaryCard label="Entradas" value={income} icon={TrendingUp} />
        <SummaryCard label="Saídas" value={expenses} icon={TrendingDown} />
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted">
            Evolução financeira (últimos 6 meses)
          </h2>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Entradas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              Saídas
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
            Carregando transações...
          </div>
        ) : (
          <EvolutionChart data={monthlyEvolution} />
        )}
      </div>
    </div>
  );
}
