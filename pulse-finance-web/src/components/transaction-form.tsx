"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import type { CreateTransactionInput, TransactionType } from "@/types/transaction";

type TransactionFormProps = {
  onSubmit: (input: CreateTransactionInput) => Promise<void>;
};

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const parsedAmount = Number(amount.replace(",", "."));

    if (!title || !category || !parsedAmount || parsedAmount <= 0) {
      setError("Preencha todos os campos com valores válidos");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title, amount: parsedAmount, type, category });
      setTitle("");
      setAmount("");
      setCategory("");
    } catch {
      setError("Não foi possível criar a transação");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel flex flex-col gap-4 rounded-2xl p-6 lg:flex-row lg:items-end"
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="title" className="text-xs font-medium text-muted">
          Título
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex: Salário, Aluguel..."
          className="rounded-lg border border-border bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="amount" className="text-xs font-medium text-muted">
          Valor (R$)
        </label>
        <input
          id="amount"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0,00"
          className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent lg:w-32"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="type" className="text-xs font-medium text-muted">
          Tipo
        </label>
        <select
          id="type"
          value={type}
          onChange={(event) => setType(event.target.value as TransactionType)}
          className="rounded-lg border border-border bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="EXPENSE">Despesa</option>
          <option value="INCOME">Receita</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-xs font-medium text-muted">
          Categoria
        </label>
        <input
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Ex: Trabalho, Moradia..."
          className="w-full rounded-lg border border-border bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent lg:w-40"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        {isSubmitting ? "Adicionando..." : "Adicionar"}
      </button>

      {error && (
        <p className="text-sm text-red-400 lg:basis-full">{error}</p>
      )}
    </form>
  );
}
