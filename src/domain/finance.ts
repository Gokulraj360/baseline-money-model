import type { AppState, Goal, Recurring, Txn } from '../types';
import { CATEGORY_MAP } from '../data/categories';
import { addMonths, daysBetween, monthKey, nowMonth, todayISO } from '../lib/date';

export const isCounted = (t: Txn): boolean => !t.pending && !t.isExcluded && !t.isTransfer;

export function effectiveParts(t: Txn): { category: string; amount: number }[] {
  if (t.splits && t.splits.length) {
    return t.splits.map((s) => ({
      category: s.category,
      amount: t.amount < 0 ? -Math.abs(s.amount) : Math.abs(s.amount),
    }));
  }
  return [{ category: t.category, amount: t.amount }];
}

export interface MonthSummary {
  month: string;
  income: number;
  fixed: number;
  flexible: number;
  savings: number;
  outflow: number;
  surplus: number;
  byCategory: { category: string; amount: number; kind: string }[];
  count: number;
}

export function summarizeMonth(txns: Txn[], month: string): MonthSummary {
  const scoped = txns.filter((t) => monthKey(t.date) === month && isCounted(t));
  const byCat = new Map<string, number>();
  let income = 0;
  let fixed = 0;
  let flexible = 0;
  let savings = 0;

  for (const t of scoped) {
    for (const part of effectiveParts(t)) {
      if (part.amount > 0) {
        income += part.amount;
        continue;
      }
      const amt = Math.abs(part.amount);
      const kind = CATEGORY_MAP[part.category]?.kind ?? 'flexible';
      if (kind === 'income') income += amt;
      else if (kind === 'fixed') fixed += amt;
      else if (kind === 'savings') savings += amt;
      else if (kind !== 'transfer') flexible += amt;
      if (kind !== 'income' && kind !== 'transfer') {
        byCat.set(part.category, (byCat.get(part.category) ?? 0) + amt);
      }
    }
  }

  const byCategory = [...byCat.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      kind: CATEGORY_MAP[category]?.kind ?? 'flexible',
    }))
    .sort((a, b) => b.amount - a.amount);

  const outflow = fixed + flexible + savings;
  return {
    month,
    income,
    fixed,
    flexible,
    savings,
    outflow,
    surplus: income - outflow,
    byCategory,
    count: scoped.length,
  };
}

export function monthsBack(month: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addMonths(month, -(i + 1)));
}

/** Average spend for a set of categories across the last N complete months. */
export function trailingCategoryAverage(
  txns: Txn[],
  categories: string[],
  months = 3,
  endMonth = nowMonth()
): number {
  const scope = monthsBack(endMonth, months);
  const total = txns
    .filter((t) => scope.includes(monthKey(t.date)) && isCounted(t))
    .reduce((sum, t) => {
      const parts = effectiveParts(t).filter((p) => categories.includes(p.category));
      return sum + parts.reduce((s, p) => s + Math.abs(p.amount), 0);
    }, 0);
  return total / months;
}

export function trailingOutflow(txns: Txn[], months = 3, endMonth = nowMonth()): number {
  const scope = monthsBack(endMonth, months);
  const total = txns
    .filter((t) => scope.includes(monthKey(t.date)) && isCounted(t))
    .reduce((s, t) => s + Math.max(0, -t.amount), 0);
  return total / months;
}

export function currentBalance(state: AppState): number {
  return state.profile.openingBalance + state.txns.reduce((s, t) => s + t.amount, 0);
}

export function monthlyAmount(amount: number, cadence: Recurring['cadence']): number {
  switch (cadence) {
    case 'weekly':
      return (amount * 52) / 12;
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
      return amount / 12;
  }
}

export function activeRecurring(state: AppState): Recurring[] {
  return state.recurring.filter((r) => r.status !== 'cancelled');
}

/** Subscriptions/fitness that are not already represented in profile.fixed. */
export function subscriptionRecurring(state: AppState): Recurring[] {
  return activeRecurring(state).filter(
    (r) => (r.category === 'subscriptions' || r.category === 'fitness') && r.status !== 'snoozed'
  );
}

export function monthlyIncome(state: AppState): number {
  return state.profile.income.reduce(
    (s, i) => s + (i.cadence === 'yearly' ? i.amount / 12 : i.cadence === 'one-off' ? 0 : i.amount),
    0
  );
}

export function fixedBaseline(state: AppState): number {
  const profileFixed = state.profile.fixed.reduce((s, f) => s + f.amount, 0);
  const subs = subscriptionRecurring(state).reduce(
    (s, r) => s + monthlyAmount(r.amount, r.cadence),
    0
  );
  return profileFixed + subs;
}

