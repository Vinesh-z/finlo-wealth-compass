
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Investment, 
  FixedDeposit, 
  ProvidentFund, 
  PreciousMetal, 
  Insurance, 
  InsuranceDocument 
} from "@/types";
import { InvestmentForm } from "@/components/investment-form";
import { InvestmentList } from "@/components/investment-list";
import { InvestmentSummary } from "@/components/investment-summary";
import { InvestmentPortfolioChart } from "@/components/charts/investment-portfolio-chart";
import { InvestmentPerformanceChart } from "@/components/charts/investment-performance-chart";
import { FixedDepositForm } from "@/components/fixed-deposits/fixed-deposit-form";
import { FixedDepositList } from "@/components/fixed-deposits/fixed-deposit-list";
import { ProvidentFundForm } from "@/components/provident-funds/provident-fund-form";
import { ProvidentFundList } from "@/components/provident-funds/provident-fund-list";
import { PreciousMetalForm } from "@/components/precious-metals/precious-metal-form";
import { PreciousMetalList } from "@/components/precious-metals/precious-metal-list";
import { InsuranceForm } from "@/components/insurance/insurance-form";
import { InsuranceList } from "@/components/insurance/insurance-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { toast } from "@/components/ui/use-toast";

function Investments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);
  const [providentFunds, setProvidentFunds] = useState<ProvidentFund[]>([]);
  const [preciousMetals, setPreciousMetals] = useState<PreciousMetal[]>([]);
  const [insurances, setInsurances] = useState<Insurance[]>([]);

  const handleAddInvestment = (investment: Omit<Investment, "id">) => {
    const newInvestment: Investment = {
      id: Math.random().toString(36).substring(2, 11),
      ...investment,
    };
    setInvestments([newInvestment, ...investments]);
    toast({
      title: "Investment Added",
      description: `${investment.name} has been added to your portfolio.`,
      duration: 3000,
    });
  };

  const handleAddFixedDeposit = (deposit: Omit<FixedDeposit, "id">) => {
    const newDeposit: FixedDeposit = {
      id: Math.random().toString(36).substring(2, 11),
      ...deposit,
    };
    setFixedDeposits([newDeposit, ...fixedDeposits]);
    toast({
      title: "Fixed Deposit Added",
      description: `${deposit.name} has been added to your deposits.`,
      duration: 3000,
    });
  };

  const handleAddProvidentFund = (fund: Omit<ProvidentFund, "id">) => {
    const newFund: ProvidentFund = {
      id: Math.random().toString(36).substring(2, 11),
      ...fund,
    };
    setProvidentFunds([newFund, ...providentFunds]);
  };

  const handleAddPreciousMetal = (metal: Omit<PreciousMetal, "id">) => {
    const newMetal: PreciousMetal = {
      id: Math.random().toString(36).substring(2, 11),
      ...metal,
    };
    setPreciousMetals([newMetal, ...preciousMetals]);
  };

  const handleAddInsurance = (insurance: Omit<Insurance, "id">) => {
    const newInsurance: Insurance = {
      id: Math.random().toString(36).substring(2, 11),
      ...insurance,
    };
    setInsurances([newInsurance, ...insurances]);
  };

  // Calculate total value of all assets
  const calculateTotalAssetsValue = () => {
    const investmentsValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    
    const fdValue = fixedDeposits.reduce((sum, fd) => {
      const principal = fd.principalAmount;
      const rate = fd.interestRate / 100;
      const timeInYears = 
        (fd.maturityDate.getTime() - fd.startDate.getTime()) / 
        (365 * 24 * 60 * 60 * 1000);
      const maturityValue = principal * Math.pow(1 + rate, timeInYears);
      return sum + maturityValue;
    }, 0);
    
    const pfValue = providentFunds.reduce((sum, pf) => sum + pf.currentBalance, 0);
    
    // For precious metals, we would typically calculate using current market prices
    // Here we're using a simplified mock calculation
    const pmValue = preciousMetals.reduce((sum, metal) => {
      // Mock current prices
      const currentPrices: Record<string, Record<string, number>> = {
        gold: { gram: 6500, ounce: 200000, kg: 6500000 },
        silver: { gram: 80, ounce: 2300, kg: 80000 }
      };
      const currentPrice = currentPrices[metal.type][metal.unit];
      return sum + (metal.quantity * currentPrice);
    }, 0);
    
    return investmentsValue + fdValue + pfValue + pmValue;
  };

  // Generate a random fun fact about investments
  const getRandomFunFact = () => {
    const funFacts = [
      "If you had invested ₹10,000 in Bitcoin in 2010, it would be worth over ₹10 crore today!",
      "Warren Buffett made 99% of his wealth after his 50th birthday, showing it's never too late to invest.",
      "The Indian stock market (Sensex) has given average returns of around 15% over the last 40 years.",
      "Gold has never lost its value in the long term and has been used as currency for over 5,000 years.",
      "Compound interest is often called the eighth wonder of the world - even small regular investments can grow significantly over time.",
      "Regular SIP investments of just ₹5,000 per month for 30 years at 12% returns could make you a crorepati.",
      "The 50:30:20 rule suggests using 50% of income for needs, 30% for wants, and 20% for savings and investments.",
      "India's Public Provident Fund (PPF) is one of the safest and tax-efficient investments available.",
      "The world's first mutual fund was created in 1924, almost 100 years ago."
    ];
    return funFacts[Math.floor(Math.random() * funFacts.length)];
  };

  // Calculate future value projection
  const calculateFutureValue = (years: number) => {
    const totalAssets = calculateTotalAssetsValue();
    const annualGrowthRate = 0.12; // Assuming 12% annual growth
    return totalAssets * Math.pow(1 + annualGrowthRate, years);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investments & Assets</h1>
        <p className="text-muted-foreground">
          Track and manage your investment portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle>Total Assets Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(calculateTotalAssetsValue())}</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 bg-gradient-to-br from-card via-card to-secondary/20">
          <CardHeader>
            <CardTitle>Future Value Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">5 Years</p>
                <p className="text-xl font-semibold">{formatCurrency(calculateFutureValue(5))}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">10 Years</p>
                <p className="text-xl font-semibold">{formatCurrency(calculateFutureValue(10))}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">20 Years</p>
                <p className="text-xl font-semibold">{formatCurrency(calculateFutureValue(20))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <div className="min-w-[24px] text-2xl">💡</div>
            <div>
              <p className="font-medium">Investment Tip:</p>
              <p className="text-muted-foreground">{getRandomFunFact()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <InvestmentSummary investments={investments} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvestmentPortfolioChart investments={investments} />
        <InvestmentPerformanceChart investments={investments} />
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto">
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

        <TabsContent value="provident-fund" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProvidentFundForm onAddFund={handleAddProvidentFund} />
            </div>
            <div className="md:col-span-2">
              <ProvidentFundList funds={providentFunds} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="precious-metals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <PreciousMetalForm onAddMetal={handleAddPreciousMetal} />
            </div>
            <div className="md:col-span-2">
              <PreciousMetalList metals={preciousMetals} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <InsuranceForm onAddInsurance={handleAddInsurance} />
            </div>
            <div className="md:col-span-2">
              <InsuranceList insurances={insurances} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Investments;
