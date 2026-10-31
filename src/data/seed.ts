import type {
  Account,
  AppState,
  Debt,
  Goal,
  NudgeKind,
  Profile,
  Recurring,
  Rule,
  Settings,
  Txn,
} from '../types';
import { addMonths, daysInMonth, monthKey, nowMonth, todayISO } from '../lib/date';
import { categorize } from '../domain/categorize';
import { rowHash } from '../domain/parse';

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ACCOUNTS: Account[] = [
  { id: 'acc_hdfc', name: 'Everyday', institution: 'HDFC Bank', kind: 'savings', last4: '4412', balance: 0 },
  { id: 'acc_icici', name: 'Credit card', institution: 'ICICI Bank', kind: 'credit', last4: '8891', balance: 0 },
  { id: 'acc_cash', name: 'Cash', institution: 'Wallet', kind: 'cash', last4: '—', balance: 0 },
];

export const SEED_RULES: Rule[] = [
  {
    id: 'rule_thirdwave',
    pattern: 'THIRD WAVE',
    field: 'description',
    matchType: 'contains',
    category: 'dining',
    source: 'learned',
    priority: 40,
    hits: 7,
    enabled: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 64,
  },
  {
    id: 'rule_bescom',
    pattern: 'BESCOM',
    field: 'description',
    matchType: 'contains',
    category: 'utilities',
    source: 'learned',
    priority: 40,
    hits: 6,
    enabled: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 88,
  },
  {
    id: 'rule_nimbus',
    pattern: 'NIMBUS LABS',
    field: 'description',
    matchType: 'contains',
    category: 'income',
    source: 'manual',
    priority: 60,
    hits: 6,
    enabled: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 150,
  },
];

type Spec = {
  desc: string;
  min: number;
  max: number;
  freq: [number, number];
  account?: string;
};

const VARIABLE: Spec[] = [
  { desc: 'SWIGGY ORDER BANGALORE', min: 240, max: 860, freq: [5, 8] },
  { desc: 'ZOMATO ORDER KORAMANGALA', min: 260, max: 940, freq: [4, 7] },
  { desc: 'DOMINOS PIZZA INDIRANAGAR', min: 320, max: 780, freq: [1, 2] },
  { desc: 'EATFIT DAILY BOWL', min: 210, max: 480, freq: [2, 4] },
  { desc: 'TRUFFLES ST MARKS ROAD', min: 380, max: 920, freq: [1, 3] },
  { desc: 'TOIT BREWERY INDIRANAGAR', min: 900, max: 2400, freq: [1, 2] },
  { desc: 'THIRD WAVE COFFEE JAYANAGAR', min: 240, max: 620, freq: [2, 4] },
  { desc: 'RAMESHWARAM CAFE', min: 180, max: 460, freq: [1, 3] },
  { desc: 'BIGBASKET GROCERY', min: 1400, max: 3400, freq: [1, 3] },
  { desc: 'BLINKIT GROCERY DELIVERY', min: 380, max: 1150, freq: [3, 6] },
  { desc: 'DMART READY TO COOK', min: 900, max: 2400, freq: [1, 2] },
  { desc: 'ZEPTO MARKET', min: 260, max: 780, freq: [2, 4] },
  { desc: 'LICIOUS MEAT DELIVERY', min: 620, max: 1800, freq: [1, 2] },
  { desc: 'UBER RIDE BANGALORE', min: 120, max: 420, freq: [4, 7] },
  { desc: 'OLA CABS', min: 110, max: 380, freq: [2, 4] },
  { desc: 'RAPIDO BIKE TAXI', min: 55, max: 165, freq: [3, 6] },
  { desc: 'NAMMA METRO CARD TOPUP', min: 200, max: 500, freq: [1, 2] },
  { desc: 'INDIAN OIL PETROL', min: 1600, max: 3200, freq: [1, 2] },
  { desc: 'HP PETROL BUNK', min: 900, max: 2200, freq: [1, 1] },
  { desc: 'AMAZON SHOPPING', min: 600, max: 5400, freq: [2, 4] },
  { desc: 'FLIPKART BIG BILLION', min: 900, max: 4800, freq: [1, 2] },
  { desc: 'MYNTRA FASHION', min: 900, max: 3800, freq: [1, 2] },
  { desc: 'DECATHLON SPORTS', min: 700, max: 2600, freq: [0, 1] },
  { desc: 'BOOKMYSHOW MOVIE TICKETS', min: 380, max: 1400, freq: [1, 2] },
  { desc: 'PVR INOX CINEMAS', min: 340, max: 1100, freq: [0, 1] },
  { desc: 'APOLLO PHARMACY', min: 180, max: 1200, freq: [0, 2] },
  { desc: 'PHARMEASY MEDICINES', min: 240, max: 980, freq: [0, 1] },
  { desc: 'PRACTO CONSULTATION', min: 500, max: 900, freq: [0, 1] },
  { desc: 'NYKAA SALON INDIRANAGAR', min: 600, max: 2200, freq: [0, 1] },
  { desc: 'URBAN COMPANY HOME SERVICE', min: 700, max: 2400, freq: [0, 1] },
  { desc: 'COURSERA ANNUAL PLAN', min: 1200, max: 1200, freq: [0, 0] },
  { desc: 'IRCTC RAILWAY BOOKING', min: 900, max: 3200, freq: [0, 1] },
  { desc: 'MAKEMYTRIP FLIGHT BOOKING', min: 3200, max: 9800, freq: [0, 0] },
  { desc: 'ARCHIES GIFTS', min: 300, max: 1400, freq: [0, 1] },
  { desc: 'BANK SMS ALERT CHARGES', min: 25, max: 25, freq: [0, 0] },
];

