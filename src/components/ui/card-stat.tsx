
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardStatProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function CardStat({ title, value, icon, className, trend }: CardStatProps) {
  return (
    <motion.div 
      className={cn("rounded-xl p-6 h-full backdrop-blur-sm border border-neutral-100 dark:border-neutral-800 shadow-card card-hover", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-primary opacity-80">{icon}</div>}
      </div>
      <div className="flex flex-col">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "text-xs font-medium flex items-center gap-0.5",
                trend.isPositive ? "text-income dark:text-income-light" : "text-expense dark:text-expense-light"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value).toFixed(1)}%
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${trend.isPositive ? "bg-income" : "bg-expense"}`}></span>
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
