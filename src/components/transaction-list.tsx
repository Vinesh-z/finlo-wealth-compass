
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export function TransactionList({ 
  transactions, 
  isLoading = false,
  onEdit,
  onDelete
}: TransactionListProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-none shadow-md">
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/70 hover:bg-secondary/70">
                <TableHead className="font-semibold text-foreground/80">Date</TableHead>
                <TableHead className="font-semibold text-foreground/80">Description</TableHead>
                <TableHead className="font-semibold text-foreground/80">Category</TableHead>
                <TableHead className="text-right font-semibold text-foreground/80">Amount</TableHead>
                {(onEdit || onDelete) && <TableHead className="w-[100px] font-semibold text-foreground/80">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-border/30 hover:bg-secondary/20 transition-all duration-200">
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  {(onEdit || onDelete) && (
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/70 hover:bg-secondary/70">
              <TableHead className="font-semibold text-foreground/80">Date</TableHead>
              <TableHead className="font-semibold text-foreground/80">Description</TableHead>
              <TableHead className="font-semibold text-foreground/80">Category</TableHead>
              <TableHead className="text-right font-semibold text-foreground/80">Amount</TableHead>
              {(onEdit || onDelete) && <TableHead className="w-[100px] font-semibold text-foreground/80">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                const isIncome = transaction.type === "income";
                
                return (
                  <TableRow 
                    key={transaction.id} 
                    className="border-b border-border/30 hover:bg-secondary/20 transition-all duration-200"
                  >
                    <TableCell className="text-sm font-medium">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="text-sm">
                      {transaction.description || '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        isIncome ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 
                        'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
                      }`}>
                        {transaction.category.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell 
                      className={`text-right font-semibold text-sm ${
                        isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    {(onEdit || onDelete) && (
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(transaction)}
                              title="Edit"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(transaction.id)}
                              className="h-8 w-8 text-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={(onEdit || onDelete) ? 5 : 4} 
                  className="text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-secondary/50 p-3 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <p>No transactions found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
