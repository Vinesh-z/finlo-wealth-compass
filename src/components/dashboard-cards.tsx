
import { ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";
import { CardStat } from "@/components/ui/card-stat";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";
import { calculateTotalIncome, calculateTotalExpenses, calculateSavings } from "@/utils/calculations";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface DashboardCardsProps {
  transactions: Transaction[];
  previousMonthData?: {
    income: number;
    expenses: number;
    savings: number;
  };
}

export function DashboardCards({ transactions, previousMonthData }: DashboardCardsProps) {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0); 
  const [savings, setSavings] = useState<number>(0);

  useEffect(() => {
    // Always calculate values regardless of transactions length
    const income = calculateTotalIncome(transactions);
    const expenses = calculateTotalExpenses(transactions);
    const calculatedSavings = calculateSavings(transactions);
    
    setTotalIncome(income);
    setTotalExpenses(expenses);
    setSavings(calculatedSavings);
  }, [transactions]);

  // Calculate trends if previous month data exists
  const incomeTrend = previousMonthData && previousMonthData.income !== 0
    ? ((totalIncome - previousMonthData.income) / previousMonthData.income) * 100
    : 0;
  
  const expensesTrend = previousMonthData && previousMonthData.expenses !== 0
    ? ((totalExpenses - previousMonthData.expenses) / previousMonthData.expenses) * 100
    : 0;
  
  const savingsTrend = previousMonthData && previousMonthData.savings !== 0
    ? ((savings - previousMonthData.savings) / previousMonthData.savings) * 100
    : 0;
    
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={`cards-${totalIncome}-${totalExpenses}-${savings}`}
    >
      <motion.div variants={itemVariants}>
        <CardStat
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={<ArrowUpRight className="h-5 w-5" />}
          className="bg-income-light dark:bg-income/10"
          trend={previousMonthData ? {
            value: incomeTrend,
            isPositive: incomeTrend >= 0
          } : undefined}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <CardStat
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<ArrowDownRight className="h-5 w-5" />}
          className="bg-expense-light dark:bg-expense/10"
          trend={previousMonthData ? {
            value: expensesTrend,
            isPositive: expensesTrend < 0 // For expenses, negative trend is positive
          } : undefined}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <CardStat
          title="Total Savings"
          value={formatCurrency(savings)}
          icon={<PiggyBank className="h-5 w-5" />}
          className="bg-primary/10 dark:bg-primary/20"
          trend={previousMonthData ? {
            value: savingsTrend,
            isPositive: savingsTrend >= 0
          } : undefined}
        />
      </motion.div>
    </motion.div>
  );
}