export const SAMPLE_CSV = `HDFC Bank Statement - Savings Account XX4412
Statement period: 01/10/2026 to 31/10/2026

Date,Narration,Withdrawal Amt.,Deposit Amt.,Closing Balance
04/10/2026,UPI/SWIGGY/4152093,486.00,,184320.50
05/10/2026,UPI/THIRD WAVE COFFEE/881201,340.00,,183980.50
06/10/2026,ACH/ICICI PRUDENTIAL LIFE,4800.00,,179180.50
08/10/2026,UPI/BLINKIT/use.blinkit@ybl,742.00,,178438.50
11/10/2026,UPI/UBER INDIA/uber@axisbank,286.00,,178152.50
12/10/2026,NETFLIX SUBSCRIPTION,649.00,,177503.50
15/10/2026,UPI/CULTFIT INDIA,1799.00,,175704.50
17/10/2026,UPI/LANDLORD/9820012345,42000.00,,133704.50
18/10/2026,UPI/LINKEDIN PREMIUM,1299.00,,132405.50
21/10/2026,UPI/DECATHLON WHITEFIELD,2350.00,,130055.50
24/10/2026,UPI/TRUFFLES ST MARKS,860.00,,129195.50
27/10/2026,UPI/APOLLO PHARMACY,412.00,,128783.50
29/10/2026,IMPS/SELF TRANSFER,5000.00,,123783.50
30/10/2026,UPI/SWIGGY/4199283,486.00,,123297.50`;

export const SAMPLE_SMS = `HDFC Bank: Rs.486.00 debited from a/c XX4412 on 04-10-26 to SWIGGY. Avl bal Rs.1,84,320.50
ICICI Bank: INR 1,199.00 spent on Credit Card XX8891 at AIRTEL on 09/10/2026.
HDFC Bank: Rs.2,350.00 debited from a/c XX4412 on 21-10-26 to DECATHLON. Avl bal Rs.1,30,055.50
Axis Bank: Rs.1,299.00 debited from a/c XX2210 on 23-10-26 towards LINKEDIN PREMIUM.
HDFC Bank: Your A/C XX4412 credited with Rs 1,42,000.00 on 01-10-26 (Salary - OCT 2026).
SBI Card: Rs.340.00 spent at THIRD WAVE COFFEE on 26/10/2026.`;

function dayISO(month: string, day: number): string {
  const max = daysInMonth(month);
  const dd = Math.min(Math.max(1, day), max);
  return `${month}-${String(dd).padStart(2, '0')}`;
}

const currentMonth = nowMonth();
const today = todayISO();
const todayDay = Number(today.slice(8, 10));
const months = [-5, -4, -3, -2, -1, 0].map((o) => addMonths(currentMonth, o));

function nextOccurrence(last: string, cadence: Recurring['cadence']): string {
  if (cadence === 'yearly') return `${Number(last.slice(0, 4)) + 1}${last.slice(4)}`;
  if (cadence === 'quarterly') return `${addMonths(monthKey(last), 3)}-${last.slice(8)}`;
  if (cadence === 'weekly') {
    const d = new Date(last);
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }
  return `${addMonths(monthKey(last), 1)}-${last.slice(8)}`;
}

