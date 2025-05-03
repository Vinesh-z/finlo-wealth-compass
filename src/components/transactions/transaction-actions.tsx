
import React from "react";
import { TransactionForm } from "@/components/transaction-form";
import { Transaction } from "@/types";

interface TransactionActionsProps {
  onAddTransaction: (transaction: {
    amount: number;
    type: Transaction['type'];
    category: Transaction['category'];
    description: string;
    date: Date;
  }) => Promise<void>;
  editingTransaction: Transaction | null;
  onEditTransaction: (transaction: Transaction) => Promise<void>;
  onCancelEdit: () => void;
}

export function TransactionActions({ 
  onAddTransaction, 
  editingTransaction,
  onEditTransaction,
  onCancelEdit
}: TransactionActionsProps) {
  return (
    <TransactionForm 
      onAddTransaction={onAddTransaction} 
      editingTransaction={editingTransaction}
      onEditTransaction={onEditTransaction}
      onCancelEdit={onCancelEdit}
    />
  );
}
