
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";
import { useMemo } from "react";

type TransactionListMobileProps = {
  transactions: Transaction[];
  isLoading?: boolean;
};

function getCategoryIcon(category: string) {
  // map categories to emoji/icons
  switch (category) {
    case "food": return "🍜";
    case "rent": return "🏠";
    case "utilities": return "💡";
    case "transportation": return "🚕";
    case "entertainment": return "🎬";
    case "shopping": return "🛒";
    case "healthcare": return "💊";
    case "education": return "🎓";
    case "travel": return "✈️";
    case "salary": return "💰";
    case "investment": return "📈";
    case "gift": return "🎁";
    case "other": return "💼";
    case "baby": return "👶";
    default: return "💼";
  }
}

// Returns: { '2025-04-20': [tx, tx], ... }
function groupByDate(transactions: Transaction[]) {
  return transactions.reduce((acc: Record<string, Transaction[]>, tx) => {
    const date = new Date(tx.date);
    const key = date.toISOString().slice(0, 10); // YYYY-MM-DD
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {});
}

const DAY_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TransactionListMobile({ transactions = [], isLoading = false }: TransactionListMobileProps) {
  const grouped = useMemo(() => groupByDate(transactions), [transactions]);
  const groupKeys = Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-neutral-900 dark:bg-zinc-900 rounded-xl p-4 animate-pulse h-20"/>
        ))}
      </div>
    );
  }

  if (groupKeys.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 text-lg font-medium">No transactions found</div>
    );
  }

  return (
    <div className="space-y-6">
      {groupKeys.map(dateKey => {
        const txs = grouped[dateKey];
        const dateObj = new Date(dateKey + "T00:00:00");
        const dayNum = dateObj.getDate();
        const weekDayName = DAY_OF_WEEK[dateObj.getDay()];
        // Count sums for income/expense in group
        const income = txs.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0);
        const expense = txs.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);

        return (
          <div key={dateKey}>
            {/* Date header row */}
            <div className="flex items-center pb-1">
              <span className="text-2xl font-bold text-white mr-2">{dayNum}</span>
              <span className={`rounded px-2 py-1 text-xs font-semibold ${
                weekDayName === "Sun" ? "bg-red-500/20 text-red-400"
                : weekDayName === "Sat" ? "bg-blue-500/20 text-blue-400"
                : "bg-zinc-700/50 text-zinc-200"
              }`}>
                {weekDayName}
              </span>
              <div className="flex-1"/>
              {/* Income/expense sums */}
              <span className="text-sm font-medium text-blue-400 mr-2">
                {income ? formatCurrency(income) : "₹ 0.00"}
              </span>
              <span className="text-sm font-medium text-red-400">
                {expense ? formatCurrency(expense) : "₹ 0.00"}
              </span>
            </div>
            <div className="space-y-1">
              {txs.map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 bg-[#272636] mt-1"
                >
                  <span className="text-xl">{getCategoryIcon(tx.category)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-base leading-5 truncate">
                      {tx.description || tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                      <span className="capitalize">{tx.category}</span>
                      <span className="opacity-60">•</span>
                      <span>Cash</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end min-w-[84px]">
                    {tx.type === "income" ? (
                      <span className="font-medium text-blue-400">+{formatCurrency(tx.amount)}</span>
                    ) : (
                      <span className="font-medium text-red-400">-{formatCurrency(tx.amount)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
