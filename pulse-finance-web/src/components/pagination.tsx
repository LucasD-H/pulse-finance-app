"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-muted">
      <span>
        Página {page} de {totalPages}
      </span>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted"
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
