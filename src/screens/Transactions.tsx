import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import type { Txn } from '../types';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories';
import { money } from '../lib/format';
import { monthLabel, monthKey, nowMonth, todayISO } from '../lib/date';
import { useRoute } from '../lib/router';
import { Icon } from '../components/Icon';
import { Confirm, Modal, Empty, useToast } from '../components/ui';
import { categorize, deriveRulePattern } from '../domain/categorize';
import { downloadFile, toCSV } from '../lib/export';

const PAGE_SIZE = 25;

type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

function CategorySelect({
  value,
  onChange,
  label = 'Category',
  className = 'select',
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  className?: string;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, typeof CATEGORIES>();
    for (const c of CATEGORIES) {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    }
    return [...map.entries()];
  }, []);
  return (
    <select className={className} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      {groups.map(([group, cats]) => (
        <optgroup key={group} label={group}>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export default function Transactions() {
  const { state, correctCategory, bulkCategory, deleteTxns, updateTxn, splitTxn, addTxn, undo } = useApp();
  const { push } = useToast();
  const route = useRoute();

  const [search, setSearch] = useState(route.params.get('q') ?? '');
  const [category, setCategory] = useState(route.params.get('category') ?? 'all');
  const [month, setMonth] = useState('all');
  const [account, setAccount] = useState('all');
  const [direction, setDirection] = useState<'all' | 'out' | 'in'>('all');
  const [sort, setSort] = useState<SortKey>('date-desc');
  const [pendingOnly, setPendingOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const [correction, setCorrection] = useState<{ txn: Txn; category: string } | null>(null);
  const [learn, setLearn] = useState(true);
  const [applyRetro, setApplyRetro] = useState(false);
  const [splitting, setSplitting] = useState<Txn | null>(null);
  const [editing, setEditing] = useState<Txn | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string[] | null>(null);
  const [bulkCat, setBulkCat] = useState('groceries');
  const [bulkLearn, setBulkLearn] = useState(true);

  const matchingPastCount = useMemo(() => {
    if (!correction || !learn) return 0;
    const pattern = deriveRulePattern(correction.txn.description, correction.txn.merchant);
    const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return state.txns.filter(
      (t) => t.id !== correction.txn.id && t.category !== correction.category && re.test(t.description)
    ).length;
  }, [correction, learn, state.txns]);

  useEffect(() => {
    const q = route.params.get('q');
    const cat = route.params.get('category');
    if (q !== null) setSearch(q);
    if (cat !== null) setCategory(cat);
  }, [route.raw]);

  const months = useMemo(
    () => [...new Set(state.txns.map((t) => monthKey(t.date)))].sort().reverse(),
    [state.txns]
  );

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    let list = state.txns.filter((t) => {
      if (category !== 'all' && t.category !== category && !(t.splits ?? []).some((s) => s.category === category)) return false;
      if (month !== 'all' && monthKey(t.date) !== month) return false;
      if (account !== 'all' && t.accountId !== account) return false;
      if (direction === 'out' && t.amount >= 0) return false;
      if (direction === 'in' && t.amount <= 0) return false;
      if (pendingOnly && !t.pending) return false;
      if (needle) {
        const hay = `${t.description} ${t.merchant} ${t.note ?? ''} ${t.category} ${Math.abs(t.amount)}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'date-asc': return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        case 'amount-desc': return a.amount - b.amount;
        case 'amount-asc': return b.amount - a.amount;
        default: return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      }
    });
    return list;
  }, [state.txns, search, category, month, account, direction, sort, pendingOnly]);

  useEffect(() => { setPage(0); }, [search, category, month, account, direction, pendingOnly]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const outTotal = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const inTotal = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allVisibleSelected = visible.length > 0 && visible.every((t) => selected.has(t.id));

  const exportCsv = () => {
    const rows = filtered.map((t) => ({
      Date: t.date,
      Merchant: t.merchant,
      Description: t.description,
      Category: CATEGORY_MAP[t.category]?.name ?? t.category,
      Amount: t.amount,
      Account: state.accounts.find((a) => a.id === t.accountId)?.name ?? t.accountId,
      Source: t.source,
      Note: t.note ?? '',
    }));
    downloadFile(toCSV(rows), `baseline-transactions-${todayISO()}.csv`);
    push(`Exported ${rows.length} transactions`);
  };

  const saveCorrection = () => {
    if (!correction) return;
    const res = correctCategory(correction.txn.id, correction.category, learn, applyRetro);
    push(
      learn
        ? `Filed under ${CATEGORY_MAP[correction.category].name}. ${
            res.created
              ? `A rule was learned for future transactions${res.retroCount ? ` and applied to ${res.retroCount} past transaction${res.retroCount > 1 ? 's' : ''}` : ''}.`
              : `The existing rule was updated${res.retroCount ? ` and applied to ${res.retroCount} past transaction${res.retroCount > 1 ? 's' : ''}` : ''}.`
          }`
        : 'Category updated for this transaction only.'
    );
    setCorrection(null);
    setApplyRetro(false);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">The ledger</div>
          <h1 className="display">Every line, <em>accounted for.</em></h1>
          <p className="lede">
            Search the whole history, correct a category, and the model learns the rule. Splits let one payment belong
            to more than one part of your life.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={exportCsv}>
            <Icon name="download" size={14} /> Export CSV
          </button>
          <button className="btn" onClick={() => setAdding(true)}>
            <Icon name="plus" size={14} /> Add transaction
          </button>
        </div>
      </div>

      <section className="panel">
        <div className="panel-body" style={{ paddingBottom: 12 }}>
          <div className="row wrap" style={{ gap: 8 }}>
            <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 180 }}>
              <Icon name="search" size={14} style={{ position: 'absolute', left: 9, top: 9, color: 'var(--faint)' }} />
              <input
                className="input"
                style={{ paddingLeft: 30 }}
                placeholder="Search merchants, notes, amounts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search transactions"
              />
            </div>
            <select className="select" style={{ width: 'auto' }} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="select" style={{ width: 'auto' }} value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Filter by month">
              <option value="all">All months</option>
              {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
            </select>
            <select className="select" style={{ width: 'auto' }} value={account} onChange={(e) => setAccount(e.target.value)} aria-label="Filter by account">
              <option value="all">All accounts</option>
              {state.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select className="select" style={{ width: 'auto' }} value={direction} onChange={(e) => setDirection(e.target.value as typeof direction)} aria-label="Filter by direction">
              <option value="all">Money in & out</option>
              <option value="out">Money out</option>
              <option value="in">Money in</option>
            </select>
            <select className="select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort transactions">
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Largest outflow</option>
              <option value="amount-asc">Largest inflow</option>
            </select>
            <button
              className="chip"
              aria-pressed={pendingOnly}
              onClick={() => setPendingOnly((v) => !v)}
            >
              <span className="dot" style={{ background: 'var(--accent)' }} /> Needs review
            </button>
            {(search || category !== 'all' || month !== 'all' || account !== 'all' || direction !== 'all' || pendingOnly) && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSearch(''); setCategory('all'); setMonth('all'); setAccount('all');
                  setDirection('all'); setPendingOnly(false);
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="row-between" style={{ marginTop: 10 }}>
            <div className="tiny" style={{ color: 'var(--muted)' }}>
              {filtered.length} of {state.txns.length} transactions · out {money(outTotal)} · in {money(inTotal)}
            </div>
            <div className="tiny" style={{ color: 'var(--muted)' }}>
              {state.txns.filter((t) => t.pending).length} waiting for review
            </div>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="panel-body" style={{ borderTop: '1px solid var(--line)', background: 'var(--accent-soft)', paddingTop: 10, paddingBottom: 10 }}>
            <div className="row wrap" style={{ gap: 8 }}>
              <span className="small strong">{selected.size} selected</span>
              <span className="faint">·</span>
              <select className="select select-sm" style={{ width: 'auto' }} value={bulkCat} onChange={(e) => setBulkCat(e.target.value)} aria-label="Bulk category">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label className="check small">
                <input type="checkbox" checked={bulkLearn} onChange={(e) => setBulkLearn(e.target.checked)} />
                Learn rule
              </label>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  bulkCategory([...selected], bulkCat, bulkLearn);
                  push(`Moved ${selected.size} transactions to ${CATEGORY_MAP[bulkCat].name}`);
                  setSelected(new Set());
                }}
              >
                Apply
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  [...selected].forEach((id) => updateTxn(id, { pending: false }));
                  push(`Approved ${selected.size} transactions`);
                  setSelected(new Set());
                }}
              >
                Approve
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  [...selected].forEach((id) => updateTxn(id, { isTransfer: true, isExcluded: true }));
                  push('Marked as transfers and excluded from spending');
                  setSelected(new Set());
                }}
              >
                Mark transfer
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => setDeleting([...selected])}>
                Delete
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setSelected(new Set())}>Clear</button>
            </div>
          </div>
        )}

        <div className="panel-body flush">
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 34 }}>
                    <input
                      type="checkbox"
                      aria-label="Select all visible transactions"
                      checked={allVisibleSelected}
                      onChange={() => {
                        setSelected((s) => {
                          const next = new Set(s);
                          if (allVisibleSelected) visible.forEach((t) => next.delete(t.id));
                          else visible.forEach((t) => next.add(t.id));
                          return next;
                        });
                      }}
                    />
                  </th>
                  <th style={{ width: 92 }}>Date</th>
                  <th>Merchant</th>
                  <th style={{ width: 170 }}>Category</th>
                  <th className="hide-sm" style={{ width: 90 }}>Confidence</th>
                  <th className="right" style={{ width: 110 }}>Amount</th>
                  <th className="right" style={{ width: 116 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((t) => {
                  const cat = CATEGORY_MAP[t.category];
                  return (
                    <tr key={t.id} className={`${selected.has(t.id) ? 'selected' : ''} ${t.pending ? 'pending' : ''}`}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select ${t.merchant}`}
                          checked={selected.has(t.id)}
                          onChange={() => toggleSelect(t.id)}
                        />
                      </td>
                      <td className="mono small nowrap">{t.date.slice(8)} {monthLabel(t.date.slice(0, 7), true).slice(0, 3)}</td>
                      <td>
                        <div className="row" style={{ gap: 6 }}>
                          <span className="txn-merchant ellipsis" style={{ maxWidth: 210 }}>{t.merchant}</span>
                          {t.pending && <span className="badge warn">Review</span>}
                          {t.isExcluded && <span className="badge outline">Excluded</span>}
                          {t.splits && <span className="badge info">Split</span>}
                        </div>
                        <div className="txn-desc" title={t.description}>{t.description}</div>
                      </td>
                      <td>
                        <button
                          className="chip"
                          style={{ height: 24, padding: '0 7px', fontSize: 11, maxWidth: 158 }}
                          onClick={() => { setLearn(true); setCorrection({ txn: t, category: t.category }); }}
                          aria-label={`Change category for ${t.merchant}, currently ${cat?.name}`}
                        >
                          <span className="swatch" style={{ background: cat?.color }} />
                          <span className="ellipsis">{cat?.name ?? t.category}</span>
                          <Icon name="chevronDown" size={10} />
                        </button>
                      </td>
                      <td className="hide-sm">
                        <span
                          className="row small"
                          style={{ gap: 5, color: t.confidence > 0.85 ? 'var(--positive)' : t.confidence > 0.5 ? 'var(--accent)' : 'var(--negative)' }}
                          title={t.why}
                        >
                          <span className="dot" style={{ background: 'currentColor' }} />
                          {Math.round(t.confidence * 100)}%
                        </span>
                      </td>
                      <td className={`money ${t.amount > 0 ? 'pos' : ''}`}>
                        {t.amount > 0 ? '+' : '−'}{money(Math.abs(t.amount))}
                      </td>
                      <td className="right">
                        <div className="row" style={{ gap: 2, justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-icon" title="Split across categories" aria-label={`Split ${t.merchant}`} onClick={() => setSplitting(t)}>
                            <Icon name="split" size={13} />
                          </button>
                          <button className="btn btn-ghost btn-icon" title="Edit transaction" aria-label={`Edit ${t.merchant}`} onClick={() => setEditing(t)}>
                            <Icon name="pencil" size={13} />
                          </button>
                          <button className="btn btn-ghost btn-icon" title="Delete transaction" aria-label={`Delete ${t.merchant}`} onClick={() => setDeleting([t.id])}>
                            <Icon name="trash" size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!visible.length && (
              <Empty
                icon="receipt"
                title="Nothing matches those filters"
                body="Try a different month or clear the search. If this account is new, import a statement from the inbox."
                action={<button className="btn btn-sm" onClick={() => { setSearch(''); setCategory('all'); setMonth('all'); setAccount('all'); setDirection('all'); setPendingOnly(false); }}>Clear everything</button>}
              />
            )}
          </div>
        </div>

        <div className="panel-foot">
          <span className="tiny" style={{ color: 'var(--muted)' }}>
            Page {page + 1} of {pageCount} · {visible.length} shown
          </span>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              <Icon name="chevronLeft" size={12} /> Previous
            </button>
            <button className="btn btn-sm" disabled={page >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>
              Next <Icon name="chevronRight" size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* correction */}
      <Modal
        open={!!correction}
        onClose={() => { setCorrection(null); setApplyRetro(false); }}
        title="Recategorise this transaction"
        sub={correction ? `${correction.txn.merchant} · ${money(Math.abs(correction.txn.amount))} · ${correction.txn.date}` : ''}
        footer={
          <>
            <button className="btn" onClick={() => { setCorrection(null); setApplyRetro(false); }}>Cancel</button>
            <button className="btn btn-primary" onClick={saveCorrection}>Save category</button>
          </>
        }
      >
        {correction && (
          <div className="stack-sm">
            <div className="callout">
              <div className="label">Statement line</div>
              <p className="mono small" style={{ marginTop: 4, lineHeight: 1.6 }}>{correction.txn.description}</p>
              <p className="small muted" style={{ marginTop: 6 }}>
                Filed as <strong>{CATEGORY_MAP[correction.txn.category]?.name}</strong> with{' '}
                {Math.round(correction.txn.confidence * 100)}% confidence. {correction.txn.why}
              </p>
            </div>
            <div className="field">
              <label htmlFor="corr-cat">New category</label>
              <CategorySelect value={correction.category} onChange={(v) => setCorrection({ ...correction, category: v })} label="New category" />
            </div>
            <label className="check">
              <input type="checkbox" checked={learn} onChange={(e) => setLearn(e.target.checked)} />
              Learn a rule for future transactions from this merchant
            </label>
            {learn && (
              <div className="note">
                Future lines containing <span className="mono">“{deriveRulePattern(correction.txn.description, correction.txn.merchant)}”</span> will be
                filed under <strong>{CATEGORY_MAP[correction.category]?.name}</strong> automatically. You can edit or delete
                the rule later.
              </div>
            )}
            {learn && matchingPastCount > 0 && (
              <label className="check" style={{ marginTop: 8 }}>
                <input
                  type="checkbox"
                  checked={applyRetro}
                  onChange={(e) => setApplyRetro(e.target.checked)}
                />
                <span>
                  Also apply to <strong>{matchingPastCount}</strong> matching past transaction{matchingPastCount > 1 ? 's' : ''} in the ledger
                </span>
              </label>
            )}
            <p className="tiny" style={{ color: 'var(--muted)' }}>
              {applyRetro
                ? `Will update this transaction and ${matchingPastCount} other matching line${matchingPastCount > 1 ? 's' : ''}.`
                : 'Only this transaction changes now unless you apply the rule to past lines.'}
            </p>
          </div>
        )}
      </Modal>

      {/* split */}
      {splitting && <SplitModal txn={splitting} onClose={() => setSplitting(null)} onSave={(parts) => { splitTxn(splitting.id, parts); push('Transaction split across categories'); setSplitting(null); }} />}

      {/* edit */}
      {editing && (
        <EditModal
          txn={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => { updateTxn(editing.id, patch); push('Transaction updated'); setEditing(null); }}
        />
      )}

      {/* add */}
      <AddModal open={adding} onClose={() => setAdding(false)} onAdd={(input) => { addTxn(input); push('Transaction added'); setAdding(false); }} />

      <Confirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return;
          deleteTxns(deleting);
          push(`Deleted ${deleting.length} transaction${deleting.length > 1 ? 's' : ''}`, {
            label: 'Undo',
            run: () => undo(),
          });
          setSelected(new Set());
        }}
        title={`Delete ${deleting?.length ?? 1} transaction${(deleting?.length ?? 1) > 1 ? 's' : ''}?`}
        body="This removes the lines from the model and recalculates every balance. You can undo it from the top bar immediately afterwards."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

function SplitModal({
  txn,
  onClose,
  onSave,
}: {
  txn: Txn;
  onClose: () => void;
  onSave: (parts: { category: string; amount: number }[]) => void;
}) {
  const total = Math.abs(txn.amount);
  const [parts, setParts] = useState(
    txn.splits?.length
      ? txn.splits
      : [{ category: txn.category, amount: Math.round(total / 2) }, { category: 'groceries', amount: total - Math.round(total / 2) }]
  );
  const assigned = parts.reduce((s, p) => s + Number(p.amount || 0), 0);
  const remaining = Math.round((total - assigned) * 100) / 100;
  const valid = Math.abs(remaining) < 0.5 && parts.every((p) => Number(p.amount) > 0);

  return (
    <Modal
      open
      onClose={onClose}
      title="Split this transaction"
      sub={`${txn.merchant} · ${money(total)} total`}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!valid} onClick={() => onSave(parts.map((p) => ({ category: p.category, amount: Number(p.amount) })))}>
            Save split
          </button>
        </>
      }
    >
      <div className="stack-sm">
        {parts.map((p, i) => (
          <div className="row" key={i} style={{ gap: 8, alignItems: 'flex-end' }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Category {i + 1}</label>
              <CategorySelect value={p.category} onChange={(v) => setParts(parts.map((x, j) => (j === i ? { ...x, category: v } : x)))} />
            </div>
            <div className="field" style={{ width: 130 }}>
              <label>Amount</label>
              <input
                className="input num"
                inputMode="decimal"
                value={p.amount}
                onChange={(e) => setParts(parts.map((x, j) => (j === i ? { ...x, amount: Number(e.target.value.replace(/[^0-9.]/g, '')) } : x)))}
                aria-label={`Amount for part ${i + 1}`}
              />
            </div>
            {parts.length > 2 && (
              <button className="btn btn-ghost btn-icon" aria-label="Remove part" onClick={() => setParts(parts.filter((_, j) => j !== i))}>
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        ))}
        <div className="row-between">
          <button
            className="btn btn-sm"
            onClick={() => setParts([...parts, { category: 'other', amount: Math.max(0, remaining) }])}
            disabled={remaining <= 0}
          >
            <Icon name="plus" size={12} /> Add part
          </button>
          <span className={`small ${Math.abs(remaining) < 0.5 ? 'pos' : 'neg'}`}>
            {Math.abs(remaining) < 0.5 ? 'Fully allocated' : `${money(Math.abs(remaining))} ${remaining > 0 ? 'left to assign' : 'over'}`}
          </span>
        </div>
        <p className="tiny" style={{ color: 'var(--muted)' }}>
          A split keeps the real payment intact while letting each part belong to a different category.
        </p>
      </div>
    </Modal>
  );
}

function EditModal({ txn, onClose, onSave }: { txn: Txn; onClose: () => void; onSave: (patch: Partial<Txn>) => void }) {
  const [date, setDate] = useState(txn.date);
  const [description, setDescription] = useState(txn.description);
  const [amount, setAmount] = useState(String(Math.abs(txn.amount)));
  const [category, setCategory] = useState(txn.category);
  const [note, setNote] = useState(txn.note ?? '');

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit transaction"
      sub="Changes recalculate the model immediately."
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() =>
              onSave({
                date,
                description,
                merchant: txn.merchant,
                amount: txn.amount < 0 ? -Math.abs(Number(amount) || 0) : Math.abs(Number(amount) || 0),
                category,
                note,
              })
            }
          >
            Save changes
          </button>
        </>
      }
    >
      <div className="stack-sm">
        <div className="form-row">
          <div className="field"><label>Date</label><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="field"><label>Amount</label><input className="input num" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        </div>
        <div className="field"><label>Statement description</label><input className="input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="field"><label>Category</label><CategorySelect value={category} onChange={setCategory} /></div>
        <div className="field"><label>Note</label><textarea className="textarea" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why does this line matter?" /></div>
      </div>
    </Modal>
  );
}

function AddModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (input: { date: string; description: string; amount: number; category?: string; accountId?: string; note?: string }) => void;
}) {
  const { state } = useApp();
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dir, setDir] = useState<'out' | 'in'>('out');
  const [category, setCategory] = useState('');
  const [accountId, setAccountId] = useState('acc_hdfc');
  const [note, setNote] = useState('');

  const preview = description ? categorize(description, dir === 'out' ? -Math.abs(Number(amount) || 1) : Math.abs(Number(amount) || 1), state.rules) : null;
  const chosen = category || preview?.category || 'other';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a transaction"
      sub="Cash, a missed line, or something the bank never told you about."
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!description || !Number(amount)}
            onClick={() =>
              onAdd({
                date,
                description,
                amount: dir === 'out' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
                category: chosen,
                accountId,
                note,
              })
            }
          >
            Add to the model
          </button>
        </>
      }
    >
      <div className="stack-sm">
        <div className="form-row-3">
          <div className="field"><label>Date</label><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="field"><label>Direction</label>
            <select className="select" value={dir} onChange={(e) => setDir(e.target.value as 'out' | 'in')}>
              <option value="out">Money out</option>
              <option value="in">Money in</option>
            </select>
          </div>
          <div className="field"><label>Amount</label><input className="input num" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        </div>
        <div className="field"><label>Description</label><input className="input" placeholder="e.g. SWIGGY ORDER BANGALORE" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="form-row">
          <div className="field"><label>Category</label><CategorySelect value={chosen} onChange={setCategory} /></div>
          <div className="field"><label>Account</label>
            <select className="select" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {state.accounts.map((a) => <option key={a.id} value={a.id}>{a.name} · {a.institution}</option>)}
            </select>
          </div>
        </div>
        {preview && (
          <div className="note">
            Auto-filed as <strong>{CATEGORY_MAP[chosen]?.name}</strong> at {Math.round(preview.confidence * 100)}% confidence.
            {' '}{preview.why}
          </div>
        )}
        <div className="field"><label>Note (optional)</label><input className="input" value={note} onChange={(e) => setNote(e.target.value)} /></div>
      </div>
    </Modal>
  );
}
