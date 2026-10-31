import { describe, expect, it } from 'vitest';
import type { AppState, Txn } from '../../types';
import { parseAmountLoose, parseCSV, parseDateLoose, parseSMS, parseStatementText, rowHash } from '../parse';
import { categorize, deriveRulePattern } from '../categorize';
import { detectRecurring } from '../recurring';
import { buildReport } from '../report';
import { deriveNudges } from '../nudges';
import {
  baseModel,
  calculateTaxDeductions,
  categoryPacing,
  currentBalance,
  detectAnomalies,
  emergencyCoverage,
  financialHealthScore,
  goalRequiredMonthly,
  monthlyIncome,
  safeToSpend,
  savingsRate,
  simulateDebtPayoff,
  summarizeMonth,
  weekendVsWeekday,
} from '../finance';
import { baselineResult, compareScenarios, runSimulation } from '../simulate';
import { buildSeedTxns, SAMPLE_CSV, SAMPLE_SMS, seedState } from '../../data/seed';

describe('parsing messy statements', () => {
  it('reads Indian and ISO date shapes', () => {
    expect(parseDateLoose('04/10/2026')).toBe('2026-10-04');
    expect(parseDateLoose('31-10-26')).toBe('2026-10-31');
    expect(parseDateLoose('2026-10-04')).toBe('2026-10-04');
    expect(parseDateLoose('4 Oct 2026')).toBe('2026-10-04');
    expect(parseDateLoose('October 4, 2026')).toBe('2026-10-04');
    expect(parseDateLoose('not a date')).toBeNull();
  });

  it('understands debits, credits, brackets, and currency noise', () => {
    expect(parseAmountLoose('1,234.50')).toBe(1234.5);
    expect(parseAmountLoose('486.00 DR')).toBe(-486);
    expect(parseAmountLoose('(2,400)')).toBe(-2400);
    expect(parseAmountLoose('Rs. 1,42,000.00')).toBe(142000);
    expect(parseAmountLoose('0')).toBeNull();
    expect(parseAmountLoose('garbage')).toBeNull();
  });

  it('parses the sample CSV with its warning rows and footer noise', () => {
    const result = parseCSV(SAMPLE_CSV, 'sample.csv');
    expect(result.rows.length).toBeGreaterThanOrEqual(12);
    expect(result.errors).toEqual([]);
    const first = result.rows[0];
    expect(first.date).toBe('2026-10-04');
    expect(first.amount).toBe(-486);
    expect(first.description).toContain('SWIGGY');
  });

  it('parses bank SMS alerts and signs credits correctly', () => {
    const result = parseSMS(SAMPLE_SMS, 'alerts.txt');
    expect(result.rows.length).toBeGreaterThanOrEqual(5);
    const salary = result.rows.find((r) => /salary/i.test(r.description));
    expect(salary?.amount).toBe(142000);
    const swiggy = result.rows.find((r) => /SWIGGY/i.test(r.description));
    expect(swiggy?.amount).toBe(-486);
  });

  it('parses text-layer PDF statement lines with DR/CR and balance', () => {
    const text = [
      'HDFC BANK LIMITED',
      '04/10/2026 SWIGGY BANGALORE 486.00 DR 184320.50',
      '30/10/2026 SALARY NIMBUS LABS 142000.00 CR 268354.50',
    ].join('\n');
    const result = parseStatementText(text, 'statement.pdf');
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0].amount).toBe(-486);
    expect(result.rows[0].balance).toBe(184320.5);
    expect(result.rows[1].amount).toBe(142000);
  });

  it('fingerprints the same line identically and different lines apart', () => {
    const a = rowHash('2026-10-04', 486, 'SWIGGY BANGALORE');
    const b = rowHash('2026-10-04', 486, 'swiggy   bangalore');
    const c = rowHash('2026-10-04', 487, 'SWIGGY BANGALORE');
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });
});

