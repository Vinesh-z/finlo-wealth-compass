
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
import { useIsMobile } from "@/hooks/use-mobile";

interface ProvidentFundListProps {
  funds: ProvidentFund[];
}

export function ProvidentFundList({ funds }: ProvidentFundListProps) {
  const isMobile = useIsMobile();

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

  // Mobile version for displaying funds
  const renderMobileFunds = () => {
    return funds.length > 0 ? (
      <div className="space-y-4">
        {funds.map((fund) => {
          const futureValues = calculateFutureValues(fund);
          
          return (
            <Card key={fund.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="font-semibold text-lg mb-2">{fund.name}</div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Years Active</p>
                    <p className="font-medium">{yearsActive(fund.startDate)} years</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="font-medium">{formatPercent(fund.interestRate / 100)}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="font-semibold text-lg">{formatCurrency(fund.currentBalance)}</p>
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2">Future Projections</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">1 Year</p>
                      <p className="text-sm font-medium">{formatCurrency(futureValues.oneYear)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">5 Years</p>
                      <p className="text-sm font-medium">{formatCurrency(futureValues.fiveYears)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">10 Years</p>
                      <p className="text-sm font-medium">{formatCurrency(futureValues.tenYears)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    ) : (
      <Card>
        <CardContent className="text-center py-6 text-muted-foreground">
          No provident funds found
        </CardContent>
      </Card>
    );
  };

  // Desktop version with table
  const renderDesktopTable = () => {
    return (
      <div className="rounded-md border">
        <div className="responsive-table-container">
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
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Provident Funds</CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? renderMobileFunds() : renderDesktopTable()}
      </CardContent>
    </Card>
  );
}
