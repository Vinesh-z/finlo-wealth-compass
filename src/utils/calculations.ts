
import { Transaction, Investment } from '@/types';

export const calculateTotalIncome = (transactions: Transaction[]): number => {
  if (!transactions || !transactions.length) return 0;
  
  return transactions
    .filter(t => t.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  if (!transactions || !transactions.length) return 0;
  
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateSavings = (transactions: Transaction[]): number => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

export const calculateCategoryTotal = (
  transactions: Transaction[],
  category: string,
  type: 'income' | 'expense'
): number => {
  if (!transactions || !transactions.length) return 0;
  
  return transactions
    .filter(t => t.type === type && t.category === category)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateCategoryPercentage = (
  transactions: Transaction[],
  category: string,
  type: 'income' | 'expense'
): number => {
  const categoryTotal = calculateCategoryTotal(transactions, category, type);
  const typeTotal = type === 'income' 
    ? calculateTotalIncome(transactions) 
    : calculateTotalExpenses(transactions);
  
  return typeTotal === 0 ? 0 : categoryTotal / typeTotal;
};

export const calculateROI = (investment: Investment): number => {
  const gainLoss = investment.currentValue - investment.initialValue;
  return investment.initialValue === 0 ? 0 : gainLoss / investment.initialValue;
};

export const calculateTotalPortfolioValue = (investments: Investment[]): number => {
  if (!investments || !investments.length) return 0;
  return investments.reduce((total, investment) => total + investment.currentValue, 0);
};

export const calculateTotalGainLoss = (investments: Investment[]): number => {
  if (!investments || !investments.length) return 0;
  return investments.reduce(
    (total, investment) => total + (investment.currentValue - investment.initialValue),
    0
  );
};
