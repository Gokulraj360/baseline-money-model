import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'rent', name: 'Rent', group: 'Housing', kind: 'fixed', color: '#7A5C3E' },
  { id: 'utilities', name: 'Utilities', group: 'Housing', kind: 'fixed', color: '#A67C3D' },
  { id: 'internet', name: 'Internet', group: 'Housing', kind: 'fixed', color: '#8A8F5C' },
  { id: 'mobile', name: 'Mobile', group: 'Housing', kind: 'fixed', color: '#6F8A7A' },
  { id: 'insurance', name: 'Insurance', group: 'Financial', kind: 'fixed', color: '#6B7F8C' },
  { id: 'groceries', name: 'Groceries', group: 'Food', kind: 'flexible', color: '#4F7A5B' },
  { id: 'dining', name: 'Dining out', group: 'Food', kind: 'flexible', color: '#B4711E' },
  { id: 'delivery', name: 'Food delivery', group: 'Food', kind: 'flexible', color: '#C0683A' },
  { id: 'transport', name: 'Transport', group: 'Getting around', kind: 'flexible', color: '#3F6E7A' },
  { id: 'fuel', name: 'Fuel', group: 'Getting around', kind: 'flexible', color: '#5C6E82' },
  { id: 'subscriptions', name: 'Subscriptions', group: 'Lifestyle', kind: 'fixed', color: '#8A5A6B' },
  { id: 'shopping', name: 'Shopping', group: 'Lifestyle', kind: 'flexible', color: '#A65A4A' },
  { id: 'entertainment', name: 'Entertainment', group: 'Lifestyle', kind: 'flexible', color: '#6E6A7C' },
  { id: 'health', name: 'Health', group: 'Wellbeing', kind: 'flexible', color: '#5A7D6A' },
  { id: 'fitness', name: 'Fitness', group: 'Wellbeing', kind: 'fixed', color: '#4E7F74' },
  { id: 'education', name: 'Education', group: 'Growth', kind: 'fixed', color: '#7A6A4A' },
  { id: 'travel', name: 'Travel', group: 'Lifestyle', kind: 'flexible', color: '#4C6B8A' },
  { id: 'personal_care', name: 'Personal care', group: 'Lifestyle', kind: 'flexible', color: '#A07A6A' },
  { id: 'home', name: 'Home', group: 'Housing', kind: 'flexible', color: '#8A7A5A' },
  { id: 'gifts', name: 'Gifts', group: 'Lifestyle', kind: 'flexible', color: '#9A6A5A' },
  { id: 'fees', name: 'Fees & charges', group: 'Financial', kind: 'fixed', color: '#8A6A6A' },
  { id: 'investments', name: 'Investments', group: 'Financial', kind: 'savings', color: '#3F6B4F' },
  { id: 'transfer', name: 'Transfers', group: 'Financial', kind: 'transfer', color: '#8A8A82' },
  { id: 'income', name: 'Income', group: 'Income', kind: 'income', color: '#2F6B4F' },
  { id: 'other', name: 'Uncategorised', group: 'Other', kind: 'flexible', color: '#7A7A72' },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
);

export const categoryName = (id: string): string => CATEGORY_MAP[id]?.name ?? 'Uncategorised';
export const categoryColor = (id: string): string => CATEGORY_MAP[id]?.color ?? '#7A7A72';
export const categoryKind = (id: string): Category['kind'] =>
  CATEGORY_MAP[id]?.kind ?? 'flexible';
