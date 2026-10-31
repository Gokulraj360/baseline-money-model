import type { AppState, Goal, Txn } from '../types';
import { addMonths, daysBetween, monthKey, monthLabel, nowMonth, todayISO } from '../lib/date';
import { money, pct } from '../lib/format';
import { CATEGORY_MAP } from '../data/categories';
import {
  emergencyCoverage,
  goalRequiredMonthly,
  isCounted,
  monthlyIncome,
  savingsRate as modelSavingsRate,
  summarizeMonth,
  topMerchants,
  type MonthSummary,
} from './finance';
import { detectPriceChange, subscriptionTotal } from './recurring';

export interface CategoryDelta {
  category: string;
  name: string;
  color: string;
  amount: number;
  prev: number;
  delta: number;
  pct: number;
}

export interface MonthlyReport {
  month: string;
  summary: MonthSummary;
  prev: MonthSummary;
  categories: CategoryDelta[];
  merchants: { merchant: string; amount: number; count: number }[];
  largest: Txn | null;
  subscriptions: { monthly: number; annual: number };
  priceChanges: { merchant: string; from: number; to: number; delta: number }[];
  goals: { goal: Goal; remaining: number; required: number; onTrack: boolean }[];
  narrative: { title: string; body: string }[];
  wins: string[];
  slippage: string[];
  savingsRate: number;
  incomeDelta: number;
  totalDelta: number;
}

