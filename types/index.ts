export interface User {
  id: string; // Firebase Auth UID
  phoneNumber: string; // Linked WA number for matching incoming webhooks
  defaultLedgerId?: string; // The primary ledger they interact with
  createdAt: number; // Timestamp
}

export interface Ledger {
  id: string;
  name: string; // e.g., "Family Budget"
  ownerId: string;
  sharedWith: string[]; // Array of User IDs (or phone numbers) that have access
  createdAt: number;
}

export interface Transaction {
  id: string;
  ledgerId: string;
  addedByUserId: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  category: string; // e.g., 'Food', 'Transport'
  description: string;
  date: number; // Timestamp
  source: 'whatsapp' | 'web';
  rawMessage?: string; // The original WA message
}

export interface BudgetEnvelope {
  id: string;
  ledgerId: string;
  category: string;
  monthlyLimit: number;
  currentSpent: number;
  alertSent80: boolean;
  alertSent100: boolean;
}

export interface SakuPot {
  id: string;
  ledgerId: string;
  name: string; // e.g., 'Emergency Fund', 'Holiday'
  targetAmount: number;
  currentAmount: number;
  deadline?: number; // Timestamp
  streakDays: number;
}

export interface RecurringExpense {
  id: string;
  ledgerId: string;
  title: string;
  monthlyAmount: number;
  totalMonths: number;
  remainingMonths: number;
  startDate: number; // Timestamp
  status: 'active' | 'completed' | 'paused';
  nextBillingDate: number; // Timestamp
}

export interface GrowthBudget {
  id: string;
  title: string;
  budgetAmount: number;
  currentSpent: number;
  category: 'health' | 'education' | 'skills' | 'other';
}

export interface Wallet {
  id: string;
  name: string; // e.g., "Bank BCA", "GoPay"
  type: 'bank' | 'e-wallet' | 'cash';
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  lastUpdated: number;
}
