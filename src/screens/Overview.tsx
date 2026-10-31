import { useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import { useMoney } from '../hooks/useMoney';
import { addMonths, monthLabel, nowMonth, todayISO } from '../lib/date';
import { money, pct } from '../lib/format';
import { navigate } from '../lib/router';
import {
  baseModel,
  categoryPacing,
  currentBalance,
  emergencyCoverage,
  financialHealthScore,
  goalProgress,
  goalRequiredMonthly,
  monthlyIncome,
  monthlySurplus,
  safeToSpend,
  savingsRate,
  summarizeMonth,
  upcomingBills,
  weekendVsWeekday,
} from '../domain/finance';
import { baselineResult } from '../domain/simulate';
import { deriveNudges } from '../domain/nudges';
import { CATEGORY_MAP } from '../data/categories';
import { Icon } from '../components/Icon';
import { CategoryBars, LineChart } from '../components/charts';
import { Modal, useToast } from '../components/ui';
import { NudgeCard } from '../components/NudgeCard';

export default function Overview() {
  const { state } = useApp();
  const { push } = useToast();
  const fmt = useMoney();
  const [explain, setExplain] = useState(false);
  const [healthOpen, setHealthOpen] = useState(false);
  const [afford, setAfford] = useState('');
  const [affordResult, setAffordResult] = useState<null | 'comfortable' | 'tight' | 'not-now'>(null);

  const now = nowMonth();
  const today = todayISO();
  const model = baseModel(state);
  const safe = safeToSpend(state);
  const sim = baselineResult(state, 6);
  const income = monthlyIncome(state);
  const surplus = monthlySurplus(state);
  const rate = savingsRate(state);
  const coverage = emergencyCoverage(state);
  const health = useMemo(() => financialHealthScore(state), [state]);
  const pacing = useMemo(() => categoryPacing(state, now), [state, now]);
  const weekend = useMemo(() => weekendVsWeekday(state.txns, now), [state.txns, now]);
  const nudges = deriveNudges(state).filter((n) => n.status === 'open').slice(0, 3);
  const bills = upcomingBills(state, 7);
  const summary = summarizeMonth(state.txns, now);

  const months = useMemo(
    () => Array.from({ length: 6 }, (_, i) => addMonths(now, -5 + i)),
    [now]
  );

  const history = useMemo(
    () =>
      months.map((m) => {
        const total = state.txns
          .filter((t) => !t.pending && t.date.slice(0, 7) <= m)
          .reduce((s, t) => s + t.amount, 0);
        return { key: m, value: state.profile.openingBalance + total };
      }),
    [months, state.txns, state.profile.openingBalance]
  );

  const forecast = sim.months.slice(0, 6).map((m) => ({ key: m.key, value: m.balance }));
  const balance = currentBalance(state);
  const projected = forecast[forecast.length - 1]?.value ?? balance;

  const goals = [...state.goals].filter((g) => !g.archived).sort((a, b) => a.priority - b.priority);
  const categories = summary.byCategory.slice(0, 8).map((c) => ({
    ...c,
    name: CATEGORY_MAP[c.category]?.name ?? c.category,
    color: CATEGORY_MAP[c.category]?.color ?? '#7A7A72',
  }));

  const recent = useMemo(
    () =>
      [...state.txns]
        .filter((t) => !t.pending)
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .slice(0, 6),
    [state.txns]
  );

  const segments = [
    { label: 'Emergency fund', value: safe.emergency, color: 'var(--info)' },
    { label: 'Goals', value: safe.goals, color: 'var(--accent)' },
    { label: 'Next 30 days of bills', value: safe.scheduled, color: 'var(--line-strong)' },
    { label: 'Buffer', value: safe.buffer, color: 'var(--faint)' },
    { label: 'Free to spend', value: Math.max(0, safe.safe), color: 'var(--positive)' },
  ].filter((s) => s.value > 0);

  const checkAfford = () => {
    const amount = Number(afford.replace(/[^0-9]/g, ''));
    if (!amount) {
      push('Enter an amount to check');
      return;
    }
    const verdict = amount <= safe.safe * 0.5 ? 'comfortable' : amount <= Math.max(0, safe.safe) ? 'tight' : 'not-now';
    setAffordResult(verdict);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="faint">·</span>
            <span>{state.txns.length} transactions modelled</span>
          </div>
          <h1 className="display">Your money, <em>modelled.</em></h1>
          <p className="lede">
            One model connects your income, your fixed costs, your goals, and the life you are actually living. Change a
            number and the whole picture moves with you.
          </p>
        </div>
        <div className="head-actions">
          <button
            className="btn"
            onClick={() => setHealthOpen(true)}
            title="Click to view Financial Health Index breakdown"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: health.score >= 75 ? 'var(--positive)' : health.score >= 50 ? 'var(--accent)' : 'var(--negative)',
              }}
            />
            <span className="small">Health: <strong className="mono">{health.score}</strong>/100 · {health.grade}</span>
          </button>
          <button className="btn" onClick={() => navigate('/simulate')}>
            <Icon name="sliders" size={14} /> Run a scenario
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/inbox')}>
            <Icon name="upload" size={14} /> Import statement
          </button>
        </div>
      </div>

      <div className="grid">
        <section className="panel col-8">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Balance, actual and projected</h2>
              <p className="panel-sub">Six months of history, six months of model. The dashed line is the baseline scenario.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label">Today</div>
              <div className="medium-number">{fmt(balance)}</div>
            </div>
          </div>
          <div className="panel-body">
            <div className="row" style={{ gap: 24, marginBottom: 8, flexWrap: 'wrap' }}>
              <div>
                <div className="stat-label">In 6 months</div>
                <div className="num" style={{ fontSize: 14, color: 'var(--accent)' }}>{fmt(projected)}</div>
              </div>
              <div>
                <div className="stat-label">Change</div>
                <div className={`num small ${projected >= balance ? 'pos' : 'neg'}`}>
                  {projected >= balance ? '+' : '−'}{fmt(Math.abs(projected - balance))}
                </div>
              </div>
              <div className="spacer" />
              <div className="legend">
                <span><i /> Actual</span>
                <span><i className="accent dashed" /> Projected</span>
              </div>
            </div>
            <LineChart
              actual={history}
              forecast={forecast}
              height={214}
              band={sim.monthly.flexible * 0.1}
              ariaLabel={`Cash balance from ${months[0]} to ${forecast[forecast.length - 1]?.key}, actual and projected`}
            />
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>
              Projection assumes income and committed costs hold steady
            </span>
            <button className="linkish small" onClick={() => navigate('/simulate')}>
              Test a different future
            </button>
          </div>
        </section>

        <section className="panel col-4" style={{ borderTop: '2px solid var(--accent)' }}>
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Safe to spend</h2>
              <p className="panel-sub">The next 30 days, after everything already promised.</p>
            </div>
            <button className="btn btn-ghost btn-icon" aria-label="How safe to spend is calculated" onClick={() => setExplain(true)}>
              <Icon name="info" size={15} />
            </button>
          </div>
          <div className="panel-body">
            <div className="hero-safe">
              <div className="big-number" style={{ color: safe.safe >= 0 ? 'var(--ink)' : 'var(--negative)' }}>
                {fmt(safe.safe)}
              </div>
              <p className="hero-note">
                {safe.safe >= 0
                  ? `About ${money(Math.max(0, safe.safe) / 30)} a day for the rest of the month, without touching your buffer or goals.`
                  : 'Your commitments are larger than unallocated cash right now. The scenarios page will show your options.'}
              </p>
            </div>

            <div className="meter" style={{ marginTop: 16 }} aria-hidden="true">
              {segments.map((s) => (
                <span
                  key={s.label}
                  title={`${s.label}: ${money(s.value)}`}
                  style={{ width: `${balance > 0 ? (s.value / balance) * 100 : 0}%`, background: s.color }}
                />
              ))}
            </div>
            <div className="stack-sm" style={{ marginTop: 12 }}>
              {segments.map((s) => (
                <div key={s.label} className="row-between" style={{ fontSize: 11.5 }}>
                  <span className="row" style={{ gap: 7 }}>
                    <i style={{ width: 7, height: 7, borderRadius: 2, background: s.color, display: 'inline-block' }} />
                    <span className="muted">{s.label}</span>
                  </span>
                  <span className="num">{fmt(s.value)}</span>
                </div>
              ))}
            </div>

            <div className="divider dashed" />
            <div className="row-between small">
              <span className="muted">Emergency coverage</span>
              <span className="num">{coverage.toFixed(1)} months</span>
            </div>
          </div>
          <div className="panel-foot">
            <button className="linkish small" onClick={() => setExplain(true)}>How this is calculated</button>
            <span className="tiny" style={{ color: 'var(--muted)' }}>Updated {today}</span>
          </div>
        </section>

        <section className="panel col-4">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">The model</h2>
              <p className="panel-sub">Monthly, from your profile and last three months.</p>
            </div>
          </div>
          <div className="panel-body">
            <dl style={{ margin: 0 }}>
              <div className="kv"><dt>Income</dt><dd className="pos">{fmt(income)}</dd></div>
              <div className="kv"><dt>Fixed costs</dt><dd>−{fmt(model.fixed)}</dd></div>
              <div className="kv"><dt>Flexible baseline</dt><dd>−{fmt(model.dining + model.groceries + model.otherFlexible)}</dd></div>
              <div className="kv" style={{ borderBottom: 0 }}>
                <dt style={{ fontWeight: 600, color: 'var(--ink)' }}>Free each month</dt>
                <dd style={{ fontWeight: 600 }} className={surplus >= 0 ? 'pos' : 'neg'}>{fmt(surplus)}</dd>
              </div>
            </dl>
            <div className="meter" style={{ marginTop: 8 }} aria-hidden="true">
              <span style={{ width: `${income ? (model.fixed / income) * 100 : 0}%`, background: 'var(--ink)' }} title="Fixed" />
              <span
                style={{ width: `${income ? ((model.dining + model.groceries + model.otherFlexible) / income) * 100 : 0}%`, background: 'var(--line-strong)' }}
                title="Flexible"
              />
              <span style={{ width: `${income ? (Math.max(0, surplus) / income) * 100 : 0}%`, background: 'var(--positive)' }} title="Free" />
            </div>
            <div className="row-between small" style={{ marginTop: 12 }}>
              <span className="muted">Savings rate</span>
              <span>
                <span className="num">{pct(rate)}</span>
                <span className="faint"> / {pct(state.profile.savingsRateTarget)} target</span>
              </span>
            </div>
            <div className="progress thin" style={{ marginTop: 6 }}>
              <span style={{ width: `${Math.min(100, (rate / Math.max(1, state.profile.savingsRateTarget)) * 100)}%` }} />
            </div>
          </div>
          <div className="panel-foot">
            <button className="linkish small" onClick={() => navigate('/plan')}>Edit the profile</button>
            <span className="tiny" style={{ color: 'var(--muted)' }}>Model v1</span>
          </div>
        </section>

        <section className="panel col-4">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Due in 7 days</h2>
              <p className="panel-sub">{bills.length ? `${bills.length} scheduled charges` : 'Nothing scheduled this week'}</p>
            </div>
            <Icon name="calendar" size={15} />
          </div>
          <div className="panel-body" style={{ paddingTop: 6 }}>
            {bills.length === 0 && (
              <p className="small muted" style={{ padding: '14px 0' }}>
                No recurring payments land in the next seven days. Your next known charge is{' '}
                {state.recurring.filter((r) => r.status === 'active').sort((a, b) => (a.nextDate < b.nextDate ? -1 : 1))[0]?.nextDate ?? 'not scheduled'}.
              </p>
            )}
            {bills.slice(0, 5).map((b) => {
              const d = new Date(b.date);
              return (
                <div className="bill-row" key={b.recurring.id}>
                  <div className="bill-date">
                    <b>{d.getDate()}</b>
                    {d.toLocaleDateString('en-IN', { month: 'short' })}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="txn-merchant ellipsis">{b.recurring.merchant}</div>
                    <div className="tiny" style={{ color: 'var(--muted)' }}>
                      {b.inDays === 0 ? 'today' : b.inDays === 1 ? 'tomorrow' : `in ${b.inDays} days`}
                    </div>
                  </div>
                  <span className="num small">{fmt(b.recurring.amount)}</span>
                </div>
              );
            })}
            {bills.length > 5 && (
              <p className="tiny" style={{ color: 'var(--muted)', marginTop: 8 }}>+ {bills.length - 5} more this week</p>
            )}
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>Total this week</span>
            <span className="num small strong">{fmt(bills.reduce((s, b) => s + b.recurring.amount, 0))}</span>
          </div>
        </section>

        <section className="panel col-4">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Goals</h2>
              <p className="panel-sub">{goals.length} with target dates</p>
            </div>
            <button className="btn btn-ghost btn-icon" aria-label="Manage goals" onClick={() => navigate('/plan')}>
              <Icon name="plus" size={15} />
            </button>
          </div>
          <div className="panel-body" style={{ paddingTop: 4 }}>
            {goals.slice(0, 3).map((g) => {
              const p = goalProgress(g);
              const req = goalRequiredMonthly(g);
              const onTrack = g.monthly >= req * 0.92;
              return (
                <div className="goal-row" key={g.id}>
                  <div className="row-between">
                    <div className="goal-name">
                      <span className="cat-dot" style={{ background: g.color }} />
                      {g.name}
                    </div>
                    <span className={`badge ${onTrack ? 'pos' : 'warn'}`}>{onTrack ? 'On pace' : 'Behind'}</span>
                  </div>
                  <div className="row-between small" style={{ marginTop: 5, color: 'var(--muted)' }}>
                    <span className="num">{fmt(g.saved)} of {fmt(g.target)}</span>
                    <span className="mono">{Math.round(p * 100)}%</span>
                  </div>
                  <div className="progress thin" style={{ marginTop: 5 }}>
                    <span style={{ width: `${p * 100}%`, background: g.color }} />
                  </div>
                </div>
              );
            })}
            {!goals.length && <p className="small muted">No goals yet. Add one to give the model a destination.</p>}
          </div>
          <div className="panel-foot">
            <button className="linkish small" onClick={() => navigate('/plan')}>Open the goal planner</button>
            <span className="tiny" style={{ color: 'var(--muted)' }}>Target dates honoured</span>
          </div>
        </section>

        <section className="panel col-7">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Coach notes</h2>
              <p className="panel-sub">What changed, and what it costs if nothing changes.</p>
            </div>
            <button className="linkish small" onClick={() => navigate('/coach')}>All notes →</button>
          </div>
          <div className="panel-body">
            {nudges.length ? (
              nudges.map((n) => <NudgeCard key={n.id} nudge={n} />)
            ) : (
              <p className="small muted">No open nudges. The model is quiet.</p>
            )}
          </div>
        </section>

        <section className="panel col-5">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Where it went</h2>
              <p className="panel-sub">{monthLabel(now)}, by category</p>
            </div>
            <span className="badge">{fmt(summary.outflow)}</span>
          </div>
          <div className="panel-body">
            <CategoryBars data={categories} total={summary.outflow} max={7} />
          </div>
          <div className="panel-foot">
            <button className="linkish small" onClick={() => navigate('/review')}>Read the monthly review</button>
            <button className="linkish small" onClick={() => navigate('/transactions')}>All transactions</button>
          </div>
        </section>

        <section className="panel col-7">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Recent activity</h2>
              <p className="panel-sub">The last six lines the model has seen.</p>
            </div>
            <button className="linkish small" onClick={() => navigate('/transactions')}>View ledger →</button>
          </div>
          <div className="panel-body flush">
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th className="right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => {
                    const cat = CATEGORY_MAP[t.category];
                    return (
                      <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/transactions?q=${encodeURIComponent(t.merchant)}`)}>
                        <td className="mono small nowrap">{t.date.slice(8)} {monthLabel(t.date.slice(0, 7), true).slice(0, 3)}</td>
                        <td>
                          <div className="txn-merchant ellipsis" style={{ maxWidth: 190 }}>{t.merchant}</div>
                        </td>
                        <td>
                          <span className="row" style={{ gap: 6 }}>
                            <span className="cat-dot" style={{ background: cat?.color }} />
                            <span className="small">{cat?.name ?? t.category}</span>
                          </span>
                        </td>
                        <td className={`money ${t.amount > 0 ? 'pos' : ''}`}>
                          {t.amount > 0 ? '+' : '−'}{money(Math.abs(t.amount))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="panel col-5">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Can I afford this?</h2>
              <p className="panel-sub">Checked against free cash, not your total balance.</p>
            </div>
            <Icon name="wallet" size={15} />
          </div>
          <div className="panel-body">
            <div className="row" style={{ gap: 8 }}>
              <input
                className="input"
                inputMode="numeric"
                placeholder="Amount, e.g. 24,000"
                value={afford}
                aria-label="Purchase amount to check"
                onChange={(e) => {
                  setAfford(e.target.value);
                  setAffordResult(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && checkAfford()}
              />
              <button className="btn btn-primary" onClick={checkAfford}>Check</button>
            </div>
            <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
              {[5000, 25000, 75000].map((v) => (
                <button key={v} className="chip" onClick={() => { setAfford(String(v)); setAffordResult(null); }}>
                  {money(v)}
                </button>
              ))}
            </div>

            {affordResult && (
              <div style={{ marginTop: 14 }}>
                <div className={`badge ${affordResult === 'comfortable' ? 'pos' : affordResult === 'tight' ? 'warn' : 'neg'}`}>
                  {affordResult === 'comfortable' ? 'Comfortably affordable' : affordResult === 'tight' ? 'Tight but possible' : 'Not from free cash'}
                </div>
                <p className="small" style={{ marginTop: 8, color: 'var(--ink-2)' }}>
                  {affordResult === 'comfortable' &&
                    `After setting ${money(Number(afford.replace(/[^0-9]/g, '')))} aside you would still have ${money(
                      safe.safe - Number(afford.replace(/[^0-9]/g, ''))
                    )} free. Your goals are untouched.`}
                  {affordResult === 'tight' &&
                    `This uses most of your free cash. You would have ${money(
                      safe.safe - Number(afford.replace(/[^0-9]/g, ''))
                    )} left, and any surprise would land on the emergency fund.`}
                  {affordResult === 'not-now' &&
                    `Free cash is ${money(Math.max(0, safe.safe))}. This purchase would need to come from goals or the buffer — the simulator can show the trade-off.`}
                </p>
                <p className="tiny" style={{ color: 'var(--muted)', marginTop: 6 }}>
                  {money(Number(afford.replace(/[^0-9]/g, '')) / Math.max(1, surplus))} months of your current free cash flow.
                </p>
                <button className="linkish small" style={{ marginTop: 8 }} onClick={() => navigate('/simulate')}>
                  Model this purchase instead →
                </button>
              </div>
            )}

            {!affordResult && (
              <p className="small muted" style={{ marginTop: 12 }}>
                The model answers from free cash after your buffer, goals, and the next 30 days of bills. It will never
                tell you to borrow or invest — only what your own numbers allow.
              </p>
            )}
          </div>
        </section>

        {/* Category Pacing & Burn Rate */}
        <section className="panel col-7">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Category pacing & burn rate</h2>
              <p className="panel-sub">
                Spend vs budget pacing for {monthLabel(now)}. Day {Math.min(30, Number(today.slice(8, 10)))} of 30 ({pacing[0]?.pctMonth ?? 100}% of month).
              </p>
            </div>
            <button className="linkish small" onClick={() => navigate('/plan')}>Edit budget caps →</button>
          </div>
          <div className="panel-body">
            <div className="stack" style={{ gap: 14 }}>
              {pacing.map((p) => (
                <div key={p.category}>
                  <div className="row-between small" style={{ marginBottom: 4 }}>
                    <span className="row" style={{ gap: 6 }}>
                      <span className="cat-dot" style={{ background: p.color }} />
                      <strong style={{ fontSize: 13 }}>{p.name}</strong>
                    </span>
                    <span className="row" style={{ gap: 10 }}>
                      <span className="num">{fmt(p.spent)}</span>
                      <span className="faint">/ {fmt(p.budget)}</span>
                      <span
                        className={`badge ${
                          p.status === 'under' ? 'pos' : p.status === 'fast' ? 'warn' : 'outline'
                        }`}
                        style={{ fontSize: 10, padding: '1px 6px' }}
                      >
                        {p.status === 'under' ? 'Under pace' : p.status === 'fast' ? 'Pacing fast' : 'On track'}
                      </span>
                    </span>
                  </div>
                  <div className="progress thin" style={{ height: 6 }}>
                    <span
                      style={{
                        width: `${Math.min(100, p.pctSpent)}%`,
                        background: p.status === 'fast' ? 'var(--negative)' : p.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-foot">
            <span className="tiny muted">Budgets adjust with your 3-month trailing average or custom ceilings set in Plan.</span>
          </div>
        </section>

        {/* Weekend vs Weekday Discretionary Insights */}
        <section className="panel col-5">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Weekend vs weekday</h2>
              <p className="panel-sub">Discretionary spending rhythm for {monthLabel(now)}</p>
            </div>
            <Icon name="clock" size={15} />
          </div>
          <div className="panel-body">
            <div className="meter" style={{ height: 10 }} aria-hidden="true">
              <span style={{ width: `${weekend.weekendPct}%`, background: 'var(--accent)' }} title="Weekend" />
              <span style={{ width: `${100 - weekend.weekendPct}%`, background: 'var(--line-strong)' }} title="Weekday" />
            </div>
            <div className="row wrap" style={{ gap: 16, marginTop: 12 }}>
              <div className="row" style={{ gap: 6 }}>
                <i style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: 2 }} />
                <span className="small muted">Weekends (Sat & Sun):</span>
                <span className="num small">{fmt(weekend.weekendAmount)}</span>
                <span className="tiny faint">({weekend.weekendPct}%)</span>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <i style={{ width: 8, height: 8, background: 'var(--line-strong)', borderRadius: 2 }} />
                <span className="small muted">Weekdays (Mon–Fri):</span>
                <span className="num small">{fmt(weekend.weekdayAmount)}</span>
                <span className="tiny faint">({100 - weekend.weekendPct}%)</span>
              </div>
            </div>
            <p className="small muted" style={{ marginTop: 14, lineHeight: 1.6 }}>
              {weekend.weekendPct >= 40
                ? `${weekend.weekendPct}% of discretionary spending occurs on Saturdays and Sundays. Weekend outings represent your largest flex lever.`
                : 'Your discretionary spending is evenly distributed across the week without concentrated weekend spikes.'}
            </p>
          </div>
          <div className="panel-foot">
            <button className="linkish small" onClick={() => navigate('/review')}>View monthly report →</button>
          </div>
        </section>
      </div>

      <p className="tiny" style={{ color: 'var(--muted)', marginTop: 24, maxWidth: '80ch' }}>
        Baseline models your own numbers. It is not investment, tax, or credit advice, and it does not recommend
        securities or products. Every projection is an estimate, shown with its assumptions.
      </p>

      {/* Financial Health Index Modal */}
      <Modal
        open={healthOpen}
        onClose={() => setHealthOpen(false)}
        title={`Financial Health Index · ${health.score}/100 (${health.grade})`}
        sub="A deterministic assessment of your money model across four critical foundations."
        footer={<button className="btn btn-primary" onClick={() => setHealthOpen(false)}>Done</button>}
      >
        <div className="stack" style={{ gap: 16 }}>
          {health.pillars.map((pil) => (
            <div key={pil.name} className="callout" style={{ borderLeft: `3px solid ${pil.status === 'good' ? 'var(--positive)' : pil.status === 'fair' ? 'var(--accent)' : 'var(--negative)'}` }}>
              <div className="row-between">
                <strong style={{ fontSize: 13 }}>{pil.name}</strong>
                <span className="badge" style={{ fontSize: 11 }}>{pil.score} / {pil.max} pts</span>
              </div>
              <p className="small muted" style={{ marginTop: 4, lineHeight: 1.5 }}>{pil.tip}</p>
            </div>
          ))}
          <p className="tiny muted" style={{ marginTop: 4 }}>
            Health scores update in real time with every transaction and recurring commitment change. No arbitrary credit scores — pure cashflow resilience.
          </p>
        </div>
      </Modal>

      <Modal
        open={explain}
        onClose={() => setExplain(false)}
        title="How safe to spend works"
        sub="Free cash is deliberately conservative. It protects what you have already decided."
      >
        <div className="stack-sm">
          <div className="callout">
            <div className="label" style={{ marginBottom: 6 }}>The formula</div>
            <p className="mono small" style={{ lineHeight: 1.7 }}>
              balance ({fmt(balance)})<br />
              − emergency fund ({fmt(safe.emergency)})<br />
              − money in goals ({fmt(safe.goals)})<br />
              − next 30 days of bills ({fmt(safe.scheduled)})<br />
              − buffer ({fmt(safe.buffer)})<br />
              = <strong>{fmt(safe.safe)}</strong>
            </p>
          </div>
          <p className="small muted">
            The buffer is a flat ₹15,000. The emergency fund and goal balances are treated as already spoken for, even
            though the money still sits in your account. Bills are counted from detected recurring payments, not from
            guesswork.
          </p>
          <p className="small muted">
            If free cash is negative, nothing is broken — it means your commitments for the next 30 days are larger than
            unallocated cash. The simulator is the right place to look at what to move.
          </p>
        </div>
      </Modal>
    </div>
  );
}