export function buildSeedTxns(): Txn[] {
  const rng = mulberry32(20261031);
  const between = (a: number, b: number) => a + rng() * (b - a);
  const int = (a: number, b: number) => Math.floor(between(a, b + 1));
  const roundTo = (n: number, step: number) => Math.round(n / step) * step;

  const out: Txn[] = [];
  let n = 0;

  const push = (date: string, desc: string, amount: number, accountId = 'acc_hdfc') => {
    if (date > today) return;
    const c = categorize(desc, amount, SEED_RULES);
    const tags: string[] = [];
    let isReimbursable = false;
    let taxSection: '80C' | '80D' | 'HRA' | 'none' = 'none';

    if (/flight|indigo|air india|hotel/i.test(desc)) {
      tags.push('#work');
      isReimbursable = true;
    } else if (/sip|mutual fund|ppf|lic/i.test(desc)) {
      tags.push('#tax');
      taxSection = '80C';
    } else if (/health insurance|star health/i.test(desc)) {
      tags.push('#tax');
      taxSection = '80D';
    } else if (/truffles|cafe|starbucks/i.test(desc) && rng() > 0.6) {
      tags.push('#social');
    }

    out.push({
      id: `seed_${++n}`,
      date,
      description: desc,
      merchant: c.merchant,
      amount: Math.round(amount * 100) / 100,
      category: c.category,
      confidence: c.confidence,
      why: c.why,
      accountId,
      source: 'seed',
      hash: rowHash(date, Math.abs(amount), desc),
      createdAt: Date.parse(date),
      tags: tags.length ? tags : undefined,
      isReimbursable: isReimbursable ? true : undefined,
      reimbursed: isReimbursable ? date < today.slice(0, 7) + '-15' : undefined,
      taxSection: taxSection !== 'none' ? taxSection : undefined,
    });
  };

  months.forEach((month, mi) => {
    const isCurrent = mi === months.length - 1;
    const lastDay = isCurrent ? Math.min(todayDay, daysInMonth(month)) : daysInMonth(month);
    const dayOk = (d: number) => d <= lastDay;

    if (dayOk(1)) push(dayISO(month, 1), 'SALARY CREDIT NIMBUS LABS PAYROLL', 142000);
    if (dayOk(3)) push(dayISO(month, 3), 'HOUSE RENT LANDLORD UPI', -42000);
    if (dayOk(5)) push(dayISO(month, 5), 'ZERODHA COIN SIP', -15000);
    if (dayOk(7)) push(dayISO(month, 7), 'HDFC LIFE POLICY PREMIUM', -2400);
    if (dayOk(8)) push(dayISO(month, 8), 'AIRTEL POSTPAID BILL', -1199);
    if (dayOk(9)) push(dayISO(month, 9), 'ACT FIBERNET BROADBAND', -1349);
    if (dayOk(10)) push(dayISO(month, 10), 'BESCOM ELECTRICITY BILL', -roundTo(between(2700, 3700), 10));
    if (dayOk(12)) push(dayISO(month, 12), 'NETFLIX SUBSCRIPTION', mi <= 2 ? -499 : -649);
    if (dayOk(14)) push(dayISO(month, 14), 'SPOTIFY INDIA', -119);
    if (dayOk(15)) push(dayISO(month, 15), 'CULTFIT MEMBERSHIP', -1799);
    if (dayOk(18)) push(dayISO(month, 18), 'LINKEDIN PREMIUM', -1299);
    if (dayOk(20)) push(dayISO(month, 20), 'APPLE ICLOUD STORAGE', -75);
    if (dayOk(22) && mi === 2) push(dayISO(month, 22), 'AMAZON PRIME MEMBERSHIP', -1499);

    for (const spec of VARIABLE) {
      let count = int(spec.freq[0], spec.freq[1]);
      if (isCurrent && (spec.desc.includes('SWIGGY') || spec.desc.includes('ZOMATO') || spec.desc.includes('TRUFFLES') || spec.desc.includes('EATFIT'))) {
        count = Math.ceil(count * 1.35);
      }
      if (isCurrent) count = Math.round(count * (lastDay / daysInMonth(month)));
      for (let k = 0; k < count; k++) {
        const day = int(1, lastDay);
        let amt = roundTo(between(spec.min, spec.max), 10);
        if (isCurrent && spec.desc.includes('SWIGGY')) amt = roundTo(amt * 1.1, 10);
        push(dayISO(month, day), spec.desc, -amt);
      }
    }
  });

  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id.localeCompare(b.id)));
}

