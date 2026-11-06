"use client";

import { Filter } from "lucide-react";
import { defaultFilters, type TransactionFilters } from "@/lib/filter-transactions";
import type { TransactionType } from "@/types/transaction";

type TransactionFiltersBarProps = {
  filters: TransactionFilters;
  categories: string[];
  onChange: (filters: TransactionFilters) => void;
};

const selectClassName =
  "rounded-lg border border-border bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent";

export function TransactionFiltersBar({
  filters,
  categories,
  onChange,
}: TransactionFiltersBarProps) {
  const hasActiveFilters =
    filters.type !== "ALL" ||
    filters.category !== "ALL" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-6 lg:flex-row lg:items-end lg:flex-wrap">
      <div className="flex items-center gap-2 text-sm font-medium text-muted lg:self-center">
        <Filter className="h-4 w-4" />
        Filtros
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-type" className="text-xs font-medium text-muted">
          Tipo
        </label>
        <select
          id="filter-type"
          value={filters.type}
          onChange={(event) =>
            onChange({
              ...filters,
              type: event.target.value as TransactionType | "ALL",
            })
          }
          className={selectClassName}
        >
          <option value="ALL">Todos</option>
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-category" className="text-xs font-medium text-muted">
          Categoria
        </label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(event) => onChange({ ...filters, category: event.target.value })}
          className={selectClassName}
        >
          <option value="ALL">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-start" className="text-xs font-medium text-muted">
          De
        </label>
        <input
          id="filter-start"
          type="date"
          value={filters.startDate}
          onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
          className={selectClassName}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-end" className="text-xs font-medium text-muted">
          Até
        </label>
        <input
          id="filter-end"
          type="date"
          value={filters.endDate}
          onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
          className={selectClassName}
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange(defaultFilters)}
          className="text-sm font-medium text-accent hover:underline"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
