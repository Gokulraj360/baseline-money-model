import type { AppState, Debt, Goal, Recurring, Txn } from '../types';
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

export interface HealthPillar {
  name: string;
  score: number;
  max: number;
  tip: string;
  status: 'good' | 'fair' | 'warn';
}

export interface FinancialHealth {
  score: number;
  grade: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  pillars: HealthPillar[];
}

export function financialHealthScore(state: AppState): FinancialHealth {
  const cov = emergencyCoverage(state);
  const sr = savingsRate(state);
  const income = monthlyIncome(state);
  const fixed = fixedBaseline(state);
  const fixedRatio = income > 0 ? fixed / income : 0;
  const dormantCount = state.recurring.filter((r) => r.status !== 'cancelled' && r.usage === 'unused').length;

  // 1. Emergency Fund (25 pts)
  let emScore = 0;
  let emTip = 'Emergency fund is below 1 month. Build to 3 months.';
  let emStatus: HealthPillar['status'] = 'warn';
  if (cov >= 3) {
    emScore = 25;
    emTip = `${cov.toFixed(1)} months of essentials covered (target: 3+).`;
    emStatus = 'good';
  } else if (cov >= 2) {
    emScore = 18;
    emTip = `${cov.toFixed(1)} months covered. Almost at the 3-month floor.`;
    emStatus = 'fair';
  } else if (cov >= 1) {
    emScore = 10;
    emTip = `${cov.toFixed(1)} months covered. Allocate more to reach 3 months.`;
    emStatus = 'fair';
  }

  // 2. Savings Rate (25 pts)
  let srScore = 5;
  let srTip = 'Savings rate below 10%. Target 20%+ for long-term health.';
  let srStatus: HealthPillar['status'] = 'warn';
  if (sr >= 25) {
    srScore = 25;
    srTip = `Savings rate is an exceptional ${Math.round(sr)}%.`;
    srStatus = 'good';
  } else if (sr >= 20) {
    srScore = 20;
    srTip = `Savings rate is on target at ${Math.round(sr)}%.`;
    srStatus = 'good';
  } else if (sr >= 12) {
    srScore = 14;
    srTip = `Savings rate is ${Math.round(sr)}%. Pushing to 20% accelerates goals.`;
    srStatus = 'fair';
  }

  // 3. Fixed Cost Ratio (25 pts)
  let fxScore = 5;
  let fxTip = `Fixed costs consume ${Math.round(fixedRatio * 100)}% of income (target: <50%).`;
  let fxStatus: HealthPillar['status'] = 'warn';
  if (fixedRatio <= 0.40) {
    fxScore = 25;
    fxTip = `Low fixed commitments (${Math.round(fixedRatio * 100)}% of salary) leave huge flexibility.`;
    fxStatus = 'good';
  } else if (fixedRatio <= 0.50) {
    fxScore = 20;
    fxTip = `Fixed commitments are healthy at ${Math.round(fixedRatio * 100)}% of income.`;
    fxStatus = 'good';
  } else if (fixedRatio <= 0.60) {
    fxScore = 12;
    fxTip = `Fixed costs are ${Math.round(fixedRatio * 100)}% of income. Tight during slower months.`;
    fxStatus = 'fair';
  }

  // 4. Waste & Subscriptions (25 pts)
  let subScore = 5;
  let subTip = `${dormantCount} dormant subscriptions detected. Cancel to reclaim surplus.`;
  let subStatus: HealthPillar['status'] = 'warn';
  if (dormantCount === 0) {
    subScore = 25;
    subTip = 'Zero dormant subscriptions detected. Lean commitments.';
    subStatus = 'good';
  } else if (dormantCount === 1) {
    subScore = 15;
    subTip = '1 unused subscription detected. Review in Recurring radar.';
    subStatus = 'fair';
  }

  const score = Math.round(emScore + srScore + fxScore + subScore);
  const grade: FinancialHealth['grade'] =
    score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Attention';

  return {
    score,
    grade,
    pillars: [
      { name: 'Emergency floor', score: emScore, max: 25, tip: emTip, status: emStatus },
      { name: 'Savings rate', score: srScore, max: 25, tip: srTip, status: srStatus },
      { name: 'Fixed commitments', score: fxScore, max: 25, tip: fxTip, status: fxStatus },
      { name: 'Subscription radar', score: subScore, max: 25, tip: subTip, status: subStatus },
    ],
  };
}

