
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
} from "@/components/ui/card";
import { DashboardCards } from "@/components/dashboard-cards";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { Transaction, TransactionCategory, TransactionType } from "@/types";

function Dashboard() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <DashboardCards 
        transactions={thisMonthTransactions} 
        previousMonthData={prevMonthData}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IncomeExpenseChart transactions={transactions} />
        <ExpensePieChart transactions={thisMonthTransactions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TransactionForm onAddTransaction={handleAddTransaction} />
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your last 5 transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={recentTransactions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
