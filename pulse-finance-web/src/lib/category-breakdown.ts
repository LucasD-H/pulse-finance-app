import type { Transaction, TransactionType } from "@/types/transaction";

export type CategoryTotal = {
  category: string;
  total: number;
  percentage: number;
};

export function buildCategoryBreakdown(
  transactions: Transaction[],
  type: TransactionType,
): CategoryTotal[] {
  const totalsByCategory = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== type) continue;
    totalsByCategory.set(
      transaction.category,
      (totalsByCategory.get(transaction.category) ?? 0) + transaction.amount,
    );
  }

  const grandTotal = Array.from(totalsByCategory.values()).reduce((sum, v) => sum + v, 0);

  return Array.from(totalsByCategory.entries())
    .map(([category, total]) => ({
      category,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}