export interface PacingItem {
  category: string;
  name: string;
  color: string;
  spent: number;
  budget: number;
  projected: number;
  pctSpent: number;
  pctMonth: number;
  status: 'under' | 'on-track' | 'fast';
}

export function categoryPacing(state: AppState, month: string = nowMonth()): PacingItem[] {
  const summary = summarizeMonth(state.txns, month);
  const isCurrent = month === nowMonth();
  const day = isCurrent ? Number(todayISO().slice(8, 10)) : 30;
  const totalDays = 30;
  const pctMonth = Math.min(100, Math.max(1, Math.round((day / totalDays) * 100)));

  return summary.byCategory
    .filter((c) => c.kind === 'flexible')
    .slice(0, 6)
    .map((c) => {
      const configured = state.profile.categoryBudgets?.[c.category];
      const fallback = trailingCategoryAverage(state.txns, [c.category], 3) || c.amount * 1.1;
      const budget = configured ?? Math.round(fallback);
      const spent = c.amount;
      const pctSpent = budget > 0 ? Math.round((spent / budget) * 100) : 100;
      const projected = day > 0 ? Math.round((spent / day) * totalDays) : spent;
      const status: PacingItem['status'] =
        pctSpent > pctMonth + 15 ? 'fast' : pctSpent < pctMonth - 10 ? 'under' : 'on-track';

      return {
        category: c.category,
        name: CATEGORY_MAP[c.category]?.name ?? c.category,
        color: CATEGORY_MAP[c.category]?.color ?? '#888',
        spent,
        budget,
        projected,
        pctSpent,
        pctMonth,
        status,
      };
    });
}

export interface AnomalyItem {
  id: string;
  txn: Txn;
  type: 'duplicate' | 'spike';
  label: string;
  severity: 'warn' | 'critical';
}

export function detectAnomalies(txns: Txn[]): AnomalyItem[] {
  const anomalies: AnomalyItem[] = [];
  const approved = txns.filter(isCounted);

  // 1. Detect same-day identical charges (potential duplicate debit)
  const seen = new Map<string, Txn>();
  for (const t of approved) {
    if (t.amount >= 0) continue;
    const key = `${t.date}_${t.amount}_${t.merchant.toUpperCase().trim()}`;
    const prev = seen.get(key);
    if (prev) {
      anomalies.push({
        id: `dup_${t.id}`,
        txn: t,
        type: 'duplicate',
        label: `Possible duplicate charge: ${Math.abs(t.amount)} at ${t.merchant} on ${t.date}`,
        severity: 'critical',
      });
    } else {
      seen.set(key, t);
    }
  }

  // 2. Detect single-transaction spending spikes (>3x average)
  for (const t of approved) {
    if (t.amount >= 0) continue;
    const abs = Math.abs(t.amount);
    if (['dining', 'delivery', 'shopping', 'entertainment'].includes(t.category) && abs >= 4500) {
      anomalies.push({
        id: `spike_${t.id}`,
        txn: t,
        type: 'spike',
        label: `Unusually high ${CATEGORY_MAP[t.category]?.name ?? t.category} payment: ₹${abs.toLocaleString('en-IN')}`,
        severity: 'warn',
      });
    }
  }

  return anomalies.slice(0, 5);
}

export interface WeekendSplit {
  weekendAmount: number;
  weekdayAmount: number;
  weekendPct: number;
  weekendCount: number;
  weekdayCount: number;
}

export function weekendVsWeekday(txns: Txn[], month: string = nowMonth()): WeekendSplit {
  let weekendAmount = 0;
  let weekdayAmount = 0;
  let weekendCount = 0;
  let weekdayCount = 0;

  for (const t of txns) {
    if (monthKey(t.date) !== month || !isCounted(t) || t.amount >= 0) continue;
    if (!['dining', 'delivery', 'shopping', 'entertainment', 'travel'].includes(t.category)) continue;

    const d = new Date(t.date + 'T12:00:00Z');
    const day = d.getUTCDay(); // 0 is Sunday, 6 is Saturday
    const amt = Math.abs(t.amount);

    if (day === 0 || day === 6) {
      weekendAmount += amt;
      weekendCount += 1;
    } else {
      weekdayAmount += amt;
      weekdayCount += 1;
    }
  }

  const total = weekendAmount + weekdayAmount;
  const weekendPct = total > 0 ? Math.round((weekendAmount / total) * 100) : 0;

  return {
    weekendAmount,
    weekdayAmount,
    weekendPct,
    weekendCount,
    weekdayCount,
  };
}

