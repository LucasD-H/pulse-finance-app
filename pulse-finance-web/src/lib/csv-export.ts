import type { Transaction } from "@/types/transaction";

const HEADERS = ["Título", "Categoria", "Tipo", "Valor", "Data"];

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsv(transactions: Transaction[]): string {
  const rows = transactions.map((transaction) =>
    [
      transaction.title,
      transaction.category,
      transaction.type === "INCOME" ? "Receita" : "Despesa",
      transaction.amount.toFixed(2).replace(".", ","),
      transaction.date.slice(0, 10),
    ]
      .map(escapeCsvField)
      .join(","),
  );

  // BOM no início para o Excel reconhecer UTF-8 corretamente (acentos).
  return "\uFEFF" + [HEADERS.join(","), ...rows].join("\n");
}

export function downloadTransactionsCsv(transactions: Transaction[]) {
  const csv = toCsv(transactions);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `transacoes-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
