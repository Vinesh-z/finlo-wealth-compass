
import { ArrowUpRight, ArrowDownRight, DollarSign, PiggyBank } from "lucide-react";
import { CardStat } from "@/components/ui/card-stat";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";
import { calculateTotalIncome, calculateTotalExpenses, calculateSavings } from "@/utils/calculations";

interface DashboardCardsProps {
  transactions: Transaction[];
  previousMonthData?: {
    income: number;
    expenses: number;
    savings: number;
  };
}

export function DashboardCards({ transactions, previousMonthData }: DashboardCardsProps) {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const savings = calculateSavings(transactions);

  // Calculate trends if previous month data exists
  const incomeTrend = previousMonthData
    ? ((totalIncome - previousMonthData.income) / previousMonthData.income) * 100
    : 0;
  
  const expensesTrend = previousMonthData
    ? ((totalExpenses - previousMonthData.expenses) / previousMonthData.expenses) * 100
    : 0;
  
  const savingsTrend = previousMonthData
    ? ((savings - previousMonthData.savings) / previousMonthData.savings) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CardStat
        title="Total Income"
        value={formatCurrency(totalIncome)}
        icon={<ArrowUpRight className="h-4 w-4 text-income" />}
        className="bg-income-light"
        trend={previousMonthData ? {
          value: incomeTrend,
          isPositive: incomeTrend >= 0
        } : undefined}
      />
      
      <CardStat
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<ArrowDownRight className="h-4 w-4 text-expense" />}
        className="bg-expense-light"
        trend={previousMonthData ? {
          value: expensesTrend,
          isPositive: expensesTrend < 0 // For expenses, negative trend is positive
        } : undefined}
      />
      
      <CardStat
        title="Total Savings"
        value={formatCurrency(savings)}
        icon={<PiggyBank className="h-4 w-4 text-primary" />}
        className="bg-primary/10"
        trend={previousMonthData ? {
          value: savingsTrend,
          isPositive: savingsTrend >= 0
        } : undefined}
      />
    </div>
  );
}
