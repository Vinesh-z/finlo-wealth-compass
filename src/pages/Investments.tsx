
import { useState } from "react";
import { InvestmentForm } from "@/components/investment-form";
import { InvestmentList } from "@/components/investment-list";
import { InvestmentSummary } from "@/components/investment-summary";
import { InvestmentPortfolioChart } from "@/components/charts/investment-portfolio-chart";
import { InvestmentPerformanceChart } from "@/components/charts/investment-performance-chart";
import { Investment, InvestmentType } from "@/types";
import { mockInvestments } from "@/data/mockData";

function Investments() {
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);

  const handleAddInvestment = (investment: {
    name: string;
    type: InvestmentType;
    initialValue: number;
    currentValue: number;
    purchaseDate: Date;
    notes: string;
  }) => {
    const newInvestment: Investment = {
      id: Math.random().toString(36).substring(2, 11),
      ...investment,
    };

    setInvestments([newInvestment, ...investments]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
        <p className="text-muted-foreground">
          Track and manage your investment portfolio
        </p>
      </div>

      <InvestmentSummary investments={investments} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvestmentPortfolioChart investments={investments} />
        <InvestmentPerformanceChart investments={investments} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <InvestmentForm onAddInvestment={handleAddInvestment} />
        </div>
        
        <div className="md:col-span-2">
          <InvestmentList investments={investments} />
        </div>
      </div>
    </div>
  );
}

export default Investments;