export function buildReport(state: AppState, month = nowMonth()): MonthlyReport {
  const prevKey = addMonths(month, -1);
  const summary = summarizeMonth(state.txns, month);
  const prev = summarizeMonth(state.txns, prevKey);

  const catIds = new Set([...summary.byCategory.map((c) => c.category), ...prev.byCategory.map((c) => c.category)]);
  const categories: CategoryDelta[] = [...catIds]
    .map((id) => {
      const amount = summary.byCategory.find((c) => c.category === id)?.amount ?? 0;
      const p = prev.byCategory.find((c) => c.category === id)?.amount ?? 0;
      return {
        category: id,
        name: CATEGORY_MAP[id]?.name ?? id,
        color: CATEGORY_MAP[id]?.color ?? '#7A7A72',
        amount,
        prev: p,
        delta: amount - p,
        pct: p > 0 ? ((amount - p) / p) * 100 : amount > 0 ? 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const monthTxns = state.txns.filter((t) => monthKey(t.date) === month && isCounted(t));
  const largest = monthTxns
    .filter((t) => t.amount < 0)
    .sort((a, b) => a.amount - b.amount)[0] ?? null;

  const subs = subscriptionTotal(state.recurring);
  const priceChanges = state.recurring
    .map((r) => ({ r, c: detectPriceChange(r) }))
    .filter((x) => x.c)
    .map((x) => ({
      merchant: x.r.merchant,
      from: x.c!.from,
      to: x.c!.to,
      delta: x.c!.delta,
    }));

  const goals = state.goals
    .filter((g) => !g.archived)
    .map((g) => ({
      goal: g,
      remaining: Math.max(0, g.target - g.saved),
      required: goalRequiredMonthly(g),
      onTrack: g.monthly >= goalRequiredMonthly(g) * 0.92,
    }));

  const income = monthlyIncome(state);
  const cashRate = income > 0 ? ((summary.income - summary.outflow) / summary.income) * 100 : 0;
  const savingsRate = modelSavingsRate(state);

  const narrative: { title: string; body: string }[] = [];
  const diff = summary.outflow - prev.outflow;
  narrative.push({
    title: diff <= 0 ? 'Spending came in lower' : 'Spending moved up',
    body: `You spent ${money(summary.outflow)} in ${monthLabel(month)} across ${summary.count} transactions, ${
      diff === 0 ? 'level with' : `${money(Math.abs(diff))} ${diff > 0 ? 'more' : 'less'} than`
    } ${monthLabel(prevKey, true)}. Income was ${money(summary.income)}.`,
  });

  const topCat = categories[0];
  if (topCat) {
    narrative.push({
      title: `${topCat.name} is the biggest line`,
      body: `${topCat.name} took ${money(topCat.amount)} — ${pct(
        summary.outflow > 0 ? (topCat.amount / summary.outflow) * 100 : 0
      )} of everything that left your account${
        topCat.prev > 0
          ? `, ${topCat.delta >= 0 ? 'up' : 'down'} ${pct(Math.abs(topCat.pct))} from last month`
          : ''
      }.`,
    });
  }

  narrative.push({
    title: 'What you kept',
    body: `Cash left over after spending was ${money(
      Math.max(0, summary.income - summary.outflow)
    )} (${pct(cashRate)} of income). Counting committed savings like the SIP, your savings rate is ${pct(
      savingsRate
    )}, against a ${pct(state.profile.savingsRateTarget)} target. Subscriptions alone run ${money(
      subs.monthly
    )} a month, or ${money(subs.annual)} a year.`,
  });

  narrative.push({
    title: 'Goal funding',
    body: `Your goals hold ${money(state.goals.reduce((s, g) => s + g.saved, 0))} of ${money(
      state.goals.reduce((s, g) => s + g.target, 0)
    )}. ${
      goals.filter((g) => !g.onTrack).length
        ? `${goals.filter((g) => !g.onTrack).length} of ${goals.length} goals need a higher monthly contribution to land on time.`
        : 'Every goal is on pace for its target date.'
    }`,
  });

  const wins: string[] = [];
  const slippage: string[] = [];
  if (summary.income > summary.outflow) wins.push(`You kept ${money(summary.income - summary.outflow)} this month.`);
  if (savingsRate >= state.profile.savingsRateTarget)
    wins.push(`Savings rate of ${pct(savingsRate)} beat your ${pct(state.profile.savingsRateTarget)} target.`);
  for (const c of categories) {
    if (c.prev > 0 && c.pct <= -12 && c.prev - c.amount > 400) {
      wins.push(`${c.name} fell ${pct(Math.abs(c.pct))} (${money(c.prev - c.amount)} less than last month).`);
    }
    if (c.prev > 0 && c.pct >= 18 && c.amount - c.prev > 600) {
      slippage.push(`${c.name} rose ${pct(c.pct)} (${money(c.amount - c.prev)} more than last month).`);
    }
  }
  if (priceChanges.length) {
    slippage.push(
      `${priceChanges.length} recurring charge${priceChanges.length > 1 ? 's' : ''} went up, adding ${money(
        priceChanges.reduce((s, c) => s + c.delta, 0) * 12
      )} a year.`
    );
  }
  if (emergencyCoverage(state) < 3) {
    slippage.push(`Emergency fund covers ${emergencyCoverage(state).toFixed(1)} months, below the three-month floor.`);
  }
  const unused = state.recurring.filter((r) => r.usage === 'unused' && r.status !== 'cancelled');
  if (unused.length) {
    slippage.push(`${unused.length} dormant subscriptions are still charging.`);
  }
  if (!wins.length) wins.push('Every month of data makes the model sharper — keep importing statements.');

  return {
    month,
    summary,
    prev,
    categories,
    merchants: topMerchants(state.txns, month, 5),
    largest,
    subscriptions: subs,
    priceChanges,
    goals,
    narrative,
    wins,
    slippage,
    savingsRate,
    incomeDelta: summary.income - prev.income,
    totalDelta: diff,
  };
}

export function reportAvailability(state: AppState): { month: string; label: string; complete: boolean }[] {
  const months = [...new Set(state.txns.map((t) => monthKey(t.date)))].sort().reverse();
  const today = todayISO();
  return months.map((m) => ({
    month: m,
    label: monthLabel(m),
    complete: daysBetween(`${m}-01`, today) > daysBetween(`${m}-01`, `${addMonths(m, 1)}-01`),
  }));
}