describe('categorisation and learned rules', () => {
  it('recognises Indian merchants with reasons', () => {
    expect(categorize('UPI/SWIGGY/4152093', -486, []).category).toBe('delivery');
    expect(categorize('UPI/BIGBASKET/123', -2140, []).category).toBe('groceries');
    expect(categorize('SALARY NIMBUS LABS', 142000, []).category).toBe('income');
    expect(categorize('LANDLORD RENT', -42000, []).category).toBe('rent');
    expect(categorize('SOMETHING UNKNOWN', -500, []).category).toBe('other');
  });

  it('lets a user rule outrank the built-in patterns', () => {
    const rules = [
      {
        id: 'r1',
        pattern: 'SWIGGY',
        field: 'description' as const,
        matchType: 'contains' as const,
        category: 'groceries',
        source: 'learned' as const,
        priority: 90,
        hits: 1,
        enabled: true,
        createdAt: 0,
      },
    ];
    const result = categorize('UPI/SWIGGY/4152093', -486, rules);
    expect(result.category).toBe('groceries');
    expect(result.why.toLowerCase()).toContain('rule');
  });

  it('derives a reusable pattern from a messy narration', () => {
    expect(deriveRulePattern('UPI/SWIGGY/4152093', 'Swiggy')).toBe('SWIGGY');
    expect(deriveRulePattern('NEFT-ACME RENTALS-8842', 'Acme Rentals')).toBe('ACME RENTALS');
    expect(deriveRulePattern('TRUFFLES ST MARKS ROAD', 'TRUFFLES ST MARKS ROAD')).toBe('TRUFFLES ST MARKS ROAD');
  });

  it('corrects and retroactively matches past transactions with a learned pattern', () => {
    const pattern = deriveRulePattern('TRUFFLES ST MARKS ROAD', 'Truffles');
    const pastTxns = [
      { id: 't1', description: 'TRUFFLES ST MARKS ROAD', category: 'other' },
      { id: 't2', description: 'TRUFFLES ST MARKS ROAD', category: 'other' },
      { id: 't3', description: 'SOME OTHER CAFE', category: 'other' },
    ];
    const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const matches = pastTxns.filter((t) => re.test(t.description) && t.category !== 'dining');
    expect(matches).toHaveLength(2);
    expect(matches.map((m) => m.id)).toEqual(['t1', 't2']);
  });
});

describe('the money model', () => {
  const state = seedState();

  it('counts only approved, non-transfer lines', () => {
    const summary = summarizeMonth(state.txns, '2026-10');
    expect(summary.count).toBeGreaterThan(0);
    expect(summary.income).toBeGreaterThan(0);
    expect(summary.outflow).toBeGreaterThan(0);
    expect(summary.surplus).toBe(summary.income - summary.outflow);
  });

  it('reconstructs the current balance from the opening balance', () => {
    const expected =
      state.profile.openingBalance +
      state.txns
        .filter((t) => !t.pending && !t.isExcluded && !t.isTransfer)
        .reduce((s, t) => s + t.amount, 0);
    expect(currentBalance(state)).toBeCloseTo(expected, 2);
  });

  it('never lets safe-to-spend exceed the balance', () => {
    const safe = safeToSpend(state);
    expect(safe.safe).toBeLessThanOrEqual(safe.balance);
    expect(safe.buffer).toBeGreaterThan(0);
    expect(safe.scheduled).toBeGreaterThanOrEqual(0);
  });

  it('has an emergency fund and a calculable coverage ratio', () => {
    expect(state.profile.emergencySaved).toBeGreaterThan(0);
    expect(emergencyCoverage(state)).toBeGreaterThan(0);
  });

  it('computes income, savings rate, and a baseline split', () => {
    expect(monthlyIncome(state)).toBeGreaterThan(100000);
    expect(savingsRate(state)).toBeGreaterThanOrEqual(0);
    const base = baseModel(state);
    expect(base.fixed).toBeGreaterThan(0);
    expect(base.dining).toBeGreaterThan(0);
    expect(base.groceries).toBeGreaterThan(0);
    expect(base.otherFlexible).toBeGreaterThanOrEqual(0);
  });

  it('requires more per month when a goal is closer', () => {
    const near = { ...state.goals[0], targetDate: '2026-12-31' };
    const far = { ...state.goals[0], targetDate: '2028-12-31' };
    expect(goalRequiredMonthly(near)).toBeGreaterThan(goalRequiredMonthly(far));
  });
});

