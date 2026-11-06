"use client";

import { useMemo, useState } from "react";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionTable } from "@/components/transaction-table";
import { TransactionFiltersBar } from "@/components/transaction-filters";
import { useTransactions } from "@/hooks/use-transactions";
import {
  applyFilters,
  defaultFilters,
  uniqueCategories,
  type TransactionFilters,
} from "@/lib/filter-transactions";

export default function TransacoesPage() {
  const { transactions, isLoading, error, createTransaction, removeTransaction } =
    useTransactions();
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);

  const categories = useMemo(() => uniqueCategories(transactions), [transactions]);
  const filteredTransactions = useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters],
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>
        <p className="text-sm text-muted">
          Gerencie suas receitas e despesas.
        </p>
      </div>

      <TransactionForm onSubmit={createTransaction} />

      <TransactionFiltersBar
        filters={filters}
        categories={categories}
        onChange={setFilters}
      />

      <div className="glass-panel rounded-2xl p-6">
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted">
            Carregando...
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-muted">
              {filteredTransactions.length} de {transactions.length} transações
            </p>
            <TransactionTable
              transactions={filteredTransactions}
              onDelete={removeTransaction}
            />
          </>
        )}
      </div>
    </div>
  );
}
