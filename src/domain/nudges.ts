import type { AppState, Nudge, NudgeKind } from '../types';
import { money, pct } from '../lib/format';
import { addMonths, daysBetween, nowMonth, todayISO } from '../lib/date';
import {
  emergencyCoverage,
  fixedBaseline,
  flexibleBaseline,
  goalRequiredMonthly,
  monthlyIncome,
  summarizeMonth,
  trailingCategoryAverage,
} from './finance';
import { detectPriceChange } from './recurring';

const SEVERITY_RANK: Record<Nudge['severity'], number> = { critical: 0, warn: 1, info: 2 };

export function deriveNudges(state: AppState): Nudge[] {
  const out: Nudge[] = [];
  const month = nowMonth();
  const today = todayISO();
  const summary = summarizeMonth(state.txns, month);
  const now = Date.now();

  // 1. Category drift against the trailing three-month average.
  const driftCats = ['dining', 'delivery', 'groceries', 'shopping', 'transport', 'entertainment'];
  const drifts = driftCats
    .map((cat) => {
      const current = summary.byCategory.find((c) => c.category === cat)?.amount ?? 0;
      const avg = trailingCategoryAverage(state.txns, [cat], 3);
      return { cat, current, avg, delta: current - avg, pct: avg > 0 ? ((current - avg) / avg) * 100 : 0 };
    })
    .filter((d) => d.avg > 0 && d.delta > 500 && d.pct > 15)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 2);

  for (const d of drifts) {
    out.push({
      id: `drift:${d.cat}:${month}`,
      kind: 'drift',
      severity: d.pct > 40 ? 'critical' : 'warn',
      title: `${d.cat === 'delivery' ? 'Food delivery' : d.cat[0].toUpperCase() + d.cat.slice(1)} is running hot`,
      body: `You've spent ${money(d.current)} on ${d.cat} this month — ${money(d.delta)} (${pct(d.pct)}) above your three-month average of ${money(d.avg)}.`,
      math: `${money(d.current)} this month vs ${money(d.avg)} average. If this repeats, it costs ${money(d.delta * 12)} a year.`,
      createdAt: now,
      status: 'open',
      actionLabel: 'Open transactions',
      actionRoute: '#/transactions?category=' + d.cat,
    });
  }

  // 2. Price changes on detected recurring payments.
  for (const r of state.recurring) {
    if (r.status === 'cancelled') continue;
    const change = detectPriceChange(r);
    if (!change) continue;
    out.push({
      id: `price:${r.id}:${change.since}`,
      kind: 'price-change',
      severity: 'warn',
      title: `${r.merchant} raised its price`,
      body: `The charge moved from ${money(change.from)} to ${money(change.to)} — a ${pct(change.pct)} increase, effective ${change.since}.`,
      math: `That's ${money(change.delta)} more each month, or ${money(change.delta * 12)} more a year if you keep it.`,
      createdAt: now,
      status: 'open',
      actionLabel: 'Review subscriptions',
      actionRoute: '#/recurring',
    });
  }

  // 3. Unused subscriptions.
  const unused = state.recurring.filter((r) => r.usage === 'unused' && r.status !== 'cancelled');
  if (unused.length) {
    const monthly = unused.reduce(
      (s, r) => s + (r.cadence === 'yearly' ? r.amount / 12 : r.amount),
      0
    );
    out.push({
      id: 'unused:subscriptions',
      kind: 'unused',
      severity: 'warn',
      title: `${unused.length} subscriptions look dormant`,
      body: `${unused.map((u) => u.merchant).join(' and ')} are still being charged but show no usage signals.`,
      math: `${money(monthly)} a month — ${money(monthly * 12)} a year — for services you may not be using.`,
      createdAt: now,
      status: 'open',
      actionLabel: 'Review them',
      actionRoute: '#/recurring',
    });
  }

  // 4. Goals that are behind their target date.
  const behind = state.goals
    .filter((g) => !g.archived && g.saved < g.target)
    .map((g) => ({ g, required: goalRequiredMonthly(g) }))
    .filter((x) => x.g.monthly < x.required * 0.92)
    .sort((a, b) => b.required - a.required)
    .slice(0, 2);

  for (const { g, required } of behind) {
    out.push({
      id: `goal:${g.id}`,
      kind: 'goal',
      severity: 'info',
      title: `${g.name} needs a bigger contribution`,
      body: `Keeping ${money(g.monthly)} a month gets you to ${money(g.saved)} of ${money(g.target)} by ${g.targetDate}.`,
      math: `To finish on time you need ${money(required)} a month — ${money(required - g.monthly)} more than today.`,
      createdAt: now,
      status: 'open',
      actionLabel: 'Open goal planner',
      actionRoute: '#/plan',
    });
  }

  // 5. Emergency buffer.
  const coverage = emergencyCoverage(state);
  if (coverage < 3) {
    out.push({
      id: 'buffer:emergency',
      kind: 'buffer',
      severity: coverage < 1.5 ? 'warn' : 'info',
      title: 'Emergency fund is under three months',
      body: `You have ${money(state.profile.emergencySaved)} set aside, which covers ${coverage.toFixed(1)} months of essential spending.`,
      math: `Three months of essentials is about ${money(
        (state.profile.emergencySaved / Math.max(coverage, 0.1)) * 3
      )}. The gap is ${money(
        Math.max(0, (state.profile.emergencySaved / Math.max(coverage, 0.1)) * 3 - state.profile.emergencySaved)
      )}.`,
      createdAt: now,
      status: 'open',
      actionLabel: 'Adjust the buffer',
      actionRoute: '#/plan',
    });
  }

  // 6. Payday check.
  const salary = state.profile.income[0];
  if (salary) {
    let next = salary.nextDate;
    if (next < today) next = `${addMonths(month, 1)}-01`;
    const inDays = daysBetween(today, next);
    if (inDays >= 0 && inDays <= 4) {
      out.push({
        id: `payday:${next}`,
        kind: 'payday',
        severity: 'info',
        title: inDays === 0 ? 'Salary lands today' : `Salary lands in ${inDays} day${inDays === 1 ? '' : 's'}`,
        body: `${money(monthlyIncome(state))} is expected on ${next}. Your committed costs for the next 30 days are ${money(
          fixedBaseline(state)
        )}.`,
        math: `Flexible spending baseline is ${money(flexibleBaseline(state))} a month. Allocating ${money(
          Math.max(0, monthlyIncome(state) - fixedBaseline(state) - flexibleBaseline(state))
        )} to goals keeps the plan on track.`,
        createdAt: now,
        status: 'open',
        actionLabel: 'Run a scenario',
        actionRoute: '#/simulate',
      });
    }
  }

  // 7. One unusually large purchase in the last fortnight.
  const recent = state.txns
    .filter((t) => t.date >= addMonths(month, -1) && t.amount < -2500 && t.date <= today)
    .filter((t) => t.date >= `${addMonths(month, -1)}-15`)
    .sort((a, b) => a.amount - b.amount);
  const big = recent[0];
  if (big) {
    const avg = trailingCategoryAverage(state.txns, [big.category], 3);
    if (avg > 0 && Math.abs(big.amount) > avg * 1.8) {
      out.push({
        id: `anomaly:${big.id}`,
        kind: 'anomaly',
        severity: 'info',
        title: 'One purchase stood out',
        body: `${big.merchant} for ${money(Math.abs(big.amount))} on ${big.date} is well above your usual ${money(avg)} on this category.`,
        math: 'A single large purchase is fine — it only matters if it becomes a pattern.',
        createdAt: now,
        status: 'open',
        actionLabel: 'Review the transaction',
        actionRoute: '#/transactions?q=' + encodeURIComponent(big.merchant),
      });
    }
  }

  const prefs = state.settings.nudgePrefs;
  return out
    .filter((n) => prefs[n.kind] !== false)
    .map((n) => ({ ...n, status: state.settings.nudgeStates[n.id] ?? n.status }))
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
}

export function openNudges(state: AppState): Nudge[] {
  return deriveNudges(state).filter((n) => n.status === 'open');
}

export function nudgeKindLabel(kind: NudgeKind): string {
  const map: Record<NudgeKind, string> = {
    drift: 'Spending drift',
    'price-change': 'Price change',
    unused: 'Unused subscription',
    goal: 'Goal pace',
    buffer: 'Emergency buffer',
    payday: 'Payday',
    anomaly: 'Unusual activity',
  };
  return map[kind];
}
