
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";
import { useMemo } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Pencil, Trash2 } from "lucide-react";

type TransactionListMobileProps = {
  transactions: Transaction[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
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
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function TransactionListMobile({ 
  transactions = [], 
  isLoading = false, 
  onDelete, 
  onEdit 
}: TransactionListMobileProps) {
  const grouped = useMemo(() => groupByDate(transactions), [transactions]);
  const groupKeys = Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-neutral-200 dark:bg-zinc-900 rounded-2xl p-6 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  if (groupKeys.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 text-lg font-medium">
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupKeys.map(dateKey => {
        const txs = grouped[dateKey];
        const dateObj = new Date(dateKey + "T00:00:00");
        const dayNum = dateObj.getDate();
        const weekDayName = DAY_OF_WEEK[dateObj.getDay()];
        const monthName = MONTHS[dateObj.getMonth()];
        // Count sums for income/expense in group
        const income = txs.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0);
        const expense = txs.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);

        return (
          <div key={dateKey}>
            {/* Date header row */}
            <div className="flex items-center mb-3">
              {/* Modern date display */}
              <div className="
                flex flex-col items-center justify-center
                p-2 w-14 rounded-xl border border-neutral-200/80 dark:border-zinc-800 
                bg-white dark:bg-zinc-900 shadow-sm
                mr-3
              ">
                <span className="text-xl font-bold text-primary">{dayNum}</span>
                <span className="text-xs uppercase font-medium text-gray-500 dark:text-gray-300 leading-tight">{monthName}</span>
                <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                  weekDayName === "Sun" ? "bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-300"
                  : weekDayName === "Sat" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
                  : "bg-neutral-100 text-neutral-500 dark:bg-zinc-700 dark:text-zinc-200"
                }`}>
                  {weekDayName}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:gap-4">
                  <div className="flex gap-1 items-center">
                    <span className="text-sm font-medium text-blue-500">
                      {income ? "+ " + formatCurrency(income) : "+ ₹0.00"}
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-sm font-medium text-red-500">
                      {expense ? "- " + formatCurrency(expense) : "- ₹0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {txs.map(tx => (
                <ContextMenu key={tx.id}>
                  <ContextMenuTrigger>
                    <div
                      className={`
                        flex items-center gap-3 rounded-2xl p-4 mt-0
                        bg-white dark:bg-[#272636] border border-neutral-200 dark:border-zinc-800 shadow-sm
                      `}
                    >
                      <span className="text-2xl min-w-[36px] text-center">{getCategoryIcon(tx.category)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-zinc-900 dark:text-white text-[16px] leading-5 truncate">
                          {tx.description || tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                          <span className="capitalize">{tx.category}</span>
                          <span className="opacity-50">•</span>
                          <span>Cash</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end min-w-[84px]">
                        {tx.type === "income" ? (
                          <span className="font-medium text-blue-500">+{formatCurrency(tx.amount)}</span>
                        ) : (
                          <span className="font-medium text-red-500">-{formatCurrency(tx.amount)}</span>
                        )}
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    {onEdit && (
                      <ContextMenuItem onClick={() => onEdit(tx)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit Transaction</span>
                      </ContextMenuItem>
                    )}
                    {onDelete && (
                      <ContextMenuItem onClick={() => onDelete(tx.id)} className="cursor-pointer text-red-500 dark:text-red-400">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Transaction</span>
                      </ContextMenuItem>
                    )}
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
