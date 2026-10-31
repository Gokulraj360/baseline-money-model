import { useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import type { ScenarioLevers } from '../types';
import { addMonths, monthLabel, nowMonth } from '../lib/date';
import { money, pct } from '../lib/format';
import { useMoney } from '../hooks/useMoney';
import { Icon } from '../components/Icon';
import { Confirm, Empty, Modal, useToast } from '../components/ui';
import { ScenarioChart } from '../components/charts';
import { compareScenarios, DEFAULT_LEVERS, leverCount, runSimulation, scenarioSummary } from '../domain/simulate';
import { currentBalance, safeToSpend, subscriptionRecurring } from '../domain/finance';
import { monthlyAmount } from '../domain/finance';

function inMonths(n: number | null): string {
  if (n === null) return 'not within 20 years';
  if (n === 0) return 'already funded';
  if (n < 12) return `${n} month${n === 1 ? '' : 's'}`;
  const y = Math.floor(n / 12);
  const m = n % 12;
  return `${y} year${y === 1 ? '' : 's'}${m ? ` ${m} mo` : ''}`;
}

export default function Simulate() {
  const { state, saveScenario, deleteScenario, applyLevers, applyScenario } = useApp();
  const { push } = useToast();
  const fmt = useMoney();

  const [levers, setLevers] = useState<ScenarioLevers>({ ...DEFAULT_LEVERS });
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [applyOpen, setApplyOpen] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const baseline = useMemo(() => runSimulation(state, DEFAULT_LEVERS, 12), [state]);
  const scenario = useMemo(() => runSimulation(state, levers, 12), [state, levers]);
  const subs = subscriptionRecurring(state);
  const safe = safeToSpend(state);

  const history = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => addMonths(nowMonth(), -5 + i));
    let running = state.profile.openingBalance;
    return months.map((m) => {
      running += state.txns
        .filter((t) => !t.pending && t.date.slice(0, 7) === m)
        .reduce((s, t) => s + t.amount, 0);
      return { key: m, value: running };
    });
  }, [state.txns, state.profile.openingBalance]);

  const start = addMonths(nowMonth(), 1);
  const basePoints = baseline.months.map((m) => ({ key: m.key, value: m.balance }));
  const scnPoints = scenario.months.map((m) => ({ key: m.key, value: m.balance }));

  const endDelta = scenario.endBalance - baseline.endBalance;
  const cashDelta = scenario.monthly.surplus - baseline.monthly.surplus;
  const etaById = new Map(scenario.goalEtas.map((e) => [e.id, e]));
  const baseEtaById = new Map(baseline.goalEtas.map((e) => [e.id, e]));

  const set = <K extends keyof ScenarioLevers>(key: K, value: ScenarioLevers[K]) =>
    setLevers((l) => ({ ...l, [key]: value }));

  const toggleSub = (id: string) => {
    setLevers((l) => ({
      ...l,
      cancelledSubs: l.cancelledSubs.includes(id)
        ? l.cancelledSubs.filter((x) => x !== id)
        : [...l.cancelledSubs, id],
    }));
  };

  const summary = scenarioSummary(levers);
  const changed = leverCount(levers);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">The what-if lab</div>
          <h1 className="display">Change a lever. <em>Watch your money move.</em></h1>
          <p className="lede">
            Every scenario runs against your real profile and six months of transactions. No returns, no products, no
            promises — just your own cash flow, twelve months forward.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-ghost" onClick={() => { setLevers({ ...DEFAULT_LEVERS }); push('Scenario reset to baseline'); }}>
            <Icon name="refresh" size={14} /> Reset
          </button>
          <button className="btn" onClick={() => { setName(`Scenario ${state.scenarios.length + 1}`); setSaving(true); }}>
            <Icon name="plus" size={14} /> Save scenario
          </button>
          <button className="btn btn-primary" onClick={() => setApplyOpen(true)}>
            <Icon name="check" size={14} /> Apply to plan
          </button>
        </div>
      </div>

      <div className="row wrap" style={{ gap: 6, marginBottom: 14 }}>
        <span className="tiny" style={{ color: 'var(--muted)' }}>Try:</span>
        {[
          { label: 'Rent +15%', apply: () => setLevers({ ...DEFAULT_LEVERS, rentChange: 15 }) },
          { label: 'Dining −30%', apply: () => setLevers({ ...DEFAULT_LEVERS, diningCut: 30 }) },
          { label: 'Cancel dormant', apply: () => setLevers({ ...DEFAULT_LEVERS, cancelledSubs: state.recurring.filter((r) => r.usage === 'unused' && r.status !== 'cancelled').map((r) => r.id) }) },
          { label: 'Salary +10%', apply: () => setLevers({ ...DEFAULT_LEVERS, incomeChange: 10 }) },
          { label: 'Big purchase ₹1L', apply: () => setLevers({ ...DEFAULT_LEVERS, oneOffAmount: 100000, oneOffMonth: 1 }) },
          { label: 'Inflation stress +8%', apply: () => setLevers({ ...DEFAULT_LEVERS, inflationRate: 8 }) },
          { label: 'Job gap (3 mo)', apply: () => setLevers({ ...DEFAULT_LEVERS, jobLossMonths: 3 }) },
        ].map((p) => (
          <button key={p.label} className="chip" onClick={() => { p.apply(); push(`Applied preset: ${p.label}`); }}>{p.label}</button>
        ))}
      </div>

      <div className="grid">
        <section className="panel col-7">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Levers</h2>
              <p className="panel-sub">{changed ? `${changed} change${changed === 1 ? '' : 's'} against baseline` : 'Baseline — move something to begin.'}</p>
            </div>
            <span className="badge">{changed ? 'Modified' : 'Baseline'}</span>
          </div>
          <div className="panel-body" style={{ paddingTop: 0 }}>
            <div className="lever">
              <div className="lever-head">
                <div>
                  <div className="small strong">Dining out & delivery</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>Baseline {fmt(baseline.monthly.dining)} a month</div>
                </div>
                <span className="lever-value">−{levers.diningCut}% · {fmt(baseline.monthly.dining - scenario.monthly.dining)}</span>
              </div>
              <input
                type="range" min={0} max={50} step={5}
                value={levers.diningCut}
                aria-label="Dining out cut percentage"
                onChange={(e) => set('diningCut', Number(e.target.value))}
              />
            </div>

            <div className="lever">
              <div className="lever-head">
                <div>
                  <div className="small strong">Groceries</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>Baseline {fmt(baseline.monthly.groceries)} a month</div>
                </div>
                <span className="lever-value">−{levers.groceriesCut}% · {fmt(baseline.monthly.groceries - scenario.monthly.groceries)}</span>
              </div>
              <input
                type="range" min={0} max={30} step={5}
                value={levers.groceriesCut}
                aria-label="Groceries cut percentage"
                onChange={(e) => set('groceriesCut', Number(e.target.value))}
              />
            </div>

            <div className="lever">
              <div className="lever-head">
                <div>
                  <div className="small strong">Subscriptions to cancel</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>Only detected subscriptions and memberships</div>
                </div>
                <span className={`lever-value ${scenario.monthlySubsSaved ? 'pos' : ''}`}>
                  +{fmt(scenario.monthlySubsSaved)}/mo
                </span>
              </div>
              <div className="stack-sm" style={{ marginTop: 4 }}>
                {subs.map((s) => {
                  const checked = levers.cancelledSubs.includes(s.id);
                  return (
                    <label key={s.id} className="row-between" style={{ cursor: 'pointer', gap: 10 }}>
                      <span className="row" style={{ gap: 8 }}>
                        <input type="checkbox" checked={checked} onChange={() => toggleSub(s.id)} aria-label={`Cancel ${s.merchant}`} />
                        <span className="small">{s.merchant}</span>
                        {s.usage === 'unused' && <span className="badge warn">Dormant</span>}
                      </span>
                      <span className="num small muted">{fmt(monthlyAmount(s.amount, s.cadence))}/mo</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="lever">
              <div className="lever-head">
                <div>
                  <div className="small strong">Rent change</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>Current rent {fmt(state.profile.fixed.find((f) => f.category === 'rent')?.amount ?? 0)}</div>
                </div>
                <span className={`lever-value ${levers.rentChange > 0 ? 'neg' : levers.rentChange < 0 ? 'pos' : ''}`}>
                  {levers.rentChange > 0 ? '+' : ''}{levers.rentChange}% · {fmt(Math.abs(scenario.rentDelta))}{levers.rentChange >= 0 ? ' more' : ' less'}
                </span>
              </div>
              <input type="range" min={-10} max={30} step={1} value={levers.rentChange} aria-label="Rent change percentage" onChange={(e) => set('rentChange', Number(e.target.value))} />
            </div>

            <div className="lever">
              <div className="lever-head">
                <div>
                  <div className="small strong">Income change</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>Salary, freelance, or a gap between jobs</div>
                </div>
                <span className={`lever-value ${levers.incomeChange > 0 ? 'pos' : levers.incomeChange < 0 ? 'neg' : ''}`}>
                  {levers.incomeChange > 0 ? '+' : ''}{levers.incomeChange}% · {fmt(Math.abs(scenario.incomeDelta))}
                </span>
              </div>
              <input type="range" min={-20} max={20} step={1} value={levers.incomeChange} aria-label="Income change percentage" onChange={(e) => set('incomeChange', Number(e.target.value))} />
            </div>

            <div className="lever">
              <div className="lever-head">
                <div>
                  <div className="small strong">One-off expense</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>A deposit, a trip, a repair</div>
                </div>
                <span className="lever-value">{fmt(levers.oneOffAmount)}</span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <input
                  className="input num"
                  style={{ maxWidth: 150 }}
                  inputMode="decimal"
                  value={levers.oneOffAmount || ''}
                  placeholder="0"
                  aria-label="One-off expense amount"
                  onChange={(e) => set('oneOffAmount', Number(e.target.value.replace(/[^0-9]/g, '')))}
                />
                <select className="select" style={{ width: 'auto' }} value={levers.oneOffMonth} onChange={(e) => set('oneOffMonth', Number(e.target.value))} aria-label="Month for the one-off expense">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>{monthLabel(addMonths(start, i), true)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lever">
              <div className="lever-head">
                <div>
                  <div className="small strong">Extra monthly savings</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>Moved to goals or a separate account</div>
                </div>
                <span className="lever-value">{fmt(levers.extraSavings)}/mo</span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <input
                  type="range" min={0} max={30000} step={1000}
                  value={levers.extraSavings}
                  aria-label="Extra monthly savings"
                  onChange={(e) => set('extraSavings', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="lever">
              <div className="lever-head">
                <div>
                  <div className="small strong">Annual inflation stress test</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>Compounds flexible expenses over the 12 months</div>
                </div>
                <span className={`lever-value ${(levers.inflationRate ?? 0) > 0 ? 'neg' : ''}`}>
                  {levers.inflationRate ?? 0}%/year
                </span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <input
                  type="range" min={0} max={15} step={1}
                  value={levers.inflationRate ?? 0}
                  aria-label="Inflation percentage"
                  onChange={(e) => set('inflationRate', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="lever">
              <div className="lever-head">
                <div>
                  <div className="small strong">Job loss / income shock</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>Simulate months with ₹0 active salary inflow</div>
                </div>
                <span className={`lever-value ${(levers.jobLossMonths ?? 0) > 0 ? 'neg' : ''}`}>
                  {levers.jobLossMonths ?? 0} month{(levers.jobLossMonths ?? 0) === 1 ? '' : 's'}
                </span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <input
                  type="range" min={0} max={12} step={1}
                  value={levers.jobLossMonths ?? 0}
                  aria-label="Job loss duration in months"
                  onChange={(e) => set('jobLossMonths', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="row wrap" style={{ gap: 6, marginTop: 12 }}>
              {summary.map((s) => (
                <span key={s} className="badge outline">{s}</span>
              ))}
            </div>
          </div>
        </section>

        <aside className="col-5 stack">
          <section className="panel" style={{ borderTop: '2px solid var(--accent)' }}>
            <div className="panel-head">
              <div>
                <h2 className="panel-title">What this does</h2>
                <p className="panel-sub">Twelve months from {monthLabel(start)}.</p>
              </div>
              <span className={`badge ${cashDelta >= 0 ? 'pos' : 'neg'}`}>{cashDelta >= 0 ? '+' : '−'}{fmt(Math.abs(cashDelta))}/mo</span>
            </div>
            <div className="panel-body">
              <div className="label">Balance after 12 months</div>
              <div className="big-number" style={{ fontSize: 38, marginTop: 4 }}>{fmt(scenario.endBalance)}</div>
              <p className="small" style={{ color: 'var(--muted)', marginTop: 4 }}>
                <span className={endDelta >= 0 ? 'pos' : 'neg'}>{endDelta >= 0 ? '+' : '−'}{fmt(Math.abs(endDelta))}</span> against the
                baseline of {fmt(baseline.endBalance)}.
              </p>

              <div className="divider dashed" />

              <div className="row-between small"><span className="muted">Free cash each month</span><span className={`num ${scenario.monthly.surplus >= 0 ? 'pos' : 'neg'}`}>{fmt(scenario.monthly.surplus)}</span></div>
              <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Income</span><span className="num">{fmt(scenario.monthly.income)}</span></div>
              <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Committed costs</span><span className="num">−{fmt(scenario.monthly.fixed)}</span></div>
              <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Flexible baseline</span><span className="num">−{fmt(scenario.monthly.flexible)}</span></div>
              {levers.extraSavings > 0 && <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Extra savings</span><span className="num">−{fmt(levers.extraSavings)}</span></div>}

              <div className="divider dashed" />

              <div className="row-between small" style={{ marginTop: 4 }}>
                <span className="muted">Safe to spend today</span>
                <span className="num">{fmt(Math.max(0, safe.safe))}</span>
              </div>
              <div className="row-between small" style={{ marginTop: 5 }}>
                <span className="muted">Runway at this burn</span>
                <span className="num">{scenario.runwayMonths.toFixed(1)} months</span>
              </div>

              <button className="btn btn-block" style={{ marginTop: 14 }} onClick={() => { saveScenario(`${summary[0]}`, levers); push('Scenario saved'); }}>
                <Icon name="plus" size={13} /> Save this scenario
              </button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Goal dates</h2>
                <p className="panel-sub">Surplus is allocated by priority.</p>
              </div>
            </div>
            <div className="panel-body" style={{ paddingTop: 4 }}>
              {scenario.goalEtas.map((e) => {
                const b = baseEtaById.get(e.id);
                const delta =
                  e.monthIndex !== null && b?.monthIndex !== null && b?.monthIndex !== undefined
                    ? b.monthIndex - e.monthIndex
                    : null;
                return (
                  <div className="goal-row" key={e.id}>
                    <div className="row-between">
                      <span className="goal-name"><span className="cat-dot" style={{ background: e.color }} />{e.name}</span>
                      <span className="badge outline">{inMonths(e.monthIndex)}</span>
                    </div>
                    <div className="row-between" style={{ marginTop: 3 }}>
                      <span className="tiny" style={{ color: 'var(--muted)' }}>Baseline: {inMonths(b?.monthIndex ?? null)}</span>
                      {delta !== null && delta !== 0 && (
                        <span className={`tiny ${delta > 0 ? 'pos' : 'neg'}`}>
                          {delta > 0 ? `${delta} month${delta === 1 ? '' : 's'} earlier` : `${Math.abs(delta)} month${Math.abs(delta) === 1 ? '' : 's'} later`}
                        </span>
                      )}
                      {delta === 0 && <span className="tiny faint">no change</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>

        <section className="panel col-12">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Balance projection</h2>
              <p className="panel-sub">Six months of history, then baseline and scenario side by side.</p>
            </div>
            <div className="legend">
              <span><i /> Actual</span>
              <span><i className="dashed" style={{ background: 'repeating-linear-gradient(90deg, var(--muted) 0 3px, transparent 3px 6px)' }} /> Baseline</span>
              <span><i className="accent" /> This scenario</span>
            </div>
          </div>
          <div className="panel-body">
            <ScenarioChart actual={history} baseline={basePoints} scenario={scnPoints} height={280} />
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>
              Forecast assumes the profile stays unchanged after the levers. Inflation and returns are not modelled.
            </span>
            <button className="linkish small" onClick={() => push(`Current balance: ${money(currentBalance(state))}`)}>Check today’s balance</button>
          </div>
        </section>

        <section className="panel col-12">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Soul, in plain language</h2>
              <p className="panel-sub">The same result without the chart.</p>
            </div>
          </div>
          <div className="panel-body">
            <p style={{ fontSize: 14, lineHeight: 1.65, maxWidth: '86ch' }}>
              {changed === 0 ? (
                <>Nothing has moved yet. Drag a lever and the model will tell you what changes — in rupees, in months, and in the goals it affects.</>
              ) : (
                <>
                  {summary.join(', ')}. That leaves <strong className="num">{fmt(scenario.monthly.surplus)}</strong> free each month
                  {cashDelta !== 0 ? <> — {fmt(Math.abs(cashDelta))} {cashDelta > 0 ? 'more' : 'less'} than the baseline</> : null}. After
                  twelve months the balance is <strong className="num">{fmt(scenario.endBalance)}</strong>
                  {endDelta !== 0 ? <>, {fmt(Math.abs(endDelta))} {endDelta > 0 ? 'higher' : 'lower'} than doing nothing</> : null}.
                  {scenario.goalEtas[0] && (
                    <> Your first goal, {scenario.goalEtas[0].name}, lands {inMonths(scenario.goalEtas[0].monthIndex)} from now.</>
                  )}
                </>
              )}
            </p>
            <div className="note guard" style={{ marginTop: 12 }}>
              <strong>Guardrail:</strong> this is a cash-flow model, not investment advice. It does not estimate returns,
              recommend securities, or suggest borrowing. Every number is built from your own profile and transactions.
            </div>
          </div>
        </section>

        <section className="panel col-12">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Saved scenarios</h2>
              <p className="panel-sub">Keep the versions worth comparing.</p>
            </div>
            <span className="badge">{state.scenarios.length}</span>
          </div>
          <div className="panel-body">
            {state.scenarios.length === 0 ? (
              <Empty
                icon="sliders"
                title="No saved scenarios"
                body="Save this one to compare it with a different future. Loading a scenario replaces the current levers."
                action={<button className="btn btn-sm" onClick={() => { setName('Scenario 1'); setSaving(true); }}>Save current levers</button>}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {state.scenarios.map((s) => {
                  const sim = runSimulation(state, s.levers, 12);
                  return (
                    <div key={s.id} className="goal-card">
                      <div className="goal-top">
                        <div>
                          <div className="small strong">{s.name}</div>
                          <div className="tiny" style={{ color: 'var(--muted)', marginTop: 2 }}>
                            {scenarioSummary(s.levers).slice(0, 2).join(' · ')}
                          </div>
                        </div>
                        {s.pinned && <span className="badge pos">Applied</span>}
                      </div>
                      <div className="row-between" style={{ marginTop: 10 }}>
                        <span className="tiny" style={{ color: 'var(--muted)' }}>12-month balance</span>
                        <span className="num small">{money(sim.endBalance)}</span>
                      </div>
                      <div className="row-between" style={{ marginTop: 3 }}>
                        <span className="tiny" style={{ color: 'var(--muted)' }}>Free each month</span>
                        <span className={`num small ${sim.monthly.surplus >= 0 ? 'pos' : 'neg'}`}>{money(sim.monthly.surplus)}</span>
                      </div>
                      <div className="row" style={{ gap: 4, marginTop: 10 }}>
                        <button className="btn btn-sm" onClick={() => { setLevers(s.levers); push(`Loaded ${s.name}`); }}>Load</button>
                        <button className="btn btn-sm" onClick={() => { applyScenario(s.id); push(`${s.name} applied to the plan`); }}>Apply</button>
                        <button className="btn btn-sm btn-ghost btn-danger" onClick={() => setRemoving(s.id)}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {state.scenarios.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div className="label" style={{ marginBottom: 8 }}>Multi-Scenario Comparison Matrix</div>
                <div className="table-wrap">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Scenario</th>
                        <th className="right">Surplus / mo</th>
                        <th className="right">12-Mo End Balance</th>
                        <th className="right">Delta vs Base</th>
                        <th className="right">Runway</th>
                        <th>First Goal ETA</th>
                        <th className="right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ background: 'var(--surface-2)' }}>
                        <td><strong>Baseline</strong> <span className="badge outline" style={{ marginLeft: 6 }}>Live Profile</span></td>
                        <td className="num right pos">{fmt(baseline.monthly.surplus)}</td>
                        <td className="num right">{fmt(baseline.endBalance)}</td>
                        <td className="num right muted">—</td>
                        <td className="num right">{baseline.runwayMonths.toFixed(1)} mo</td>
                        <td className="small">{baseline.goalEtas.find((g) => g.monthKey)?.monthKey ?? '—'}</td>
                        <td className="right"><button className="btn btn-sm" onClick={() => { setLevers({ ...DEFAULT_LEVERS }); push('Reset to baseline'); }}>Reset</button></td>
                      </tr>
                      {compareScenarios(state, state.scenarios).map((c) => (
                        <tr key={c.id}>
                          <td><strong>{c.name}</strong></td>
                          <td className={`num right ${c.surplus >= 0 ? 'pos' : 'neg'}`}>{fmt(c.surplus)}</td>
                          <td className="num right">{fmt(c.endBalance)}</td>
                          <td className={`num right ${c.deltaEndBalance >= 0 ? 'pos' : 'neg'}`}>
                            {c.deltaEndBalance >= 0 ? '+' : '−'}{fmt(Math.abs(c.deltaEndBalance))}
                          </td>
                          <td className="num right">{c.runwayMonths.toFixed(1)} mo</td>
                          <td className="small">{c.firstGoalETA ?? '—'}</td>
                          <td className="right">
                            <button
                              className="btn btn-sm"
                              onClick={() => {
                                const target = state.scenarios.find((x) => x.id === c.id);
                                if (target) { setLevers(target.levers); push(`Loaded ${c.name}`); }
                              }}
                            >
                              Load
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal
        open={saving}
        onClose={() => setSaving(false)}
        title="Save this scenario"
        sub="Saved scenarios stay on this device and can be applied to the plan."
        footer={
          <>
            <button className="btn" onClick={() => setSaving(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              disabled={!name.trim()}
              onClick={() => {
                saveScenario(name.trim(), levers);
                push('Scenario saved');
                setSaving(false);
              }}
            >
              Save scenario
            </button>
          </>
        }
      >
        <div className="field">
          <label>Scenario name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rent rises, dining cools" autoFocus />
        </div>
        <div className="callout" style={{ marginTop: 10 }}>
          <div className="tiny" style={{ color: 'var(--muted)' }}>What will be saved</div>
          <p className="small" style={{ marginTop: 4 }}>{scenarioSummary(levers).join(' · ')}</p>
        </div>
      </Modal>

      <Confirm
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onConfirm={() => {
          applyLevers(levers);
          push('Scenario applied. Income, rent, subscriptions, and goal contributions updated.');
        }}
        title="Apply this scenario to your plan?"
        body="This writes the lever changes into your persistent profile: income, rent, cancelled subscriptions, and recalculated goal contributions. You can undo the goal changes by editing the plan."
        confirmLabel="Apply to plan"
      />

      <Confirm
        open={!!removing}
        onClose={() => setRemoving(null)}
        onConfirm={() => {
          if (!removing) return;
          deleteScenario(removing);
          push('Scenario deleted');
        }}
        title="Delete this scenario?"
        body="The saved levers are removed. The plan itself is untouched."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
