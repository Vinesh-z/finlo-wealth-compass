
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Investment } from "@/types";
import { formatCurrency } from "@/utils/format";
import { FixedDeposit, ProvidentFund, PreciousMetal } from "@/types";

// Add new properties for all asset types
interface InvestmentPortfolioChartProps {
  investments: Investment[];
  fixedDeposits?: FixedDeposit[];
  providentFunds?: ProvidentFund[];
  preciousMetals?: PreciousMetal[];
}

export function InvestmentPortfolioChart({ 
  investments, 
  fixedDeposits = [],
  providentFunds = [],
  preciousMetals = []
}: InvestmentPortfolioChartProps) {
  // Helper: fixed deposits maturity value
  const getFDMaturity = (deposit: FixedDeposit) => {
    const principal = deposit.principalAmount;
    const rate = deposit.interestRate / 100;
    const timeInYears = 
      (deposit.maturityDate.getTime() - deposit.startDate.getTime()) / 
      (365 * 24 * 60 * 60 * 1000);
    return principal * Math.pow(1 + rate, timeInYears);
  };

  // Helper: total provident fund value
  const getPFValue = (fund: ProvidentFund) => fund.currentBalance;

  // Helper: total precious metals value
  const getPMValue = (metal: PreciousMetal) => metal.quantity * metal.purchasePricePerUnit;

  // Group and sum values for each asset category for the chart
  const assetTypes = [
    {
      label: "General Investments",
      value: investments.reduce((acc, i) => acc + i.currentValue, 0),
    },
    {
      label: "Fixed Deposits",
      value: fixedDeposits.reduce((acc, fd) => acc + getFDMaturity(fd), 0),
    },
    {
      label: "Provident Funds",
      value: providentFunds.reduce((acc, pf) => acc + getPFValue(pf), 0),
    },
    {
      label: "Precious Metals",
      value: preciousMetals.reduce((acc, pm) => acc + getPMValue(pm), 0),
    },
  ];

  // Filter to non-zero for cleanliness
  const data = assetTypes.filter(asset => asset.value > 0);

  // Calculate total to show percent
  const totalPortfolioValue = data.reduce((acc, item) => acc + item.value, 0);

  // Use the new palette (first row in your image)
  const COLORS = [
    "#142459", // General Investments (Blue Navy)
    "#176BA0", // Fixed Deposits (Blue)
    "#19AADE", // Provident Fund (Sky Blue)
    "#1AC9E6", // Precious Metals (Cyan)
  ];

  // Custom tooltip using INR style
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percent = ((value / totalPortfolioValue) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-md shadow-md border">
          <p className="font-medium">{name}</p>
          <p className="text-investment font-semibold">{formatCurrency(value)}</p>
          <p className="text-sm text-muted-foreground">{percent}% of portfolio</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="label"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No investment data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
