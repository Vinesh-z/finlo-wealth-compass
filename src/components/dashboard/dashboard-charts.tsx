
import React from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { Transaction } from "@/types";

interface DashboardChartsProps {
  transactions: Transaction[];
  thisMonthTransactions: Transaction[];
}

const DashboardCharts = ({ transactions, thisMonthTransactions }: DashboardChartsProps) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }} 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <Card className="shadow-card overflow-hidden border border-neutral-100 dark:border-neutral-800">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-gradient-to-r from-secondary/30 to-secondary/10 dark:from-secondary/10 dark:to-transparent pb-4">
          <CardTitle className="text-lg font-heading">Income & Expenses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <IncomeExpenseChart transactions={transactions} />
        </CardContent>
      </Card>
      
      <Card className="shadow-card overflow-hidden border border-neutral-100 dark:border-neutral-800">
        <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-gradient-to-r from-secondary/30 to-secondary/10 dark:from-secondary/10 dark:to-transparent pb-4">
          <CardTitle className="text-lg font-heading">Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ExpensePieChart transactions={thisMonthTransactions} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardCharts;