export function flexibleBaseline(state: AppState): number {
  return trailingCategoryAverage(
    state.txns,
    ['groceries', 'dining', 'delivery', 'transport', 'fuel', 'shopping', 'entertainment', 'health', 'travel', 'personal_care', 'home', 'gifts', 'other'],
    3
  );
}

/** The baseline the model uses when no levers are pulled. */
export function baseModel(state: AppState): {
  fixed: number;
  dining: number;
  groceries: number;
  otherFlexible: number;
} {
  const fixed = fixedBaseline(state);
  const dining = trailingCategoryAverage(state.txns, ['dining', 'delivery'], 3);
  const groceries = trailingCategoryAverage(state.txns, ['groceries'], 3);
  const otherFlexible = Math.max(0, flexibleBaseline(state) - dining - groceries);
  return { fixed, dining, groceries, otherFlexible };
}

export function essentialMonthly(state: AppState): number {
  const essentialCats = ['rent', 'utilities', 'internet', 'mobile', 'insurance', 'groceries', 'transport', 'fuel', 'health'];
  const fixedEssentials = state.profile.fixed
    .filter((f) => essentialCats.includes(f.category))
    .reduce((s, f) => s + f.amount, 0);
  const flexEssentials = trailingCategoryAverage(state.txns, ['groceries', 'transport', 'fuel', 'health'], 3);
  return fixedEssentials + flexEssentials;
}

export function emergencyCoverage(state: AppState): number {
  const essential = essentialMonthly(state);
  return essential > 0 ? state.profile.emergencySaved / essential : 0;
}

export function upcomingBills(state: AppState, days = 30): { recurring: Recurring; date: string; inDays: number }[] {
  const today = todayISO();
  return activeRecurring(state)
    .filter((r) => r.status === 'active')
    .map((r) => ({ recurring: r, date: r.nextDate, inDays: daysBetween(today, r.nextDate) }))
    .filter((x) => x.inDays >= 0 && x.inDays <= days)
    .sort((a, b) => a.inDays - b.inDays);
}

export function scheduledTotal(state: AppState, days = 30): number {
  return upcomingBills(state, days).reduce(
    (s, b) => s + monthlyAmount(b.recurring.amount, b.recurring.cadence),
    0
  );
}

export interface SafeToSpend {
  balance: number;
  emergency: number;
  goals: number;
  scheduled: number;
  buffer: number;
  safe: number;
  ratio: number;
}

export function safeToSpend(state: AppState): SafeToSpend {
  const balance = currentBalance(state);
  const emergency = state.profile.emergencySaved;
  const goals = state.goals.filter((g) => !g.archived).reduce((s, g) => s + g.saved, 0);
  const scheduled = scheduledTotal(state, 30);
  const buffer = 15000;
  const safe = balance - emergency - goals - scheduled - buffer;
  return {
    balance,
    emergency,
    goals,
    scheduled,
    buffer,
    safe,
    ratio: balance > 0 ? Math.max(0, Math.min(1, safe / balance)) : 0,
  };
}

export function goalRequiredMonthly(goal: Goal): number {
  const remaining = Math.max(0, goal.target - goal.saved);
  const today = todayISO();
  const months = Math.max(1, Math.ceil(daysBetween(today, goal.targetDate) / 30.4));
  return remaining / months;
}

export function goalProgress(goal: Goal): number {
  return goal.target > 0 ? Math.min(1, goal.saved / goal.target) : 0;
}

export function goalOnTrack(goal: Goal): boolean {
  return goal.monthly >= goalRequiredMonthly(goal) - 1;
}

export function monthlySurplus(state: AppState): number {
  return monthlyIncome(state) - fixedBaseline(state) - flexibleBaseline(state);
}

export function savingsRate(state: AppState): number {
  const income = monthlyIncome(state);
  if (income <= 0) return 0;
  const sip = state.profile.fixed.filter((f) => f.category === 'investments').reduce((s, f) => s + f.amount, 0);
  const surplus = monthlySurplus(state);
  return ((Math.max(0, surplus) + sip + state.profile.emergencySaved * 0) / income) * 100;
}

export function categorySpend(txns: Txn[], month: string): { category: string; amount: number }[] {
  return summarizeMonth(txns, month).byCategory;
}

export function topMerchants(txns: Txn[], month: string, limit = 5): { merchant: string; amount: number; count: number }[] {
  const map = new Map<string, { amount: number; count: number }>();
  for (const t of txns) {
    if (monthKey(t.date) !== month || !isCounted(t) || t.amount >= 0) continue;
    const key = t.merchant || t.description.slice(0, 24);
    const cur = map.get(key) ?? { amount: 0, count: 0 };
    map.set(key, { amount: cur.amount + Math.abs(t.amount), count: cur.count + 1 });
  }
  return [...map.entries()]
    .map(([merchant, v]) => ({ merchant, ...v }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}
