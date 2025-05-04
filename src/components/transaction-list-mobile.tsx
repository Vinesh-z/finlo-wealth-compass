import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";
import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

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
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-primary/5 dark:bg-zinc-900/50 rounded-xl p-4 animate-pulse h-16" />
        ))}
      </div>
    );
  }

  if (groupKeys.length === 0) {
    return (
      <Card className="rounded-xl p-6 text-center">
        <div className="text-center text-muted-foreground py-2 text-base font-medium">
          No transactions found
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
            {/* Date header with compact design */}
            <div className="flex items-center mb-2">
              <div className="
                flex flex-col items-center justify-center
                w-14 h-14 rounded-lg shadow-sm
                mr-2 bg-white dark:bg-zinc-800
                border border-primary/10 dark:border-zinc-700
              ">
                <span className="text-lg font-bold text-primary">{dayNum}</span>
                <span className="text-xs uppercase font-medium text-neutral-500 dark:text-neutral-400 leading-tight">{monthName}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                  weekDayName === "Sun" || weekDayName === "Sat" 
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                    : "bg-neutral-100 text-neutral-500 dark:bg-zinc-700 dark:text-zinc-300"
                }`}>
                  {weekDayName}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-1 items-center">
                    <span className="text-xs font-medium text-primary dark:text-primary-foreground">
                      {income ? "+ " + formatCurrency(income) : "+ ₹0.00"}
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      {expense ? "- " + formatCurrency(expense) : "- ₹0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions list with compact design */}
            <div className="space-y-2">
              {txs.map(tx => (
                <Card
                  key={tx.id}
                  className={`
                    overflow-hidden rounded-lg border shadow-sm
                    ${tx.type === 'income' ? 'bg-primary/5 dark:bg-primary/10 border-primary/20' : 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-800/30'}
                  `}
                >
                  <div className="p-2 flex items-center gap-2">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full 
                      ${tx.type === 'income' ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground' : 
                        'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}
                    `}>
                      <span className="text-base">{getCategoryIcon(tx.category)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-zinc-900 dark:text-white text-sm leading-tight truncate">
                        {tx.description || tx.category.charAt(0).toUpperCase() + tx.category.slice(1).replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-zinc-600 dark:text-zinc-300 flex items-center gap-1 mt-0.5">
                        <span className="capitalize">{tx.category.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end min-w-[70px]">
                      {tx.type === "income" ? (
                        <span className="font-medium text-xs text-primary dark:text-primary-foreground">+{formatCurrency(tx.amount)}</span>
                      ) : (
                        <span className="font-medium text-xs text-rose-600 dark:text-rose-400">-{formatCurrency(tx.amount)}</span>
                      )}
                      
                      {/* Action icons in the amount column */}
                      <div className="flex items-center gap-2 mt-0.5">
                        {onEdit && (
                          <button 
                            onClick={() => onEdit(tx)}
                            className="p-1 rounded-full hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
                            aria-label="Edit transaction"
                          >
                            <Pencil className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
                          </button>
                        )}
                        
                        {onDelete && (
                          <button 
                            onClick={() => onDelete(tx.id)}
                            className="p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                            aria-label="Delete transaction"
                          >
                            <Trash2 className="h-3 w-3 text-rose-500 dark:text-rose-400" />
                          </button>
                        )}
                      </div>
                    </div>
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
