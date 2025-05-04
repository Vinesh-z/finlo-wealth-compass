import React, { useState } from "react";
import { motion } from "framer-motion";
import { TransactionHeader } from "./transaction-header";
import { TransactionActions } from "./transaction-actions";
import { TransactionList } from "@/components/transaction-list";
import { TransactionListMobile } from "@/components/transaction-list-mobile";
import { TransactionForm } from "@/components/transaction-form";
import { toast } from "@/components/ui/use-toast";
import { Transaction, TransactionType } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
export function TransactionPage() {
  const isMobile = useIsMobile();
  const [transactions, setTransactions] = useState<Transaction[]>([{
    id: "1",
    amount: 1000,
    type: "expense" as TransactionType,
    category: "food",
    description: "Groceries",
    date: new Date(2023, 4, 15)
  }, {
    id: "2",
    amount: 2000,
    type: "income" as TransactionType,
    category: "salary",
    description: "Monthly salary",
    date: new Date(2023, 4, 10)
  }, {
    id: "3",
    amount: 500,
    type: "expense" as TransactionType,
    category: "entertainment",
    description: "Movie tickets",
    date: new Date(2023, 4, 20)
  }]);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filter !== "all" && transaction.type !== filter) {
      return false;
    }

    // Search by description or category
    if (searchQuery && !transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) && !transaction.category.toLowerCase().includes(searchQuery.toLowerCase())) {
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
  const handleAddTransaction = (transaction: {
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    date: Date;
    is_custom_category: boolean;
  }) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID() // Using built-in UUID generation instead of uuid package
    };
    setTransactions(prev => [...prev, newTransaction]);
    setIsFormOpen(false);
    toast({
      title: "Transaction added",
      description: "The transaction has been successfully added."
    });
  };
  const handleEditTransaction = (transaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
    setEditingTransaction(null);
    setIsFormOpen(false);
    toast({
      title: "Transaction updated",
      description: "The transaction has been successfully updated."
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
  const handleEditButtonClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };
  return <div className="container mx-auto p-4 pb-20 px-0 py-[16px]">
      <TransactionHeader />
      
      <div className="mt-8">
        <TransactionActions onFilterChange={handleFilterChange} onSortChange={handleSortChange} onSearchChange={handleSearchChange} filter={filter} sortBy={sortBy} searchQuery={searchQuery} />
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="mt-6 pb-16">
          {isMobile ? <TransactionListMobile transactions={sortedTransactions} onEdit={handleEditButtonClick} onDelete={handleDeleteTransaction} /> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TransactionList transactions={sortedTransactions} onEdit={handleEditButtonClick} onDelete={handleDeleteTransaction} />
              </div>
              <div>
                <TransactionForm onAddTransaction={handleAddTransaction} editingTransaction={editingTransaction} onEditTransaction={handleEditTransaction} onCancelEdit={() => setEditingTransaction(null)} />
              </div>
            </div>}
        </motion.div>
      </div>
      
      {/* Mobile-only floating action button and transaction form dialog */}
      {isMobile && <>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? "Edit Transaction" : "Add Transaction"}
                </DialogTitle>
              </DialogHeader>
              <TransactionForm onAddTransaction={handleAddTransaction} editingTransaction={editingTransaction} onEditTransaction={handleEditTransaction} onCancelEdit={() => {
            setEditingTransaction(null);
            setIsFormOpen(false);
          }} />
            </DialogContent>
            <DialogTrigger asChild>
              <Button className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg" size="icon">
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
          </Dialog>
        </>}
    </div>;
}