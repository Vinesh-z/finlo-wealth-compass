
import { useState, useEffect } from "react";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { Transaction, TransactionCategory, TransactionType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert database format to app format
      const formattedTransactions = data?.map(item => ({
        id: item.id,
        amount: item.amount,
        type: item.type as TransactionType,
        category: item.category as TransactionCategory,
        description: item.description || '',
        date: new Date(item.date),
      })) || [];

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (transaction: {
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    date: Date;
  }) => {
    try {
      // Insert transaction into Supabase
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date.toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Convert the returned data to our app format
      const newTransaction: Transaction = {
        id: data.id,
        amount: data.amount,
        type: data.type as TransactionType,
        category: data.category as TransactionCategory,
        description: data.description || '',
        date: new Date(data.date),
      };

      setTransactions([newTransaction, ...transactions]);
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
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
          <TransactionList 
            transactions={transactions} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default Transactions;
