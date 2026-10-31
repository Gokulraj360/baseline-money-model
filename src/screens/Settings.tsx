import { useRef, useState } from 'react';
import { useApp } from '../store/AppStore';
import type { AppState } from '../types';
import { Icon } from '../components/Icon';
import { Confirm, useToast } from '../components/ui';
import { downloadFile, toCSV } from '../lib/export';
import { currentBalance, summarizeMonth } from '../domain/finance';
import { money } from '../lib/format';
import { nowMonth, todayISO } from '../lib/date';
import { navigate } from '../lib/router';
import { CATEGORY_MAP } from '../data/categories';

/* Small local wrapper so the segmented control reads naturally here. */
function SegmentSwitch({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Settings() {
  const { state, update, updateSettings, reset } = useApp();
  const { push } = useToast();
  const [resetOpen, setResetOpen] = useState(false);
  const [wipeOpen, setWipeOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sizeKb = Math.max(1, Math.round(new Blob([JSON.stringify(state)]).size / 1024));
  const counts = summarizeMonth(state.txns, nowMonth());

  const importBackup = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as AppState;
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.txns) || !parsed.profile) {
        throw new Error('That file is not a Baseline backup.');
      }
      update(() => parsed);
      push(`Backup restored · ${parsed.txns.length} transactions`);
    } catch (e) {
      push(e instanceof Error ? e.message : 'Could not read that backup');
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Settings · local-first</div>
          <h1 className="display">Your data, <em>your machine.</em></h1>
          <p className="lede">
            Baseline stores everything in this browser. No account, no server, no upload. Export a backup whenever you
            want a second copy.
          </p>
        </div>
        <div className="head-actions">
          <button
            className="btn"
            onClick={() => {
              downloadFile(JSON.stringify(state, null, 2), `baseline-backup-${todayISO()}.json`, 'application/json');
              push('Full backup exported');
            }}
          >
            <Icon name="download" size={14} /> Export backup
          </button>
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={14} /> Restore backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importBackup(f);
              e.currentTarget.value = '';
            }}
          />
        </div>
      </div>

      <div className="grid">
        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Appearance</h2>
              <p className="panel-sub">Paper by default. Dark when the room is.</p>
            </div>
          </div>
          <div className="panel-body">
            <div className="row-between" style={{ gap: 14 }}>
              <div>
                <div className="small strong">Theme</div>
                <div className="tiny" style={{ color: 'var(--muted)' }}>Both palettes use the same tokens.</div>
              </div>
              <SegmentSwitch
                value={state.settings.theme}
                options={[{ value: 'light', label: 'Paper' }, { value: 'dark', label: 'Ink' }]}
                onChange={(v) => { updateSettings({ theme: v as 'light' | 'dark' }); push(`${v === 'light' ? 'Paper' : 'Ink'} theme`); }}
                label="Theme"
              />
            </div>
            <div className="divider" />
            <div className="row-between" style={{ gap: 14 }}>
              <div>
                <div className="small strong">Compact ledger</div>
                <div className="tiny" style={{ color: 'var(--muted)' }}>Tighter rows in large transaction tables.</div>
              </div>
              <SegmentSwitch
                value={state.settings.dense ? 'compact' : 'roomy'}
                options={[{ value: 'roomy', label: 'Roomy' }, { value: 'compact', label: 'Compact' }]}
                onChange={(v) => updateSettings({ dense: v === 'compact' })}
                label="Table density"
              />
            </div>
            <div className="divider" />
            <div className="row-between" style={{ gap: 14 }}>
              <div>
                <div className="small strong">Hide headline balances</div>
                <div className="tiny" style={{ color: 'var(--muted)' }}>For screenshares and coffee shops.</div>
              </div>
              <SegmentSwitch
                value={state.settings.hideBalances ? 'hidden' : 'shown'}
                options={[{ value: 'shown', label: 'Show' }, { value: 'hidden', label: 'Hide' }]}
                onChange={(v) => { updateSettings({ hideBalances: v === 'hidden' }); push(v === 'hidden' ? 'Balances masked' : 'Balances visible'); }}
                label="Hide balances"
              />
            </div>
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>⌘K opens the command palette anywhere</span>
            <button className="linkish small" onClick={() => navigate('/coach')}>Nudge preferences</button>
          </div>
        </section>

        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Data</h2>
              <p className="panel-sub">{sizeKb} KB stored locally.</p>
            </div>
            <span className="badge pos"><Icon name="lock" size={10} /> Local only</span>
          </div>
          <div className="panel-body">
            <div className="row-between small"><span className="muted">Transactions</span><span className="num">{state.txns.length}</span></div>
            <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Months modelled</span><span className="num">{new Set(state.txns.map((t) => t.date.slice(0, 7))).size}</span></div>
            <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Rules</span><span className="num">{state.rules.length}</span></div>
            <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Recurring</span><span className="num">{state.recurring.length}</span></div>
            <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Goals</span><span className="num">{state.goals.length}</span></div>
            <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Scenarios</span><span className="num">{state.scenarios.length}</span></div>
            <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Corrections</span><span className="num">{state.corrections.length}</span></div>
            <div className="row-between small" style={{ marginTop: 5 }}><span className="muted">Current balance</span><span className="num">{money(currentBalance(state))}</span></div>
            <div className="divider" />
            <div className="row wrap" style={{ gap: 8 }}>
              <button
                className="btn btn-sm"
                onClick={() => {
                  const rows = state.txns.map((t) => ({
                    Date: t.date,
                    Merchant: t.merchant,
                    Description: t.description,
                    Category: CATEGORY_MAP[t.category]?.name ?? t.category,
                    Amount: t.amount,
                    Account: t.accountId,
                    Source: t.source,
                    Confidence: t.confidence,
                    Pending: t.pending ? 'yes' : 'no',
                  }));
                  downloadFile(toCSV(rows), `baseline-transactions-${todayISO()}.csv`);
                  push('Transactions exported');
                }}
              >
                <Icon name="download" size={12} /> Transactions CSV
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  const rows = state.txns
                    .filter((t) => t.date.slice(0, 7) === nowMonth())
                    .map((t) => ({ Date: t.date, Merchant: t.merchant, Amount: t.amount, Category: t.category }));
                  downloadFile(toCSV(rows), `baseline-${nowMonth()}.csv`);
                  push('This month exported');
                }}
              >
                <Icon name="download" size={12} /> This month
              </button>
              <button className="btn btn-sm" onClick={() => fileRef.current?.click()}>
                <Icon name="upload" size={12} /> Restore JSON
              </button>
            </div>
            <div className="note" style={{ marginTop: 12 }}>
              A backup contains everything: transactions, rules, scenarios, goals, and settings. Keep it somewhere you
              trust — it is not encrypted at rest.
            </div>
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>{counts.count} lines this month</span>
            <button className="linkish small" onClick={() => navigate('/inbox')}>Import a statement</button>
          </div>
        </section>

        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Accounts</h2>
              <p className="panel-sub">Where the model reads from, for now.</p>
            </div>
          </div>
          <div className="panel-body" style={{ paddingTop: 4 }}>
            {state.accounts.map((a) => (
              <div key={a.id} className="bill-row">
                <span className="nudge-icon" style={{ width: 28, height: 28 }}>
                  <Icon name={a.kind === 'credit' ? 'receipt' : a.kind === 'cash' ? 'wallet' : 'wallet'} size={13} />
                </span>
                <div style={{ flex: 1 }}>
                  <div className="txn-merchant">{a.name}</div>
                  <div className="tiny" style={{ color: 'var(--muted)' }}>{a.institution} · {a.kind} ···· {a.last4}</div>
                </div>
                <span className="num small">{a.id === 'acc_hdfc' ? money(currentBalance(state)) : money(a.balance)}</span>
              </div>
            ))}
            <p className="tiny" style={{ color: 'var(--muted)', marginTop: 10 }}>
              Balances are reconstructed from the opening balance and imported lines. They are not live bank feeds.
            </p>
          </div>
        </section>

        <section className="panel col-6">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Demo controls</h2>
              <p className="panel-sub">Six months of seeded history, ready to explore.</p>
            </div>
          </div>
          <div className="panel-body">
            <p className="small muted">
              Resetting restores the original ₹ seeded persona, six months of transactions, and the sample rules. Your
              imports and corrections are lost.
            </p>
            <div className="row wrap" style={{ gap: 8, marginTop: 12 }}>
              <button className="btn" onClick={() => setResetOpen(true)}>
                <Icon name="refresh" size={13} /> Reset to demo data
              </button>
              <button className="btn btn-danger" onClick={() => setWipeOpen(true)}>
                <Icon name="trash" size={13} /> Clear all transactions
              </button>
            </div>
            <div className="note guard" style={{ marginTop: 12 }}>
              Clearing transactions keeps your profile, rules, and goals. Every balance and chart recalculates from
              the empty ledger.
            </div>
          </div>
        </section>

        <section className="panel col-12">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">About Baseline</h2>
              <p className="panel-sub">Version 1.0 · a hackathon build with a long memory.</p>
            </div>
            <span className="badge">INR · en-IN</span>
          </div>
          <div className="panel-body">
            <div className="grid" style={{ gap: 20 }}>
              <div className="col-4">
                <div className="label" style={{ marginBottom: 6 }}>What it does</div>
                <p className="small muted" style={{ lineHeight: 1.65 }}>
                  Imports messy statements, learns from corrections, detects recurring payments, models goals, and
                  simulates trade-offs against your real cash flow.
                </p>
              </div>
              <div className="col-4">
                <div className="label" style={{ marginBottom: 6 }}>What it does not do</div>
                <p className="small muted" style={{ lineHeight: 1.65 }}>
                  No bank connections, no stored credentials, no market projections, no product recommendations, and no
                  advice on securities or credit.
                </p>
              </div>
              <div className="col-4">
                <div className="label" style={{ marginBottom: 6 }}>Keyboard</div>
                <p className="small muted" style={{ lineHeight: 1.65 }}>
                  <span className="kbd">⌘K</span> command palette · <span className="kbd">Esc</span> close dialogs ·{' '}
                  <span className="kbd">⌘Z</span> undo the last destructive change.
                </p>
              </div>
            </div>
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>Built with React, TypeScript, and no chart library</span>
            <span className="tiny" style={{ color: 'var(--muted)' }}>Baseline · {todayISO()}</span>
          </div>
        </section>
      </div>

      <Confirm
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => { reset(); push('Demo data restored'); }}
        title="Reset everything to the demo?"
        body="Your transactions, imports, rules, corrections, goals, and scenarios will be replaced with the seeded persona."
        confirmLabel="Reset demo"
        danger
      />

      <Confirm
        open={wipeOpen}
        onClose={() => setWipeOpen(false)}
        onConfirm={() => {
          update((s) => ({ ...s, txns: [], batches: [], corrections: [], lastAction: null }));
          push('Transactions cleared');
        }}
        title="Clear every transaction?"
        body="The ledger will be empty. Profile, rules, goals, and scenarios stay. Export a backup first if you might want the history back."
        confirmLabel="Clear transactions"
        danger
      />
    </div>
  );
}
