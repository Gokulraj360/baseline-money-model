import { useState } from 'react';
import { useApp, uid } from '../store/AppStore';
import type { FixedCost, Goal, IncomeSource } from '../types';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories';
import { money, pct } from '../lib/format';
import { daysBetween, friendlyDate, todayISO } from '../lib/date';
import { useMoney } from '../hooks/useMoney';
import { Icon } from '../components/Icon';
import { Confirm, Empty, Modal, useToast } from '../components/ui';
import {
  emergencyCoverage,
  fixedBaseline,
  flexibleBaseline,
  goalProgress,
  goalRequiredMonthly,
  monthlyIncome,
  monthlySurplus,
} from '../domain/finance';

const GOAL_COLORS = ['#4C6B8A', '#A65A4A', '#7A6A4A', '#4F7A5B', '#8A5A6B', '#3F6E7A'];

export default function Plan() {
  const {
    state, updateProfile, upsertIncome, removeIncome, upsertFixed, removeFixed,
    upsertGoal, deleteGoal, contributeGoal,
  } = useApp();
  const { push } = useToast();
  const fmt = useMoney();

  const [bufferOpen, setBufferOpen] = useState(false);
  const [incomeEdit, setIncomeEdit] = useState<IncomeSource | null>(null);
  const [incomeNew, setIncomeNew] = useState(false);
  const [fixedEdit, setFixedEdit] = useState<FixedCost | null>(null);
  const [fixedNew, setFixedNew] = useState(false);
  const [goalEdit, setGoalEdit] = useState<Goal | null>(null);
  const [goalNew, setGoalNew] = useState(false);
  const [goalDelete, setGoalDelete] = useState<Goal | null>(null);
  const [contributing, setContributing] = useState<Goal | null>(null);
  const [contribution, setContribution] = useState('');

  const income = monthlyIncome(state);
  const fixed = fixedBaseline(state);
  const flexible = flexibleBaseline(state);
  const surplus = monthlySurplus(state);
  const goalsMonthly = state.goals.filter((g) => !g.archived).reduce((s, g) => s + g.monthly, 0);
  const free = income - fixed - flexible - goalsMonthly;
  const coverage = emergencyCoverage(state);
  const incomePct = (n: number) => (income > 0 ? Math.max(0, Math.min(100, (n / income) * 100)) : 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Persistent profile · plan</div>
          <h1 className="display">A plan that <em>knows your life.</em></h1>
          <p className="lede">
            Income, fixed costs, the emergency floor, and goals with real target dates. Everything here feeds the
            simulator, so a change in rent or salary moves the whole picture.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={() => setBufferOpen(true)}>
            <Icon name="shield" size={14} /> Buffer & targets
          </button>
          <button className="btn btn-primary" onClick={() => setGoalNew(true)}>
            <Icon name="plus" size={14} /> New goal
          </button>
        </div>
      </div>

      <section className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div>
            <h2 className="panel-title">The monthly plan</h2>
            <p className="panel-sub">Where each month's income is already committed.</p>
          </div>
          <span className="badge">{fmt(income)} / month</span>
        </div>
        <div className="panel-body">
          <div className="meter" style={{ height: 12 }} aria-hidden="true">
            <span style={{ width: `${incomePct(fixed)}%`, background: 'var(--ink)' }} title="Fixed costs" />
            <span style={{ width: `${incomePct(flexible)}%`, background: 'var(--line-strong)' }} title="Flexible baseline" />
            <span style={{ width: `${incomePct(goalsMonthly)}%`, background: 'var(--accent)' }} title="Goal contributions" />
            <span style={{ width: `${incomePct(Math.max(0, free))}%`, background: 'var(--positive)' }} title="Unassigned" />
          </div>
          <div className="row wrap" style={{ gap: 20, marginTop: 14 }}>
            {[
              { label: 'Fixed costs', value: fixed, color: 'var(--ink)' },
              { label: 'Flexible baseline', value: flexible, color: 'var(--line-strong)' },
              { label: 'Goal contributions', value: goalsMonthly, color: 'var(--accent)' },
              { label: 'Unassigned', value: Math.max(0, free), color: 'var(--positive)' },
            ].map((x) => (
              <div key={x.label} className="row" style={{ gap: 7 }}>
                <i style={{ width: 8, height: 8, background: x.color, borderRadius: 2 }} />
                <span className="small muted">{x.label}</span>
                <span className="num small">{fmt(x.value)}</span>
                <span className="tiny faint">{pct(income > 0 ? (x.value / income) * 100 : 0)}</span>
              </div>
            ))}
          </div>
          <div className="divider dashed" />
          <div className="row-between wrap" style={{ gap: 12 }}>
            <span className="small muted">
              Free cash before goal contributions is <strong className="num" style={{ color: 'var(--ink)' }}>{fmt(surplus)}</strong> a
              month. Goals currently claim <span className="num">{fmt(goalsMonthly)}</span>.
            </span>
            <button className="linkish small" onClick={() => setGoalNew(true)}>Give the surplus a job →</button>
          </div>
        </div>
      </section>

      <div className="grid">
        <section className="panel col-8">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Goals with target dates</h2>
              <p className="panel-sub">The model checks required contribution against what you have committed.</p>
            </div>
            <span className="badge">{state.goals.filter((g) => !g.archived).length} active</span>
          </div>
          <div className="panel-body">
            {state.goals.filter((g) => !g.archived).length === 0 ? (
              <Empty
                icon="target"
                title="No goals yet"
                body="A goal needs a number, a date, and a monthly commitment. That is what makes the simulation meaningful."
                action={<button className="btn btn-sm btn-primary" onClick={() => setGoalNew(true)}>Create the first goal</button>}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
                {state.goals
                  .filter((g) => !g.archived)
                  .sort((a, b) => a.priority - b.priority)
                  .map((g) => {
                    const progress = goalProgress(g);
                    const required = goalRequiredMonthly(g);
                    const onTrack = g.monthly >= required * 0.92;
                    const days = daysBetween(todayISO(), g.targetDate);
                    return (
                      <article className="goal-card" key={g.id}>
                        <div className="goal-top">
                          <div>
                            <div className="row" style={{ gap: 7 }}>
                              <span className="cat-dot" style={{ background: g.color }} />
                              <h3 style={{ fontSize: 13.5 }}>{g.name}</h3>
                            </div>
                            <div className="tiny" style={{ color: 'var(--muted)', marginTop: 3 }}>
                              by {friendlyDate(g.targetDate)} · {days > 0 ? `${days} days` : 'past due'}
                            </div>
                          </div>
                          <span className={`badge ${onTrack ? 'pos' : 'warn'}`}>{onTrack ? 'On pace' : 'Behind'}</span>
                        </div>
                        <div className="row-between" style={{ marginTop: 12 }}>
                          <span className="num" style={{ fontSize: 18 }}>{fmt(g.saved)}</span>
                          <span className="small muted">of {fmt(g.target)}</span>
                        </div>
                        <div className="progress" style={{ marginTop: 7 }}>
                          <span style={{ width: `${progress * 100}%`, background: g.color }} />
                        </div>
                        <div className="row-between tiny" style={{ marginTop: 6, color: 'var(--muted)' }}>
                          <span>{Math.round(progress * 100)}% funded</span>
                          <span>needs {fmt(required)}/mo</span>
                        </div>
                        <div className="divider" style={{ margin: '10px 0' }} />
                        <div className="row-between">
                          <span className="small muted">Committed {fmt(g.monthly)}/mo</span>
                          <div className="row" style={{ gap: 2 }}>
                            <button className="btn btn-sm" onClick={() => { setContributing(g); setContribution(''); }}>Add money</button>
                            <button className="btn btn-ghost btn-icon" aria-label={`Edit ${g.name}`} onClick={() => setGoalEdit(g)}>
                              <Icon name="pencil" size={13} />
                            </button>
                            <button className="btn btn-ghost btn-icon" aria-label={`Delete ${g.name}`} onClick={() => setGoalDelete(g)}>
                              <Icon name="trash" size={13} />
                            </button>
                          </div>
                        </div>
                        {g.note && <p className="tiny" style={{ color: 'var(--muted)', marginTop: 8 }}>{g.note}</p>}
                      </article>
                    );
                  })}
              </div>
            )}
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>
              Total goal value {fmt(state.goals.reduce((s, g) => s + g.target, 0))}
            </span>
            <button className="linkish small" onClick={() => setGoalNew(true)}>Add another goal</button>
          </div>
        </section>

        <aside className="col-4 stack">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Emergency floor</h2>
                <p className="panel-sub">Months of essentials, not months of spending.</p>
              </div>
              <button className="btn btn-ghost btn-icon" aria-label="Edit emergency fund" onClick={() => setBufferOpen(true)}>
                <Icon name="pencil" size={14} />
              </button>
            </div>
            <div className="panel-body">
              <div className="row-between" style={{ alignItems: 'flex-end' }}>
                <div>
                  <div className="medium-number">{fmt(state.profile.emergencySaved)}</div>
                  <div className="tiny" style={{ color: 'var(--muted)', marginTop: 3 }}>of {fmt(state.profile.emergencyTarget)} target</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="medium-number" style={{ color: coverage < 3 ? 'var(--negative)' : 'var(--positive)' }}>{coverage.toFixed(1)}</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>months</div>
                </div>
              </div>
              <div className="progress" style={{ marginTop: 12 }}>
                <span style={{ width: `${Math.min(100, (state.profile.emergencySaved / Math.max(1, state.profile.emergencyTarget)) * 100)}%` }} />
              </div>
              <div className="row-between tiny" style={{ marginTop: 6, color: 'var(--muted)' }}>
                <span>{Math.round((state.profile.emergencySaved / Math.max(1, state.profile.emergencyTarget)) * 100)}% funded</span>
                <span>3-month floor</span>
              </div>
              <div className="divider dashed" />
              <div className="row-between small"><span className="muted">Savings rate target</span><span className="num">{pct(state.profile.savingsRateTarget)}</span></div>
              <div className="row-between small" style={{ marginTop: 4 }}><span className="muted">Essentials / month</span><span className="num">{fmt(state.profile.emergencySaved / Math.max(0.1, coverage))}</span></div>
              <button className="btn btn-sm btn-block" style={{ marginTop: 12 }} onClick={() => setBufferOpen(true)}>Adjust the floor</button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Profile</h2>
                <p className="panel-sub">The constants of the model.</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="row-between small"><span className="muted">Name</span><span>{state.profile.name}</span></div>
              <div className="row-between small" style={{ marginTop: 6 }}><span className="muted">Currency</span><span className="mono">INR · en-IN</span></div>
              <div className="row-between small" style={{ marginTop: 6 }}><span className="muted">Opening balance</span><span className="num">{fmt(state.profile.openingBalance)}</span></div>
              <div className="row-between small" style={{ marginTop: 6 }}><span className="muted">Modelled since</span><span className="mono">{state.seedMonth}</span></div>
              <div className="note" style={{ marginTop: 12 }}>
                This profile persists across sessions. Imported statements update the transactions, never these constants.
              </div>
            </div>
          </section>
        </aside>

        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Income</h2>
              <p className="panel-sub">{fmt(income)} a month</p>
            </div>
            <button className="btn btn-sm" onClick={() => setIncomeNew(true)}><Icon name="plus" size={12} /> Add source</button>
          </div>
          <div className="panel-body flush">
            <table className="tbl">
              <tbody>
                {state.profile.income.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <div className="txn-merchant">{i.name}</div>
                      <div className="tiny" style={{ color: 'var(--muted)' }}>{i.cadence} · next {friendlyDate(i.nextDate)}</div>
                    </td>
                    <td className="money">{money(i.amount)}</td>
                    <td className="right" style={{ width: 64 }}>
                      <div className="row" style={{ gap: 2, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-icon" aria-label={`Edit ${i.name}`} onClick={() => setIncomeEdit(i)}><Icon name="pencil" size={13} /></button>
                        <button className="btn btn-ghost btn-icon" aria-label={`Remove ${i.name}`} onClick={() => { removeIncome(i.id); push('Income source removed'); }}><Icon name="trash" size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!state.profile.income.length && <Empty icon="wallet" title="No income sources" body="Add salary or freelance income so the model has a starting point." />}
          </div>
        </section>

        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Fixed costs</h2>
              <p className="panel-sub">{fmt(fixed)} a month including detected subscriptions</p>
            </div>
            <button className="btn btn-sm" onClick={() => setFixedNew(true)}><Icon name="plus" size={12} /> Add cost</button>
          </div>
          <div className="panel-body flush">
            <table className="tbl">
              <tbody>
                {state.profile.fixed.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div className="row" style={{ gap: 7 }}>
                        <span className="cat-dot" style={{ background: CATEGORY_MAP[f.category]?.color }} />
                        <div>
                          <div className="txn-merchant">{f.name}</div>
                          <div className="tiny" style={{ color: 'var(--muted)' }}>due day {f.dueDay} · {CATEGORY_MAP[f.category]?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="money">{money(f.amount)}</td>
                    <td className="right" style={{ width: 64 }}>
                      <div className="row" style={{ gap: 2, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-icon" aria-label={`Edit ${f.name}`} onClick={() => setFixedEdit(f)}><Icon name="pencil" size={13} /></button>
                        <button className="btn btn-ghost btn-icon" aria-label={`Remove ${f.name}`} onClick={() => { removeFixed(f.id); push('Fixed cost removed'); }}><Icon name="trash" size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!state.profile.fixed.length && <Empty icon="wallet" title="No fixed costs" body="Rent, utilities, and insurance belong here so the model can protect them." />}
          </div>
        </section>
      </div>

      <Modal
        open={bufferOpen}
        onClose={() => setBufferOpen(false)}
        title="Buffer & targets"
        sub="These numbers decide what counts as safe to spend."
        footer={<button className="btn btn-primary" onClick={() => setBufferOpen(false)}>Done</button>}
      >
        <BufferForm
          emergencyTarget={state.profile.emergencyTarget}
          emergencySaved={state.profile.emergencySaved}
          savingsRateTarget={state.profile.savingsRateTarget}
          onSave={(patch) => { updateProfile(patch); push('Targets updated'); }}
        />
      </Modal>

      {incomeNew && (
        <IncomeModal
          title="Add income"
          onClose={() => setIncomeNew(false)}
          onSave={(i) => { upsertIncome({ ...i, id: uid('inc') }); push('Income added'); setIncomeNew(false); }}
        />
      )}
      {incomeEdit && (
        <IncomeModal
          title="Edit income"
          initial={incomeEdit}
          onClose={() => setIncomeEdit(null)}
          onSave={(i) => { upsertIncome({ ...i, id: incomeEdit.id }); push('Income updated'); setIncomeEdit(null); }}
        />
      )}
      {fixedNew && (
        <FixedModal
          title="Add fixed cost"
          onClose={() => setFixedNew(false)}
          onSave={(f) => { upsertFixed({ ...f, id: uid('fx') }); push('Fixed cost added'); setFixedNew(false); }}
        />
      )}
      {fixedEdit && (
        <FixedModal
          title="Edit fixed cost"
          initial={fixedEdit}
          onClose={() => setFixedEdit(null)}
          onSave={(f) => { upsertFixed({ ...f, id: fixedEdit.id }); push('Fixed cost updated'); setFixedEdit(null); }}
        />
      )}
      {goalNew && (
        <GoalModal
          title="New goal"
          onClose={() => setGoalNew(false)}
          onSave={(g) => { upsertGoal({ ...g, id: uid('goal'), priority: state.goals.length + 1 }); push('Goal created'); setGoalNew(false); }}
        />
      )}
      {goalEdit && (
        <GoalModal
          title="Edit goal"
          initial={goalEdit}
          onClose={() => setGoalEdit(null)}
          onSave={(g) => { upsertGoal({ ...g, id: goalEdit.id, priority: goalEdit.priority }); push('Goal updated'); setGoalEdit(null); }}
        />
      )}

      <Modal
        open={!!contributing}
        onClose={() => setContributing(null)}
        title={`Add money to ${contributing?.name ?? ''}`}
        sub="This moves cash already in your account into the goal, and lowers safe-to-spend."
        footer={
          <>
            <button className="btn" onClick={() => setContributing(null)}>Cancel</button>
            <button
              className="btn btn-primary"
              disabled={!Number(contribution)}
              onClick={() => {
                if (!contributing) return;
                contributeGoal(contributing.id, Number(contribution));
                push(`${money(Number(contribution))} added to ${contributing.name}`);
                setContributing(null);
              }}
            >
              Add to goal
            </button>
          </>
        }
      >
        <div className="field">
          <label>Amount</label>
          <input className="input num" inputMode="decimal" autoFocus value={contribution} onChange={(e) => setContribution(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" />
        </div>
        <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
          {[5000, 10000, 25000].map((v) => (
            <button key={v} className="chip" onClick={() => setContribution(String(v))}>{money(v)}</button>
          ))}
        </div>
        <p className="tiny" style={{ color: 'var(--muted)', marginTop: 10 }}>
          Remaining to target: {contributing ? money(Math.max(0, contributing.target - contributing.saved)) : '—'}.
        </p>
      </Modal>

      <Confirm
        open={!!goalDelete}
        onClose={() => setGoalDelete(null)}
        onConfirm={() => {
          if (!goalDelete) return;
          deleteGoal(goalDelete.id);
          push(`${goalDelete.name} deleted`);
        }}
        title={`Delete ${goalDelete?.name}?`}
        body="The goal is removed from the model and its saved amount is released back to free cash. The transactions stay untouched."
        confirmLabel="Delete goal"
        danger
      />
    </div>
  );
}

function BufferForm({
  emergencyTarget, emergencySaved, savingsRateTarget, onSave,
}: {
  emergencyTarget: number;
  emergencySaved: number;
  savingsRateTarget: number;
  onSave: (p: { emergencyTarget: number; emergencySaved: number; savingsRateTarget: number }) => void;
}) {
  const [target, setTarget] = useState(String(emergencyTarget));
  const [saved, setSaved] = useState(String(emergencySaved));
  const [rate, setRate] = useState(String(savingsRateTarget));
  return (
    <div className="stack-sm">
      <div className="field"><label>Emergency fund target</label><input className="input num" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, ''))} /></div>
      <div className="field"><label>Currently set aside</label><input className="input num" inputMode="decimal" value={saved} onChange={(e) => setSaved(e.target.value.replace(/[^0-9]/g, ''))} /></div>
      <div className="field"><label>Savings rate target (%)</label><input className="input num" inputMode="numeric" value={rate} onChange={(e) => setRate(e.target.value.replace(/[^0-9]/g, ''))} /></div>
      <button
        className="btn btn-primary"
        onClick={() => onSave({ emergencyTarget: Number(target), emergencySaved: Number(saved), savingsRateTarget: Number(rate) })}
      >
        Save targets
      </button>
      <p className="tiny" style={{ color: 'var(--muted)' }}>
        A three-month floor is a common starting point. Baseline treats this money as unavailable for spending.
      </p>
    </div>
  );
}

function IncomeModal({
  title, initial, onClose, onSave,
}: {
  title: string;
  initial?: IncomeSource;
  onClose: () => void;
  onSave: (i: Omit<IncomeSource, 'id'>) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [amount, setAmount] = useState(String(initial?.amount ?? ''));
  const [cadence, setCadence] = useState<IncomeSource['cadence']>(initial?.cadence ?? 'monthly');
  const [nextDate, setNextDate] = useState(initial?.nextDate ?? todayISO());
  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!name || !Number(amount)} onClick={() => onSave({ name, amount: Number(amount), cadence, nextDate })}>Save</button>
        </>
      }
    >
      <div className="stack-sm">
        <div className="field"><label>Source</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nimbus Labs salary" /></div>
        <div className="form-row">
          <div className="field"><label>Amount</label><input className="input num" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} /></div>
          <div className="field"><label>Cadence</label>
            <select className="select" value={cadence} onChange={(e) => setCadence(e.target.value as IncomeSource['cadence'])}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="one-off">One-off</option>
            </select>
          </div>
        </div>
        <div className="field"><label>Next expected</label><input className="input" type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} /></div>
      </div>
    </Modal>
  );
}

