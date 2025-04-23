
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";

// New color palette from provided image
const BAR_COLORS = {
  income: "#6DF002",     // bright mint green
  expense: "#EA7369",    // coral
  savings: "#142459"     // deep navy blue
};

interface IncomeExpenseChartProps {
  transactions: Transaction[];
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  // Group transactions by month
  const groupedByMonth = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        income: 0,
        expense: 0,
      };
    }
    
    if (transaction.type === 'income') {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expense += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, { income: number; expense: number; savings?: number }>);
  
  // Calculate savings for each month
  Object.keys(groupedByMonth).forEach(month => {
    groupedByMonth[month].savings = 
      groupedByMonth[month].income - groupedByMonth[month].expense;
  });
  
  // Convert to array and sort by date
  const chartData = Object.entries(groupedByMonth)
    .map(([month, data]) => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(monthNum) - 1];
      
      return {
        month: `${monthName} ${year}`,
        income: data.income,
        expense: data.expense,
        savings: data.savings || 0,
      };
    })
    .sort((a, b) => {
      // Sort by date (oldest first)
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-1">
            <p>
              <span className="inline-block w-3 h-3" style={{backgroundColor: BAR_COLORS.income}}></span>
              <span className="font-medium">Income:</span> {formatCurrency(payload[0].value)}
            </p>
            <p>
              <span className="inline-block w-3 h-3" style={{backgroundColor: BAR_COLORS.expense}}></span>
              <span className="font-medium">Expense:</span> {formatCurrency(payload[1].value)}
            </p>
            <p>
              <span className="inline-block w-3 h-3" style={{backgroundColor: BAR_COLORS.savings}}></span>
              <span className="font-medium">Savings:</span> {formatCurrency(payload[2].value)}
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
        <CardTitle>Monthly Income & Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `₹${value}`} 
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" name="Income" fill={BAR_COLORS.income} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill={BAR_COLORS.expense} radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Savings" fill={BAR_COLORS.savings} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No transaction data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
