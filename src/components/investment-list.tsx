
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Investment } from "@/types";
import { formatCurrency, formatDate, formatPercent } from "@/utils/format";
import { calculateROI } from "@/utils/calculations";
import { Edit, Trash2 } from "lucide-react";
import { useInvestmentActions } from "@/hooks/useInvestmentActions";

interface InvestmentListProps {
  investments: Investment[];
  onInvestmentDeleted: (id: string) => void;
  onInvestmentUpdated: (investment: Investment) => void;
}

export function InvestmentList({ investments, onInvestmentDeleted, onInvestmentUpdated }: InvestmentListProps) {
  const { handleDelete } = useInvestmentActions();

  // Sort by current value (highest first)
  const sortedInvestments = [...investments].sort(
    (a, b) => b.currentValue - a.currentValue
  );

  const onDelete = async (id: string) => {
    const success = await handleDelete(id);
    if (success) {
      onInvestmentDeleted(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead className="text-right">Initial Value</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvestments.length > 0 ? (
                sortedInvestments.map((investment) => {
                  const roi = calculateROI(investment);
                  const gainLoss = investment.currentValue - investment.initialValue;
                  const isProfit = gainLoss >= 0;

                  return (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.name}</TableCell>
                      <TableCell className="capitalize">
                        {investment.type.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </TableCell>
                      <TableCell>{formatDate(new Date(investment.purchaseDate))}</TableCell>
                      <TableCell className="text-right">{formatCurrency(investment.initialValue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(investment.currentValue)}</TableCell>
                      <TableCell 
                        className={`text-right font-medium ${
                          isProfit ? "text-income" : "text-expense"
                        }`}
                      >
                        {isProfit ? "+" : ""}
                        {formatCurrency(gainLoss)}
                      </TableCell>
                      <TableCell 
                        className={`text-right font-medium ${
                          isProfit ? "text-income" : "text-expense"
                        }`}
                      >
                        {formatPercent(roi)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {/* TODO: Implement edit dialog */}}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Investment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this investment? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(investment.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No investments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