function FixedModal({
  title, initial, onClose, onSave,
}: {
  title: string;
  initial?: FixedCost;
  onClose: () => void;
  onSave: (f: Omit<FixedCost, 'id'>) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [amount, setAmount] = useState(String(initial?.amount ?? ''));
  const [category, setCategory] = useState(initial?.category ?? 'rent');
  const [dueDay, setDueDay] = useState(String(initial?.dueDay ?? 1));
  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!name || !Number(amount)} onClick={() => onSave({ name, amount: Number(amount), category, dueDay: Number(dueDay) })}>Save</button>
        </>
      }
    >
      <div className="stack-sm">
        <div className="field"><label>Name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rent" /></div>
        <div className="form-row">
          <div className="field"><label>Amount</label><input className="input num" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} /></div>
          <div className="field"><label>Due day</label><input className="input num" type="number" min={1} max={31} value={dueDay} onChange={(e) => setDueDay(e.target.value)} /></div>
        </div>
        <div className="field"><label>Category</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
    </Modal>
  );
}

function GoalModal({
  title, initial, onClose, onSave,
}: {
  title: string;
  initial?: Goal;
  onClose: () => void;
  onSave: (g: Omit<Goal, 'id' | 'priority'>) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [target, setTarget] = useState(String(initial?.target ?? ''));
  const [saved, setSaved] = useState(String(initial?.saved ?? 0));
  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? '2027-12-31');
  const [monthly, setMonthly] = useState(String(initial?.monthly ?? ''));
  const [color, setColor] = useState(initial?.color ?? GOAL_COLORS[0]);
  const [note, setNote] = useState(initial?.note ?? '');
  const monthlyNum = Number(monthly) || 0;
  const targetNum = Number(target) || 0;
  const savedNum = Number(saved) || 0;
  const monthsLeft = Math.max(1, Math.ceil(daysBetween(todayISO(), targetDate) / 30.4));
  const required = Math.max(0, targetNum - savedNum) / monthsLeft;

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      sub="A number, a date, and a monthly commitment."
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!name || !targetNum}
            onClick={() => onSave({ name, target: targetNum, saved: savedNum, targetDate, monthly: monthlyNum, color, note })}
          >
            Save goal
          </button>
        </>
      }
    >
      <div className="stack-sm">
        <div className="field"><label>Goal name</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Japan in spring" /></div>
        <div className="form-row">
          <div className="field"><label>Target amount</label><input className="input num" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, ''))} /></div>
          <div className="field"><label>Already saved</label><input className="input num" inputMode="decimal" value={saved} onChange={(e) => setSaved(e.target.value.replace(/[^0-9]/g, ''))} /></div>
        </div>
        <div className="form-row">
          <div className="field"><label>Target date</label><input className="input" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></div>
          <div className="field"><label>Monthly commitment</label><input className="input num" inputMode="decimal" value={monthly} onChange={(e) => setMonthly(e.target.value.replace(/[^0-9]/g, ''))} /></div>
        </div>
        <div className="field"><label>Colour</label>
          <div className="row" style={{ gap: 6 }}>
            {GOAL_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Use colour ${c}`}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                style={{ width: 24, height: 24, borderRadius: 4, background: c, border: color === c ? '2px solid var(--ink)' : '1px solid var(--line)', padding: 0 }}
              />
            ))}
          </div>
        </div>
        <div className="field"><label>Note</label><textarea className="textarea" rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></div>
        <div className={`note ${monthlyNum >= required * 0.92 ? '' : 'guard'}`}>
          At {money(monthlyNum)} a month you need {money(required)} to land on time ({monthsLeft} months left).{' '}
          {monthlyNum >= required * 0.92 ? 'That works.' : `Add ${money(Math.max(0, required - monthlyNum))} a month to stay on pace.`}
        </div>
      </div>
    </Modal>
  );
}
