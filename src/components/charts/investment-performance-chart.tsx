import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Investment } from "@/types";
import { formatCurrency, formatPercent } from "@/utils/format";
import { calculateROI } from "@/utils/calculations";

interface InvestmentPerformanceChartProps {
  investments: Investment[];
}

export function InvestmentPerformanceChart({ investments }: InvestmentPerformanceChartProps) {
  // Sort investments by ROI
  const sortedInvestments = [...investments]
    .sort((a, b) => {
      const roiA = calculateROI(a);
      const roiB = calculateROI(b);
      return roiB - roiA; // Sort by ROI, descending
    })
    .slice(0, 10); // Take top 10 for readability
  
  // Prepare data for chart
  const data = sortedInvestments.map(investment => {
    const roi = calculateROI(investment);
    return {
      name: investment.name.length > 15 
        ? investment.name.substring(0, 15) + "..." 
        : investment.name,
      initialValue: investment.initialValue,
      currentValue: investment.currentValue,
      roi: roi * 100, // Convert to percentage
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-1">
            <p>
              <span className="inline-block w-3 h-3 bg-[#6b7280] mr-2 rounded-full"></span>
              <span className="font-medium">Initial:</span> {formatCurrency(payload[0].value)}
            </p>
            <p>
              <span className="inline-block w-3 h-3 bg-[#3b82f6] mr-2 rounded-full"></span>
              <span className="font-medium">Current:</span> {formatCurrency(payload[1].value)}
            </p>
            <p>
              <span className="font-medium">ROI:</span>{' '}
              <span className={payload[2].value >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}>
                {formatPercent(payload[2].value / 100)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value}`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="initialValue" name="Initial Value" stroke="#6b7280" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                <Line yAxisId="left" type="monotone" dataKey="currentValue" name="Current Value" stroke="#3b82f6" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI (%)" stroke="#10b981" strokeWidth={2} dot={{ strokeWidth: 2 }} />
              </LineChart>
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
