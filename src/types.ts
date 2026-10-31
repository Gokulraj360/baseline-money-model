export type TxnSource = 'seed' | 'csv' | 'pdf' | 'sms' | 'manual';

export type Split = { category: string; amount: number };

export interface Txn {
  id: string;
  date: string; // yyyy-mm-dd
  description: string;
  merchant: string;
  amount: number; // signed: negative = money out, positive = money in
  category: string;
  confidence: number; // 0..1
  why: string;
  accountId: string;
  source: TxnSource;
  isTransfer?: boolean;
  isExcluded?: boolean;
  splits?: Split[];
  note?: string;
  batchId?: string;
  hash: string;
  pending?: boolean;
  createdAt?: number;
  tags?: string[];
  isReimbursable?: boolean;
  reimbursed?: boolean;
  taxSection?: '80C' | '80D' | 'HRA' | 'none';
}

export interface Category {
  id: string;
  name: string;
  group: string;
  kind: 'fixed' | 'flexible' | 'income' | 'savings' | 'transfer';
  color: string;
}

export type RuleField = 'description' | 'merchant';
export type MatchType = 'contains' | 'startsWith' | 'exact' | 'regex';

export interface Rule {
  id: string;
  pattern: string;
  field: RuleField;
  matchType: MatchType;
  category: string;
  source: 'learned' | 'manual';
  priority: number;
  hits: number;
  enabled: boolean;
  createdAt: number;
  lastHitAt?: number;
}

export interface Recurring {
  id: string;
  merchant: string;
  category: string;
  amount: number; // positive number
  cadence: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDate: string;
  lastDate: string;
  status: 'active' | 'unused' | 'cancelled' | 'snoozed';
  priceHistory: { date: string; amount: number }[];
  usage: 'used' | 'unused' | 'unknown';
  lastUsedDate?: string;
  detectedFrom: number; // number of matching txns
  accountId: string;
  notes?: string;
  source: 'detected' | 'manual';
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  cadence: 'monthly' | 'yearly' | 'one-off';
  nextDate: string;
  variable?: boolean;
}

export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  category: string;
  dueDay: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  targetDate: string;
  monthly: number;
  priority: number;
  color: string;
  note?: string;
  archived?: boolean;
}

export interface Debt {
  id: string;
  name: string;
  principal: number;
  interestRate: number; // annual %, e.g. 10.5
  minimumMonthly: number;
  dueDate?: number;
  category?: string;
}

export interface Profile {
  name: string;
  currency: 'INR';
  emergencyTarget: number;
  emergencySaved: number;
  savingsRateTarget: number;
  income: IncomeSource[];
  fixed: FixedCost[];
  openingBalance: number;
  categoryBudgets?: Record<string, number>;
  debts?: Debt[];
}

export interface Account {
  id: string;
  name: string;
  institution: string;
  kind: 'savings' | 'credit' | 'cash';
  last4: string;
  balance: number;
}

export type NudgeKind =
  | 'drift'
  | 'price-change'
  | 'unused'
  | 'goal'
  | 'buffer'
  | 'payday'
  | 'anomaly';

export interface Nudge {
  id: string;
  kind: NudgeKind;
  severity: 'info' | 'warn' | 'critical';
  title: string;
  body: string;
  math?: string;
  createdAt: number;
  status: 'open' | 'snoozed' | 'done' | 'dismissed';
  actionLabel?: string;
  actionRoute?: string;
}

export interface ScenarioLevers {
  diningCut: number; // 0..50 (%)
  groceriesCut: number; // 0..30
  cancelledSubs: string[]; // recurring ids
  rentChange: number; // -10..30
  incomeChange: number; // -20..20
  oneOffAmount: number;
  oneOffMonth: number; // 0..11
  extraSavings: number;
  inflationRate?: number; // 0..15 (%)
  jobLossMonths?: number; // 0..12 months without salary
}

export interface CustomAlert {
  id: string;
  name: string;
  condition: 'category_exceeds' | 'balance_below' | 'single_txn_above';
  threshold: number;
  category?: string;
  enabled: boolean;
  createdAt: number;
}

export interface Scenario {
  id: string;
  name: string;
  levers: ScenarioLevers;
  createdAt: number;
  pinned?: boolean;
}

export interface Settings {
  theme: 'light' | 'dark';
  dense: boolean;
  nudgePrefs: Record<NudgeKind, boolean>;
  nudgeStates: Record<string, 'snoozed' | 'done' | 'dismissed'>;
  hideBalances: boolean;
  savingsApy: number;
}

export interface ImportBatch {
  id: string;
  fileName: string;
  source: TxnSource;
  importedAt: number;
  total: number;
  added: number;
  duplicates: number;
  approved: boolean;
}

export interface Correction {
  id: string;
  txnId: string;
  description: string;
  from: string;
  to: string;
  at: number;
  learnedRuleId?: string;
}

export interface AppState {
  version: number;
  profile: Profile;
  accounts: Account[];
  txns: Txn[];
  rules: Rule[];
  recurring: Recurring[];
  goals: Goal[];
  nudges: Nudge[];
  scenarios: Scenario[];
  settings: Settings;
  batches: ImportBatch[];
  corrections: Correction[];
  seedMonth: string;
  customAlerts?: CustomAlert[];
  lastAction?: { label: string; snapshot: string; at: number } | null;
}

export interface ParsedRow {
  date: string;
  description: string;
  amount: number;
  balance?: number;
  raw: string;
  hash: string;
  duplicate?: boolean;
}

export interface ParseResult {
  rows: ParsedRow[];
  errors: string[];
  meta: { source: TxnSource; fileName: string; detectedFormat?: string; columns?: string[] };
}
