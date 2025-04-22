export type TransactionType = 'income' | 'expense';

export type DefaultTransactionCategory = 
  | 'food'
  | 'social_life'
  | 'pets'
  | 'transport'
  | 'household'
  | 'apparel'
  | 'beauty'
  | 'health'
  | 'education'
  | 'gift'
  | 'investment'
  | 'subscription'
  | 'baby'
  | 'other';

export interface CustomTransactionCategory {
  id: string;
  name: string;
}

export type TransactionCategory = DefaultTransactionCategory | string;

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: Date;
  is_custom_category?: boolean;
}

export type InvestmentType = 
  | 'stocks' 
  | 'mutual_funds' 
  | 'real_estate' 
  | 'crypto' 
  | 'bonds' 
  | 'etf'
  | 'other';

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  initialValue: number;
  currentValue: number;
  purchaseDate: Date;
  notes: string;
}

export type PreciousMetalType = 'gold' | 'silver';
export type PreciousMetalUnit = 'gram' | 'ounce' | 'kg';
export type InsurancePremiumFrequency = 'monthly' | 'quarterly' | 'semi-annually' | 'annually';

export interface FixedDeposit {
  id: string;
  name: string;
  principalAmount: number;
  interestRate: number;
  startDate: Date;
  maturityDate: Date;
  bankName?: string;
  notes?: string;
}

export interface ProvidentFund {
  id: string;
  name: string;
  currentBalance: number;
  interestRate: number;
  startDate: Date;
  notes?: string;
}

export interface PreciousMetal {
  id: string;
  type: PreciousMetalType;
  quantity: number;
  unit: PreciousMetalUnit;
  purchasePricePerUnit: number;
  purchaseDate: Date;
  notes?: string;
}

export interface Insurance {
  id: string;
  name: string;
  type: string;
  provider: string;
  policyNumber?: string;
  premiumAmount?: number;
  premiumFrequency?: InsurancePremiumFrequency;
  startDate: Date;
  expiryDate?: Date;
  notes?: string;
}

export interface InsuranceDocument {
  id: string;
  insuranceId: string;
  filePath: string;
  fileName: string;
  fileType: string;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminderDate: Date;
  isCompleted: boolean;
}

export interface UserPreferences {
  currency: string;
  theme: 'light' | 'dark';
}
