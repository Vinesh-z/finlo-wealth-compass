
import React from "react";
import { motion } from "framer-motion";

export function TransactionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      <p className="text-muted-foreground">
        Manage and track all your income and expenses
      </p>
    </motion.div>
  );
}
