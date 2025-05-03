
import { useState, useEffect } from "react";
import { DashboardCards } from "@/components/dashboard-cards";
import { Transaction, TransactionCategory, TransactionType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardCharts from "@/components/dashboard/dashboard-charts";
import DashboardTransactionForm from "@/components/dashboard/dashboard-transaction-form";
import DashboardRecentTransactions from "@/components/dashboard/dashboard-recent-transactions";

function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      const formattedTransactions: Transaction[] = (data || []).map(item => ({
          id: item.id,
          amount: Number(item.amount),
          type: item.type as TransactionType,
          category: item.category as TransactionCategory,
          description: item.description || "",
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
    type: TransactionType;
    category: TransactionCategory;
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
        .from("transactions")
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
        type: data.type as TransactionType,
        category: data.category as TransactionCategory,
        description: data.description || "",
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

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Filter transactions for this month
  const currentDate = new Date();
  const thisMonth = currentDate.getMonth();
  const thisYear = currentDate.getFullYear();
  
  const thisMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === thisMonth && 
      transactionDate.getFullYear() === thisYear
    );
  });

  // Calculate empty previous month data 
  const prevMonthData = {
    income: 0,
    expenses: 0,
    savings: 0
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      } 
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <DashboardHeader />

      <motion.div variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}>
        <DashboardCards 
          transactions={thisMonthTransactions} 
          previousMonthData={prevMonthData}
        />
      </motion.div>

      <DashboardCharts 
        transactions={transactions}
        thisMonthTransactions={thisMonthTransactions} 
      />

      <motion.div variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardTransactionForm onAddTransaction={handleAddTransaction} />
        <DashboardRecentTransactions 
          transactions={recentTransactions}
          isLoading={isLoading}
        />
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
