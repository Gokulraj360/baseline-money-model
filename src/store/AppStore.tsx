import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type {
  AppState,
  CustomAlert,
  Debt,
  Goal,
  ImportBatch,
  IncomeSource,
  FixedCost,
  NudgeKind,
  ParsedRow,
  Profile,
  Recurring,
  Rule,
  ScenarioLevers,
  Settings,
  Txn,
} from '../types';
import { seedState } from '../data/seed';
import { categorize, deriveRulePattern } from '../domain/categorize';
import { rowHash } from '../domain/parse';
import { detectRecurring, addCadence } from '../domain/recurring';
import { runSimulation } from '../domain/simulate';
import { addMonths, nowMonth, todayISO } from '../lib/date';

const STORAGE_KEY = 'baseline.state.v1';

export const uid = (prefix = 'id'): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.txns)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

type Action =
  | { type: 'update'; fn: (s: AppState) => AppState }
  | { type: 'undo' }
  | { type: 'reset' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'update':
      return action.fn(state);
    case 'undo': {
      if (!state.lastAction) return state;
      try {
        const snap = JSON.parse(state.lastAction.snapshot) as AppState;
        return { ...snap, lastAction: null };
      } catch {
        return state;
      }
    }
    case 'reset':
      return seedState();
    default:
      return state;
  }
}

function snapshotOf(state: AppState): string {
  return JSON.stringify({ ...state, lastAction: null });
}

function withUndo(next: AppState, label: string): AppState {
  return { ...next, lastAction: { label, snapshot: snapshotOf(next), at: Date.now() } };
}

export interface ImportSummary {
  added: number;
  duplicates: number;
  batchId: string;
}

