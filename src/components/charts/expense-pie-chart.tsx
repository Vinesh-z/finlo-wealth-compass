import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionCategory } from "@/types";
import { formatCurrency } from "@/utils/format";
import { calculateCategoryTotal } from "@/utils/calculations";

interface ExpensePieChartProps {
  transactions: Transaction[];
}

export function ExpensePieChart({ transactions }: ExpensePieChartProps) {
  // Get all expense categories
  const expenseCategories = Array.from(
    new Set(
      transactions
        .filter(t => t.type === "expense")
        .map(t => t.category)
    )
  );

  // Calculate total for each category
  const data = expenseCategories.map(category => {
    const total = calculateCategoryTotal(transactions, category, "expense");
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: total,
    };
  }).filter(item => item.value > 0) // Remove zero-value categories
    .sort((a, b) => b.value - a.value); // Sort by value, descending

  // Aesthetic color palette for expense categories
  const COLORS = [
    "#8B5CF6",  // Vivid Purple
    "#D946EF",  // Magenta Pink
    "#F97316",  // Bright Orange
    "#0EA5E9",  // Ocean Blue
    "#06b6d4",  // Cyan
    "#10b981",  // Emerald
    "#84cc16",  // Lime Green
    "#f59e0b",  // Amber
    "#ec4899",  // Pink
    "#f43f5e",  // Rose
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-expense font-semibold">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-muted-foreground">
            {((payload[0].value / data.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
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
            No expense data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
