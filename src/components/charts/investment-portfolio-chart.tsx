
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Investment } from "@/types";
import { formatCurrency, formatPercent } from "@/utils/format";

interface InvestmentPortfolioChartProps {
  investments: Investment[];
}

export function InvestmentPortfolioChart({ investments }: InvestmentPortfolioChartProps) {
  // Group investments by type
  const portfolioByType = investments.reduce((acc, investment) => {
    if (!acc[investment.type]) {
      acc[investment.type] = 0;
    }
    acc[investment.type] += investment.currentValue;
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to array for chart
  const data = Object.entries(portfolioByType)
    .map(([type, value]) => ({
      name: type.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      value,
    }))
    .filter(item => item.value > 0) // Remove zero-value types
    .sort((a, b) => b.value - a.value); // Sort by value, descending

  // Calculate total portfolio value
  const totalPortfolioValue = investments.reduce(
    (total, investment) => total + investment.currentValue, 
    0
  );

  // Custom colors
  const COLORS = [
    "#3b82f6", // Blue (Primary)
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#d946ef", // Fuchsia
    "#ec4899", // Pink
    "#f43f5e", // Rose
    "#ef4444", // Red
    "#f97316", // Orange
    "#f59e0b", // Amber
    "#84cc16", // Lime
    "#10b981", // Emerald
    "#06b6d4", // Cyan
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalPortfolioValue) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 rounded-md shadow-md border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-investment font-semibold">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-muted-foreground">{percentage}% of portfolio</p>
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
