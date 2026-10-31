import type { Recurring, Txn } from '../types';
import { monthKey } from '../lib/date';
import { isCounted } from './finance';

const normalize = (s: string) =>
  s.toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 24);

const median = (nums: number[]): number => {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

export interface DetectedRecurring {
  merchant: string;
  category: string;
  amount: number;
  cadence: Recurring['cadence'];
  confidence: number;
  occurrences: number;
  lastDate: string;
  nextDate: string;
  dates: string[];
}

function cadenceFor(medianGap: number): Recurring['cadence'] | null {
  if (medianGap >= 5 && medianGap <= 9) return 'weekly';
  if (medianGap >= 24 && medianGap <= 37) return 'monthly';
  if (medianGap >= 78 && medianGap <= 100) return 'quarterly';
  if (medianGap >= 330 && medianGap <= 400) return 'yearly';
  return null;
}

/**
 * Groups outflow transactions by merchant and looks for a stable rhythm:
 * at least 3 hits, a consistent cadence, and amounts within 20% of the median.
 */
export function detectRecurring(txns: Txn[], existing: Recurring[]): DetectedRecurring[] {
  const known = new Set(existing.map((r) => normalize(r.merchant)));
  const knownAmounts = new Set(
    existing.map((r) => `${r.category}:${Math.round(r.cadence === 'yearly' ? r.amount / 12 : r.amount)}`)
  );
  const groups = new Map<string, { merchant: string; category: string; items: Txn[] }>();

  for (const t of txns) {
    if (!isCounted(t) || t.amount >= 0) continue;
    const key = normalize(t.merchant || t.description);
    if (!key || key.length < 3) continue;
    if (!groups.has(key)) groups.set(key, { merchant: t.merchant || t.description, category: t.category, items: [] });
    groups.get(key)!.items.push(t);
  }

  const out: DetectedRecurring[] = [];
  for (const [, group] of groups) {
    if (group.items.length < 3) continue;
    if (known.has(normalize(group.merchant))) continue;
    const items = group.items.sort((a, b) => (a.date < b.date ? -1 : 1));
    const gaps: number[] = [];
    for (let i = 1; i < items.length; i++) {
      gaps.push((Date.parse(items[i].date) - Date.parse(items[i - 1].date)) / 86400000);
    }
    const gap = median(gaps);
    const cadence = cadenceFor(gap);
    if (!cadence) continue;
    const amounts = items.map((t) => Math.abs(t.amount));
    const med = median(amounts);
    const within = amounts.filter((a) => Math.abs(a - med) / med <= 0.2).length / amounts.length;
    if (within < 0.7) continue;
    if (knownAmounts.has(`${group.category}:${Math.round(cadence === 'yearly' ? med / 12 : med)}`)) continue;

    const regularity = gaps.filter((g) => Math.abs(g - gap) <= Math.max(3, gap * 0.15)).length / gaps.length;
    const confidence = Math.min(0.98, 0.55 + Math.min(0.2, items.length * 0.035) + regularity * 0.2);
    const last = items[items.length - 1].date;
    const nextDate = addCadence(last, cadence);

    out.push({
      merchant: group.merchant,
      category: group.category,
      amount: Math.round(med),
      cadence,
      confidence: Math.round(confidence * 100) / 100,
      occurrences: items.length,
      lastDate: last,
      nextDate,
      dates: items.map((i) => i.date),
    });
  }
  return out.sort((a, b) => b.amount - a.amount);
}

export function addCadence(iso: string, cadence: Recurring['cadence']): string {
  const d = new Date(iso);
  const step = cadence === 'weekly' ? 7 : cadence === 'monthly' ? 30 : cadence === 'quarterly' ? 91 : 365;
  d.setDate(d.getDate() + step);
  return d.toISOString().slice(0, 10);
}

export function detectPriceChange(r: Recurring): { from: number; to: number; delta: number; pct: number; since: string } | null {
  if (r.priceHistory.length < 2) return null;
  const sorted = [...r.priceHistory].sort((a, b) => (a.date < b.date ? -1 : 1));
  const last = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];
  if (last.amount <= prev.amount) return null;
  return {
    from: prev.amount,
    to: last.amount,
    delta: last.amount - prev.amount,
    pct: ((last.amount - prev.amount) / prev.amount) * 100,
    since: last.date,
  };
}

export function subscriptionTotal(rec: Recurring[]): { monthly: number; annual: number } {
  const monthly = rec.reduce((s, r) => {
    if (r.status === 'cancelled') return s;
    const amt = r.cadence === 'yearly' ? r.amount / 12 : r.cadence === 'quarterly' ? r.amount / 3 : r.amount;
    return s + amt;
  }, 0);
  return { monthly, annual: monthly * 12 };
}

export function unusedTotal(rec: Recurring[]): number {
  return rec
    .filter((r) => r.usage === 'unused' && r.status !== 'cancelled')
    .reduce((s, r) => s + (r.cadence === 'yearly' ? r.amount / 12 : r.amount), 0);
}

export function monthsOfHistory(txns: Txn[]): number {
  return new Set(txns.map((t) => monthKey(t.date))).size;
}
