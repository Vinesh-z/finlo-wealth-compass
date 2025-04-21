
import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";
import { calculateTotalIncome, calculateTotalExpenses, calculateSavings } from "@/utils/calculations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

function Analytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [timeFrame, setTimeFrame] = useState<string>("all");
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
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedTransactions: Transaction[] = (data || []).map(item => ({
        id: item.id,
        amount: Number(item.amount),
        type: item.type as Transaction['type'],
        category: item.category as Transaction['category'],
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

  // Filter transactions based on time frame
  const filteredTransactions = (() => {
    const now = new Date();
    
    switch (timeFrame) {
      case "month":
        return transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getMonth() === now.getMonth() && 
            transactionDate.getFullYear() === now.getFullYear()
          );
        });
      
      case "quarter":
        const quarterStart = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        );
        return transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= quarterStart;
        });
      
      case "year":
        return transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate.getFullYear() === now.getFullYear();
        });
      
      case "all":
      default:
        return transactions;
    }
  })();

  // Calculate summary statistics
  const totalIncome = calculateTotalIncome(filteredTransactions);
  const totalExpenses = calculateTotalExpenses(filteredTransactions);
  const savings = calculateSavings(filteredTransactions);
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  // Find top spending category
  const getTopSpendingCategory = () => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === "expense");
    if (expenseTransactions.length === 0) return null;
    
    const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
    
    let topCategory = "";
    let topAmount = 0;
    
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > topAmount) {
        topCategory = category;
        topAmount = amount;
      }
    });
    
    return { category: topCategory, amount: topAmount };
  };

  const topSpendingCategory = getTopSpendingCategory();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize your financial data to gain insights
          </p>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Visualize your financial data to gain insights
        </p>
      </div>

      <div className="w-full md:w-64">
        <Label htmlFor="time-frame" className="mb-2 block">Time Period</Label>
        <Select 
          value={timeFrame} 
          onValueChange={setTimeFrame}
        >
          <SelectTrigger id="time-frame">
            <SelectValue placeholder="Select time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-income dark:text-income-light">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-expense dark:text-expense-light">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Savings Rate</h3>
          <p className="text-2xl font-bold text-primary dark:text-primary-foreground">
            {savingsRate.toFixed(1)}%
            <span className="text-sm text-muted-foreground ml-1">
              ({formatCurrency(savings)})
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IncomeExpenseChart transactions={filteredTransactions} />
        <ExpensePieChart transactions={filteredTransactions} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Spending Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-income-light dark:bg-income/10 rounded-lg">
              <p className="font-medium">Savings Potential</p>
              <p className="text-sm text-muted-foreground">
                Your savings rate is {savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of your income.
              </p>
            </div>
            
            <div className="p-4 bg-accent dark:bg-accent/20 rounded-lg">
              <p className="font-medium">Top Spending Category</p>
              <p className="text-sm text-muted-foreground">
                {topSpendingCategory 
                  ? `Your highest expense category is "${topSpendingCategory.category}" (${formatCurrency(topSpendingCategory.amount)}). Review to identify potential savings.`
                  : "Add more transactions to see insights about your spending patterns."}
              </p>
            </div>

            <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <p className="font-medium">Month-over-Month Comparison</p>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length > 0
                  ? `You have ${filteredTransactions.length} transactions in this period. Track your spending trends over time to help maintain your financial goals.`
                  : "Add transactions to track your spending trends over time."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
