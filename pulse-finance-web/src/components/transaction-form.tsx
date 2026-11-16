"use client";

import { useState, type FormEvent } from "react";
import { Plus, Save } from "lucide-react";
import type { CreateTransactionInput, Transaction, TransactionType } from "@/types/transaction";

type TransactionFormProps = {
  onSubmit: (input: CreateTransactionInput) => Promise<void>;
  initialValues?: Pick<Transaction, "title" | "amount" | "type" | "category">;
  onCancel?: () => void;
};

export function TransactionForm({ onSubmit, initialValues, onCancel }: TransactionFormProps) {
  const isEditMode = Boolean(initialValues);

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [amount, setAmount] = useState(
    initialValues ? String(initialValues.amount).replace(".", ",") : "",
  );
  const [type, setType] = useState<TransactionType>(initialValues?.type ?? "EXPENSE");
  const [category, setCategory] = useState(initialValues?.category ?? "");
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
      if (!isEditMode) {
        setTitle("");
        setAmount("");
        setCategory("");
      }
    } catch {
      setError(
        isEditMode
          ? "Não foi possível salvar as alterações"
          : "Não foi possível criar a transação",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isEditMode
          ? "flex flex-col gap-4"
          : "glass-panel flex flex-col gap-4 rounded-2xl p-6 lg:flex-row lg:items-end"
      }
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

      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isEditMode ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isSubmitting ? "Salvando..." : isEditMode ? "Salvar" : "Adicionar"}
        </button>
      </div>

      {error && <p className="text-sm text-red-400 lg:basis-full">{error}</p>}
    </form>
  );
}