describe('recurring detection', () => {
  const txn = (id: number, date: string, amount: number, merchant = 'NETFLIX'): Txn => ({
    id: `t${id}`,
    date,
    description: `${merchant} SUBSCRIPTION`,
    merchant,
    amount,
    category: 'subscriptions',
    confidence: 1,
    why: 'test',
    accountId: 'acc_hdfc',
    source: 'seed',
    hash: `h${id}`,
  });

  it('finds a stable monthly subscription', () => {
    const rows = [
      txn(1, '2026-07-12', -649),
      txn(2, '2026-08-12', -649),
      txn(3, '2026-09-12', -649),
      txn(4, '2026-10-12', -649),
    ];
    const found = detectRecurring(rows, []);
    expect(found).toHaveLength(1);
    expect(found[0].cadence).toBe('monthly');
    expect(found[0].amount).toBe(649);
    expect(found[0].confidence).toBeGreaterThan(0.6);
  });

  it('does not re-detect something already in the recurring list', () => {
    const rows = [
      txn(1, '2026-08-12', -649),
      txn(2, '2026-09-12', -649),
      txn(3, '2026-10-12', -649),
    ];
    const existing = [
      {
        id: 'rec1',
        merchant: 'Netflix',
        category: 'subscriptions',
        amount: 649,
        cadence: 'monthly' as const,
        nextDate: '2026-11-12',
        lastDate: '2026-10-12',
        status: 'active' as const,
        priceHistory: [],
        usage: 'used' as const,
        detectedFrom: 4,
        accountId: 'acc_hdfc',
        source: 'manual' as const,
      },
    ];
    expect(detectRecurring(rows, existing)).toHaveLength(0);
  });

  it('ignores one-off and irregular spending', () => {
    const rows = [
      txn(1, '2026-07-02', -1200, 'RANDOM SHOP'),
      txn(2, '2026-07-19', -800, 'RANDOM SHOP'),
      txn(3, '2026-09-30', -2400, 'RANDOM SHOP'),
    ];
    expect(detectRecurring(rows, [])).toHaveLength(0);
  });
});

describe('what-if simulation', () => {
  const state = seedState();

  it('projects a consistent horizon and starting balance', () => {
    const sim = baselineResult(state, 12);
    expect(sim.months).toHaveLength(12);
    expect(sim.months[0].balance).toBeCloseTo(currentBalance(state) + sim.months[0].net, 2);
  });

  it('cancelling subscriptions leaves more money at the end', () => {
    const base = baselineResult(state, 12);
    const sub = state.recurring.find((r) => r.category === 'subscriptions' && r.status !== 'cancelled');
    expect(sub).toBeDefined();
    const result = runSimulation(
      state,
      { diningCut: 0, groceriesCut: 0, cancelledSubs: [sub!.id], rentChange: 0, incomeChange: 0, oneOffAmount: 0, oneOffMonth: 2, extraSavings: 0 },
      12
    );
    expect(result.monthlySubsSaved).toBeGreaterThan(0);
    expect(result.endBalance).toBeGreaterThan(base.endBalance);
  });

  it('a rent rise reduces surplus and end balance', () => {
    const base = baselineResult(state, 6);
    const rise = runSimulation(
      state,
      { diningCut: 0, groceriesCut: 0, cancelledSubs: [], rentChange: 10, incomeChange: 0, oneOffAmount: 0, oneOffMonth: 2, extraSavings: 0 },
      6
    );
    expect(rise.rentDelta).toBeGreaterThan(0);
    expect(rise.monthly.surplus).toBeLessThan(base.monthly.surplus);
    expect(rise.endBalance).toBeLessThan(base.endBalance);
  });

  it('a one-off purchase shows up in exactly one month', () => {
    const result = runSimulation(
      state,
      { diningCut: 0, groceriesCut: 0, cancelledSubs: [], rentChange: 0, incomeChange: 0, oneOffAmount: 50000, oneOffMonth: 3, extraSavings: 0 },
      4
    );
    expect(result.months[3].net).toBeLessThan(result.months[2].net);
    expect(result.months[2].net).toBe(result.months[1].net);
  });

  it('goal ETAs shrink when more is saved each month', () => {
    const base = baselineResult(state, 12);
    const aggressive = runSimulation(
      state,
      { diningCut: 40, groceriesCut: 20, cancelledSubs: [], rentChange: 0, incomeChange: 0, oneOffAmount: 0, oneOffMonth: 2, extraSavings: 0 },
      12
    );
    const baseMonth = base.goalEtas.find((g) => g.monthIndex !== null)?.monthIndex ?? 999;
    const fastMonth = aggressive.goalEtas.find((g) => g.monthIndex !== null)?.monthIndex ?? 999;
    expect(fastMonth).toBeLessThanOrEqual(baseMonth);
  });
});

