import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Investment, 
  FixedDeposit, 
  ProvidentFund, 
  PreciousMetal, 
  Insurance
} from "@/types";
import { supabase } from "@/integrations/supabase/client";
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
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchInvestments();
      } else {
        window.location.href = '/auth';
      }
    };
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchInvestments();
        } else {
          window.location.href = '/auth';
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  async function fetchInvestments() {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching investments:', error);
      toast({
        title: "Error",
        description: "Failed to load investments. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const transformedData = data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type as Investment['type'],
      initialValue: Number(item.initial_value),
      currentValue: Number(item.current_value),
      purchaseDate: new Date(item.purchase_date),
      notes: item.notes || ''
    }));

    setInvestments(transformedData);
  }

  const handleAddInvestment = async (investment: Omit<Investment, "id">) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add investments.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('investments')
        .insert({
          name: investment.name,
          type: investment.type,
          initial_value: investment.initialValue,
          current_value: investment.currentValue,
          purchase_date: investment.purchaseDate.toISOString().split('T')[0],
          notes: investment.notes,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newInvestment: Investment = {
        id: data.id,
        name: data.name,
        type: data.type as Investment['type'],
        initialValue: Number(data.initial_value),
        currentValue: Number(data.current_value),
        purchaseDate: new Date(data.purchase_date),
        notes: data.notes || ''
      };

      setInvestments([newInvestment, ...investments]);
      toast({
        title: "Investment Added",
        description: `${investment.name} has been added to your portfolio.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding investment:', error);
      toast({
        title: "Error",
        description: "Failed to add investment. Please try again.",
        variant: "destructive",
      });
    }
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
    const pmValue = preciousMetals.reduce((sum, metal) => {
      return sum + (metal.quantity * metal.purchasePricePerUnit);
    }, 0);
    return investmentsValue + fdValue + pfValue + pmValue;
  };

  const getRandomFunFact = () => {
    const funFacts = [
      "If you had invested ₹10,000 in Bitcoin in 2010, it would be worth over ₹10 crore today!",
      "Warren Buffett made 99% of his wealth after his 50th birthday, showing it's never too late to invest.",
      "The Indian stock market (Sensex) has given average returns of around 15% over the last 40 years.",
      "Gold has never lost its value in the long term and has been used as currency for over 5,000 years.",
      "Compound interest is often called the eighth wonder of the world - even small regular investments can grow significantly over time."
    ];
    return funFacts[Math.floor(Math.random() * funFacts.length)];
  };

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
          <div className="space-y-6">
            <InvestmentForm onAddInvestment={handleAddInvestment} />
            <InvestmentList investments={investments} />
          </div>
        </TabsContent>

        <TabsContent value="fixed-deposits" className="space-y-6">
          <div className="space-y-6">
            <FixedDepositForm onAddDeposit={handleAddFixedDeposit} />
            <FixedDepositList deposits={fixedDeposits} />
          </div>
        </TabsContent>

        <TabsContent value="provident-fund" className="space-y-6">
          <div className="space-y-6">
            <ProvidentFundForm onAddFund={handleAddProvidentFund} />
            <ProvidentFundList funds={providentFunds} />
          </div>
        </TabsContent>

        <TabsContent value="precious-metals" className="space-y-6">
          <div className="space-y-6">
            <PreciousMetalForm onAddMetal={handleAddPreciousMetal} />
            <PreciousMetalList metals={preciousMetals} />
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <div className="space-y-6">
            <InsuranceForm onAddInsurance={handleAddInsurance} />
            <InsuranceList insurances={insurances} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Investments;
