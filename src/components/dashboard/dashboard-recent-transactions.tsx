
import React from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { TransactionList } from "@/components/transaction-list";
import { Transaction } from "@/types";
import { ArrowRightIcon } from "lucide-react";

interface DashboardRecentTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const DashboardRecentTransactions = ({ transactions, isLoading }: DashboardRecentTransactionsProps) => {
  return (
    <div className="md:col-span-2">
      <Card className="shadow-card border border-neutral-100 dark:border-neutral-800 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-800 bg-gradient-to-r from-secondary/30 to-secondary/10 dark:from-secondary/10 dark:to-transparent pb-4">
          <div>
            <CardTitle className="text-lg font-heading">Recent Transactions</CardTitle>
            <CardDescription>Your last 5 transactions</CardDescription>
          </div>
          <a href="/transactions" className="text-sm text-primary flex items-center gap-1 hover:underline">
            View All
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </a>
        </CardHeader>
        <CardContent className="p-0">
          <TransactionList 
            transactions={transactions} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardRecentTransactions;
