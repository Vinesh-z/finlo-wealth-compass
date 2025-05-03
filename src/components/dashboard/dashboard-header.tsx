
import React from "react";
import { motion } from "framer-motion";

const DashboardHeader = () => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <h1 className="text-3xl font-bold tracking-tight font-heading mb-2">Dashboard</h1>
      <p className="text-muted-foreground">
        Your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
    </motion.div>
  );
};

export default DashboardHeader;
