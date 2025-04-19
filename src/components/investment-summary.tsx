
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Investment } from "@/types";
import { formatCurrency, formatPercent } from "@/utils/format";
import { calculateTotalPortfolioValue, calculateTotalGainLoss } from "@/utils/calculations";

interface InvestmentSummaryProps {
  investments: Investment[];
}

export function InvestmentSummary({ investments }: InvestmentSummaryProps) {
  const totalPortfolioValue = calculateTotalPortfolioValue(investments);
  const totalInitialValue = investments.reduce(
    (total, investment) => total + investment.initialValue, 
    0
  );
  const totalGainLoss = calculateTotalGainLoss(investments);
  const overallROI = totalInitialValue > 0
    ? totalGainLoss / totalInitialValue 
    : 0;
  
  const isProfit = totalGainLoss >= 0;

  // Count assets by type
  const assetsByType = investments.reduce((acc, investment) => {
    acc[investment.type] = (acc[investment.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Value by type
  const valueByType = investments.reduce((acc, investment) => {
    acc[investment.type] = (acc[investment.type] || 0) + investment.currentValue;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            <p className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Initial Investment</p>
            <p className="text-2xl font-bold">{formatCurrency(totalInitialValue)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${isProfit ? "text-income" : "text-expense"}`}>
              {isProfit ? "+" : ""}
              {formatCurrency(totalGainLoss)}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Overall ROI</p>
            <p className={`text-2xl font-bold ${isProfit ? "text-income" : "text-expense"}`}>
              {formatPercent(overallROI)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Portfolio Breakdown</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Assets by Type</h4>
              <div className="space-y-2">
                {Object.entries(assetsByType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="capitalize">
                      {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Value by Type</h4>
              <div className="space-y-2">
                {Object.entries(valueByType).map(([type, value]) => (
                  <div key={type} className="flex justify-between">
                    <span className="capitalize">
                      {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                    <span className="font-medium">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