interface AppContextValue {
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  undo: () => void;
  reset: () => void;
  importRows: (rows: ParsedRow[], source: Txn['source'], fileName: string) => ImportSummary;
  approveBatch: (batchId: string) => void;
  discardBatch: (batchId: string) => void;
  correctCategory: (
    txnId: string,
    category: string,
    learn: boolean,
    applyRetro?: boolean
  ) => { ruleId: string | null; created: boolean; retroCount: number };
  bulkCategory: (ids: string[], category: string, learn: boolean) => void;
  splitTxn: (id: string, splits: { category: string; amount: number }[]) => void;
  deleteTxns: (ids: string[]) => void;
  addTxn: (input: { date: string; description: string; amount: number; category?: string; accountId?: string; note?: string }) => void;
  updateTxn: (id: string, patch: Partial<Txn>) => void;
  addRule: (rule: Omit<Rule, 'id' | 'createdAt' | 'hits'> & { hits?: number }) => string;
  updateRule: (id: string, patch: Partial<Rule>) => void;
  deleteRule: (id: string) => void;
  applyRuleRetro: (id: string) => number;
  scanRecurring: () => number;
  updateRecurring: (id: string, patch: Partial<Recurring>) => void;
  addRecurring: (r: Omit<Recurring, 'id'>) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  upsertIncome: (i: IncomeSource) => void;
  removeIncome: (id: string) => void;
  upsertFixed: (f: FixedCost) => void;
  removeFixed: (id: string) => void;
  upsertGoal: (g: Goal) => void;
  deleteGoal: (id: string) => void;
  contributeGoal: (id: string, amount: number) => void;
  saveScenario: (name: string, levers: ScenarioLevers) => string;
  deleteScenario: (id: string) => void;
  applyScenario: (id: string) => void;
  applyLevers: (levers: ScenarioLevers) => void;
  setNudgeState: (id: string, status: 'open' | 'snoozed' | 'done' | 'dismissed') => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setCategoryBudget: (category: string, amount: number) => void;
  upsertDebt: (debt: Debt) => void;
  removeDebt: (id: string) => void;
  addCustomAlert: (alert: Omit<CustomAlert, 'id' | 'createdAt'>) => void;
  removeCustomAlert: (id: string) => void;
  toggleReimbursed: (txnId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* storage full — the app still works in memory */
      }
    }, 120);
    return () => clearTimeout(t);
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
    document.documentElement.dataset.dense = state.settings.dense ? 'true' : 'false';
  }, [state.settings.theme, state.settings.dense]);

  const update = useCallback((fn: (s: AppState) => AppState) => dispatch({ type: 'update', fn }), []);
  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const importRows = useCallback(
    (rows: ParsedRow[], source: Txn['source'], fileName: string): ImportSummary => {
      const batchId = uid('batch');
      const existing = new Set(state.txns.map((t) => t.hash));
      const seen = new Set<string>();
      const fresh: Txn[] = [];
      let duplicates = 0;
      for (const row of rows) {
        const dup = existing.has(row.hash) || seen.has(row.hash);
        if (dup) {
          duplicates++;
          continue;
        }
        seen.add(row.hash);
        const c = categorize(row.description, row.amount, state.rules);
        fresh.push({
          id: uid('txn'),
          date: row.date,
          description: row.description,
          merchant: c.merchant,
          amount: row.amount,
          category: c.category,
          confidence: c.confidence,
          why: c.why,
          accountId: 'acc_hdfc',
          source,
          hash: row.hash,
          batchId,
          pending: true,
          createdAt: Date.now(),
        });
      }
      const batch: ImportBatch = {
        id: batchId,
        fileName,
        source,
        importedAt: Date.now(),
        total: rows.length,
        added: fresh.length,
        duplicates,
        approved: false,
      };
      update((s) => ({
        ...s,
        txns: [...s.txns, ...fresh],
        batches: [batch, ...s.batches],
      }));
      return { added: fresh.length, duplicates, batchId };
    },
    [state.txns, state.rules, update]
  );

  const approveBatch = useCallback(
    (batchId: string) => {
      update((s) => ({
        ...s,
        txns: s.txns.map((t) => (t.batchId === batchId ? { ...t, pending: false } : t)),
        batches: s.batches.map((b) => (b.id === batchId ? { ...b, approved: true } : b)),
      }));
    },
    [update]
  );

  const discardBatch = useCallback(
    (batchId: string) => {
      update((s) =>
        withUndo(
          {
            ...s,
            txns: s.txns.filter((t) => t.batchId !== batchId),
            batches: s.batches.filter((b) => b.id !== batchId),
          },
          'Discarded import'
        )
      );
    },
    [update]
  );

  const learnRule = (s: AppState, description: string, category: string): { rules: Rule[]; ruleId: string | null; created: boolean } => {
    const pattern = deriveRulePattern(description, description);
    const existing = s.rules.find(
      (r) => r.pattern.toUpperCase() === pattern && r.category === category
    );
    if (existing) {
      return {
        rules: s.rules.map((r) => (r.id === existing.id ? { ...r, hits: r.hits + 1, enabled: true } : r)),
        ruleId: existing.id,
        created: false,
      };
    }
    const id = uid('rule');
    const rule: Rule = {
      id,
      pattern,
      field: 'description',
      matchType: 'contains',
      category,
      source: 'learned',
      priority: 50,
      hits: 0,
      enabled: true,
      createdAt: Date.now(),
    };
    return { rules: [rule, ...s.rules], ruleId: id, created: true };
  };

  const correctCategory = useCallback(
    (
      txnId: string,
      category: string,
      learn: boolean,
      applyRetro = false
    ): { ruleId: string | null; created: boolean; retroCount: number } => {
      const currentTxn = state.txns.find((t) => t.id === txnId);
      if (!currentTxn) return { ruleId: null, created: false, retroCount: 0 };

      let ruleId: string | null = null;
      let created = false;
      let retroCount = 0;

      if (learn) {
        const pattern = deriveRulePattern(currentTxn.description, currentTxn.description);
        const existing = state.rules.find(
          (r) => r.pattern.toUpperCase() === pattern && r.category === category
        );
        if (existing) {
          ruleId = existing.id;
          created = false;
        } else {
          ruleId = uid('rule');
          created = true;
        }

        if (applyRetro) {
          const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          const matches = state.txns.filter(
            (t) => t.id !== txnId && re.test(t.description) && t.category !== category
          );
          retroCount = matches.length;
        }
      }

      const assignedRuleId = ruleId;
      const assignedCreated = created;
      const countToRetro = retroCount;

      update((s) => {
        const txn = s.txns.find((t) => t.id === txnId);
        if (!txn) return s;
        let rules = s.rules;
        let finalRuleId = assignedRuleId;

        if (learn) {
          const pattern = deriveRulePattern(txn.description, txn.description);
          const existing = s.rules.find(
            (r) => r.pattern.toUpperCase() === pattern && r.category === category
          );
          if (existing) {
            finalRuleId = existing.id;
            rules = s.rules.map((r) =>
              r.id === existing.id
                ? {
                    ...r,
                    hits: r.hits + 1 + countToRetro,
                    enabled: true,
                    lastHitAt: Date.now(),
                  }
                : r
            );
          } else {
            const id = finalRuleId ?? uid('rule');
            finalRuleId = id;
            const newRule: Rule = {
              id,
              pattern,
              field: 'description',
              matchType: 'contains',
              category,
              source: 'learned',
              priority: 50,
              hits: countToRetro,
              enabled: true,
              createdAt: Date.now(),
              lastHitAt: countToRetro > 0 ? Date.now() : undefined,
            };
            rules = [newRule, ...s.rules];
          }
        }

        const pattern = learn ? deriveRulePattern(txn.description, txn.description) : '';
        const re = pattern ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;

        return {
          ...s,
          rules,
          txns: s.txns.map((t) => {
            if (t.id === txnId) {
              return {
                ...t,
                category,
                confidence: 1,
                why: learn
                  ? `You set this category. A rule was learned so future “${txn.merchant}” lines land here.`
                  : 'Category set manually.',
                pending: false,
              };
            }
            if (applyRetro && re && re.test(t.description) && t.category !== category) {
              return {
                ...t,
                category,
                confidence: 0.99,
                why: `Applied learned rule “${pattern}” retroactively.`,
                pending: false,
              };
            }
            return t;
          }),
          corrections: [
            {
              id: uid('corr'),
              txnId,
              description: txn.description,
              from: txn.category,
              to: category,
              at: Date.now(),
              learnedRuleId: learn ? finalRuleId ?? undefined : undefined,
            },
            ...s.corrections,
          ],
        };
      });

      return { ruleId: assignedRuleId, created: assignedCreated, retroCount };
    },
    [state.txns, state.rules, update]
  );

  const bulkCategory = useCallback(
    (ids: string[], category: string, learn: boolean) => {
      update((s) => {
        let rules = s.rules;
        if (learn && ids.length) {
          const first = s.txns.find((t) => t.id === ids[0]);
          if (first) rules = learnRule(s, first.description, category).rules;
        }
        return withUndo(
          {
            ...s,
            rules,
            txns: s.txns.map((t) =>
              ids.includes(t.id)
                ? { ...t, category, confidence: 1, why: 'Updated in a bulk correction.', pending: false }
                : t
            ),
            corrections: [
              ...ids.map((id) => {
                const t = s.txns.find((x) => x.id === id);
                return {
                  id: uid('corr'),
                  txnId: id,
                  description: t?.description ?? '',
                  from: t?.category ?? '',
                  to: category,
                  at: Date.now(),
                };
              }),
              ...s.corrections,
            ],
          },
          `Recategorised ${ids.length} transactions`
        );
      });
    },
    [update]
  );

  const splitTxn = useCallback(
    (id: string, splits: { category: string; amount: number }[]) => {
      update((s) => ({
        ...s,
        txns: s.txns.map((t) =>
          t.id === id
            ? { ...t, splits, category: splits[0].category, confidence: 1, why: 'Split across categories.', pending: false }
            : t
        ),
      }));
    },
    [update]
  );

  const deleteTxns = useCallback(
    (ids: string[]) => {
      update((s) =>
        withUndo(
          { ...s, txns: s.txns.filter((t) => !ids.includes(t.id)) },
          `Deleted ${ids.length} transaction${ids.length === 1 ? '' : 's'}`
        )
      );
    },
    [update]
  );

  const addTxn = useCallback(
    (input: { date: string; description: string; amount: number; category?: string; accountId?: string; note?: string }) => {
      const c = categorize(input.description, input.amount, state.rules);
      const txn: Txn = {
        id: uid('txn'),
        date: input.date,
        description: input.description,
        merchant: c.merchant,
        amount: input.amount,
        category: input.category ?? c.category,
        confidence: input.category ? 1 : c.confidence,
        why: input.category ? 'Added manually.' : c.why,
        accountId: input.accountId ?? 'acc_hdfc',
        source: 'manual',
        hash: rowHash(input.date, Math.abs(input.amount), input.description),
        note: input.note,
        createdAt: Date.now(),
      };
      update((s) => ({ ...s, txns: [...s.txns, txn] }));
    },
    [state.rules, update]
  );

  const updateTxn = useCallback(
    (id: string, patch: Partial<Txn>) => {
      update((s) => ({
        ...s,
        txns: s.txns.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      }));
    },
    [update]
  );

  const addRule = useCallback(
    (rule: Omit<Rule, 'id' | 'createdAt' | 'hits'> & { hits?: number }) => {
      const id = uid('rule');
      update((s) => ({
        ...s,
        rules: [
          { ...rule, id, createdAt: Date.now(), hits: rule.hits ?? 0 },
          ...s.rules,
        ],
      }));
      return id;
    },
    [update]
  );

  const updateRule = useCallback(
    (id: string, patch: Partial<Rule>) => {
      update((s) => ({ ...s, rules: s.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
    },
    [update]
  );

  const deleteRule = useCallback(
    (id: string) => {
      update((s) => ({ ...s, rules: s.rules.filter((r) => r.id !== id) }));
    },
    [update]
  );

  const applyRuleRetro = useCallback(
    (id: string): number => {
      const rule = state.rules.find((r) => r.id === id);
      if (!rule) return 0;
      let count = 0;
      try {
        const re =
          rule.matchType === 'regex'
            ? new RegExp(rule.pattern, 'i')
            : rule.matchType === 'exact'
            ? new RegExp(`^${rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
            : rule.matchType === 'startsWith'
            ? new RegExp(`^${rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')
            : new RegExp(rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const matches = state.txns.filter((t) =>
          re.test(rule.field === 'merchant' ? t.merchant : t.description)
        );
        count = matches.length;
        const ids = matches.map((m) => m.id);
        update((s) => ({
          ...s,
          txns: s.txns.map((t) =>
            ids.includes(t.id) && t.category !== rule.category
              ? { ...t, category: rule.category, confidence: 0.99, why: `Applied rule “${rule.pattern}” retroactively.` }
              : t
          ),
          rules: s.rules.map((r) =>
            r.id === id ? { ...r, hits: r.hits + matches.length, lastHitAt: Date.now() } : r
          ),
        }));
      } catch {
        return 0;
      }
      return count;
    },
    [state.rules, state.txns, update]
  );

  const scanRecurring = useCallback((): number => {
    const detected = detectRecurring(state.txns, state.recurring);
    if (!detected.length) return 0;
    const additions: Recurring[] = detected.map((d) => {
      let next = addCadence(d.lastDate, d.cadence);
      let guard = 0;
      while (next < todayISO() && guard++ < 60) next = addCadence(next, d.cadence);
      return {
      id: uid('rec'),
      merchant: d.merchant,
      category: d.category,
      amount: d.amount,
      cadence: d.cadence,
      nextDate: next,
      lastDate: d.lastDate,
      status: 'active',
      priceHistory: [{ date: d.dates[d.dates.length - 1], amount: d.amount }],
      usage: 'unknown',
      detectedFrom: d.occurrences,
      accountId: 'acc_hdfc',
      source: 'detected',
      notes: `Detected from ${d.occurrences} consistent charges at ${Math.round(d.confidence * 100)}% confidence.`,
      };
    });
    update((s) => ({ ...s, recurring: [...s.recurring, ...additions] }));
    return additions.length;
  }, [state.txns, state.recurring, update]);

  const updateRecurring = useCallback(
    (id: string, patch: Partial<Recurring>) => {
      update((s) => ({
        ...s,
        recurring: s.recurring.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      }));
    },
    [update]
  );

  const addRecurring = useCallback(
    (r: Omit<Recurring, 'id'>) => {
      update((s) => ({ ...s, recurring: [{ ...r, id: uid('rec') }, ...s.recurring] }));
    },
    [update]
  );

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      update((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
    },
    [update]
  );

  const upsertIncome = useCallback(
    (i: IncomeSource) => {
      update((s) => {
        const exists = s.profile.income.some((x) => x.id === i.id);
        return {
          ...s,
          profile: {
            ...s.profile,
            income: exists
              ? s.profile.income.map((x) => (x.id === i.id ? i : x))
              : [...s.profile.income, i],
          },
        };
      });
    },
    [update]
  );

  const removeIncome = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        profile: { ...s.profile, income: s.profile.income.filter((i) => i.id !== id) },
      }));
    },
    [update]
  );

  const upsertFixed = useCallback(
    (f: FixedCost) => {
      update((s) => {
        const exists = s.profile.fixed.some((x) => x.id === f.id);
        return {
          ...s,
          profile: {
            ...s.profile,
            fixed: exists ? s.profile.fixed.map((x) => (x.id === f.id ? f : x)) : [...s.profile.fixed, f],
          },
        };
      });
    },
    [update]
  );

  const removeFixed = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        profile: { ...s.profile, fixed: s.profile.fixed.filter((f) => f.id !== id) },
      }));
    },
    [update]
  );

  const upsertGoal = useCallback(
    (g: Goal) => {
      update((s) => {
        const exists = s.goals.some((x) => x.id === g.id);
        return { ...s, goals: exists ? s.goals.map((x) => (x.id === g.id ? g : x)) : [...s.goals, g] };
      });
    },
    [update]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      update((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));
    },
    [update]
  );

  const contributeGoal = useCallback(
    (id: string, amount: number) => {
      update((s) => ({
        ...s,
        goals: s.goals.map((g) =>
          g.id === id ? { ...g, saved: Math.max(0, Math.min(g.target, g.saved + amount)) } : g
        ),
      }));
    },
    [update]
  );

  const saveScenario = useCallback(
    (name: string, levers: ScenarioLevers): string => {
      const id = uid('scn');
      update((s) => ({
        ...s,
        scenarios: [{ id, name, levers, createdAt: Date.now() }, ...s.scenarios],
      }));
      return id;
    },
    [update]
  );

  const deleteScenario = useCallback(
    (id: string) => {
      update((s) => ({ ...s, scenarios: s.scenarios.filter((x) => x.id !== id) }));
    },
    [update]
  );

  const applyLevers = useCallback(
    (levers: ScenarioLevers) => {
      const sim = runSimulation(state, levers, 12);
      update((s) => {
        const goals = s.goals.map((g) => ({ ...g }));
        const required = goals.map((g) => {
          const months = Math.max(
            1,
            Math.ceil((Date.parse(g.targetDate) - Date.parse(todayISO())) / (86400000 * 30.4))
          );
          return Math.max(0, g.target - g.saved) / months;
        });
        const totalReq = required.reduce((a, b) => a + b, 0);
        const scale = totalReq > 0 ? Math.min(1, Math.max(0, sim.monthly.surplus) / totalReq) : 1;
        goals.forEach((g, i) => {
          g.monthly = Math.round(required[i] * scale);
        });
        const income = s.profile.income.map((i, idx) =>
          idx === 0 ? { ...i, amount: Math.round(i.amount * (1 + levers.incomeChange / 100)) } : i
        );
        const fixed = s.profile.fixed.map((f) =>
          f.category === 'rent' ? { ...f, amount: Math.round(f.amount * (1 + levers.rentChange / 100)) } : f
        );
        return {
          ...s,
          goals,
          profile: { ...s.profile, income, fixed },
          recurring: s.recurring.map((r) =>
            levers.cancelledSubs.includes(r.id) ? { ...r, status: 'cancelled' as const } : r
          ),
        };
      });
    },
    [state, update]
  );

  const applyScenario = useCallback(
    (id: string) => {
      const scn = state.scenarios.find((s) => s.id === id);
      if (!scn) return;
      applyLevers(scn.levers);
      update((s) => ({
        ...s,
        scenarios: s.scenarios.map((x) => (x.id === id ? { ...x, pinned: true } : x)),
      }));
    },
    [state.scenarios, applyLevers, update]
  );

  const setNudgeState = useCallback(
    (id: string, status: 'open' | 'snoozed' | 'done' | 'dismissed') => {
      update((s) => {
        const next = { ...s.settings.nudgeStates };
        if (status === 'open') delete next[id];
        else next[id] = status;
        return { ...s, settings: { ...s.settings, nudgeStates: next } };
      });
    },
    [update]
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
    },
    [update]
  );

  const setCategoryBudget = useCallback(
    (category: string, amount: number) => {
      update((s) => ({
        ...s,
        profile: {
          ...s.profile,
          categoryBudgets: {
            ...(s.profile.categoryBudgets ?? {}),
            [category]: amount,
          },
        },
      }));
    },
    [update]
  );

  const upsertDebt = useCallback(
    (debt: Debt) => {
      update((s) => {
        const debts = s.profile.debts ?? [];
        const exists = debts.some((d) => d.id === debt.id);
        return {
          ...s,
          profile: {
            ...s.profile,
            debts: exists ? debts.map((d) => (d.id === debt.id ? debt : d)) : [...debts, debt],
          },
        };
      });
    },
    [update]
  );

  const removeDebt = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        profile: {
          ...s.profile,
          debts: (s.profile.debts ?? []).filter((d) => d.id !== id),
        },
      }));
    },
    [update]
  );

  const addCustomAlert = useCallback(
    (alert: Omit<CustomAlert, 'id' | 'createdAt'>) => {
      const id = uid('alt');
      update((s) => ({
        ...s,
        customAlerts: [{ ...alert, id, createdAt: Date.now() }, ...(s.customAlerts ?? [])],
      }));
    },
    [update]
  );

  const removeCustomAlert = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        customAlerts: (s.customAlerts ?? []).filter((a) => a.id !== id),
      }));
    },
    [update]
  );

  const toggleReimbursed = useCallback(
    (txnId: string) => {
      update((s) => ({
        ...s,
        txns: s.txns.map((t) => (t.id === txnId ? { ...t, reimbursed: !t.reimbursed } : t)),
      }));
    },
    [update]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      update,
      undo,
      reset,
      importRows,
      approveBatch,
      discardBatch,
      correctCategory,
      bulkCategory,
      splitTxn,
      deleteTxns,
      addTxn,
      updateTxn,
      addRule,
      updateRule,
      deleteRule,
      applyRuleRetro,
      scanRecurring,
      updateRecurring,
      addRecurring,
      updateProfile,
      upsertIncome,
      removeIncome,
      upsertFixed,
      removeFixed,
      upsertGoal,
      deleteGoal,
      contributeGoal,
      saveScenario,
      deleteScenario,
      applyScenario,
      applyLevers,
      setNudgeState,
      updateSettings,
      setCategoryBudget,
      upsertDebt,
      removeDebt,
      addCustomAlert,
      removeCustomAlert,
      toggleReimbursed,
    }),
    [
      state, update, undo, reset, importRows, approveBatch, discardBatch, correctCategory,
      bulkCategory, splitTxn, deleteTxns, addTxn, updateTxn, addRule, updateRule, deleteRule,
      applyRuleRetro, scanRecurring, updateRecurring, addRecurring, updateProfile, upsertIncome,
      removeIncome, upsertFixed, removeFixed, upsertGoal, deleteGoal, contributeGoal, saveScenario,
      deleteScenario, applyScenario, applyLevers, setNudgeState, updateSettings,
      setCategoryBudget, upsertDebt, removeDebt, addCustomAlert, removeCustomAlert, toggleReimbursed,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export const monthOptions = (count = 12): string[] =>
  Array.from({ length: count }, (_, i) => addMonths(nowMonth(), -i));