describe('reports and nudges', () => {
  const state = seedState();

  it('builds a month report with narrative, categories, and goals', () => {
    const report = buildReport(state, '2026-10');
    expect(report.month).toBe('2026-10');
    expect(report.narrative.length).toBeGreaterThan(0);
    expect(report.categories.length).toBeGreaterThan(0);
    expect(report.goals.length).toBeGreaterThan(0);
    expect(report.wins.length + report.slippage.length).toBeGreaterThan(0);
    expect(report.subscriptions.monthly).toBeGreaterThan(0);
  });

  it('generates nudges without any investment recommendation', () => {
    const nudges = deriveNudges(state);
    expect(nudges.length).toBeGreaterThan(0);
    const text = nudges.map((n) => `${n.title} ${n.body} ${n.math ?? ''}`).join(' ').toLowerCase();
    expect(text).not.toMatch(/buy (a )?(stock|fund|mutual fund|sip)/);
    expect(text).not.toMatch(/guaranteed return/);
  });

  it('seeded transactions are deterministic and span six months', () => {
    const again = buildSeedTxns();
    expect(again.length).toBe(state.txns.length);
    expect(again.map((t) => t.id)).toEqual(state.txns.map((t) => t.id));
    const months = new Set(state.txns.map((t) => t.date.slice(0, 7)));
    expect(months.size).toBeGreaterThanOrEqual(5);
  });
});

