export type UserTier = 'FREE' | 'PRO';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum Category {
  FOOD = 'Food & Dining',
  TRANSPORT = 'Transportation',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  INCOME = 'Income',
  TECH = 'Technology',
  BUSINESS = 'Business Services',
  TRAVEL = 'Travel',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  merchant: string;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  type: 'Checking' | 'Savings' | 'Credit Card' | 'Investment';
  lastSynced: string;
  accountNumber: string;
  holderName: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  REPORTS = 'REPORTS',
  ACCOUNT = 'ACCOUNT',
  SETTINGS = 'SETTINGS',
  HISTORY = 'HISTORY',
  SUBSCRIPTION = 'SUBSCRIPTION',
}

export interface VendorSplit {
  name: string;
  amount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  vendors?: VendorSplit[];
}

export interface RecurringTransaction {
  merchant: string;
  amount: number;
  count: number;
}

export interface AnalysisResult {
  totalIncome: number;
  totalExpense: number;
  excludedInternalTransfers?: number;
  summary: string;
  breakdown: CategoryBreakdown[];
  recurring?: RecurringTransaction[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  fileName: string;
  fileType: string;
  result: AnalysisResult;
}

export interface TaxAnalysisResult {
  income: {
    totalGross: number;
    excludedInternalTransfers?: number;
    breakdown: {
      salary: number;
      business: number;
      professional: number;
      interest: number;
      dividend: number;
      capitalGains: number;
      other: number;
    };
    recurringSources: { 
      name: string; 
      amount: number; 
      frequency?: string;
    }[];
    flaggedCredits: {
      description: string;
      amount: number;
      reason: string;
    }[];
  };
  expenses: {
    totalDeductible: number;
    totalNonDeductible: number;
    deductibleBreakdown: { category: string; amount: number }[];
    scrutinyRisks: { 
      description: string; 
      amount: number; 
      riskReason: string;
    }[];
  };
  financialRatios?: {
    ros: number;
    ebitdaMargin: number;
    netProfitMargin: number;
  };
  itrContext: {
    suggestedForm: string;
    detectedSections: string[];
    notes: string;
  };
  aiInsight: {
    title: string;
    description: string;
    potentialSavings: string;
  };
}