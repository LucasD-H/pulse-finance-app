import type { Transaction } from "@/types/transaction";

const HEADERS = ["Título", "Categoria", "Tipo", "Valor", "Data"];

// Campos que começam com =, +, -, @ (ou tab/CR) podem ser interpretados como
// fórmula pelo Excel/Google Sheets ao abrir o CSV ("CSV Injection"/"Formula
// Injection" — ver OWASP). Como título e categoria vêm de texto livre do
// usuário, prefixamos esses caracteres com uma aspa simples para neutralizar.
const FORMULA_TRIGGER_CHARS = ["=", "+", "-", "@", "\t", "\r"];

function sanitizeCsvField(value: string): string {
  if (FORMULA_TRIGGER_CHARS.some((char) => value.startsWith(char))) {
    return `'${value}`;
  }
  return value;
}

function escapeCsvField(value: string): string {
  const sanitized = sanitizeCsvField(value);

  if (sanitized.includes(",") || sanitized.includes('"') || sanitized.includes("\n")) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }

  return sanitized;
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
