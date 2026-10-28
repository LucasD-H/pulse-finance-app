"use client";

import { TransactionForm } from "@/components/transaction-form";
import { TransactionTable } from "@/components/transaction-table";
import { useTransactions } from "@/hooks/use-transactions";

export default function TransacoesPage() {
  const { transactions, isLoading, error, createTransaction, removeTransaction } =
    useTransactions();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transações</h1>
        <p className="text-sm text-muted">
          Gerencie suas receitas e despesas.
        </p>
      </div>

      <TransactionForm onSubmit={createTransaction} />

      <div className="glass-panel rounded-2xl p-6">
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted">
            Carregando...
          </div>
        ) : (
          <TransactionTable
            transactions={transactions}
            onDelete={removeTransaction}
          />
        )}
      </div>
    </div>
  );
}
