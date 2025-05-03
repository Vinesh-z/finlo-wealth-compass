
import React from "react";
import { TransactionForm } from "@/components/transaction-form";
import { Transaction, TransactionCategory, TransactionType } from "@/types";

interface DashboardTransactionFormProps {
  onAddTransaction: (transaction: {
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    date: Date;
  }) => Promise<void>;
}

const DashboardTransactionForm = ({ onAddTransaction }: DashboardTransactionFormProps) => {
  return (
    <div className="md:col-span-1">
      <TransactionForm onAddTransaction={onAddTransaction} />
    </div>
  );
};

export default DashboardTransactionForm;
