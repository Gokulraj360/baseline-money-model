import { useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import type { Rule } from '../types';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories';
import { money } from '../lib/format';
import { Icon } from '../components/Icon';
import { Confirm, Empty, Modal, Switch, useToast } from '../components/ui';
import { ruleMatches } from '../domain/categorize';

export default function Rules() {
  const { state, addRule, updateRule, deleteRule, applyRuleRetro } = useApp();
  const { push } = useToast();
  const [editing, setEditing] = useState<Rule | null>(null);
  const [creating, setCreating] = useState(false);
  const [testing, setTesting] = useState<Rule | null>(null);
  const [retro, setRetro] = useState<Rule | null>(null);
  const [removing, setRemoving] = useState<Rule | null>(null);

  const learned = state.rules.filter((r) => r.source === 'learned').length;
  const auto = state.txns.filter((t) => t.confidence >= 0.85).length;
  const autoPct = state.txns.length ? Math.round((auto / state.txns.length) * 100) : 0;

  const suggestions = useMemo(() => {
    const groups = new Map<string, { merchant: string; count: number; total: number; descriptions: string[] }>();
    for (const t of state.txns) {
      if (t.category !== 'other' || t.amount >= 0) continue;
      const key = t.merchant.toUpperCase();
      const cur = groups.get(key) ?? { merchant: t.merchant, count: 0, total: 0, descriptions: [] };
      cur.count += 1;
      cur.total += Math.abs(t.amount);
      cur.descriptions.push(t.description);
      groups.set(key, cur);
    }
    return [...groups.values()]
      .filter((g) => g.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [state.txns]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Learning loop</div>
          <h1 className="display">The model <em>learns from you.</em></h1>
          <p className="lede">
            Every correction can become a rule. Rules run before the built-in merchant list, so your judgement always
            wins. Apply one to the past whenever you want.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={() => navigateToCorrections()}>
            <Icon name="receipt" size={14} /> Correction log
          </button>
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Icon name="plus" size={14} /> New rule
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="col-8 stack">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Rules</h2>
                <p className="panel-sub">Higher priority wins when two rules match.</p>
              </div>
              <span className="badge">{state.rules.length} rules</span>
            </div>
            <div className="panel-body flush">
              {state.rules.length === 0 ? (
                <Empty
                  icon="split"
                  title="No rules yet"
                  body="Correct a category from the ledger and tick “learn a rule” — it will appear here."
                  action={<button className="btn btn-sm btn-primary" onClick={() => setCreating(true)}>Create one manually</button>}
                />
              ) : (
                <div className="table-wrap">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Pattern</th>
                        <th>Category</th>
                        <th className="hide-sm">Source</th>
                        <th className="hide-sm">Hits</th>
                        <th>Priority</th>
                        <th className="right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...state.rules]
                        .sort((a, b) => b.priority - a.priority || b.createdAt - a.createdAt)
                        .map((r) => (
                          <tr key={r.id} style={{ opacity: r.enabled ? 1 : 0.55 }}>
                            <td>
                              <div className="mono small strong">{r.pattern}</div>
                              <div className="tiny" style={{ color: 'var(--muted)' }}>
                                {r.field} {r.matchType}
                              </div>
                            </td>
                            <td>
                              <span className="row" style={{ gap: 6 }}>
                                <span className="cat-dot" style={{ background: CATEGORY_MAP[r.category]?.color }} />
                                <span className="small">{CATEGORY_MAP[r.category]?.name}</span>
                              </span>
                            </td>
                            <td className="hide-sm">
                              <span className={`badge ${r.source === 'learned' ? 'info' : 'outline'}`}>{r.source}</span>
                            </td>
                            <td className="hide-sm num small">{r.hits}</td>
                            <td className="num small">{r.priority}</td>
                            <td>
                              <div className="row" style={{ gap: 2, justifyContent: 'flex-end' }}>
                                <div title={r.enabled ? 'Disable rule' : 'Enable rule'}>
                                  <Switch checked={r.enabled} label={`Toggle ${r.pattern}`} onChange={(v) => { updateRule(r.id, { enabled: v }); push(v ? 'Rule enabled' : 'Rule disabled'); }} />
                                </div>
                                <button className="btn btn-ghost btn-icon" title="Test this rule" aria-label={`Test ${r.pattern}`} onClick={() => setTesting(r)}>
                                  <Icon name="spark" size={13} />
                                </button>
                                <button className="btn btn-ghost btn-icon" title="Edit rule" aria-label={`Edit ${r.pattern}`} onClick={() => setEditing(r)}>
                                  <Icon name="pencil" size={13} />
                                </button>
                                <button className="btn btn-ghost btn-icon" title="Delete rule" aria-label={`Delete ${r.pattern}`} onClick={() => setRemoving(r)}>
                                  <Icon name="trash" size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="panel-foot">
              <span className="tiny" style={{ color: 'var(--muted)' }}>
                {learned} learned from corrections · {state.rules.filter((r) => r.source === 'manual').length} written by hand
              </span>
              <button className="linkish small" onClick={() => setCreating(true)}>Add a rule</button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Recent corrections</h2>
                <p className="panel-sub">The exact moments the model changed its mind.</p>
              </div>
            </div>
            <div className="panel-body flush">
              {state.corrections.length === 0 ? (
                <Empty icon="pencil" title="No corrections yet" body="When you fix a category in the ledger, the before-and-after is recorded here." />
              ) : (
                <div className="table-wrap">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>Line</th>
                        <th>From</th>
                        <th>To</th>
                        <th className="hide-sm">Learned</th>
                        <th>When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.corrections.slice(0, 8).map((c) => (
                        <tr key={c.id}>
                          <td className="small ellipsis" style={{ maxWidth: 300 }}>{c.description}</td>
                          <td className="small muted">{CATEGORY_MAP[c.from]?.name ?? c.from}</td>
                          <td className="small">{CATEGORY_MAP[c.to]?.name ?? c.to}</td>
                          <td className="hide-sm">{c.learnedRuleId ? <span className="badge info">Rule</span> : <span className="badge outline">Once</span>}</td>
                          <td className="tiny mono" style={{ color: 'var(--muted)' }}>
                            {new Date(c.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="col-4 stack">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Learning health</h2>
                <p className="panel-sub">How much the model gets right unaided.</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="big-number" style={{ fontSize: 42 }}>{autoPct}%</div>
              <p className="small muted" style={{ marginTop: 4 }}>of transactions were categorised with high confidence.</p>
              <div className="progress" style={{ marginTop: 10 }}>
                <span style={{ width: `${autoPct}%` }} />
              </div>
              <div className="divider dashed" />
              <div className="row-between small"><span className="muted">Needs a human</span><span className="num">{state.txns.filter((t) => t.category === 'other').length}</span></div>
              <div className="row-between small" style={{ marginTop: 4 }}><span className="muted">Rules learned</span><span className="num">{learned}</span></div>
              <div className="row-between small" style={{ marginTop: 4 }}><span className="muted">Corrections</span><span className="num">{state.corrections.length}</span></div>
              <div className="row-between small" style={{ marginTop: 4 }}><span className="muted">Rule hits</span><span className="num">{state.rules.reduce((s, r) => s + r.hits, 0)}</span></div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Merchants without a rule</h2>
                <p className="panel-sub">Repeated names still falling into Uncategorised.</p>
              </div>
            </div>
            <div className="panel-body" style={{ paddingTop: 4 }}>
              {suggestions.length === 0 && <p className="small muted">Nothing is waiting. The model has a home for every repeated merchant.</p>}
              {suggestions.map((s) => (
                <div className="goal-row" key={s.merchant}>
                  <div className="row-between">
                    <span className="small strong ellipsis" style={{ maxWidth: 170 }}>{s.merchant}</span>
                    <span className="tiny mono" style={{ color: 'var(--muted)' }}>{s.count} lines · {money(s.total)}</span>
                  </div>
                  <div className="row" style={{ marginTop: 6, gap: 6 }}>
                    <select
                      className="select select-sm"
                      style={{ width: 130 }}
                      id={`sugg-${s.merchant}`}
                      defaultValue="groceries"
                      aria-label={`Suggested category for ${s.merchant}`}
                    >
                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        const el = document.getElementById(`sugg-${s.merchant}`) as HTMLSelectElement | null;
                        addRule({
                          pattern: s.merchant.toUpperCase().slice(0, 24),
                          field: 'description',
                          matchType: 'contains',
                          category: el?.value ?? 'groceries',
                          source: 'learned',
                          priority: 45,
                          enabled: true,
                          hits: s.count,
                        });
                        push(`Rule created for ${s.merchant}`);
                      }}
                    >
                      Create rule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">How matching works</h2>
              </div>
            </div>
            <div className="panel-body">
              <p className="small muted">
                Rules run highest priority first. A rule can match the raw statement line or the cleaned merchant name,
                by contains, starts-with, exact text, or a regular expression.
              </p>
              <div className="note" style={{ marginTop: 10 }}>
                Corrections only change the future by default. Use <strong>Apply to past</strong> from a rule's test panel when you want history rewritten.
              </div>
            </div>
          </section>
        </aside>
      </div>

      {creating && (
        <RuleModal
          title="New rule"
          onClose={() => setCreating(false)}
          onSave={(r) => {
            addRule(r);
            push('Rule created');
            setCreating(false);
          }}
        />
      )}

      {editing && (
        <RuleModal
          title="Edit rule"
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(r) => {
            updateRule(editing.id, r);
            push('Rule updated');
            setEditing(null);
          }}
        />
      )}

      {testing && (
        <TestModal
          rule={testing}
          txns={state.txns}
          onClose={() => setTesting(null)}
          onRetro={() => { setRetro(testing); setTesting(null); }}
        />
      )}

      <Confirm
        open={!!retro}
        onClose={() => setRetro(null)}
        onConfirm={() => {
          if (!retro) return;
          const n = applyRuleRetro(retro.id);
          push(`Rule applied to ${n} past transaction${n === 1 ? '' : 's'}`);
        }}
        title="Apply this rule to past transactions?"
        body={`Every historical line matching “${retro?.pattern ?? ''}” will be recategorised to ${CATEGORY_MAP[retro?.category ?? 'other']?.name}. This cannot be undone.`}
        confirmLabel="Apply to past"
      />

      <Confirm
        open={!!removing}
        onClose={() => setRemoving(null)}
        onConfirm={() => {
          if (!removing) return;
          deleteRule(removing.id);
          push('Rule deleted');
        }}
        title="Delete this rule?"
        body="Transactions already filed by this rule keep their category. Future lines will fall back to the built-in classifier."
        confirmLabel="Delete rule"
        danger
      />
    </div>
  );
}

function navigateToCorrections() {
  const el = document.querySelector('.page .col-8 .panel:last-child');
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function RuleModal({
  title,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  initial?: Rule;
  onClose: () => void;
  onSave: (r: Omit<Rule, 'id' | 'createdAt'>) => void;
}) {
  const [pattern, setPattern] = useState(initial?.pattern ?? '');
  const [field, setField] = useState<Rule['field']>(initial?.field ?? 'description');
  const [matchType, setMatchType] = useState<Rule['matchType']>(initial?.matchType ?? 'contains');
  const [category, setCategory] = useState(initial?.category ?? 'groceries');
  const [priority, setPriority] = useState(initial?.priority ?? 50);
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      sub="Rules run before the built-in merchant list."
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!pattern.trim()}
            onClick={() =>
              onSave({
                pattern: pattern.trim(),
                field,
                matchType,
                category,
                source: initial?.source ?? 'manual',
                priority,
                enabled,
                hits: initial?.hits ?? 0,
              })
            }
          >
            Save rule
          </button>
        </>
      }
    >
      <div className="stack-sm">
        <div className="field">
          <label htmlFor="rule-pattern">Match text</label>
          <input id="rule-pattern" className="input mono" placeholder="e.g. SWIGGY" value={pattern} onChange={(e) => setPattern(e.target.value)} />
        </div>
        <div className="form-row">
          <div className="field">
            <label>Field</label>
            <select className="select" value={field} onChange={(e) => setField(e.target.value as Rule['field'])}>
              <option value="description">Statement description</option>
              <option value="merchant">Cleaned merchant</option>
            </select>
          </div>
          <div className="field">
            <label>Match type</label>
            <select className="select" value={matchType} onChange={(e) => setMatchType(e.target.value as Rule['matchType'])}>
              <option value="contains">Contains</option>
              <option value="startsWith">Starts with</option>
              <option value="exact">Exact match</option>
              <option value="regex">Regular expression</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Category</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Priority (0–100)</label>
            <input className="input num" type="number" min={0} max={100} value={priority} onChange={(e) => setPriority(Number(e.target.value))} />
          </div>
          <div className="field">
            <label>Status</label>
            <div className="row" style={{ height: 32 }}>
              <Switch checked={enabled} onChange={setEnabled} label="Rule enabled" />
              <span className="small muted">{enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
        {matchType === 'regex' && (
          <p className="tiny neg">Regular expressions are powerful and easy to get wrong. Test the rule before relying on it.</p>
        )}
      </div>
    </Modal>
  );
}

function TestModal({
  rule,
  txns,
  onClose,
  onRetro,
}: {
  rule: Rule;
  txns: { description: string; merchant: string }[];
  onClose: () => void;
  onRetro: () => void;
}) {
  const [sample, setSample] = useState('SWIGGY ORDER BANGALORE');
  const matches = txns.filter((t) => ruleMatches(rule, t)).length;
  const sampleMatches = ruleMatches(rule, { description: sample, merchant: sample });

  return (
    <Modal
      open
      onClose={onClose}
      title={`Test “${rule.pattern}”`}
      sub={`${rule.matchType} match on the ${rule.field}`}
      footer={
        <>
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onRetro}>
            <Icon name="undo" size={13} /> Apply to {matches} past lines
          </button>
        </>
      }
    >
      <div className="stack-sm">
        <div className="field">
          <label htmlFor="test-sample">Try a statement line</label>
          <input id="test-sample" className="input mono" value={sample} onChange={(e) => setSample(e.target.value)} />
        </div>
        <div className={`callout ${sampleMatches ? 'note' : ''}`} style={{ borderColor: sampleMatches ? 'var(--accent)' : 'var(--line)' }}>
          <div className="row-between">
            <span className="small">{sampleMatches ? 'Matches this line' : 'Does not match'}</span>
            <span className={`badge ${sampleMatches ? 'pos' : 'outline'}`}>{sampleMatches ? CATEGORY_MAP[rule.category]?.name : 'No action'}</span>
          </div>
        </div>
        <div className="callout">
          <div className="row-between small">
            <span className="muted">Lines in your ledger that match</span>
            <span className="num">{matches}</span>
          </div>
        </div>
        <p className="tiny" style={{ color: 'var(--muted)' }}>
          Applying to the past rewrites categories for matching transactions. It does not create new transactions.
        </p>
      </div>
    </Modal>
  );
}
