export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type CreateTransactionInput = {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
};