const txns = buildSeedTxns();
const seedBalance = 235000 + txns.reduce((s, t) => s + t.amount, 0);

const ACCOUNTS_SEEDED: Account[] = ACCOUNTS.map((a) =>
  a.id === 'acc_hdfc' ? { ...a, balance: Math.round(seedBalance) } : a
);

const netflixDate = (i: number) => dayISO(months[i], 12);

const RECURRING_SEED: Recurring[] = [
  {
    id: 'rec_netflix', merchant: 'Netflix', category: 'subscriptions', amount: 649, cadence: 'monthly',
    nextDate: nextOccurrence(netflixDate(5), 'monthly'), lastDate: netflixDate(5), status: 'active',
    priceHistory: [{ date: netflixDate(2), amount: 499 }, { date: netflixDate(4), amount: 649 }],
    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',
  },
  {
    id: 'rec_spotify', merchant: 'Spotify', category: 'subscriptions', amount: 119, cadence: 'monthly',
    nextDate: nextOccurrence(dayISO(currentMonth, 14), 'monthly'), lastDate: dayISO(currentMonth, 14),
    status: 'active', priceHistory: [{ date: dayISO(months[0], 14), amount: 119 }],
    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',
  },
  {
    id: 'rec_cult', merchant: 'Cult.fit', category: 'fitness', amount: 1799, cadence: 'monthly',
    nextDate: nextOccurrence(dayISO(currentMonth, 15), 'monthly'), lastDate: dayISO(currentMonth, 15),
    status: 'active', priceHistory: [{ date: dayISO(months[0], 15), amount: 1799 }],
    usage: 'unused', lastUsedDate: dayISO(addMonths(currentMonth, -2), 18), detectedFrom: 6,
    accountId: 'acc_hdfc', source: 'detected', notes: 'No check-ins recorded in the last 8 weeks.',
  },
  {
    id: 'rec_linkedin', merchant: 'LinkedIn Premium', category: 'subscriptions', amount: 1299, cadence: 'monthly',
    nextDate: nextOccurrence(dayISO(currentMonth, 18), 'monthly'), lastDate: dayISO(currentMonth, 18),
    status: 'active', priceHistory: [{ date: dayISO(months[0], 18), amount: 1299 }],
    usage: 'unused', lastUsedDate: dayISO(addMonths(currentMonth, -3), 2), detectedFrom: 6,
    accountId: 'acc_hdfc', source: 'detected', notes: 'No logins recorded for 12 weeks.',
  },
  {
    id: 'rec_airtel', merchant: 'Airtel', category: 'mobile', amount: 1199, cadence: 'monthly',
    nextDate: nextOccurrence(dayISO(currentMonth, 8), 'monthly'), lastDate: dayISO(currentMonth, 8),
    status: 'active', priceHistory: [{ date: dayISO(months[0], 8), amount: 1199 }],
    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',
  },
  {
    id: 'rec_act', merchant: 'ACT Fibernet', category: 'internet', amount: 1349, cadence: 'monthly',
    nextDate: nextOccurrence(dayISO(currentMonth, 9), 'monthly'), lastDate: dayISO(currentMonth, 9),
    status: 'active', priceHistory: [{ date: dayISO(months[0], 9), amount: 1349 }],
    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',
  },
  {
    id: 'rec_rent', merchant: 'Landlord', category: 'rent', amount: 42000, cadence: 'monthly',
    nextDate: nextOccurrence(dayISO(currentMonth, 3), 'monthly'), lastDate: dayISO(currentMonth, 3),
    status: 'active', priceHistory: [{ date: dayISO(months[0], 3), amount: 42000 }],
    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',
  },
  {
    id: 'rec_insurance', merchant: 'HDFC Life', category: 'insurance', amount: 2400, cadence: 'monthly',
    nextDate: nextOccurrence(dayISO(currentMonth, 7), 'monthly'), lastDate: dayISO(currentMonth, 7),
    status: 'active', priceHistory: [{ date: dayISO(months[0], 7), amount: 2400 }],
    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',
  },
  {
    id: 'rec_icloud', merchant: 'Apple iCloud', category: 'subscriptions', amount: 75, cadence: 'monthly',
    nextDate: nextOccurrence(dayISO(currentMonth, 20), 'monthly'), lastDate: dayISO(currentMonth, 20),
    status: 'active', priceHistory: [{ date: dayISO(months[0], 20), amount: 75 }],
    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',
  },
  {
    id: 'rec_prime', merchant: 'Amazon Prime', category: 'subscriptions', amount: 1499, cadence: 'yearly',
    nextDate: nextOccurrence(dayISO(months[2], 22), 'yearly'), lastDate: dayISO(months[2], 22),
    status: 'active', priceHistory: [{ date: dayISO(months[2], 22), amount: 1499 }],
    usage: 'used', lastUsedDate: today, detectedFrom: 1, accountId: 'acc_hdfc', source: 'detected',
  },
];