describe('advanced financial intelligence functions', () => {
  const state = seedState();

  it('computes financial health score (0-100 index) with subscores', () => {
    const health = financialHealthScore(state);
    expect(health.score).toBeGreaterThanOrEqual(0);
    expect(health.score).toBeLessThanOrEqual(100);
    expect(['Excellent', 'Good', 'Fair', 'Needs Attention']).toContain(health.grade);
    expect(health.pillars).toHaveLength(4);
    health.pillars.forEach((p) => {
      expect(p.score).toBeGreaterThanOrEqual(0);
      expect(p.max).toBeGreaterThan(0);
    });
  });

  it('calculates category pacing against monthly budget ceilings', () => {
    const pacing = categoryPacing(state);
    expect(pacing.length).toBeGreaterThan(0);
    const dining = pacing.find((p) => p.category === 'dining');
    expect(dining).toBeDefined();
    expect(dining?.budget).toBeGreaterThan(0);
    expect(['fast', 'under', 'on-track']).toContain(dining?.status);
    expect(dining?.pctMonth).toBeGreaterThanOrEqual(0);
  });

  it('detects duplicate debit anomalies and spend spikes', () => {
    const mockTxns: Txn[] = [
      { id: 'tx1', date: '2026-10-10', description: 'SWIGGY ORDER', merchant: 'Swiggy', amount: -540, category: 'dining', confidence: 1, why: 'test', accountId: 'acc_hdfc', source: 'seed', hash: 'h1' },
      { id: 'tx2', date: '2026-10-10', description: 'SWIGGY ORDER', merchant: 'Swiggy', amount: -540, category: 'dining', confidence: 1, why: 'test', accountId: 'acc_hdfc', source: 'seed', hash: 'h2' },
      { id: 'tx3', date: '2026-10-12', description: 'LUXURY WATCH', merchant: 'Titan', amount: -85000, category: 'shopping', confidence: 1, why: 'test', accountId: 'acc_hdfc', source: 'seed', hash: 'h3' },
    ];
    const anomalies = detectAnomalies(mockTxns);
    expect(anomalies.length).toBeGreaterThanOrEqual(1);
    const dup = anomalies.find((a) => a.type === 'duplicate');
    expect(dup).toBeDefined();
    expect(dup?.label).toContain('duplicate');
  });

  it('computes weekend vs weekday discretionary spending breakdown', () => {
    const impulse = weekendVsWeekday(state.txns, '2026-10');
    expect(impulse.weekendAmount).toBeGreaterThanOrEqual(0);
    expect(impulse.weekdayAmount).toBeGreaterThanOrEqual(0);
    expect(typeof impulse.weekendPct).toBe('number');
  });

  it('calculates Chapter VI-A Indian Income Tax deductions (80C, 80D, HRA)', () => {
    const tax = calculateTaxDeductions(state);
    expect(tax.sec80C.limit).toBe(150000);
    expect(tax.sec80D.limit).toBe(25000);
    expect(tax.sec80C.current).toBeLessThanOrEqual(150000);
    expect(tax.sec80D.current).toBeLessThanOrEqual(25000);
    expect(tax.totalEligible).toBe(tax.sec80C.current + tax.sec80D.current);
    expect(tax.hra.rentPaid).toBeGreaterThan(0);
  });

  it('simulates debt payoff and extra payment interest acceleration', () => {
    const debts = state.profile.debts || [
      { id: 'd1', name: 'Car Loan', principal: 300000, interestRate: 9.0, minimumMonthly: 7000 },
      { id: 'd2', name: 'Credit Card', principal: 40000, interestRate: 36.0, minimumMonthly: 2000 },
    ];
    const base = simulateDebtPayoff(debts, 0, 'avalanche');
    const accelerated = simulateDebtPayoff(debts, 5000, 'avalanche');
    expect(base.monthsToPayoff).toBeGreaterThan(0);
    expect(accelerated.monthsToPayoff).toBeLessThanOrEqual(base.monthsToPayoff);
    expect(accelerated.totalInterestPaid).toBeLessThanOrEqual(base.totalInterestPaid);
  });

  it('simulates macroeconomic inflation compounding on flexible spend', () => {
    const noInflation = runSimulation(state, { diningCut: 0, groceriesCut: 0, cancelledSubs: [], rentChange: 0, incomeChange: 0, oneOffAmount: 0, oneOffMonth: 2, extraSavings: 0, inflationRate: 0 }, 12);
    const withInflation = runSimulation(state, { diningCut: 0, groceriesCut: 0, cancelledSubs: [], rentChange: 0, incomeChange: 0, oneOffAmount: 0, oneOffMonth: 2, extraSavings: 0, inflationRate: 10 }, 12);
    expect(withInflation.endBalance).toBeLessThan(noInflation.endBalance);
  });

  it('simulates income shock and job loss scenario with zero salary months', () => {
    const normal = runSimulation(state, { diningCut: 0, groceriesCut: 0, cancelledSubs: [], rentChange: 0, incomeChange: 0, oneOffAmount: 0, oneOffMonth: 2, extraSavings: 0, jobLossMonths: 0 }, 12);
    const shock = runSimulation(state, { diningCut: 0, groceriesCut: 0, cancelledSubs: [], rentChange: 0, incomeChange: 0, oneOffAmount: 0, oneOffMonth: 2, extraSavings: 0, jobLossMonths: 3 }, 12);
    expect(shock.endBalance).toBeLessThan(normal.endBalance);
  });

  it('compares multiple scenarios side-by-side with compareScenarios', () => {
    const comparison = compareScenarios(state, [
      { id: 'sc_base', name: 'Baseline', levers: { diningCut: 0, groceriesCut: 0, cancelledSubs: [], rentChange: 0, incomeChange: 0, oneOffAmount: 0, oneOffMonth: 1, extraSavings: 0 } },
      { id: 'sc_austerity', name: 'Austerity', levers: { diningCut: 50, groceriesCut: 25, cancelledSubs: [], rentChange: 0, incomeChange: 0, oneOffAmount: 0, oneOffMonth: 1, extraSavings: 0 } },
    ]);
    expect(comparison).toHaveLength(2);
    expect(comparison[1].endBalance).toBeGreaterThan(comparison[0].endBalance);
  });
});
