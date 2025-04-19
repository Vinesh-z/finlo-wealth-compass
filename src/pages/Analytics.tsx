
import { useState } from "react";
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
import { mockTransactions } from "@/data/mockData";
import { formatCurrency } from "@/utils/format";
import { calculateTotalIncome, calculateTotalExpenses, calculateSavings } from "@/utils/calculations";

function Analytics() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [timeFrame, setTimeFrame] = useState<string>("all");

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
          <p className="text-2xl font-bold text-income">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-expense">{formatCurrency(totalExpenses)}</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Savings Rate</h3>
          <p className="text-2xl font-bold text-primary">
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
            {/* Dynamic insights would go here in a real app with more data analysis */}
            <div className="p-4 bg-income-light rounded-lg">
              <p className="font-medium">Savings Potential</p>
              <p className="text-sm text-muted-foreground">
                Your savings rate is {savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of your income.
              </p>
            </div>
            
            <div className="p-4 bg-accent rounded-lg">
              <p className="font-medium">Top Spending Category</p>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length > 0 
                  ? "Review your highest expense categories to identify potential savings."
                  : "Add more transactions to see insights about your spending patterns."}
              </p>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="font-medium">Month-over-Month Comparison</p>
              <p className="text-sm text-muted-foreground">
                Track your spending trends over time to help maintain your financial goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
