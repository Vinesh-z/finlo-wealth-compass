
import { Transaction, Investment, TransactionCategory, InvestmentType } from '@/types';

// Helper to generate unique IDs
const generateId = (): string => Math.random().toString(36).substring(2, 11);

// Helper to generate dates within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Current date and date 3 months ago
const now = new Date();
const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

// Transaction categories
const incomeCategories: TransactionCategory[] = ['salary', 'investment', 'gift', 'other'];
const expenseCategories: TransactionCategory[] = [
  'food', 'rent', 'utilities', 'transportation', 'entertainment', 
  'shopping', 'healthcare', 'education', 'travel', 'other'
];

// Generate mock transactions
export const mockTransactions: Transaction[] = Array.from({ length: 50 }, () => {
  const isIncome = Math.random() > 0.7;
  const type = isIncome ? 'income' : 'expense';
  const categories = isIncome ? incomeCategories : expenseCategories;
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Realistic amounts
  let amount: number;
  if (isIncome) {
    amount = category === 'salary' 
      ? 2000 + Math.floor(Math.random() * 3000) 
      : 100 + Math.floor(Math.random() * 900);
  } else {
    amount = category === 'rent' 
      ? 800 + Math.floor(Math.random() * 1200) 
      : 10 + Math.floor(Math.random() * 200);
  }
  
  return {
    id: generateId(),
    amount,
    type,
    category,
    description: `${type === 'income' ? 'Received' : 'Paid for'} ${category}`,
    date: randomDate(threeMonthsAgo, now),
  };
});

// Investment types
const investmentTypes: InvestmentType[] = [
  'stocks', 'mutual_funds', 'real_estate', 'crypto', 'bonds', 'etf', 'other'
];

// Stock names
const stockNames = [
  'Apple Inc.', 'Microsoft Corp.', 'Amazon.com Inc.', 'Tesla Inc.', 
  'Google/Alphabet', 'Meta Platforms Inc.', 'NVIDIA Corp.', 'Netflix Inc.',
  'Berkshire Hathaway', 'JPMorgan Chase & Co.', 'Johnson & Johnson',
  'Procter & Gamble', 'Visa Inc.', 'Mastercard Inc.', 'Coca-Cola Co.'
];

// Generate mock investments
export const mockInvestments: Investment[] = Array.from({ length: 10 }, () => {
  const type = investmentTypes[Math.floor(Math.random() * investmentTypes.length)];
  
  // Name based on type
  let name: string;
  switch (type) {
    case 'stocks':
      name = stockNames[Math.floor(Math.random() * stockNames.length)];
      break;
    case 'mutual_funds':
      name = `${['Vanguard', 'Fidelity', 'BlackRock', 'State Street'][Math.floor(Math.random() * 4)]} ${['Growth', 'Index', 'Value', 'Total Market'][Math.floor(Math.random() * 4)]} Fund`;
      break;
    case 'real_estate':
      name = `${['Residential', 'Commercial', 'REIT', 'Land'][Math.floor(Math.random() * 4)]} Investment`;
      break;
    case 'crypto':
      name = ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Polkadot'][Math.floor(Math.random() * 5)];
      break;
    default:
      name = `Investment ${generateId().substring(0, 4)}`;
  }
  
  const initialValue = 1000 + Math.floor(Math.random() * 9000);
  const percentChange = (Math.random() * 0.4) - 0.1; // -10% to +30%
  const currentValue = initialValue * (1 + percentChange);
  
  // Purchase date between 1-3 years ago
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
  
  return {
    id: generateId(),
    name,
    type,
    initialValue,
    currentValue,
    purchaseDate: randomDate(threeYearsAgo, oneYearAgo),
    notes: `${name} investment note`,
  };
});
