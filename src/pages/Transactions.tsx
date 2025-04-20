
import { useState } from "react";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { Transaction, TransactionCategory, TransactionType } from "@/types";

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddTransaction = (transaction: {
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    date: Date;
  }) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 11),
      ...transaction,
    };

    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Manage and track all your income and expenses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TransactionForm onAddTransaction={handleAddTransaction} />
        </div>
        
        <div className="md:col-span-2">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default Transactions;
