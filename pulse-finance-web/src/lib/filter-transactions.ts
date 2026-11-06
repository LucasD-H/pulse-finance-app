import type { Transaction, TransactionType } from "@/types/transaction";

export type TransactionFilters = {
  type: TransactionType | "ALL";
  category: string; // "ALL" ou o nome exato da categoria
  startDate: string; // formato yyyy-mm-dd (input type="date"), vazio = sem limite
  endDate: string;
};

export const defaultFilters: TransactionFilters = {
  type: "ALL",
  category: "ALL",
  startDate: "",
  endDate: "",
};

export function applyFilters(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  return transactions.filter((transaction) => {
    if (filters.type !== "ALL" && transaction.type !== filters.type) {
      return false;
    }

    if (filters.category !== "ALL" && transaction.category !== filters.category) {
      return false;
    }

    const transactionDate = transaction.date.slice(0, 10); // yyyy-mm-dd

    if (filters.startDate && transactionDate < filters.startDate) {
      return false;
    }

    if (filters.endDate && transactionDate > filters.endDate) {
      return false;
    }

    return true;
  });
}

export function uniqueCategories(transactions: Transaction[]): string[] {
  return Array.from(new Set(transactions.map((t) => t.category))).sort();
}
