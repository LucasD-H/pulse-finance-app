"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

type TransactionTableProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
        Nenhuma transação cadastrada ainda
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted">
            <th className="pb-3 font-medium">Título</th>
            <th className="pb-3 font-medium">Categoria</th>
            <th className="pb-3 font-medium">Data</th>
            <th className="pb-3 font-medium">Valor</th>
            <th className="pb-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-border/50">
              <td className="py-3">{transaction.title}</td>
              <td className="py-3 text-muted">{transaction.category}</td>
              <td className="py-3 text-muted">
                {dateFormatter.format(new Date(transaction.date))}
              </td>
              <td
                className={cn(
                  "py-3 font-medium",
                  transaction.type === "INCOME" ? "text-emerald-400" : "text-red-400",
                )}
              >
                {transaction.type === "INCOME" ? "+" : "-"}
                {currencyFormatter.format(transaction.amount)}
              </td>
              <td className="py-3 text-right">
                <button
                  type="button"
                  onClick={() => onDelete(transaction.id)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Excluir ${transaction.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
