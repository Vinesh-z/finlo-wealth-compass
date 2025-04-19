
import { cn } from "@/lib/utils";

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
    <div className={cn("rounded-lg p-6 h-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="opacity-70">{icon}</div>}
      </div>
      <div className="flex flex-col">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-income" : "text-expense"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value).toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
