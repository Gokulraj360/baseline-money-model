import type { AppState, ScenarioLevers } from '../types';
import {
  currentBalance,
  fixedBaseline,
  flexibleBaseline,
  monthlyAmount,
  monthlyIncome,
  subscriptionRecurring,
  trailingCategoryAverage,
} from './finance';
import { addMonths, nowMonth } from '../lib/date';

export const DEFAULT_LEVERS: ScenarioLevers = {
  diningCut: 0,
  groceriesCut: 0,
  cancelledSubs: [],
  rentChange: 0,
  incomeChange: 0,
  oneOffAmount: 0,
  oneOffMonth: 2,
  extraSavings: 0,
  inflationRate: 0,
  jobLossMonths: 0,
};

export interface SimMonth {
  key: string;
  balance: number;
  net: number;
  inflow: number;
  outflow: number;
}

export interface GoalEta {
  id: string;
  name: string;
  monthIndex: number | null;
  monthKey: string | null;
  color: string;
}

export interface SimResult {
  months: SimMonth[];
  monthly: {
    income: number;
    fixed: number;
    flexible: number;
    dining: number;
    groceries: number;
    otherFlexible: number;
    extraSavings: number;
    surplus: number;
  };
  endBalance: number;
  minBalance: number;
  goalEtas: GoalEta[];
  monthlySubsSaved: number;
  annualSubsSaved: number;
  diningSaved: number;
  groceriesSaved: number;
  rentDelta: number;
  incomeDelta: number;
  runwayMonths: number;
}

export interface BaseModel {
  income: number;
  fixed: number;
  dining: number;
  groceries: number;
  otherFlexible: number;
  rent: number;
}

export function baseModel(state: AppState): BaseModel {
  const dining = trailingCategoryAverage(state.txns, ['dining', 'delivery'], 3);
  const groceries = trailingCategoryAverage(state.txns, ['groceries'], 3);
  const flexible = flexibleBaseline(state);
  return {
    income: monthlyIncome(state),
    fixed: fixedBaseline(state),
    dining,
    groceries,
    otherFlexible: Math.max(0, flexible - dining - groceries),
    rent:
      state.profile.fixed.filter((f) => f.category === 'rent').reduce((s, f) => s + f.amount, 0) ||
      flexible * 0,
  };
}

export function goalEtas(
  startMonth: string,
  goals: AppState['goals'],
  monthlyForGoals: number,
  startIndex = 0
): GoalEta[] {
  const ordered = [...goals].filter((g) => !g.archived).sort((a, b) => a.priority - b.priority);
  if (monthlyForGoals <= 0) {
    return ordered.map((g) => ({
      id: g.id,
      name: g.name,
      monthIndex: null,
      monthKey: null,
      color: g.color,
    }));
  }
  const remaining = ordered.map((g) => Math.max(0, g.target - g.saved));
  const result: GoalEta[] = ordered.map((g) => ({
    id: g.id,
    name: g.name,
    monthIndex: remaining[ordered.indexOf(g)] === 0 ? 0 : null,
    monthKey: remaining[ordered.indexOf(g)] === 0 ? addMonths(startMonth, 0) : null,
    color: g.color,
  }));

  let month = 0;
  const maxMonths = 240;
  while (month < maxMonths && remaining.some((r) => r > 0)) {
    month += 1;
    let pool = monthlyForGoals;
    for (let i = 0; i < remaining.length && pool > 0; i++) {
      if (remaining[i] <= 0) continue;
      const take = Math.min(pool, remaining[i]);
      remaining[i] -= take;
      pool -= take;
      if (remaining[i] <= 0 && result[i].monthIndex === null) {
        result[i].monthIndex = month + startIndex;
        result[i].monthKey = addMonths(startMonth, month - 1);
      }
    }
  }
  return result;
}

