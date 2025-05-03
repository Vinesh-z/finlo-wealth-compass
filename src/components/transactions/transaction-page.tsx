
import { useState, useEffect } from "react";
import { TransactionList } from "@/components/transaction-list";
import { Transaction } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransactionListMobile } from "@/components/transaction-list-mobile";
import { TransactionHeader } from "@/components/transactions/transaction-header";
import { TransactionActions } from "@/components/transactions/transaction-actions";
import { DeleteTransactionDialog } from "@/components/transactions/delete-transaction-dialog";

export function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedTransactions: Transaction[] = (data || []).map(item => ({
        id: item.id,
        amount: Number(item.amount),
        type: item.type,
        category: item.category,
        description: item.description || '',
        date: new Date(item.date),
      }));

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
    type: Transaction['type'];
    category: Transaction['category'];
    description: string;
    date: Date;
  }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Not signed in",
          description: "Please sign in to add transactions.",
          variant: "destructive",
        });
        return;
      }
      const user_id = session.user.id;

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction: Transaction = {
        id: data.id,
        amount: Number(data.amount),
        type: data.type,
        category: data.category,
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

  const handleEditTransaction = async (transaction: Transaction) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date.toISOString(),
        })
        .eq('id', transaction.id);

      if (error) throw error;

      // Update local state
      setTransactions(transactions.map(t => 
        t.id === transaction.id ? transaction : t
      ));
      
      setEditingTransaction(null);
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionToDelete);

      if (error) throw error;

      // Update local state
      setTransactions(transactions.filter(t => t.id !== transactionToDelete));
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setTransactionToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const confirmDelete = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <TransactionHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TransactionActions
            onAddTransaction={handleAddTransaction}
            editingTransaction={editingTransaction}
            onEditTransaction={handleEditTransaction}
            onCancelEdit={() => setEditingTransaction(null)}
          />
        </div>
        
        <div className="md:col-span-2">
          {isMobile ? (
            <TransactionListMobile
              transactions={transactions}
              isLoading={isLoading}
              onEdit={setEditingTransaction}
              onDelete={confirmDelete}
            />
          ) : (
            <TransactionList 
              transactions={transactions} 
              isLoading={isLoading}
              onEdit={setEditingTransaction}
              onDelete={confirmDelete}
            />
          )}
        </div>
      </div>

      <DeleteTransactionDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}