const PROFILE: Profile = {
  name: 'Ananya Rao',
  currency: 'INR',
  emergencyTarget: 300000,
  emergencySaved: 168000,
  savingsRateTarget: 25,
  openingBalance: 275000,
  income: [
    { id: 'inc_salary', name: 'Nimbus Labs — salary', amount: 142000, cadence: 'monthly', nextDate: dayISO(addMonths(currentMonth, 1), 1) },
  ],
  fixed: [
    { id: 'fx_rent', name: 'Rent', amount: 42000, category: 'rent', dueDay: 3 },
    { id: 'fx_sip', name: 'SIP transfer', amount: 15000, category: 'investments', dueDay: 5 },
    { id: 'fx_insurance', name: 'Life insurance', amount: 2400, category: 'insurance', dueDay: 7 },
    { id: 'fx_airtel', name: 'Mobile', amount: 1199, category: 'mobile', dueDay: 8 },
    { id: 'fx_act', name: 'Broadband', amount: 1349, category: 'internet', dueDay: 9 },
    { id: 'fx_bescom', name: 'Electricity', amount: 3200, category: 'utilities', dueDay: 10 },
  ],
  categoryBudgets: {
    dining: 14000,
    groceries: 12000,
    shopping: 8000,
    entertainment: 4000,
  },
  debts: [
    { id: 'debt_car', name: 'Car Loan (HDFC)', principal: 340000, interestRate: 8.9, minimumMonthly: 8500, category: 'transport' },
    { id: 'debt_card', name: 'Credit Card (ICICI)', principal: 45000, interestRate: 36.0, minimumMonthly: 2500, category: 'shopping' },
  ],
};

const GOALS: Goal[] = [
  {
    id: 'goal_japan', name: 'Japan in spring', target: 250000, saved: 42000,
    targetDate: '2027-03-31', monthly: 8000, priority: 1, color: '#4C6B8A',
    note: 'Two weeks, Kyoto and Tokyo, booked by February.',
  },
  {
    id: 'goal_laptop', name: 'New work laptop', target: 120000, saved: 32000,
    targetDate: '2027-01-15', monthly: 5000, priority: 2, color: '#A65A4A',
    note: 'Replace the 2019 machine before the contract renewal.',
  },
  {
    id: 'goal_office', name: 'Home office upgrade', target: 80000, saved: 12000,
    targetDate: '2027-08-31', monthly: 3000, priority: 3, color: '#7A6A4A',
    note: 'Desk, chair, and a proper monitor arm.',
  },
];

export const NUDGE_PREF_DEFAULTS: Record<NudgeKind, boolean> = {
  drift: true,
  'price-change': true,
  unused: true,
  goal: true,
  buffer: true,
  payday: true,
  anomaly: true,
};

export function seedState(): AppState {
  return {
    version: 1,
    profile: PROFILE,
    accounts: ACCOUNTS_SEEDED,
    txns,
    rules: SEED_RULES,
    recurring: RECURRING_SEED,
    goals: GOALS,
    nudges: [],
    scenarios: [],
    settings: {
      theme: 'light',
      dense: true,
      nudgePrefs: NUDGE_PREF_DEFAULTS,
      nudgeStates: {},
      hideBalances: false,
      savingsApy: 4,
    },
    batches: [
      {
        id: 'batch_seed',
        fileName: '6 months of account history',
        source: 'seed',
        importedAt: Date.now() - 1000 * 60 * 60 * 24 * 180,
        total: txns.length,
        added: txns.length,
        duplicates: 0,
        approved: true,
      },
    ],
    corrections: [],
    seedMonth: currentMonth,
    lastAction: null,
  };
}

