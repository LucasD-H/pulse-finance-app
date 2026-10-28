"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import type { CreateTransactionInput, Transaction } from "@/types/transaction";

export function useTransactions() {
  const { token } = useAuth();

  // Chave condicional: enquanto não houver token, a chave é `null` e o SWR
  // não dispara a requisição (padrão do SWR para "fetch condicional").
  const { data, error, isLoading, mutate } = useSWR<Transaction[]>(
    token ? "/transactions" : null,
    () => api<Transaction[]>("/transactions", {}, token!),
  );

  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      if (!token) return;
      const created = await api<Transaction>(
        "/transactions",
        { method: "POST", body: input },
        token,
      );
      await mutate((current) => [created, ...(current ?? [])], {
        revalidate: false,
      });
    },
    [token, mutate],
  );

  const removeTransaction = useCallback(
    async (id: string) => {
      if (!token) return;
      await api(`/transactions/${id}`, { method: "DELETE" }, token);
      await mutate((current) => current?.filter((t) => t.id !== id), {
        revalidate: false,
      });
    },
    [token, mutate],
  );

  return {
    transactions: data ?? [],
    isLoading,
    error: error ? "Não foi possível carregar as transações" : null,
    createTransaction,
    removeTransaction,
    refetch: mutate,
  };
}
