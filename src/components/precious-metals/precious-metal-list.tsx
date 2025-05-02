
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
import { Badge } from "@/components/ui/badge";
import { PreciousMetal } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PreciousMetalListProps {
  metals: PreciousMetal[];
}

const getCurrentPrices = () => {
  // In a real app, this would be an API call to get current metal prices
  return {
    gold: {
      gram: 6500, // Price in INR per gram
      ounce: 200000, // Price in INR per ounce
      kg: 6500000, // Price in INR per kg
    },
    silver: {
      gram: 80, // Price in INR per gram
      ounce: 2300, // Price in INR per ounce
      kg: 80000, // Price in INR per kg
    }
  };
};

export function PreciousMetalList({ metals }: PreciousMetalListProps) {
  const [currentPrices, setCurrentPrices] = useState(getCurrentPrices());
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  // Simulate fetching current prices
  useEffect(() => {
    setLoading(true);
    // In a real app, you would fetch the current prices from an API
    const timer = setTimeout(() => {
      setCurrentPrices(getCurrentPrices());
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const calculateCurrentValue = (metal: PreciousMetal) => {
    return metal.quantity * currentPrices[metal.type][metal.unit];
  };

  const calculateProfit = (metal: PreciousMetal) => {
    const currentValue = calculateCurrentValue(metal);
    const purchaseValue = metal.quantity * metal.purchasePricePerUnit;
    return currentValue - purchaseValue;
  };

  const calculateProfitPercentage = (metal: PreciousMetal) => {
    const currentValue = calculateCurrentValue(metal);
    const purchaseValue = metal.quantity * metal.purchasePricePerUnit;
    return ((currentValue - purchaseValue) / purchaseValue) * 100;
  };

  // Mobile rendering for precious metals
  const renderMobileMetals = () => {
    return metals.length > 0 ? (
      <div className="space-y-4">
        {metals.map((metal) => {
          const profit = calculateProfit(metal);
          const profitPercentage = calculateProfitPercentage(metal);
          const isProfit = profit >= 0;
          
          return (
            <Card key={metal.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <Badge variant={metal.type === "gold" ? "default" : "outline"}>
                    {metal.type.charAt(0).toUpperCase() + metal.type.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(metal.purchaseDate)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">
                      {metal.quantity} {metal.unit}{metal.quantity > 1 ? "s" : ""}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Price</p>
                    <p className="font-medium">
                      {formatCurrency(metal.purchasePricePerUnit)}/{metal.unit}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="font-medium">
                      {formatCurrency(currentPrices[metal.type][metal.unit])}/{metal.unit}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="font-medium">
                      {formatCurrency(calculateCurrentValue(metal))}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground">Profit/Loss</p>
                  <p className={`font-medium ${isProfit ? "text-income" : "text-expense"}`}>
                    {isProfit ? "+" : ""}
                    {formatCurrency(profit)} 
                    <span className="text-xs ml-1">
                      ({isProfit ? "+" : ""}{profitPercentage.toFixed(2)}%)
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-6 text-muted-foreground">
        No precious metals found
      </div>
    );
  };

  // Desktop table rendering
  const renderDesktopTable = () => {
    return (
      <div className="rounded-md border">
        <div className="responsive-table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead className="text-right">Purchase Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metals.length > 0 ? (
                metals.map((metal) => {
                  const profit = calculateProfit(metal);
                  const profitPercentage = calculateProfitPercentage(metal);
                  const isProfit = profit >= 0;
                  
                  return (
                    <TableRow key={metal.id}>
                      <TableCell>
                        <Badge variant={metal.type === "gold" ? "default" : "outline"}>
                          {metal.type.charAt(0).toUpperCase() + metal.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {metal.quantity} {metal.unit}
                        {metal.quantity > 1 ? "s" : ""}
                      </TableCell>
                      <TableCell>{formatDate(metal.purchaseDate)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(metal.purchasePricePerUnit)} per {metal.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(currentPrices[metal.type][metal.unit])} per {metal.unit}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(calculateCurrentValue(metal))}
                      </TableCell>
                      <TableCell 
                        className={`text-right font-medium ${
                          isProfit ? "text-income" : "text-expense"
                        }`}
                      >
                        {isProfit ? "+" : ""}
                        {formatCurrency(profit)} 
                        <span className="text-xs ml-1">
                          ({isProfit ? "+" : ""}{profitPercentage.toFixed(2)}%)
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No precious metals found
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
        <CardTitle>Your Precious Metals</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading current prices...</div>
        ) : isMobile ? (
          renderMobileMetals()
        ) : (
          renderDesktopTable()
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p className="font-medium">Current Market Prices:</p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p>Gold:</p>
              <ul className="list-disc list-inside ml-2">
                <li>{formatCurrency(currentPrices.gold.gram)} per gram</li>
                <li>{formatCurrency(currentPrices.gold.ounce)} per ounce</li>
              </ul>
            </div>
            <div>
              <p>Silver:</p>
              <ul className="list-disc list-inside ml-2">
                <li>{formatCurrency(currentPrices.silver.gram)} per gram</li>
                <li>{formatCurrency(currentPrices.silver.ounce)} per ounce</li>
              </ul>
            </div>
          </div>
          <p className="mt-2 italic">* Prices updated for demonstration purposes only</p>
        </div>
      </CardContent>
    </Card>
  );
}
