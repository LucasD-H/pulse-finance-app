"use client";

import useSWR from "swr";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

// Lista de categorias já usadas pelo usuário, independente de filtros ou
// paginação — alimenta o <select> de categoria na barra de filtros.
export function useCategories() {
  const { token } = useAuth();

  const { data } = useSWR<string[]>(
    token ? "/transactions/categories" : null,
    (path: string) => api<string[]>(path, {}, token!),
  );

  return data ?? [];
}
