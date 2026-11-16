"use client";

import { useState } from "react";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionTable } from "@/components/transaction-table";
import { TransactionFiltersBar } from "@/components/transaction-filters";
import { EditTransactionModal } from "@/components/edit-transaction-modal";
import { Pagination } from "@/components/pagination";
import { useTransactions } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { defaultFilters, type TransactionFilters } from "@/lib/filter-transactions";
import type { Transaction } from "@/types/transaction";

const PAGE_SIZE = 10;

export default function TransacoesPage() {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const {
    transactions,
    meta,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    removeTransaction,
  } = useTransactions(filters, page, PAGE_SIZE);
  const categories = useCategories();

  function handleFiltersChange(next: TransactionFilters) {
    setFilters(next);
    setPage(1); // toda mudança de filtro volta para a primeira página
  }

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
        onChange={handleFiltersChange}
      />

      <div className="glass-panel rounded-2xl p-6">
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted">
            Carregando...
          </div>
        ) : (
          <>
            {meta && (
              <p className="mb-4 text-xs text-muted">
                {meta.total} transação{meta.total === 1 ? "" : "ões"} encontrada
                {meta.total === 1 ? "" : "s"}
              </p>
            )}
            <TransactionTable
              transactions={transactions}
              onEdit={setEditingTransaction}
              onDelete={removeTransaction}
            />
            {meta && meta.totalPages > 1 && (
              <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
            )}
          </>
        )}
      </div>

      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSubmit={async (id, input) => {
          await updateTransaction(id, input);
          setEditingTransaction(null);
        }}
      />
    </div>
  );
}
