
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProvidentFund } from "@/types";
import { formatCurrency, formatDate, formatPercent } from "@/utils/format";

interface ProvidentFundListProps {
  funds: ProvidentFund[];
}

export function ProvidentFundList({ funds }: ProvidentFundListProps) {
  const calculateFutureValues = (fund: ProvidentFund) => {
    const currentBalance = fund.currentBalance;
    const rate = fund.interestRate / 100;
    
    // Calculate projected values for different time periods
    return {
      oneYear: currentBalance * Math.pow(1 + rate, 1),
      fiveYears: currentBalance * Math.pow(1 + rate, 5),
      tenYears: currentBalance * Math.pow(1 + rate, 10),
    };
  };

  const yearsActive = (startDate: Date) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(startDate).getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25); // More accurate for leap years
    return diffYears.toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Provident Funds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Years Active</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Interest Rate</TableHead>
                <TableHead className="text-right">1Y Projection</TableHead>
                <TableHead className="text-right">5Y Projection</TableHead>
                <TableHead className="text-right">10Y Projection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funds.length > 0 ? (
                funds.map((fund) => {
                  const futureValues = calculateFutureValues(fund);
                  
                  return (
                    <TableRow key={fund.id}>
                      <TableCell className="font-medium">{fund.name}</TableCell>
                      <TableCell>{yearsActive(fund.startDate)} years</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(fund.currentBalance)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercent(fund.interestRate / 100)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(futureValues.oneYear)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(futureValues.fiveYears)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(futureValues.tenYears)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No provident funds found
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
