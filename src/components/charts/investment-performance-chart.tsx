
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
import { useIsMobile } from "@/hooks/use-mobile";

// Palette using blue rows for lines and legend
const LINES = [
  { key: "initialValue", color: "#142459" }, // navy blue
  { key: "currentValue", color: "#19AADE" }, // sky blue
  { key: "roi", color: "#6DF002" } // mint green
];

interface InvestmentPerformanceChartProps {
  investments: Investment[];
}

export function InvestmentPerformanceChart({ investments }: InvestmentPerformanceChartProps) {
  const isMobile = useIsMobile();

  // Sort investments by ROI
  const sortedInvestments = [...investments]
    .sort((a, b) => {
      const roiA = calculateROI(a);
      const roiB = calculateROI(b);
      return roiB - roiA;
    })
    .slice(0, isMobile ? 5 : 10); // Show fewer items on mobile
  
  // Prepare data for chart
  const data = sortedInvestments.map(investment => {
    const roi = calculateROI(investment);
    return {
      name: investment.name.length > (isMobile ? 10 : 15)
        ? investment.name.substring(0, isMobile ? 10 : 15) + "..." 
        : investment.name,
      initialValue: investment.initialValue,
      currentValue: investment.currentValue,
      roi: roi * 100, // percent
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
              <span className="inline-block w-3 h-3" style={{backgroundColor: "#142459"}}></span>
              <span className="font-medium">Initial:</span> {formatCurrency(payload[0].value)}
            </p>
            <p>
              <span className="inline-block w-3 h-3" style={{backgroundColor: "#19AADE"}}></span>
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
          <div className={`${isMobile ? 'h-[300px] mobile-chart-container' : 'h-[350px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ 
                  top: 5, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 10 : 20, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: isMobile ? 10 : 12 }} 
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 60 : 30}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  tickFormatter={(value) => isMobile ? value.toLocaleString() : formatCurrency(value)}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 60 : 80}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 40 : 50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="initialValue" 
                  name="Initial Value" 
                  stroke="#142459" 
                  strokeWidth={2} 
                  dot={{ strokeWidth: isMobile ? 1 : 2, r: isMobile ? 3 : 4 }} 
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="currentValue" 
                  name="Current Value" 
                  stroke="#19AADE" 
                  strokeWidth={2} 
                  dot={{ strokeWidth: isMobile ? 1 : 2, r: isMobile ? 3 : 4 }} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="roi" 
                  name="ROI (%)" 
                  stroke="#6DF002" 
                  strokeWidth={2} 
                  dot={{ strokeWidth: isMobile ? 1 : 2, r: isMobile ? 3 : 4 }} 
                />
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