export interface TaxDeductions {
  sec80C: { current: number; limit: number; remaining: number };
  sec80D: { current: number; limit: number; remaining: number };
  hra: { rentPaid: number };
  totalEligible: number;
}

export function calculateTaxDeductions(state: AppState): TaxDeductions {
  // 80C: Investments, ELSS, PF, Life insurance, Tuition (Limit: 1,50,000)
  const investTxns = state.txns
    .filter((t) => isCounted(t) && (t.taxSection === '80C' || t.category === 'investments' || t.category === 'insurance'))
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const sec80CSpent = Math.min(150000, investTxns);

  // 80D: Health Insurance (Limit: 25,000)
  const healthTxns = state.txns
    .filter((t) => isCounted(t) && (t.taxSection === '80D' || /health insurance|star health|niva bupa/i.test(t.description)))
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const sec80DSpent = Math.min(25000, healthTxns);

  // HRA: Rent paid in full year (or from fixed rent costs)
  const rentTxns = state.txns
    .filter((t) => isCounted(t) && t.category === 'rent')
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const rentFixedAnnual = state.profile.fixed
    .filter((f) => f.category === 'rent')
    .reduce((s, f) => s + f.amount * 12, 0);
  const hraRent = rentTxns > 0 ? rentTxns : rentFixedAnnual;

  return {
    sec80C: { current: sec80CSpent, limit: 150000, remaining: Math.max(0, 150000 - sec80CSpent) },
    sec80D: { current: sec80DSpent, limit: 25000, remaining: Math.max(0, 25000 - sec80DSpent) },
    hra: { rentPaid: hraRent },
    totalEligible: sec80CSpent + sec80DSpent,
  };
}

export interface DebtPayoffResult {
  monthsToPayoff: number;
  totalInterestPaid: number;
  totalPaid: number;
  monthlySchedule: { month: number; balance: number; paid: number; interest: number }[];
}

export function simulateDebtPayoff(
  debts: Debt[],
  extraMonthly = 0,
  strategy: 'snowball' | 'avalanche' = 'avalanche'
): DebtPayoffResult {
  if (!debts.length) {
    return { monthsToPayoff: 0, totalInterestPaid: 0, totalPaid: 0, monthlySchedule: [] };
  }

  // Clone debt items
  const pool = debts.map((d) => ({
    ...d,
    currentPrincipal: d.principal,
    monthlyRate: d.interestRate / 100 / 12,
  }));

  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  const maxMonths = 120; // 10 years max
  const monthlySchedule: DebtPayoffResult['monthlySchedule'] = [];

  while (month < maxMonths && pool.some((d) => d.currentPrincipal > 0.01)) {
    month += 1;
    let monthInterest = 0;
    let monthPaid = 0;

    // 1. Accrue monthly interest
    for (const d of pool) {
      if (d.currentPrincipal <= 0) continue;
      const interest = d.currentPrincipal * d.monthlyRate;
      d.currentPrincipal += interest;
      monthInterest += interest;
      totalInterest += interest;
    }

    // 2. Pay minimums
    for (const d of pool) {
      if (d.currentPrincipal <= 0) continue;
      const payment = Math.min(d.currentPrincipal, d.minimumMonthly);
      d.currentPrincipal -= payment;
      monthPaid += payment;
      totalPaid += payment;
    }

    // 3. Apply extra payment to targeted debt
    let extraLeft = extraMonthly;
    // Sort pool by strategy
    const sorted = [...pool]
      .filter((d) => d.currentPrincipal > 0)
      .sort((a, b) =>
        strategy === 'avalanche'
          ? b.interestRate - a.interestRate
          : a.currentPrincipal - b.currentPrincipal
      );

    for (const target of sorted) {
      if (extraLeft <= 0) break;
      const extraPay = Math.min(target.currentPrincipal, extraLeft);
      target.currentPrincipal -= extraPay;
      extraLeft -= extraPay;
      monthPaid += extraPay;
      totalPaid += extraPay;
    }

    const currentTotalBalance = pool.reduce((s, d) => s + Math.max(0, d.currentPrincipal), 0);
    monthlySchedule.push({
      month,
      balance: Math.round(currentTotalBalance),
      paid: Math.round(monthPaid),
      interest: Math.round(monthInterest),
    });
  }

  return {
    monthsToPayoff: month,
    totalInterestPaid: Math.round(totalInterest),
    totalPaid: Math.round(totalPaid),
    monthlySchedule,
  };
}
