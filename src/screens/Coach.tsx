import { useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import { deriveNudges, nudgeKindLabel } from '../domain/nudges';
import type { Nudge, NudgeKind } from '../types';
import { money, pct } from '../lib/format';
import { daysInMonth, nowMonth, todayISO } from '../lib/date';
import {
  emergencyCoverage,
  goalRequiredMonthly,
  monthlyIncome,
  monthlySurplus,
  safeToSpend,
  savingsRate,
  summarizeMonth,
  trailingCategoryAverage,
} from '../domain/finance';
import { CATEGORY_MAP } from '../data/categories';
import { Icon } from '../components/Icon';
import { NudgeCard } from '../components/NudgeCard';
import { Empty, Switch, Tabs, useToast } from '../components/ui';
import { navigate } from '../lib/router';

const KINDS: NudgeKind[] = ['drift', 'price-change', 'unused', 'goal', 'buffer', 'payday', 'anomaly'];

export default function Coach() {
  const { state, setNudgeState, updateSettings } = useApp();
  const { push } = useToast();
  const [tab, setTab] = useState<'open' | 'snoozed' | 'handled'>('open');
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState<{ title: string; body: string; math?: string } | null>(null);

  const nudges = useMemo(() => deriveNudges(state), [state]);
  const open = nudges.filter((n) => n.status === 'open');
  const snoozed = nudges.filter((n) => n.status === 'snoozed');
  const handled = nudges.filter((n) => n.status === 'done' || n.status === 'dismissed');
  const shown = tab === 'open' ? open : tab === 'snoozed' ? snoozed : handled;

  const safe = safeToSpend(state);
  const rate = savingsRate(state);
  const coverage = emergencyCoverage(state);

  const ask = (q: string) => {
    setQuestion(q);
    setAsked(answer(q, state));
  };

  const suggestions = [
    'How much can I spend this week?',
    'Am I on track for my goals?',
    "What's my biggest leak?",
    'How is my emergency fund doing?',
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Coach · {open.length} open notes</div>
          <h1 className="display">A second pair of eyes, <em>not a crystal ball.</em></h1>
          <p className="lede">
            The coach watches the model for drift, price changes, and dormant subscriptions. It explains the arithmetic
            and asks better questions. It will not pick products for you.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={() => navigate('/review')}>
            <Icon name="file" size={14} /> Monthly review
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/simulate')}>
            <Icon name="sliders" size={14} /> Run a scenario
          </button>
        </div>
      </div>

      <div className="grid">
        <section className="panel col-8">
          <div className="panel-head" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div className="row-between">
              <div>
                <h2 className="panel-title">Notes</h2>
                <p className="panel-sub">Generated from your ledger every time it changes.</p>
              </div>
              <span className={`badge ${open.some((n) => n.severity === 'critical') ? 'neg' : open.length ? 'warn' : 'pos'}`}>
                {open.length ? `${open.length} open` : 'All clear'}
              </span>
            </div>
            <Tabs
              tabs={[
                { id: 'open', label: 'Open', count: open.length },
                { id: 'snoozed', label: 'Snoozed', count: snoozed.length },
                { id: 'handled', label: 'Handled', count: handled.length },
              ]}
              value={tab}
              onChange={(t) => setTab(t as typeof tab)}
            />
          </div>
          <div className="panel-body">
            {shown.length === 0 && (
              <Empty
                icon="check"
                title={tab === 'open' ? 'No open notes' : 'Nothing here'}
                body={
                  tab === 'open'
                    ? 'The model is quiet. Import a new statement or change a lever to give it something to react to.'
                    : 'Notes you snooze or handle will appear here, ready to be reopened.'
                }
              />
            )}
            {shown.map((n) => (
              <div key={n.id} style={{ marginBottom: 10 }}>
                <NudgeCard nudge={n} showMath />
                {n.status !== 'open' && (
                  <button
                    className="btn btn-sm btn-ghost"
                    style={{ marginTop: 4 }}
                    onClick={() => { setNudgeState(n.id, 'open'); push('Note reopened'); }}
                  >
                    <Icon name="refresh" size={12} /> Reopen note
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>
              {nudges.length} notes derived · rules, not a language model
            </span>
            <button className="linkish small" onClick={() => navigate('/settings')}>Nudge preferences</button>
          </div>
        </section>

        <aside className="col-4 stack">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">The guardrails</h2>
                <p className="panel-sub">What this coach will and will not do.</p>
              </div>
              <Icon name="shield" size={15} style={{ color: 'var(--info)' }} />
            </div>
            <div className="panel-body stack-sm">
              {[
                { t: 'Model, never recommend', d: 'No funds, stocks, policies, or “best” products.' },
                { t: 'Your numbers only', d: 'Income and spending come from what you imported.' },
                { t: 'Show the arithmetic', d: 'Every note includes the rupees behind it.' },
                { t: 'No fake projections', d: 'No market returns. One assumption at a time.' },
              ].map((g) => (
                <div key={g.t} className="row" style={{ gap: 9, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--info)', paddingTop: 1 }}><Icon name="check" size={13} /></span>
                  <span>
                    <span className="small strong">{g.t}</span>
                    <span className="tiny" style={{ display: 'block', color: 'var(--muted)' }}>{g.d}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">What to watch</h2>
                <p className="panel-sub">Live state of the model.</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="row-between small"><span className="muted">Free cash this month</span><span className={`num ${monthlySurplus(state) >= 0 ? 'pos' : 'neg'}`}>{money(monthlySurplus(state))}</span></div>
              <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Savings rate</span><span className="num">{pct(rate)}</span></div>
              <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Emergency coverage</span><span className={`num ${coverage >= 3 ? 'pos' : 'neg'}`}>{coverage.toFixed(1)} months</span></div>
              <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Safe to spend</span><span className="num">{money(Math.max(0, safe.safe))}</span></div>
              <div className="divider dashed" />
              <div className="label" style={{ marginBottom: 8 }}>Nudge types</div>
              <div className="stack-sm">
                {KINDS.map((k) => (
                  <label key={k} className="row-between" style={{ gap: 10, cursor: 'pointer' }}>
                    <span className="small">{nudgeKindLabel(k)}</span>
                    <Switch
                      checked={state.settings.nudgePrefs[k] !== false}
                      label={`Toggle ${nudgeKindLabel(k)} notes`}
                      onChange={(v) => {
                        updateSettings({ nudgePrefs: { ...state.settings.nudgePrefs, [k]: v } });
                        push(v ? `${nudgeKindLabel(k)} notes on` : `${nudgeKindLabel(k)} notes off`);
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </section>
        </aside>

        <section className="panel col-12">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Ask Baseline</h2>
              <p className="panel-sub">Rule-based answers from your model. No generated text, no advice.</p>
            </div>
            <span className="badge info"><Icon name="lock" size={10} /> On-device</span>
          </div>
          <div className="panel-body">
            <div className="row wrap" style={{ gap: 8 }}>
              <input
                className="input"
                style={{ flex: '1 1 320px' }}
                placeholder="Ask about spending, goals, subscriptions, or affordability…"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ask(question)}
                aria-label="Ask the coach a question"
              />
              <button className="btn btn-primary" onClick={() => ask(question)} disabled={!question.trim()}>
                <Icon name="compass" size={14} /> Ask
              </button>
            </div>
            <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
              {suggestions.map((s) => (
                <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>
              ))}
            </div>

            {asked && (
              <div className="callout" style={{ marginTop: 14, borderLeft: '2px solid var(--accent)' }}>
                <div className="label">Answer</div>
                <h3 style={{ fontSize: 13.5, marginTop: 4 }}>{asked.title}</h3>
                <p className="small" style={{ marginTop: 4, color: 'var(--ink-2)', lineHeight: 1.65 }}>{asked.body}</p>
                {asked.math && <p className="tiny mono" style={{ marginTop: 8, color: 'var(--muted)' }}>{asked.math}</p>}
                <div className="row" style={{ gap: 6, marginTop: 10 }}>
                  <button className="btn btn-sm" onClick={() => navigate('/simulate')}>Model it</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => { setAsked(null); setQuestion(''); }}>Clear</button>
                </div>
              </div>
            )}
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>
              Answers are assembled from the same functions that power the charts.
            </span>
            <button className="linkish small" onClick={() => ask('Should I invest in a mutual fund?')}>
              See the guardrail in action
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function answer(q: string, state: ReturnType<typeof useApp>['state']): { title: string; body: string; math?: string } {
  const lower = q.toLowerCase();
  const safe = safeToSpend(state);
  const day = Number(todayISO().slice(8, 10));
  const daysLeft = Math.max(1, daysInMonth(nowMonth()) - day + 1);
  const perDay = Math.max(0, safe.safe) / daysLeft;
  const surplus = monthlySurplus(state);

  if (/(invest|stock|share|mutual fund|equity|crypto|trading|which fund|returns)/.test(lower)) {
    return {
      title: 'That is outside the guardrail',
      body:
        'I can model the cash-flow consequence of investing — how much a monthly transfer frees up, or what happens if income falls. I will not recommend a security, fund, or product, or estimate returns. For those decisions, a SEBI-registered adviser is the right person.',
      math: `If you are weighing a monthly transfer, the most the model can safely support today is ${money(Math.max(0, surplus))}.`,
    };
  }

  const amountMatch = lower.replace(/,/g, '').match(/(?:₹|rs\.?|inr)?\s*(\d{3,9})/);
  if (/(afford|buy|spend|purchase|trip|phone|laptop)/.test(lower) && amountMatch) {
    const amount = Number(amountMatch[1]);
    const verdict = amount <= safe.safe * 0.5 ? 'comfortable' : amount <= safe.safe ? 'tight' : 'not from free cash';
    return {
      title: `${money(amount)} is ${verdict}`,
      body:
        verdict === 'comfortable'
          ? `Free cash is ${money(safe.safe)} after the emergency floor, goals, the next 30 days of bills, and the buffer. This purchase leaves ${money(safe.safe - amount)} and does not touch any goal.`
          : verdict === 'tight'
          ? `Free cash is ${money(safe.safe)}. This leaves ${money(safe.safe - amount)} — one surprise would push the month onto the buffer.`
          : `Free cash is ${money(Math.max(0, safe.safe))}. The purchase would have to come from goal money or the emergency floor. The simulator can show the exact trade-off.`,
      math: `${money(amount)} ÷ ${money(Math.max(1, surplus))} of monthly free cash ≈ ${(amount / Math.max(1, surplus)).toFixed(1)} months of savings.`,
    };
  }

  if (/(goal|japan|laptop|target|on track|pace)/.test(lower)) {
    const goals = state.goals.filter((g) => !g.archived);
    const behind = goals.filter((g) => g.monthly < goalRequiredMonthly(g) * 0.92);
    return {
      title: behind.length ? `${behind.length} of ${goals.length} goals need more` : 'Every goal is on pace',
      body: behind.length
        ? behind
            .map(
              (g) =>
                `${g.name}: ${money(g.monthly)} committed, ${money(goalRequiredMonthly(g))} required to land by ${g.targetDate}.`
            )
            .join(' ')
        : `All ${goals.length} goals are funded at or above the required monthly amount. Free cash after goal contributions is ${money(Math.max(0, surplus))}.`,
      math: `Free cash before goal commitments: ${money(surplus)} a month.`,
    };
  }

  if (/(leak|waste|overspend|biggest|drift|dining|food|subscription)/.test(lower)) {
    const month = nowMonth();
    const summary = summarizeMonth(state.txns, month);
    const drifts = summary.byCategory
      .map((c) => ({ ...c, avg: trailingCategoryAverage(state.txns, [c.category], 3) }))
      .filter((c) => c.avg > 0 && c.amount > c.avg * 1.1)
      .sort((a, b) => b.amount - b.avg - (a.amount - a.avg))
      .slice(0, 1);
    const dormant = state.recurring.filter((r) => r.usage === 'unused' && r.status !== 'cancelled');
    if (dormant.length) {
      return {
        title: 'Dormant subscriptions are the clearest leak',
        body: `${dormant.map((d) => d.merchant).join(' and ')} are still charging with no recent usage. That is ${money(
          dormant.reduce((s, d) => s + (d.cadence === 'yearly' ? d.amount / 12 : d.amount), 0)
        )} a month.`,
        math: 'Cancelling them changes the model immediately — not the real subscription.',
      };
    }
    if (drifts.length) {
      const d = drifts[0];
      return {
        title: `${CATEGORY_MAP[d.category]?.name ?? d.category} is above its own baseline`,
        body: `You have spent ${money(d.amount)} against a three-month average of ${money(d.avg)}. That is ${money(d.amount - d.avg)} above the pattern.`,
        math: `If it repeats for a year: ${money((d.amount - d.avg) * 12)}.`,
      };
    }
    return {
      title: 'No obvious leak this month',
      body: 'Every flexible category is within 10% of its three-month average, and no dormant subscription is charging.',
      math: `Flexible baseline for the model: ${money(monthlySurplus(state))} left after commitments.`,
    };
  }

  if (/(emergency|buffer|safety|runway|months)/.test(lower)) {
    const coverage = emergencyCoverage(state);
    return {
      title: `${coverage.toFixed(1)} months of essentials covered`,
      body:
        coverage >= 3
          ? `The emergency fund holds ${money(state.profile.emergencySaved)}, above the three-month floor. It is not counted as spendable anywhere in the app.`
          : `The fund holds ${money(state.profile.emergencySaved)}. Three months of essentials would be about ${money(
              (state.profile.emergencySaved / Math.max(0.1, coverage)) * 3
            )}, leaving a gap of ${money(
              Math.max(0, (state.profile.emergencySaved / Math.max(0.1, coverage)) * 3 - state.profile.emergencySaved)
            )}.`,
      math: `Essential spending is roughly ${money(state.profile.emergencySaved / Math.max(0.1, coverage))} a month.`,
    };
  }

  if (/(spend|week|today|daily|left|safe)/.test(lower)) {
    return {
      title: `${money(perDay)} a day, or ${money(Math.max(0, safe.safe))} for the rest of the month`,
      body: `Free cash is what remains after ${money(safe.emergency)} of emergency fund, ${money(safe.goals)} in goals, ${money(
        safe.scheduled
      )} of scheduled bills in the next 30 days, and a ${money(safe.buffer)} buffer.`,
      math: `${money(Math.max(0, safe.safe))} ÷ ${daysLeft} days left = ${money(perDay)} per day.`,
    };
  }

  if (/(save|savings|rate)/.test(lower)) {
    return {
      title: `Savings rate is ${pct(savingsRate(state))}`,
      body: `The target is ${pct(state.profile.savingsRateTarget)}. Free cash is ${money(surplus)} a month after fixed and flexible costs, before goal contributions.`,
      math: `Income ${money(monthlyIncome(state))} · fixed ${money(state.profile.fixed.reduce((s, f) => s + f.amount, 0))} · flexible baseline included in the model.`,
    };
  }

  return {
    title: 'Here is the state of the model',
    body: `Income is ${money(monthlyIncome(state))} a month, free cash is ${money(surplus)}, and ${money(
      Math.max(0, safe.safe)
    )} is safe to spend after everything already promised. Ask about a goal, an amount, a subscription, or your buffer.`,
    math: `${state.txns.length} transactions across ${new Set(state.txns.map((t) => t.date.slice(0, 7))).size} months.`,
  };
}
