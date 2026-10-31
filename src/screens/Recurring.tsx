import { useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import type { Recurring } from '../types';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories';
import { money, pct } from '../lib/format';
import { friendlyDate, relativeDays, todayISO } from '../lib/date';
import { useMoney } from '../hooks/useMoney';
import { Icon } from '../components/Icon';
import { Confirm, Empty, Modal, Tabs, useToast } from '../components/ui';
import { detectPriceChange, subscriptionTotal, unusedTotal } from '../domain/recurring';
import { monthlyAmount, upcomingBills } from '../domain/finance';
import { addDays } from '../lib/date';

type Filter = 'all' | 'subscriptions' | 'bills' | 'dormant' | 'cancelled';

export default function RecurringScreen() {
  const { state, scanRecurring, updateRecurring, addRecurring } = useApp();
  const { push } = useToast();
  const fmt = useMoney();

  const [filter, setFilter] = useState<Filter>('all');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Recurring | null>(null);
  const [cancelling, setCancelling] = useState<Recurring | null>(null);
  const [cancelAll, setCancelAll] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scriptTarget, setScriptTarget] = useState<Recurring | null>(null);
  const [scriptType, setScriptType] = useState<'rbi_cancel' | 'negotiate'>('rbi_cancel');

  const allActive = state.recurring.filter((r) => r.status !== 'cancelled');
  const subs = allActive.filter((r) => r.category === 'subscriptions' || r.category === 'fitness');
  const subTotals = subscriptionTotal(subs);
  const dormant = allActive.filter((r) => r.usage === 'unused');
  const dormantMonthly = unusedTotal(state.recurring);
  const monthlyAll = allActive.reduce((s, r) => s + monthlyAmount(r.amount, r.cadence), 0);
  const upcoming = upcomingBills(state, 45);

  const rows = useMemo(() => {
    const sorted = [...state.recurring].sort((a, b) => {
      if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
      if (b.status === 'cancelled' && a.status !== 'cancelled') return -1;
      return a.nextDate < b.nextDate ? -1 : 1;
    });
    switch (filter) {
      case 'subscriptions': return sorted.filter((r) => r.category === 'subscriptions');
      case 'bills': return sorted.filter((r) => ['rent', 'utilities', 'internet', 'mobile', 'insurance'].includes(r.category));
      case 'dormant': return sorted.filter((r) => r.usage === 'unused' && r.status !== 'cancelled');
      case 'cancelled': return sorted.filter((r) => r.status === 'cancelled');
      default: return sorted;
    }
  }, [state.recurring, filter]);

  const priceAlerts = state.recurring
    .filter((r) => r.status !== 'cancelled')
    .map((r) => ({ r, change: detectPriceChange(r) }))
    .filter((x) => x.change);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Recurring radar</div>
          <h1 className="display">What keeps <em>coming back.</em></h1>
          <p className="lede">
            Rent, bills, and the quiet subscriptions. Baseline watches the rhythm, flags price changes, and notices when
            something stops being used.
          </p>
        </div>
        <div className="head-actions">
          <button
            className="btn"
            disabled={scanning}
            onClick={() => {
              setScanning(true);
              const n = scanRecurring();
              setTimeout(() => {
                setScanning(false);
                push(n ? `Found ${n} new recurring charge${n > 1 ? 's' : ''}` : 'No new recurring patterns found');
              }, 250);
            }}
          >
            <Icon name="refresh" size={14} /> {scanning ? 'Scanning…' : 'Scan for recurring'}
          </button>
          <button className="btn btn-primary" onClick={() => setAdding(true)}>
            <Icon name="plus" size={14} /> Add recurring
          </button>
        </div>
      </div>

      <div className="grid" style={{ marginBottom: 16 }}>
        <div className="col-3 panel">
          <div className="panel-body">
            <div className="label">Monthly subscriptions</div>
            <div className="medium-number" style={{ marginTop: 6 }}>{fmt(subTotals.monthly)}</div>
            <div className="tiny" style={{ color: 'var(--muted)', marginTop: 3 }}>{fmt(subTotals.annual)} a year</div>
          </div>
        </div>
        <div className="col-3 panel">
          <div className="panel-body">
            <div className="label">All recurring</div>
            <div className="medium-number" style={{ marginTop: 6 }}>{fmt(monthlyAll)}</div>
            <div className="tiny" style={{ color: 'var(--muted)', marginTop: 3 }}>{allActive.length} active commitments</div>
          </div>
        </div>
        <div className="col-3 panel">
          <div className="panel-body">
            <div className="label">Dormant</div>
            <div className="medium-number" style={{ marginTop: 6, color: dormantMonthly ? 'var(--negative)' : 'var(--ink)' }}>
              {fmt(dormantMonthly)}
            </div>
            <div className="tiny" style={{ color: 'var(--muted)', marginTop: 3 }}>{dormant.length} service{dormant.length === 1 ? '' : 's'} with no usage</div>
          </div>
        </div>
        <div className="col-3 panel">
          <div className="panel-body">
            <div className="label">Next 30 days</div>
            <div className="medium-number" style={{ marginTop: 6 }}>{fmt(upcoming.filter((u) => u.inDays <= 30).reduce((s, u) => s + u.recurring.amount, 0))}</div>
            <div className="tiny" style={{ color: 'var(--muted)', marginTop: 3 }}>{upcoming.filter((u) => u.inDays <= 30).length} scheduled charges</div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Renewal rhythm (Days 1–31)</h2>
            <p className="panel-sub">Scheduled charges distributed across the 31-day cycle to avoid cash crunches.</p>
          </div>
          <span className="badge">{allActive.length} active commitments</span>
        </div>
        <div className="panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: 6 }}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const matches = allActive.filter((r) => {
                const d = new Date(r.nextDate).getDate();
                return d === day;
              });
              const dayTotal = matches.reduce((s, r) => s + r.amount, 0);
              const isToday = new Date().getDate() === day;
              return (
                <div
                  key={day}
                  style={{
                    border: isToday ? '1px solid var(--accent)' : '1px solid var(--line)',
                    background: matches.length > 0 ? 'var(--surface-2)' : 'transparent',
                    borderRadius: 4,
                    padding: '6px 8px',
                    minHeight: 56,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div className="row-between">
                    <span className="tiny mono" style={{ fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--accent)' : 'var(--ink)' }}>
                      {day}
                    </span>
                    {matches.length > 0 && (
                      <span className="cat-dot" style={{ background: 'var(--accent)', width: 6, height: 6 }} />
                    )}
                  </div>
                  {matches.length > 0 ? (
                    <div>
                      <div className="tiny ellipsis" style={{ fontWeight: 600, color: 'var(--ink)' }} title={matches.map(m => `${m.merchant} (${money(m.amount)})`).join(', ')}>
                        {matches[0].merchant}
                      </div>
                      <div className="tiny faint num">{money(dayTotal)}</div>
                    </div>
                  ) : (
                    <span className="tiny faint">—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {priceAlerts.length > 0 && (
        <div className="panel" style={{ marginBottom: 16, borderLeft: '2px solid var(--accent)' }}>
          <div className="panel-body">
            <div className="row-between wrap" style={{ gap: 12 }}>
              <div>
                <div className="row" style={{ gap: 8 }}>
                  <Icon name="alert" size={15} style={{ color: 'var(--accent)' }} />
                  <h2 className="panel-title">Price change detected</h2>
                </div>
                {priceAlerts.map(({ r, change }) => (
                  <p key={r.id} className="small muted" style={{ marginTop: 4 }}>
                    <strong style={{ color: 'var(--ink)' }}>{r.merchant}</strong> went from {money(change!.from)} to{' '}
                    {money(change!.to)} ({pct(change!.pct)}). That is {money(change!.delta * 12)} more each year.
                  </p>
                ))}
              </div>
              <button className="btn btn-sm" onClick={() => setFilter('subscriptions')}>Review subscriptions</button>
            </div>
          </div>
        </div>
      )}

      {dormant.length > 0 && (
        <div className="panel" style={{ marginBottom: 16, borderLeft: '2px solid var(--negative)' }}>
          <div className="panel-body">
            <div className="row-between wrap" style={{ gap: 12 }}>
              <div>
                <div className="row" style={{ gap: 8 }}>
                  <Icon name="clock" size={15} style={{ color: 'var(--negative)' }} />
                  <h2 className="panel-title">{dormant.length} dormant subscriptions</h2>
                </div>
                <p className="small muted" style={{ marginTop: 4 }}>
                  {dormant.map((d) => d.merchant).join(', ')} — last meaningful use{' '}
                  {dormant[0].lastUsedDate ? relativeDays(dormant[0].lastUsedDate) : 'not recorded'}. Together they cost{' '}
                  {fmt(dormantMonthly)} a month.
                </p>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <button className="btn btn-sm" onClick={() => setFilter('dormant')}>Review them</button>
                <button className="btn btn-sm btn-danger" onClick={() => setCancelAll(true)}>Cancel both</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid">
        <section className="panel col-8">
          <div className="panel-head" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <div className="row-between">
              <div>
                <h2 className="panel-title">Recurring payments</h2>
                <p className="panel-sub">{rows.length} shown</p>
              </div>
              <span className="badge info"><Icon name="refresh" size={10} /> Auto-detected</span>
            </div>
            <Tabs
              tabs={[
                { id: 'all', label: 'All', count: state.recurring.length },
                { id: 'subscriptions', label: 'Subscriptions', count: state.recurring.filter((r) => r.category === 'subscriptions').length },
                { id: 'bills', label: 'Bills', count: state.recurring.filter((r) => ['rent', 'utilities', 'internet', 'mobile', 'insurance'].includes(r.category)).length },
                { id: 'dormant', label: 'Dormant', count: dormant.length },
                { id: 'cancelled', label: 'Cancelled', count: state.recurring.filter((r) => r.status === 'cancelled').length },
              ]}
              value={filter}
              onChange={(f) => setFilter(f as Filter)}
            />
          </div>

          <div className="panel-body flush">
            {rows.length === 0 ? (
              <Empty icon="repeat" title="Nothing in this view" body="Change the filter or scan the ledger for new recurring patterns." />
            ) : (
              <div className="table-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Amount</th>
                      <th className="hide-sm">Cadence</th>
                      <th>Next charge</th>
                      <th className="hide-sm">Usage</th>
                      <th>Status</th>
                      <th className="right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const change = detectPriceChange(r);
                      return (
                        <tr key={r.id} style={{ opacity: r.status === 'cancelled' ? 0.55 : 1 }}>
                          <td>
                            <div className="row" style={{ gap: 7 }}>
                              <span className="cat-dot" style={{ background: CATEGORY_MAP[r.category]?.color }} />
                              <div>
                                <div className="txn-merchant">{r.merchant}</div>
                                <div className="tiny" style={{ color: 'var(--muted)' }}>
                                  {CATEGORY_MAP[r.category]?.name} · {r.source === 'detected' ? 'detected' : 'manual'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="money">
                            {money(r.amount)}
                            {change && (
                              <div className="tiny" style={{ color: 'var(--negative)', marginTop: 2 }}>
                                was {money(change.from)}
                              </div>
                            )}
                          </td>
                          <td className="hide-sm small muted">{r.cadence}</td>
                          <td>
                            <div className="small">{friendlyDate(r.nextDate)}</div>
                            <div className="tiny" style={{ color: 'var(--muted)' }}>{relativeDays(r.nextDate)}</div>
                          </td>
                          <td className="hide-sm">
                            {r.status === 'cancelled' ? (
                              <span className="tiny faint">—</span>
                            ) : r.usage === 'unused' ? (
                              <span className="badge warn">Dormant</span>
                            ) : r.usage === 'used' ? (
                              <span className="badge pos">In use</span>
                            ) : (
                              <span className="badge outline">Unknown</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${r.status === 'active' ? 'pos' : r.status === 'snoozed' ? 'warn' : 'outline'}`}>
                              {r.status}
                            </span>
                          </td>
                          <td>
                            <div className="row" style={{ gap: 2, justifyContent: 'flex-end' }}>
                              {r.status === 'cancelled' ? (
                                <button className="btn btn-sm" onClick={() => { updateRecurring(r.id, { status: 'active' }); push(`${r.merchant} restored`); }}>
                                  Restore
                                </button>
                              ) : (
                                <>
                                  <button className="btn btn-ghost btn-icon" title="Edit" aria-label={`Edit ${r.merchant}`} onClick={() => setEditing(r)}>
                                    <Icon name="pencil" size={13} />
                                  </button>
                                  {r.usage === 'unused' ? (
                                    <button className="btn btn-sm" onClick={() => { updateRecurring(r.id, { usage: 'used', lastUsedDate: todayISO() }); push(`${r.merchant} marked as in use`); }}>
                                      Keep
                                    </button>
                                  ) : (
                                    <button className="btn btn-sm btn-ghost" onClick={() => { updateRecurring(r.id, { usage: 'unused' }); push(`${r.merchant} marked dormant`); }}>
                                      Dormant
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-sm btn-ghost"
                                    title="Negotiation and cancellation script"
                                    onClick={() => setScriptTarget(r)}
                                  >
                                    Script
                                  </button>
                                  <button className="btn btn-sm btn-danger" onClick={() => setCancelling(r)}>Cancel</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>
              Detection needs at least three consistent charges within a 20% amount band
            </span>
            <button className="linkish small" onClick={() => { push('Scanning the last six months'); const n = scanRecurring(); push(n ? `${n} new patterns added` : 'No new patterns'); }}>
              Scan again
            </button>
          </div>
        </section>

        <aside className="col-4 stack">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Coming up</h2>
                <p className="panel-sub">The next 45 days of known charges.</p>
              </div>
            </div>
            <div className="panel-body" style={{ paddingTop: 4, maxHeight: 420, overflowY: 'auto' }}>
              {upcoming.slice(0, 12).map((u) => (
                <div className="bill-row" key={u.recurring.id}>
                  <div className="bill-date">
                    <b>{new Date(u.date).getDate()}</b>
                    {new Date(u.date).toLocaleDateString('en-IN', { month: 'short' })}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="txn-merchant ellipsis">{u.recurring.merchant}</div>
                    <div className="tiny" style={{ color: 'var(--muted)' }}>{relativeDays(u.date)} · {u.recurring.cadence}</div>
                  </div>
                  <span className="num small">{money(u.recurring.amount)}</span>
                </div>
              ))}
              {!upcoming.length && <p className="small muted" style={{ padding: '12px 0' }}>Nothing scheduled. That is either calm or suspicious.</p>}
            </div>
            <div className="panel-foot">
              <span className="tiny" style={{ color: 'var(--muted)' }}>45-day total</span>
              <span className="num small strong">{fmt(upcoming.reduce((s, u) => s + u.recurring.amount, 0))}</span>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">How detection works</h2>
              </div>
            </div>
            <div className="panel-body stack-sm">
              <p className="small muted">
                The scanner groups outflows by merchant, measures the gaps between charges, and checks that amounts stay
                within 20% of the median.
              </p>
              <div className="callout">
                <div className="row-between small"><span className="muted">Weekly</span><span className="mono">5–9 days</span></div>
                <div className="row-between small"><span className="muted">Monthly</span><span className="mono">24–37 days</span></div>
                <div className="row-between small"><span className="muted">Quarterly</span><span className="mono">78–100 days</span></div>
                <div className="row-between small"><span className="muted">Yearly</span><span className="mono">330–400 days</span></div>
              </div>
              <div className="note guard">
                Cancelling here changes the model, not the real subscription. Nothing is sent to the merchant.
              </div>
            </div>
          </section>
        </aside>
      </div>

      {adding && (
        <RecurringModal
          title="Add a recurring payment"
          onClose={() => setAdding(false)}
          onSave={(r) => { addRecurring({ ...r, source: 'manual', detectedFrom: 0 }); push('Recurring payment added'); setAdding(false); }}
        />
      )}

      {editing && (
        <RecurringModal
          title={`Edit ${editing.merchant}`}
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(r) => { updateRecurring(editing.id, r); push('Change saved'); setEditing(null); }}
        />
      )}

      <Confirm
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        onConfirm={() => {
          if (!cancelling) return;
          updateRecurring(cancelling.id, { status: 'cancelled' });
          push(`${cancelling.merchant} marked cancelled`);
        }}
        title={`Cancel ${cancelling?.merchant}?`}
        body="This updates the model and removes it from future bills. It does not cancel the real subscription — do that with the provider."
        confirmLabel="Mark as cancelled"
        danger
      />

      <Confirm
        open={cancelAll}
        onClose={() => setCancelAll(false)}
        onConfirm={() => {
          dormant.forEach((d) => updateRecurring(d.id, { status: 'cancelled' }));
          push(`Marked ${dormant.length} dormant subscriptions as cancelled`);
        }}
        title={`Cancel ${dormant.length} dormant subscriptions?`}
        body={`This frees ${money(dormantMonthly)} a month in the model. Remember to cancel with each provider as well.`}
        confirmLabel="Mark all cancelled"
        danger
      />

      {scriptTarget && (
        <Modal
          open
          onClose={() => setScriptTarget(null)}
          title={`Support script: ${scriptTarget.merchant}`}
          sub="Pre-drafted correspondence citing regulatory frameworks and retention options."
          footer={
            <>
              <button className="btn" onClick={() => setScriptTarget(null)}>Close</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const text = scriptType === 'rbi_cancel'
                    ? `Subject: Revocation of E-Mandate Consent - ${scriptTarget.merchant}\n\nDear Customer Support Team,\n\nI am writing to formally request the immediate cancellation of my recurring subscription for ${scriptTarget.merchant} and the immediate revocation of the associated electronic mandate registered on my card/account.\n\nUnder the Reserve Bank of India (RBI) Framework for Processing of E-mandates for Recurring Transactions (Circular RBI/2019-20/47 and subsequent notifications), subscribers have the explicit statutory right to withdraw their mandate consent at any time without obstruction, punitive fees, or forced retention workflows.\n\nSubscription Details:\n- Service: ${scriptTarget.merchant}\n- Registered User: ${state.profile.name}\n- Recurring Charge Amount: INR ${scriptTarget.amount}\n- Scheduled Next Billing Date: ${scriptTarget.nextDate}\n\nPlease confirm in writing within 48 hours that this recurring e-mandate has been cancelled and that no further debit authorizations will be presented to my issuing bank.\n\nThank you,\n${state.profile.name}`
                    : `Subject: Exploring plan options before renewal - ${scriptTarget.merchant}\n\nHi Support Team,\n\nI have been using ${scriptTarget.merchant} and evaluating my software subscriptions ahead of my upcoming renewal on ${scriptTarget.nextDate}.\n\nBefore making a final renewal decision, I wanted to inquire if there are any loyalty retention discounts, annual prepaid promotional pricing, or temporary pause options available for my account?\n\nI would love to remain a subscriber if we can find a mutually workable rate.\n\nBest regards,\n${state.profile.name}`;
                  navigator.clipboard.writeText(text);
                  push('Script copied to clipboard');
                }}
              >
                Copy to clipboard
              </button>
            </>
          }
        >
          <div className="stack-sm">
            <div className="row" style={{ gap: 6, marginBottom: 8 }}>
              <button
                type="button"
                className="chip"
                aria-pressed={scriptType === 'rbi_cancel'}
                onClick={() => setScriptType('rbi_cancel')}
              >
                RBI E-Mandate Revocation
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={scriptType === 'negotiate'}
                onClick={() => setScriptType('negotiate')}
              >
                Retention & Discount Request
              </button>
            </div>

            {scriptType === 'rbi_cancel' ? (
              <div className="note" style={{ whiteSpace: 'pre-line', fontSize: 11.5, lineHeight: 1.5 }}>
                {`Subject: Revocation of E-Mandate Consent - ${scriptTarget.merchant}

Dear Customer Support Team,

I am writing to formally request the immediate cancellation of my recurring subscription for ${scriptTarget.merchant} and the immediate revocation of the associated electronic mandate registered on my card/account.

Under the Reserve Bank of India (RBI) Framework for Processing of E-mandates for Recurring Transactions (Circular RBI/2019-20/47 and subsequent notifications), subscribers have the explicit statutory right to withdraw their mandate consent at any time without obstruction, punitive fees, or forced retention workflows.

Subscription Details:
- Service: ${scriptTarget.merchant}
- Registered User: ${state.profile.name}
- Recurring Charge Amount: INR ${scriptTarget.amount}
- Scheduled Next Billing Date: ${scriptTarget.nextDate}

Please confirm in writing within 48 hours that this recurring e-mandate has been cancelled and that no further debit authorizations will be presented to my issuing bank.

Thank you,
${state.profile.name}`}
              </div>
            ) : (
              <div className="note" style={{ whiteSpace: 'pre-line', fontSize: 11.5, lineHeight: 1.5 }}>
                {`Subject: Exploring plan options before renewal - ${scriptTarget.merchant}

Hi Support Team,

I have been using ${scriptTarget.merchant} and evaluating my software subscriptions ahead of my upcoming renewal on ${scriptTarget.nextDate}.

Before making a final renewal decision, I wanted to inquire if there are any loyalty retention discounts, annual prepaid promotional pricing, or temporary pause options available for my account?

I would love to remain a subscriber if we can find a mutually workable rate.

Best regards,
${state.profile.name}`}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

function RecurringModal({
  title,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  initial?: Recurring;
  onClose: () => void;
  onSave: (r: Omit<Recurring, 'id' | 'source' | 'detectedFrom'>) => void;
}) {
  const [merchant, setMerchant] = useState(initial?.merchant ?? '');
  const [amount, setAmount] = useState(String(initial?.amount ?? ''));
  const [category, setCategory] = useState(initial?.category ?? 'subscriptions');
  const [cadence, setCadence] = useState<Recurring['cadence']>(initial?.cadence ?? 'monthly');
  const [nextDate, setNextDate] = useState(initial?.nextDate ?? addDays(todayISO(), 14));
  const [usage, setUsage] = useState<Recurring['usage']>(initial?.usage ?? 'used');
  const [notes, setNotes] = useState(initial?.notes ?? '');

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!merchant.trim() || !Number(amount)}
            onClick={() =>
              onSave({
                merchant: merchant.trim(),
                amount: Math.abs(Number(amount)),
                category,
                cadence,
                nextDate,
                lastDate: initial?.lastDate ?? todayISO(),
                status: initial?.status ?? 'active',
                priceHistory: initial?.priceHistory ?? [{ date: todayISO(), amount: Math.abs(Number(amount)) }],
                usage,
                lastUsedDate: initial?.lastUsedDate,
                accountId: initial?.accountId ?? 'acc_hdfc',
                notes,
              })
            }
          >
            Save
          </button>
        </>
      }
    >
      <div className="stack-sm">
        <div className="field"><label>Merchant</label><input className="input" value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="e.g. Nykaa Beauty" /></div>
        <div className="form-row">
          <div className="field"><label>Amount</label><input className="input num" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div className="field"><label>Cadence</label>
            <select className="select" value={cadence} onChange={(e) => setCadence(e.target.value as Recurring['cadence'])}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field"><label>Category</label>
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Next charge</label><input className="input" type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} /></div>
        </div>
        <div className="field"><label>Usage signal</label>
          <select className="select" value={usage} onChange={(e) => setUsage(e.target.value as Recurring['usage'])}>
            <option value="used">In use</option>
            <option value="unknown">Not sure</option>
            <option value="unused">Dormant</option>
          </select>
        </div>
        <div className="field"><label>Note</label><input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Why does this exist?" /></div>
      </div>
    </Modal>
  );
}
