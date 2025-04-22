
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Investment, FixedDeposit, ProvidentFund, PreciousMetal } from "@/types";
import { formatCurrency, formatPercent } from "@/utils/format";
import { calculateTotalPortfolioValue, calculateTotalGainLoss } from "@/utils/calculations";

interface InvestmentSummaryProps {
  investments: Investment[];
  fixedDeposits?: FixedDeposit[];
  providentFunds?: ProvidentFund[];
  preciousMetals?: PreciousMetal[];
}

export function InvestmentSummary({ 
  investments, 
  fixedDeposits = [], 
  providentFunds = [], 
  preciousMetals = [] 
}: InvestmentSummaryProps) {
  // Calculate fixed deposits value
  const totalFixedDepositsValue = fixedDeposits.reduce((total, deposit) => {
    const principal = deposit.principalAmount;
    const rate = deposit.interestRate / 100;
    const timeInYears = 
      (deposit.maturityDate.getTime() - deposit.startDate.getTime()) / 
      (365 * 24 * 60 * 60 * 1000);
    const maturityValue = principal * Math.pow(1 + rate, timeInYears);
    return total + maturityValue;
  }, 0);

  // Calculate provident funds value
  const totalProvidentFundsValue = providentFunds.reduce(
    (total, fund) => total + fund.currentBalance, 
    0
  );

  // Calculate precious metals value
  const totalPreciousMetalsValue = preciousMetals.reduce(
    (total, metal) => total + (metal.quantity * metal.purchasePricePerUnit), 
    0
  );

  // Calculate general investments value
  const totalInvestmentsValue = calculateTotalPortfolioValue(investments);
  
  // Calculate total portfolio value across all asset types
  const totalPortfolioValue = totalInvestmentsValue + totalFixedDepositsValue + 
    totalProvidentFundsValue + totalPreciousMetalsValue;
  
  // Calculate initial values and gains/losses
  const totalInitialValue = investments.reduce(
    (total, investment) => total + investment.initialValue, 
    0
  );
  const totalGainLoss = calculateTotalGainLoss(investments);
  const overallROI = totalInitialValue > 0
    ? totalGainLoss / totalInitialValue 
    : 0;
  
  const isProfit = totalGainLoss >= 0;

  // Count assets by type (including all investment types)
  const assetsByType = [...investments, ...fixedDeposits.map(fd => ({
    type: 'fixed_deposit',
    currentValue: calculateMaturityValue(fd)
  })), ...providentFunds.map(pf => ({
    type: 'provident_fund',
    currentValue: pf.currentBalance
  })), ...preciousMetals.map(pm => ({
    type: 'precious_metal',
    currentValue: pm.quantity * pm.purchasePricePerUnit
  }))].reduce((acc, investment) => {
    acc[investment.type] = (acc[investment.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Value by type (including all investment types)
  const valueByType = [...investments, ...fixedDeposits.map(fd => ({
    type: 'fixed_deposit',
    currentValue: calculateMaturityValue(fd)
  })), ...providentFunds.map(pf => ({
    type: 'provident_fund',
    currentValue: pf.currentBalance
  })), ...preciousMetals.map(pm => ({
    type: 'precious_metal',
    currentValue: pm.quantity * pm.purchasePricePerUnit
  }))].reduce((acc, investment) => {
    acc[investment.type] = (acc[investment.type] || 0) + investment.currentValue;
    return acc;
  }, {} as Record<string, number>);

  // Helper function for calculating fixed deposit maturity value
  function calculateMaturityValue(deposit: FixedDeposit): number {
    const principal = deposit.principalAmount;
    const rate = deposit.interestRate / 100;
    const timeInYears = 
      (deposit.maturityDate.getTime() - deposit.startDate.getTime()) / 
      (365 * 24 * 60 * 60 * 1000);
    
    return principal * Math.pow(1 + rate, timeInYears);
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Asset Values by Type</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Asset Type</span>
                <span className="font-medium">Value</span>
              </div>
              
              {totalInvestmentsValue > 0 && (
                <div className="flex justify-between">
                  <span>General Investments</span>
                  <span className="font-medium">{formatCurrency(totalInvestmentsValue)}</span>
                </div>
              )}
              
              {totalFixedDepositsValue > 0 && (
                <div className="flex justify-between">
                  <span>Fixed Deposits</span>
                  <span className="font-medium">{formatCurrency(totalFixedDepositsValue)}</span>
                </div>
              )}
              
              {totalProvidentFundsValue > 0 && (
                <div className="flex justify-between">
                  <span>Provident Funds</span>
                  <span className="font-medium">{formatCurrency(totalProvidentFundsValue)}</span>
                </div>
              )}
              
              {totalPreciousMetalsValue > 0 && (
                <div className="flex justify-between">
                  <span>Precious Metals</span>
                  <span className="font-medium">{formatCurrency(totalPreciousMetalsValue)}</span>
                </div>
              )}
              
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Total</span>
                <span className="font-medium">{formatCurrency(totalPortfolioValue)}</span>
              </div>
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
        </div>
      </CardContent>
    </Card>
  );
}
