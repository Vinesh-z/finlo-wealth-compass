
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
import { FixedDeposit } from "@/types";
import { formatCurrency, formatDate, formatPercent } from "@/utils/format";

interface FixedDepositListProps {
  deposits: FixedDeposit[];
}

export function FixedDepositList({ deposits }: FixedDepositListProps) {
  const calculateMaturityAmount = (deposit: FixedDeposit) => {
    const principal = deposit.principalAmount;
    const rate = deposit.interestRate / 100;
    const timeInYears = 
      (deposit.maturityDate.getTime() - deposit.startDate.getTime()) / 
      (365 * 24 * 60 * 60 * 1000);
    
    return principal * Math.pow(1 + rate, timeInYears);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Fixed Deposits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Interest Rate</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Maturity Date</TableHead>
                <TableHead className="text-right">Maturity Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.length > 0 ? (
                deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="font-medium">{deposit.name}</TableCell>
                    <TableCell>{deposit.bankName || '-'}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(deposit.principalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercent(deposit.interestRate / 100)}
                    </TableCell>
                    <TableCell>{formatDate(deposit.startDate)}</TableCell>
                    <TableCell>{formatDate(deposit.maturityDate)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(calculateMaturityAmount(deposit))}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No fixed deposits found
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
