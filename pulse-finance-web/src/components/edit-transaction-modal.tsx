"use client";

import { useEffect, useRef } from "react";
import { TransactionForm } from "@/components/transaction-form";
import type { CreateTransactionInput, Transaction } from "@/types/transaction";

type EditTransactionModalProps = {
  transaction: Transaction | null;
  onClose: () => void;
  onSubmit: (id: string, input: CreateTransactionInput) => Promise<void>;
};

export function EditTransactionModal({
  transaction,
  onClose,
  onSubmit,
}: EditTransactionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // <dialog> é controlado imperativamente (showModal()/close()), não por
  // uma prop "open" — é o próprio elemento que gerencia o foco, o Esc para
  // fechar e o ::backdrop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (transaction) {
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [transaction]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="glass-panel w-full max-w-lg rounded-2xl border-none p-0 text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {transaction && (
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Editar transação</h2>
          <TransactionForm
            initialValues={transaction}
            onCancel={onClose}
            onSubmit={(input) => onSubmit(transaction.id, input)}
          />
        </div>
      )}
    </dialog>
  );
}