export function runSimulation(state: AppState, levers: ScenarioLevers, horizon = 12): SimResult {
  const base = baseModel(state);
  const subs = subscriptionRecurring(state);
  const monthlySubsSaved = subs
    .filter((r) => levers.cancelledSubs.includes(r.id))
    .reduce((s, r) => s + monthlyAmount(r.amount, r.cadence), 0);

  const baseIncome = base.income * (1 + levers.incomeChange / 100);
  const rent = base.rent * (1 + levers.rentChange / 100);
  const rentDelta = rent - base.rent;
  const dining = base.dining * (1 - levers.diningCut / 100);
  const groceries = base.groceries * (1 - levers.groceriesCut / 100);
  const fixed = base.fixed - monthlySubsSaved + rentDelta;
  const baseFlexible = dining + groceries + base.otherFlexible;
  const surplus = baseIncome - fixed - baseFlexible - levers.extraSavings;

  const start = addMonths(nowMonth(), 1);
  const balance0 = currentBalance(state);
  let balance = balance0;
  const months: SimMonth[] = [];
  const inflationAnnual = levers.inflationRate ?? 0;
  const jobLoss = levers.jobLossMonths ?? 0;

  for (let i = 0; i < horizon; i++) {
    // Model job loss shock if active for first N months
    const monthIncome = i < jobLoss ? 0 : baseIncome;
    // Model inflation compounding on flexible costs
    const inflationMultiplier = Math.pow(1 + inflationAnnual / 100 / 12, i);
    const monthFlexible = baseFlexible * inflationMultiplier;

    const oneOff = i === levers.oneOffMonth ? levers.oneOffAmount : 0;
    const net = monthIncome - fixed - monthFlexible - levers.extraSavings - oneOff;
    balance += net;
    months.push({
      key: addMonths(start, i),
      balance,
      net,
      inflow: monthIncome,
      outflow: fixed + monthFlexible + levers.extraSavings + oneOff,
    });
  }

  const etas = goalEtas(start, state.goals, surplus);

  return {
    months,
    monthly: {
      income: baseIncome,
      fixed,
      flexible: baseFlexible,
      dining,
      groceries,
      otherFlexible: base.otherFlexible,
      extraSavings: levers.extraSavings,
      surplus,
    },
    endBalance: balance,
    minBalance: Math.min(...months.map((m) => m.balance), balance0),
    goalEtas: etas,
    monthlySubsSaved,
    annualSubsSaved: monthlySubsSaved * 12,
    diningSaved: base.dining - dining,
    groceriesSaved: base.groceries - groceries,
    rentDelta,
    incomeDelta: baseIncome - base.income,
    runwayMonths: fixed + baseFlexible > 0 ? balance0 / (fixed + baseFlexible) : 0,
  };
}

export function baselineResult(state: AppState, horizon = 12): SimResult {
  return runSimulation(state, DEFAULT_LEVERS, horizon);
}

export function scenarioSummary(levers: ScenarioLevers): string[] {
  const out: string[] = [];
  if (levers.diningCut) out.push(`Dining out and delivery cut ${levers.diningCut}%`);
  if (levers.groceriesCut) out.push(`Groceries cut ${levers.groceriesCut}%`);
  if (levers.cancelledSubs.length) out.push(`${levers.cancelledSubs.length} subscriptions cancelled`);
  if (levers.rentChange) out.push(`Rent ${levers.rentChange > 0 ? 'up' : 'down'} ${Math.abs(levers.rentChange)}%`);
  if (levers.incomeChange) out.push(`Income ${levers.incomeChange > 0 ? 'up' : 'down'} ${Math.abs(levers.incomeChange)}%`);
  if (levers.oneOffAmount) out.push(`One-off ${levers.oneOffAmount.toLocaleString('en-IN')} in month ${levers.oneOffMonth + 1}`);
  if (levers.extraSavings) out.push(`Extra savings of ${levers.extraSavings.toLocaleString('en-IN')}/mo`);
  if (levers.inflationRate) out.push(`Inflation stress-test at ${levers.inflationRate}%/year`);
  if (levers.jobLossMonths) out.push(`Job loss / income shock modeled for ${levers.jobLossMonths} month${levers.jobLossMonths > 1 ? 's' : ''}`);
  return out.length ? out : ['Baseline — no changes'];
}

export function leverCount(levers: ScenarioLevers): number {
  return (
    (levers.diningCut ? 1 : 0) +
    (levers.groceriesCut ? 1 : 0) +
    levers.cancelledSubs.length +
    (levers.rentChange ? 1 : 0) +
    (levers.incomeChange ? 1 : 0) +
    (levers.oneOffAmount ? 1 : 0) +
    (levers.extraSavings ? 1 : 0) +
    (levers.inflationRate ? 1 : 0) +
    (levers.jobLossMonths ? 1 : 0)
  );
}

export interface ScenarioComparison {
  id: string;
  name: string;
  endBalance: number;
  deltaEndBalance: number;
  surplus: number;
  minBalance: number;
  runwayMonths: number;
  firstGoalETA: string | null;
}

export function compareScenarios(
  state: AppState,
  scenarios: { id: string; name: string; levers: ScenarioLevers }[]
): ScenarioComparison[] {
  const base = baselineResult(state, 12);
  return scenarios.map((s) => {
    const res = runSimulation(state, s.levers, 12);
    const firstEta = res.goalEtas.find((g) => g.monthKey !== null)?.monthKey ?? null;
    return {
      id: s.id,
      name: s.name,
      endBalance: res.endBalance,
      deltaEndBalance: res.endBalance - base.endBalance,
      surplus: res.monthly.surplus,
      minBalance: res.minBalance,
      runwayMonths: res.runwayMonths,
      firstGoalETA: firstEta,
    };
  });
}
