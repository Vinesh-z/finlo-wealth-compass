import React, { useState } from "react";
import { motion } from "framer-motion";
import { TransactionHeader } from "./transaction-header";
import { TransactionActions } from "./transaction-actions";
import { toast } from "@/components/ui/use-toast";
import { Transaction, TransactionType } from "@/types";

export function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: 1000,
      type: "expense" as TransactionType,
      category: "food",
      description: "Groceries",
      date: new Date(2023, 4, 15)
    },
    {
      id: "2",
      amount: 2000,
      type: "income" as TransactionType,
      category: "salary",
      description: "Monthly salary",
      date: new Date(2023, 4, 10)
    },
    {
      id: "3",
      amount: 500,
      type: "expense" as TransactionType,
      category: "entertainment",
      description: "Movie tickets",
      date: new Date(2023, 4, 20)
    }
  ]);

  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filter !== "all" && transaction.type !== filter) {
      return false;
    }

    // Search by description or category
    if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !transaction.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "amount") {
      return b.amount - a.amount;
    }
    return 0;
  });

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "The transaction has been successfully deleted."
    });
  };

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
    toast({
      title: "Transaction added",
      description: "The transaction has been successfully added."
    });
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="container mx-auto p-4">
      <TransactionHeader />
      <TransactionActions 
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
        filter={filter}
        sortBy={sortBy}
        searchQuery={searchQuery}
      />
      <div className="mt-8">
        {/* Transaction list would go here */}
      </div>
    </div>
  );
}
