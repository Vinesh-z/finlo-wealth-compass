
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
import { Investment } from "@/types";
import { formatCurrency, formatDate, formatPercent } from "@/utils/format";
import { calculateROI } from "@/utils/calculations";

interface InvestmentListProps {
  investments: Investment[];
}

export function InvestmentList({ investments }: InvestmentListProps) {
  // Sort by current value (highest first)
  const sortedInvestments = [...investments].sort(
    (a, b) => b.currentValue - a.currentValue
  );

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
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
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
