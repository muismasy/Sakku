export interface User {
  id: string; // Firebase Auth UID
  phone_number: string; // Linked WA number for matching incoming webhooks
  default_ledger_id?: string; // The primary ledger they interact with
  created_at: number; // Timestamp
}

export interface Ledger {
  id: string;
  name: string; // e.g., "Family Budget"
  owner_id: string;
  shared_with: string[]; // Array of User IDs (or phone numbers) that have access
  created_at: number;
}

export interface Transaction {
  id: string;
  ledger_id: string;
  added_by_user_id: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  category: string; // e.g., 'Food', 'Transport'
  description: string;
  date: number; // Timestamp
  source: 'whatsapp' | 'web';
  raw_message?: string; // The original WA message
}

export interface BudgetEnvelope {
  id: string;
  ledger_id: string;
  category: string;
  monthly_limit: number;
  current_spent: number;
  alert_sent_80: boolean;
  alert_sent_100: boolean;
}

export interface SakuPot {
  id: string;
  ledger_id: string;
  name: string; // e.g., 'Emergency Fund', 'Holiday'
  target_amount: number;
  current_amount: number;
  deadline?: number; // Timestamp
  streak_days: number;
}

export interface RecurringExpense {
  id: string;
  ledger_id: string;
  title: string;
  monthly_amount: number;
  total_months: number;
  remaining_months: number;
  start_date: number; // Timestamp
  status: 'active' | 'completed' | 'paused';
  next_billing_date: number; // Timestamp
}

export interface GrowthBudget {
  id: string;
  title: string;
  budget_amount: number;
  current_spent: number;
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
  last_updated: number;
}
