
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Investment, FixedDeposit, ProvidentFund, PreciousMetal, Insurance } from "@/types";
import { InvestmentForm } from "@/components/investment-form";
import { InvestmentList } from "@/components/investment-list";
import { InvestmentSummary } from "@/components/investment-summary";
import { InvestmentPortfolioChart } from "@/components/charts/investment-portfolio-chart";
import { InvestmentPerformanceChart } from "@/components/charts/investment-performance-chart";
import { FixedDepositForm } from "@/components/fixed-deposits/fixed-deposit-form";
import { FixedDepositList } from "@/components/fixed-deposits/fixed-deposit-list";

function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);

  const handleAddInvestment = (investment: Omit<Investment, "id">) => {
    const newInvestment: Investment = {
      id: Math.random().toString(36).substring(2, 11),
      ...investment,
    };
    setInvestments([newInvestment, ...investments]);
  };

  const handleAddFixedDeposit = (deposit: Omit<FixedDeposit, "id">) => {
    const newDeposit: FixedDeposit = {
      id: Math.random().toString(36).substring(2, 11),
      ...deposit,
    };
    setFixedDeposits([newDeposit, ...fixedDeposits]);
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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General Investments</TabsTrigger>
          <TabsTrigger value="fixed-deposits">Fixed Deposits</TabsTrigger>
          <TabsTrigger value="provident-fund">Provident Fund</TabsTrigger>
          <TabsTrigger value="precious-metals">Precious Metals</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <InvestmentForm onAddInvestment={handleAddInvestment} />
            </div>
            <div className="md:col-span-2">
              <InvestmentList investments={investments} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fixed-deposits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <FixedDepositForm onAddDeposit={handleAddFixedDeposit} />
            </div>
            <div className="md:col-span-2">
              <FixedDepositList deposits={fixedDeposits} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="provident-fund">
          <div className="text-center py-8 text-muted-foreground">
            Provident Fund tracking coming soon...
          </div>
        </TabsContent>

        <TabsContent value="precious-metals">
          <div className="text-center py-8 text-muted-foreground">
            Precious Metals tracking coming soon...
          </div>
        </TabsContent>

        <TabsContent value="insurance">
          <div className="text-center py-8 text-muted-foreground">
            Insurance management coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Investments;
