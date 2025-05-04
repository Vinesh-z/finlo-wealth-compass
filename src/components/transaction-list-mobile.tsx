
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";
import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          <Card key={i} className="bg-primary/5 dark:bg-zinc-900/50 rounded-2xl p-6 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  if (groupKeys.length === 0) {
    return (
      <Card className="rounded-2xl p-8 text-center">
        <div className="text-center text-muted-foreground py-4 text-lg font-medium">
          No transactions found
        </div>
      </Card>
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
            {/* Date header with modern design */}
            <div className="flex items-center mb-3">
              <div className="
                flex flex-col items-center justify-center
                w-16 h-16 p-2 rounded-xl shadow-sm
                mr-3 bg-white dark:bg-zinc-800
                border border-primary/10 dark:border-zinc-700
              ">
                <span className="text-2xl font-bold text-primary">{dayNum}</span>
                <span className="text-xs uppercase font-medium text-neutral-500 dark:text-neutral-400 leading-tight">{monthName}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  weekDayName === "Sun" || weekDayName === "Sat" 
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                    : "bg-neutral-100 text-neutral-500 dark:bg-zinc-700 dark:text-zinc-300"
                }`}>
                  {weekDayName}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1 items-center">
                    <span className="text-sm font-medium text-primary dark:text-primary-foreground">
                      {income ? "+ " + formatCurrency(income) : "+ ₹0.00"}
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                      {expense ? "- " + formatCurrency(expense) : "- ₹0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions list with modern design */}
            <div className="space-y-3">
              {txs.map(tx => (
                <Card
                  key={tx.id}
                  className={`
                    overflow-hidden rounded-xl border shadow-sm
                    ${tx.type === 'income' ? 'bg-primary/5 dark:bg-primary/10 border-primary/20' : 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-800/30'}
                  `}
                >
                  <div className="p-3 flex items-center gap-3">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full 
                      ${tx.type === 'income' ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground' : 
                        'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}
                    `}>
                      <span className="text-lg">{getCategoryIcon(tx.category)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-zinc-900 dark:text-white text-[16px] leading-5 truncate">
                        {tx.description || tx.category.charAt(0).toUpperCase() + tx.category.slice(1).replace('_', ' ')}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-1 mt-0.5">
                        <span className="capitalize">{tx.category.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end min-w-[84px]">
                      {tx.type === "income" ? (
                        <span className="font-medium text-primary dark:text-primary-foreground">+{formatCurrency(tx.amount)}</span>
                      ) : (
                        <span className="font-medium text-rose-600 dark:text-rose-400">-{formatCurrency(tx.amount)}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons row */}
                  <div className={`
                    flex border-t text-sm
                    ${tx.type === 'income' ? 'border-primary/10 dark:border-primary/20' : 'border-rose-200 dark:border-rose-800/30'}
                  `}>
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(tx)}
                        className="flex-1 py-2 px-2 flex items-center justify-center gap-1 hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                    
                    {onEdit && onDelete && (
                      <div className="w-px bg-neutral-200 dark:bg-zinc-700" />
                    )}
                    
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(tx.id)}
                        className="flex-1 py-2 px-2 flex items-center justify-center gap-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
