
export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'food' 
  | 'rent' 
  | 'utilities' 
  | 'transportation' 
  | 'entertainment' 
  | 'shopping' 
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'salary'
  | 'investment'
  | 'gift'
  | 'other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: Date;
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
