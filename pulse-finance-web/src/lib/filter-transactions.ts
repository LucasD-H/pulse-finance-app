import type { TransactionType } from "@/types/transaction";

// A filtragem de verdade agora acontece no backend (query params de
// /transactions), já combinada com a paginação. Este arquivo só guarda o
// formato do estado de filtro compartilhado entre os componentes da tela.
export type TransactionFilters = {
  type: TransactionType | "ALL";
  category: string; // "ALL" ou o nome exato da categoria
  startDate: string; // formato yyyy-mm-dd (input type="date"), vazio = sem limite
  endDate: string;
};

export const defaultFilters: TransactionFilters = {
  type: "ALL",
  category: "ALL",
  startDate: "",
  endDate: "",
};
