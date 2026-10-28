"use client";

import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { SummaryCard } from "@/components/summary-card";
import { useTransactions } from "@/hooks/use-transactions";

export default function DashboardPage() {
  const { transactions, isLoading, error } = useTransactions();

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
        <h2 className="mb-4 text-sm font-medium text-muted">
          Evolução financeira
        </h2>
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
          {isLoading
            ? "Carregando transações..."
            : "Gráfico (Recharts) entra aqui na próxima etapa"}
        </div>
      </div>
    </div>
  );
}
