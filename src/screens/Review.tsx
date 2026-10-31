import { useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import { addMonths, monthLabel, nowMonth, todayISO } from '../lib/date';
import { money, pct } from '../lib/format';
import { useMoney } from '../hooks/useMoney';
import { buildReport } from '../domain/report';
import { CATEGORY_MAP } from '../data/categories';
import { Icon } from '../components/Icon';
import { CategoryBars, Donut } from '../components/charts';
import { Empty, useToast } from '../components/ui';
import { downloadFile, toCSV } from '../lib/export';
import { navigate } from '../lib/router';

export default function Review() {
  const { state } = useApp();
  const { push } = useToast();
  const fmt = useMoney();

  const months = useMemo(
    () => [...new Set(state.txns.map((t) => t.date.slice(0, 7)))].sort().reverse(),
    [state.txns]
  );
  const [month, setMonth] = useState(months[0] ?? nowMonth());
  const report = useMemo(() => buildReport(state, month), [state, month]);
  const s = report.summary;

  const exportReport = () => {
    const rows = report.categories.map((c) => ({
      Category: c.name,
      ThisMonth: Math.round(c.amount),
      LastMonth: Math.round(c.prev),
      Change: Math.round(c.delta),
      ChangePct: Math.round(c.pct),
    }));
    downloadFile(toCSV(rows), `baseline-review-${month}.csv`);
    push('Category table exported');
  };

  const maxBar = Math.max(...report.categories.slice(0, 8).map((c) => c.amount), 1);

  return (
    <div className="page">
      <div className="page-head no-print">
        <div>
          <div className="eyebrow">Monthly review · {monthLabel(month)}</div>
          <h1 className="display">The month, <em>written up.</em></h1>
          <p className="lede">
            A plain-language account of what happened, what changed, and what the model now believes. Print it, or keep
            it as the record.
          </p>
        </div>
        <div className="head-actions">
          <select className="select" style={{ width: 'auto' }} value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Choose a month">
            {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
          </select>
          <button className="btn" onClick={exportReport}><Icon name="download" size={14} /> Export table</button>
          <button className="btn btn-primary" onClick={() => { window.print(); push('Print dialog opened'); }}>
            <Icon name="printer" size={14} /> Print / PDF
          </button>
        </div>
      </div>

      <div className="print-only" style={{ marginBottom: 16 }}>
        <div className="eyebrow">Baseline · monthly review</div>
        <h1 style={{ fontSize: 26, marginTop: 6 }}>{monthLabel(month)}</h1>
        <p className="small muted">Generated {todayISO()} for {state.profile.name}. Models your own numbers; not advice.</p>
      </div>

      <div className="grid">
        <section className="panel col-8">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">The short version</h2>
              <p className="panel-sub">{s.count} transactions · {monthLabel(month)}</p>
            </div>
            <span className={`badge ${report.totalDelta <= 0 ? 'pos' : 'warn'}`}>
              {report.totalDelta <= 0 ? 'Spending down ' : 'Spending up '}
              {fmt(Math.abs(report.totalDelta))}
            </span>
          </div>
          <div className="panel-body">
            <div className="stack" style={{ gap: 14 }}>
              {report.narrative.map((n, i) => (
                <div key={i} style={{ borderLeft: i === 0 ? '2px solid var(--accent)' : '1px solid var(--line)', paddingLeft: 12 }}>
                  <h3 style={{ fontSize: 13, marginBottom: 3 }}>{n.title}</h3>
                  <p className="small" style={{ color: 'var(--ink-2)', lineHeight: 1.65 }}>{n.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>Written from the ledger — no language model involved</span>
            <button className="linkish small no-print" onClick={() => navigate('/transactions')}>Open the underlying lines</button>
          </div>
        </section>

        <section className="panel col-4">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">At a glance</h2>
              <p className="panel-sub">Income, outflow, and what stayed.</p>
            </div>
          </div>
          <div className="panel-body">
            <div className="stack-sm">
              <div>
                <div className="label">Income</div>
                <div className="medium-number pos" style={{ marginTop: 2 }}>{fmt(s.income)}</div>
              </div>
              <div>
                <div className="label">Everything out</div>
                <div className="medium-number" style={{ marginTop: 2 }}>{fmt(s.outflow)}</div>
              </div>
              <div>
                <div className="label">Kept</div>
                <div className={`medium-number ${s.surplus >= 0 ? 'pos' : 'neg'}`} style={{ marginTop: 2 }}>{fmt(s.surplus)}</div>
                <div className="tiny" style={{ color: 'var(--muted)' }}>
                  {pct(report.savingsRate)} savings rate · target {pct(state.profile.savingsRateTarget)}
                </div>
              </div>
            </div>
            <div className="divider dashed" />
            <div className="row-between small"><span className="muted">Fixed costs</span><span className="num">{fmt(s.fixed)}</span></div>
            <div className="row-between small" style={{ marginTop: 4 }}><span className="muted">Flexible</span><span className="num">{fmt(s.flexible)}</span></div>
            <div className="row-between small" style={{ marginTop: 4 }}><span className="muted">Committed savings</span><span className="num">{fmt(s.savings)}</span></div>
            <div className="row-between small" style={{ marginTop: 4 }}><span className="muted">Transactions</span><span className="num">{s.count}</span></div>
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>Previous month {monthLabel(addMonths(month, -1), true)}</span>
            <span className="num small">{fmt(report.prev.outflow)}</span>
          </div>
        </section>

        <section className="panel col-7">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Where it went</h2>
              <p className="panel-sub">Category, this month against last.</p>
            </div>
          </div>
          <div className="panel-body">
            {report.categories.length ? (
              <div className="stack-sm">
                {report.categories.slice(0, 9).map((c) => (
                  <div key={c.category} className="row" style={{ gap: 10 }}>
                    <span style={{ width: 110, fontSize: 11.5, flex: 'none' }} className="ellipsis">{c.name}</span>
                    <div style={{ flex: 1, height: 8, background: 'var(--surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${(c.amount / maxBar) * 100}%`, height: '100%', background: c.color, opacity: 0.85 }} />
                    </div>
                    <span className="num small" style={{ width: 78, textAlign: 'right' }}>{money(c.amount)}</span>
                    <span className={`tiny mono ${c.delta > 0 ? 'neg' : 'pos'}`} style={{ width: 64, textAlign: 'right' }}>
                      {c.prev === 0 ? 'new' : `${c.delta > 0 ? '+' : ''}${Math.round(c.pct)}%`}
                    </span>
                  </div>
                ))}
              </div>
            ) : <Empty icon="receipt" title="No transactions in this month" body="Choose another month or import a statement." />}
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>{report.categories.length} categories touched</span>
            <button className="linkish small no-print" onClick={() => navigate('/transactions')}>Recategorise anything</button>
          </div>
        </section>

        <section className="panel col-5">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">The split</h2>
              <p className="panel-sub">Fixed, flexible, and saved.</p>
            </div>
          </div>
          <div className="panel-body">
            <div className="row" style={{ gap: 18, alignItems: 'center' }}>
              <Donut
                slices={[
                  { value: s.fixed, color: 'var(--ink)', label: `Fixed ${money(s.fixed)}` },
                  { value: s.flexible, color: 'var(--accent)', label: `Flexible ${money(s.flexible)}` },
                  { value: s.savings, color: 'var(--positive)', label: `Saved ${money(s.savings)}` },
                ]}
                size={124}
                thickness={15}
                center={
                  <div>
                    <div className="tiny" style={{ color: 'var(--muted)' }}>Outflow</div>
                    <div className="num small strong">{fmt(s.outflow)}</div>
                  </div>
                }
              />
              <div className="stack-sm" style={{ flex: 1 }}>
                {[
                  { label: 'Fixed', value: s.fixed, color: 'var(--ink)' },
                  { label: 'Flexible', value: s.flexible, color: 'var(--accent)' },
                  { label: 'Saved', value: s.savings, color: 'var(--positive)' },
                ].map((x) => (
                  <div key={x.label} className="row-between small">
                    <span className="row" style={{ gap: 6 }}>
                      <i style={{ width: 8, height: 8, borderRadius: 2, background: x.color }} />
                      {x.label}
                    </span>
                    <span className="num">{fmt(x.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="divider dashed" />
            <div className="tiny" style={{ color: 'var(--muted)', marginBottom: 4 }}>Top merchants</div>
            {report.merchants.map((m) => (
              <div key={m.merchant} className="row-between small" style={{ padding: '3px 0' }}>
                <span className="ellipsis" style={{ maxWidth: 190 }}>{m.merchant}</span>
                <span className="num">{money(m.amount)} <span className="faint">· {m.count}</span></span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">What went well</h2>
            </div>
            <Icon name="trendDown" size={15} style={{ color: 'var(--positive)' }} />
          </div>
          <div className="panel-body">
            <ul className="stack-sm">
              {report.wins.map((w, i) => (
                <li key={i} className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--positive)', paddingTop: 2 }}><Icon name="check" size={13} /></span>
                  <span className="small">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">What slipped</h2>
            </div>
            <Icon name="alert" size={15} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="panel-body">
            {report.slippage.length ? (
              <ul className="stack-sm">
                {report.slippage.map((w, i) => (
                  <li key={i} className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent)', paddingTop: 2 }}><Icon name="alert" size={13} /></span>
                    <span className="small">{w}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="small muted">Nothing notable. The month stayed inside the plan.</p>
            )}
          </div>
          <div className="panel-foot no-print">
            <button className="linkish small" onClick={() => navigate('/coach')}>See the live nudges</button>
          </div>
        </section>

        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Recurring commitments</h2>
              <p className="panel-sub">{fmt(report.subscriptions.monthly)} a month · {fmt(report.subscriptions.annual)} a year</p>
            </div>
            <button className="btn btn-ghost btn-icon no-print" aria-label="Open recurring" onClick={() => navigate('/recurring')}>
              <Icon name="chevronRight" size={15} />
            </button>
          </div>
          <div className="panel-body">
            {report.priceChanges.length ? (
              report.priceChanges.map((c) => (
                <div key={c.merchant} className="row-between small" style={{ padding: '5px 0', borderBottom: '1px solid var(--line)' }}>
                  <span>{c.merchant}</span>
                  <span className="num">{money(c.from)} → {money(c.to)} <span className="neg tiny">+{money(c.delta)}/mo</span></span>
                </div>
              ))
            ) : (
              <p className="small muted">No price changes detected this month.</p>
            )}
            <div className="note" style={{ marginTop: 10 }}>
              Annual billing is normalised to a monthly figure so yearly plans stay comparable.
            </div>
          </div>
        </section>

        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Goal progress</h2>
              <p className="panel-sub">Where the saved money sits.</p>
            </div>
          </div>
          <div className="panel-body">
            {report.goals.map((g) => (
              <div key={g.goal.id} className="goal-row">
                <div className="row-between">
                  <span className="goal-name"><span className="cat-dot" style={{ background: g.goal.color }} />{g.goal.name}</span>
                  <span className={`badge ${g.onTrack ? 'pos' : 'warn'}`}>{g.onTrack ? 'On pace' : 'Behind'}</span>
                </div>
                <div className="progress thin" style={{ marginTop: 6 }}>
                  <span style={{ width: `${Math.min(100, (g.goal.saved / g.goal.target) * 100)}%`, background: g.goal.color }} />
                </div>
                <div className="row-between tiny" style={{ marginTop: 4, color: 'var(--muted)' }}>
                  <span>{fmt(g.goal.saved)} of {fmt(g.goal.target)}</span>
                  <span>needs {fmt(g.required)}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel col-12">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Assumptions and guardrails</h2>
            </div>
          </div>
          <div className="panel-body">
            <div className="grid" style={{ gap: 20 }}>
              <div className="col-6">
                <div className="label" style={{ marginBottom: 6 }}>How this was built</div>
                <ul className="small muted" style={{ paddingLeft: 0, lineHeight: 1.7 }}>
                  <li>Income and spending come from counted transactions only.</li>
                  <li>Excluded transfers and pending lines are left out.</li>
                  <li>Subscriptions are normalised to monthly amounts.</li>
                  <li>Balances are reconstructions, not bank-certified statements.</li>
                </ul>
              </div>
              <div className="col-6">
                <div className="label" style={{ marginBottom: 6 }}>What this is not</div>
                <p className="small" style={{ color: 'var(--ink-2)', lineHeight: 1.7 }}>
                  Baseline does not recommend securities, funds, insurance products, or loans. It does not predict
                  markets or promise returns. It models your cash flow and the trade-offs already present in your
                  numbers. For tax or investment decisions, speak to a registered professional.
                </p>
              </div>
            </div>
            <div className="note guard" style={{ marginTop: 14 }}>
              A review is a record, not a verdict. One expensive month is data; three in a row is a pattern.
            </div>
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>Baseline · {state.profile.name} · {monthLabel(month)}</span>
            <button className="linkish small no-print" onClick={() => { downloadFile(JSON.stringify({ report, state: state.txns.length }, null, 2), `baseline-report-${month}.json`, 'application/json'); push('Report data exported'); }}>
              Export raw report
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
