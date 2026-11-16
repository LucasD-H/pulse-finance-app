"use client";

import { useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import type {
  CreateTransactionInput,
  PaginatedTransactions,
  UpdateTransactionInput,
} from "@/types/transaction";
import { defaultFilters, type TransactionFilters } from "@/lib/filter-transactions";

function buildQueryString(page: number, limit: number, filters: TransactionFilters) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  if (filters.type !== "ALL") params.set("type", filters.type);
  if (filters.category !== "ALL") params.set("category", filters.category);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);

  return params.toString();
}

export function useTransactions(
  filters: TransactionFilters = defaultFilters,
  page = 1,
  limit = 10,
) {
  const { token } = useAuth();
  const { mutate: globalMutate } = useSWRConfig();

  const queryKey = token
    ? `/transactions?${buildQueryString(page, limit, filters)}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<PaginatedTransactions>(
    queryKey,
    (path: string) => api<PaginatedTransactions>(path, {}, token!),
  );

  // Invalida todas as chaves "/transactions..." em cache (outras páginas,
  // outros filtros, e o fetch "tudo" usado no dashboard/relatórios), para
  // que todos revalidem na próxima vez que forem exibidos.
  const invalidateAll = useCallback(() => {
    return globalMutate(
      (key) => typeof key === "string" && key.startsWith("/transactions"),
    );
  }, [globalMutate]);

  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      if (!token) return;
      await api("/transactions", { method: "POST", body: input }, token);
      await invalidateAll();
    },
    [token, invalidateAll],
  );

  const updateTransaction = useCallback(
    async (id: string, input: UpdateTransactionInput) => {
      if (!token) return;
      await api(`/transactions/${id}`, { method: "PUT", body: input }, token);
      await invalidateAll();
    },
    [token, invalidateAll],
  );

  const removeTransaction = useCallback(
    async (id: string) => {
      if (!token) return;
      await api(`/transactions/${id}`, { method: "DELETE" }, token);
      await invalidateAll();
    },
    [token, invalidateAll],
  );

  return {
    transactions: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error: error ? "Não foi possível carregar as transações" : null,
    createTransaction,
    updateTransaction,
    removeTransaction,
    refetch: mutate,
  };
}

// Usado por telas que precisam do histórico completo (dashboard, relatórios,
// exportação em CSV) em vez de uma página por vez.
export function useAllTransactions() {
  return useTransactions(defaultFilters, 1, 1000);
}
