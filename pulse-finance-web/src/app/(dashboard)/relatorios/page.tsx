"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import { CategoryBreakdownChart } from "@/components/category-breakdown-chart";
import { useAllTransactions } from "@/hooks/use-transactions";
import { buildCategoryBreakdown } from "@/lib/category-breakdown";
import { downloadTransactionsCsv } from "@/lib/csv-export";

export default function RelatoriosPage() {
  const { transactions, isLoading } = useAllTransactions();

  const expensesByCategory = useMemo(
    () => buildCategoryBreakdown(transactions, "EXPENSE"),
    [transactions],
  );
  const incomeByCategory = useMemo(
    () => buildCategoryBreakdown(transactions, "INCOME"),
    [transactions],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
          <p className="text-sm text-muted">
            Distribuição das suas finanças por categoria.
          </p>
        </div>

        <button
          type="button"
          onClick={() => downloadTransactionsCsv(transactions)}
          disabled={transactions.length === 0}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-sm text-muted">
          Carregando...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="mb-4 text-sm font-medium text-muted">
              Despesas por categoria
            </h2>
            <CategoryBreakdownChart data={expensesByCategory} />
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h2 className="mb-4 text-sm font-medium text-muted">
              Receitas por categoria
            </h2>
            <CategoryBreakdownChart data={incomeByCategory} />
          </div>
        </div>
      )}
    </div>
  );
}
