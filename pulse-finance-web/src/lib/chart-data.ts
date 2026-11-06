import type { Transaction } from "@/types/transaction";

export type MonthlyEvolution = {
  month: string;
  income: number;
  expenses: number;
};

const monthLabelFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "2-digit",
});

// Agrupa as transações nos últimos `monthsCount` meses (incluindo meses sem
// nenhum lançamento, para o gráfico não "pular" períodos vazios).
export function buildMonthlyEvolution(
  transactions: Transaction[],
  monthsCount = 6,
): MonthlyEvolution[] {
  const now = new Date();

  const months = Array.from({ length: monthsCount }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1 - index), 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const data: MonthlyEvolution = {
      month: monthLabelFormatter.format(date),
      income: 0,
      expenses: 0,
    };
    return { key, data };
  });

  const monthByKey = new Map(months.map(({ key, data }) => [key, data]));

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const month = monthByKey.get(key);

    if (!month) continue; // fora da janela de meses exibida

    if (transaction.type === "INCOME") {
      month.income += transaction.amount;
    } else {
      month.expenses += transaction.amount;
    }
  }

  return months.map(({ data }) => data);
}
