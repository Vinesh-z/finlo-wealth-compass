import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Investment, 
  FixedDeposit, 
  ProvidentFund, 
  PreciousMetal, 
  Insurance,
  InvestmentType,
  PreciousMetal as PreciousMetalType 
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
      type: item.type as InvestmentType,
      initialValue: Number(item.initial_value),
      currentValue: Number(item.current_value),
      purchaseDate: new Date(item.purchase_date),
      notes: item.notes || ''
    }));

    setInvestments(transformedData);

    // Fetch fixed deposits
    const { data: fdData, error: fdError } = await supabase
      .from('fixed_deposits')
      .select('*')
      .order('created_at', { ascending: false });

    if (fdError) {
      console.error('Error fetching fixed deposits:', fdError);
      toast({
        title: "Error",
        description: "Failed to load fixed deposits. Please try again.",
        variant: "destructive",
      });
    } else {
      const transformedFDData = fdData.map(item => ({
        id: item.id,
        name: item.name,
        principalAmount: Number(item.principal_amount),
        interestRate: Number(item.interest_rate),
        startDate: new Date(item.start_date),
        maturityDate: new Date(item.maturity_date),
        bankName: item.bank_name || '',
        notes: item.notes || ''
      }));
      setFixedDeposits(transformedFDData);
    }

    // Fetch provident funds
    const { data: pfData, error: pfError } = await supabase
      .from('provident_funds')
      .select('*')
      .order('created_at', { ascending: false });

    if (pfError) {
      console.error('Error fetching provident funds:', pfError);
      toast({
        title: "Error",
        description: "Failed to load provident funds. Please try again.",
        variant: "destructive",
      });
    } else {
      const transformedPFData = pfData.map(item => ({
        id: item.id,
        name: item.name,
        currentBalance: Number(item.current_balance),
        interestRate: Number(item.interest_rate),
        startDate: new Date(item.start_date),
        notes: item.notes || ''
      }));
      setProvidentFunds(transformedPFData);
    }

    // Fetch precious metals
    const { data: pmData, error: pmError } = await supabase
      .from('precious_metals')
      .select('*')
      .order('created_at', { ascending: false });

    if (pmError) {
      console.error('Error fetching precious metals:', pmError);
      toast({
        title: "Error",
        description: "Failed to load precious metals. Please try again.",
        variant: "destructive",
      });
    } else {
      const transformedPMData = pmData.map(item => ({
        id: item.id,
        type: item.type as PreciousMetalType['type'],
        quantity: Number(item.quantity),
        unit: item.unit as PreciousMetalType['unit'],
        purchasePricePerUnit: Number(item.purchase_price_per_unit),
        purchaseDate: new Date(item.purchase_date),
        notes: item.notes || ''
      }));
      setPreciousMetals(transformedPMData);
    }

    // Fetch insurance policies
    const { data: insData, error: insError } = await supabase
      .from('insurance')
      .select('*')
      .order('created_at', { ascending: false });

    if (insError) {
      console.error('Error fetching insurance:', insError);
      toast({
        title: "Error",
        description: "Failed to load insurance policies. Please try again.",
        variant: "destructive",
      });
    } else {
      const transformedInsData = insData.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        provider: item.provider,
        policyNumber: item.policy_number,
        premiumAmount: item.premium_amount ? Number(item.premium_amount) : undefined,
        premiumFrequency: item.premium_frequency as Insurance['premiumFrequency'],
        startDate: new Date(item.start_date),
        expiryDate: item.expiry_date ? new Date(item.expiry_date) : undefined,
        notes: item.notes || ''
      }));
      setInsurances(transformedInsData);
    }
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
        type: data.type as InvestmentType,
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

  const handleAddFixedDeposit = async (deposit: Omit<FixedDeposit, "id">) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add fixed deposits.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('fixed_deposits')
        .insert({
          name: deposit.name,
          principal_amount: deposit.principalAmount,
          interest_rate: deposit.interestRate,
          start_date: deposit.startDate.toISOString().split('T')[0],
          maturity_date: deposit.maturityDate.toISOString().split('T')[0],
          bank_name: deposit.bankName,
          notes: deposit.notes,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newDeposit: FixedDeposit = {
        id: data.id,
        name: data.name,
        principalAmount: Number(data.principal_amount),
        interestRate: Number(data.interest_rate),
        startDate: new Date(data.start_date),
        maturityDate: new Date(data.maturity_date),
        bankName: data.bank_name || '',
        notes: data.notes || ''
      };

      setFixedDeposits([newDeposit, ...fixedDeposits]);
      toast({
        title: "Fixed Deposit Added",
        description: `${deposit.name} has been added to your deposits.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding fixed deposit:', error);
      toast({
        title: "Error",
        description: "Failed to add fixed deposit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddProvidentFund = async (fund: Omit<ProvidentFund, "id">) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add provident funds.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('provident_funds')
        .insert({
          name: fund.name,
          current_balance: fund.currentBalance,
          interest_rate: fund.interestRate,
          start_date: fund.startDate.toISOString().split('T')[0],
          notes: fund.notes,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newFund: ProvidentFund = {
        id: data.id,
        name: data.name,
        currentBalance: Number(data.current_balance),
        interestRate: Number(data.interest_rate),
        startDate: new Date(data.start_date),
        notes: data.notes || ''
      };

      setProvidentFunds([newFund, ...providentFunds]);
      toast({
        title: "Provident Fund Added",
        description: `${fund.name} has been added to your funds.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding provident fund:', error);
      toast({
        title: "Error",
        description: "Failed to add provident fund. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddPreciousMetal = async (metal: Omit<PreciousMetal, "id">) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add precious metals.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('precious_metals')
        .insert({
          type: metal.type,
          quantity: metal.quantity,
          unit: metal.unit,
          purchase_price_per_unit: metal.purchasePricePerUnit,
          purchase_date: metal.purchaseDate.toISOString().split('T')[0],
          notes: metal.notes,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newMetal: PreciousMetal = {
        id: data.id,
        type: data.type as PreciousMetalType['type'],
        quantity: Number(data.quantity),
        unit: data.unit as PreciousMetalType['unit'],
        purchasePricePerUnit: Number(data.purchase_price_per_unit),
        purchaseDate: new Date(data.purchase_date),
        notes: data.notes || ''
      };

      setPreciousMetals([newMetal, ...preciousMetals]);
      toast({
        title: "Precious Metal Added",
        description: `${metal.quantity} ${metal.unit}(s) of ${metal.type} has been added.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding precious metal:', error);
      toast({
        title: "Error",
        description: "Failed to add precious metal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddInsurance = async (insurance: Omit<Insurance, "id">) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add insurance policies.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('insurance')
        .insert({
          name: insurance.name,
          type: insurance.type,
          provider: insurance.provider,
          policy_number: insurance.policyNumber,
          premium_amount: insurance.premiumAmount,
          premium_frequency: insurance.premiumFrequency,
          start_date: insurance.startDate.toISOString().split('T')[0],
          expiry_date: insurance.expiryDate?.toISOString().split('T')[0],
          notes: insurance.notes,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newInsurance: Insurance = {
        id: data.id,
        name: data.name,
        type: data.type,
        provider: data.provider,
        policyNumber: data.policy_number || undefined,
        premiumAmount: data.premium_amount ? Number(data.premium_amount) : undefined,
        premiumFrequency: data.premium_frequency as Insurance['premiumFrequency'],
        startDate: new Date(data.start_date),
        expiryDate: data.expiry_date ? new Date(data.expiry_date) : undefined,
        notes: data.notes || ''
      };

      setInsurances([newInsurance, ...insurances]);
      toast({
        title: "Insurance Policy Added",
        description: `${insurance.name} has been added to your policies.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding insurance:', error);
      toast({
        title: "Error",
        description: "Failed to add insurance policy. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments(investments.filter(investment => investment.id !== id));
  };

  const handleUpdateInvestment = (updatedInvestment: Investment) => {
    setInvestments(investments.map(investment => 
      investment.id === updatedInvestment.id ? updatedInvestment : investment
    ));
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

      <InvestmentSummary 
        investments={investments}
        fixedDeposits={fixedDeposits}
        providentFunds={providentFunds}
        preciousMetals={preciousMetals}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvestmentPortfolioChart 
          investments={investments}
          fixedDeposits={fixedDeposits}
          providentFunds={providentFunds}
          preciousMetals={preciousMetals}
        />
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
            <InvestmentList 
              investments={investments} 
              onInvestmentDeleted={handleDeleteInvestment}
              onInvestmentUpdated={handleUpdateInvestment}
            />
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
