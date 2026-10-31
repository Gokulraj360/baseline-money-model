import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, type IconName } from './Icon';
import { useApp } from '../store/AppStore';
import { navigate, useRoute } from '../lib/router';
import { Modal, useToast } from './ui';
import { deriveNudges } from '../domain/nudges';

export interface RouteMeta {
  path: string;
  label: string;
  icon: IconName;
  group: string;
  desc: string;
}

export const ROUTES: RouteMeta[] = [
  { path: 'overview', label: 'Overview', icon: 'grid', group: 'Today', desc: 'Your living money model at a glance' },
  { path: 'inbox', label: 'Inbox', icon: 'inbox', group: 'Today', desc: 'Import and approve statements' },
  { path: 'transactions', label: 'Transactions', icon: 'receipt', group: 'Understand', desc: 'Search, correct, and split transactions' },
  { path: 'rules', label: 'Rules', icon: 'split', group: 'Understand', desc: 'What the model has learned from you' },
  { path: 'recurring', label: 'Recurring', icon: 'repeat', group: 'Understand', desc: 'Subscriptions, bills, and price changes' },
  { path: 'review', label: 'Monthly review', icon: 'file', group: 'Understand', desc: 'The month, written up' },
  { path: 'plan', label: 'Plan', icon: 'target', group: 'Plan', desc: 'Income, fixed costs, buffer, and goals' },
  { path: 'simulate', label: 'Simulate', icon: 'sliders', group: 'Plan', desc: 'What-if scenarios against the model' },
  { path: 'coach', label: 'Coach', icon: 'compass', group: 'Coach', desc: 'Nudges, guardrails, and how the math works' },
  { path: 'settings', label: 'Settings', icon: 'settings', group: 'Coach', desc: 'Appearance, data, and privacy' },
];

const GROUPS = ['Today', 'Understand', 'Plan', 'Coach'];

export function usePageMeta(): RouteMeta {
  const route = useRoute();
  return ROUTES.find((r) => r.path === route.path) ?? ROUTES[0];
}

function Brand() {
  return (
    <button
      className="rail-brand"
      onClick={() => navigate('/overview')}
      style={{ background: 'none', border: 0, borderBottom: '1px solid var(--line)', textAlign: 'left', cursor: 'pointer', width: '100%' }}
      aria-label="Baseline home"
    >
      <span className="brand-mark">B</span>
      <span>
        <span className="brand-name">Baseline</span>
        <span className="brand-tag">Living money model</span>
      </span>
    </button>
  );
}

function NavList({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const { state } = useApp();
  const route = useRoute();
  const pending = state.txns.filter((t) => t.pending).length;
  const nudges = deriveNudges(state).filter((n) => n.status === 'open').length;

  return (
    <nav className="rail-nav" aria-label="Main navigation" style={compact ? { padding: 0 } : undefined}>
      {GROUPS.map((group) => (
        <React.Fragment key={group}>
          <div className="nav-group">{group}</div>
          {ROUTES.filter((r) => r.group === group).map((r) => {
            const count = r.path === 'inbox' ? pending : r.path === 'coach' ? nudges : 0;
            return (
              <button
                key={r.path}
                className="nav-item"
                aria-current={route.path === r.path ? 'page' : undefined}
                onClick={() => {
                  navigate('/' + r.path);
                  onNavigate?.();
                }}
              >
                <Icon name={r.icon} size={15} />
                <span>{r.label}</span>
                {count > 0 && <span className="nav-count">{count}</span>}
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </nav>
  );
}

function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const { state, updateSettings, undo } = useApp();
  const { push } = useToast();

  const items = useMemo(() => {
    const base = ROUTES.map((r) => ({
      id: r.path,
      label: r.label,
      hint: r.desc,
      icon: r.icon,
      group: 'Go to',
      run: () => navigate('/' + r.path),
    }));
    const actions = [
      {
        id: 'theme',
        label: state.settings.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode',
        hint: 'Appearance',
        icon: 'moon' as IconName,
        group: 'Actions',
        run: () => updateSettings({ theme: state.settings.theme === 'light' ? 'dark' : 'light' }),
      },
      {
        id: 'import',
        label: 'Import a statement',
        hint: 'CSV, PDF, or SMS',
        icon: 'upload' as IconName,
        group: 'Actions',
        run: () => navigate('/inbox'),
      },
      {
        id: 'simulate',
        label: 'Run a what-if scenario',
        hint: 'Change a lever, see the model',
        icon: 'sliders' as IconName,
        group: 'Actions',
        run: () => navigate('/simulate'),
      },
      {
        id: 'undo',
        label: state.lastAction ? `Undo: ${state.lastAction.label}` : 'Nothing to undo yet',
        hint: 'Restore the previous state',
        icon: 'undo' as IconName,
        group: 'Actions',
        run: () => {
          undo();
          push('Last change undone');
        },
      },
      {
        id: 'review',
        label: 'Generate this month’s review',
        hint: 'The written report',
        icon: 'file' as IconName,
        group: 'Actions',
        run: () => navigate('/review'),
      },
    ];
    const all = [...base, ...actions];
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter(
      (i) => i.label.toLowerCase().includes(needle) || i.hint.toLowerCase().includes(needle)
    );
  }, [q, state.settings.theme, state.lastAction, updateSettings, undo, push]);

  useEffect(() => {
    setActive(0);
  }, [q, open]);

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const item of items) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <Modal open={open} onClose={onClose} title="Jump to" sub="Routes and actions. Arrow keys to move, Enter to run." size="normal">
      <input
        className="palette-input"
        placeholder="Search routes and actions…"
        value={q}
        autoFocus
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => Math.min(items.length - 1, a + 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(0, a - 1));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            const item = items[active];
            if (item) {
              item.run();
              onClose();
            }
          }
        }}
        aria-label="Command search"
      />
      <div className="palette-list" role="listbox" aria-label="Commands">
        {grouped.map(([group, list]) => (
          <div key={group}>
            <div className="palette-sec">{group}</div>
            {list.map((item) => {
              const idx = items.indexOf(item);
              return (
                <button
                  key={item.id}
                  className="palette-item"
                  role="option"
                  aria-selected={idx === active}
                  data-active={idx === active}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => {
                    item.run();
                    onClose();
                  }}
                >
                  <Icon name={item.icon} size={14} />
                  <span>{item.label}</span>
                  <span className="kbd">{item.hint.length > 30 ? item.hint.slice(0, 28) + '…' : item.hint}</span>
                </button>
              );
            })}
          </div>
        ))}
        {!items.length && (
          <div className="empty" style={{ padding: 24 }}>
            <h3>No match</h3>
            <p>Try “import”, “scenario”, “review”, or a section name.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state, updateSettings, undo, reset } = useApp();
  const { push } = useToast();
  const meta = usePageMeta();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const firstRun = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !paletteOpen) {
        const el = document.activeElement as HTMLElement | null;
        if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
        e.preventDefault();
        undo();
        push('Last change undone');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, push, paletteOpen]);

  useEffect(() => {
    if (firstRun.current) return;
    firstRun.current = true;
    if (!localStorage.getItem('baseline.seen')) {
      localStorage.setItem('baseline.seen', '1');
    }
  }, []);

  return (
    <div className="shell">
      <aside className="rail">
        <Brand />
        <NavList />
        <div className="rail-foot">
          <div className="row-between">
            <div className="user-chip">
              <span className="avatar">{state.profile.name.split(' ').map((x) => x[0]).join('').slice(0, 2)}</span>
              <span>
                <div className="user-name">{state.profile.name}</div>
                <div className="user-sub">Bengaluru · INR</div>
              </span>
            </div>
            <button
              className="btn btn-ghost btn-icon"
              aria-label={`Switch to ${state.settings.theme === 'light' ? 'dark' : 'light'} mode`}
              onClick={() => updateSettings({ theme: state.settings.theme === 'light' ? 'dark' : 'light' })}
            >
              <Icon name={state.settings.theme === 'light' ? 'moon' : 'sun'} size={15} />
            </button>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="crumb">
            <span>Baseline</span>
            <span className="crumb-sep">/</span>
            <b>{meta.label}</b>
          </div>
          <div className="topbar-spacer" />
          {state.lastAction && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                undo();
                push('Last change undone');
              }}
              title={state.lastAction.label}
            >
              <Icon name="undo" size={13} />
              <span className="hide-sm">Undo</span>
            </button>
          )}
          <button className="searchbtn" onClick={() => setPaletteOpen(true)} aria-label="Search and jump to a section">
            <Icon name="search" size={14} />
            <span className="search-label">Search or jump</span>
            <span className="kbd">⌘K</span>
          </button>
          <button
            className="btn btn-ghost btn-icon"
            aria-label="Notifications"
            onClick={() => navigate('/coach')}
            title="Open the coach"
          >
            <Icon name="bell" size={15} />
          </button>
          <button
            className="btn btn-ghost btn-icon"
            aria-label={state.settings.hideBalances ? 'Show balances' : 'Hide balances'}
            onClick={() => {
              updateSettings({ hideBalances: !state.settings.hideBalances });
              push(state.settings.hideBalances ? 'Balances visible' : 'Balances hidden');
            }}
          >
            <Icon name={state.settings.hideBalances ? 'eyeOff' : 'eye'} size={15} />
          </button>
        </header>

        {children}

        <div className="mobile-nav">
          {ROUTES.filter((r) => ['overview', 'inbox', 'transactions', 'simulate', 'plan'].includes(r.path)).map((r) => (
            <button
              key={r.path}
              aria-current={meta.path === r.path ? 'page' : undefined}
              onClick={() => navigate('/' + r.path)}
            >
              <Icon name={r.icon} size={17} />
              {r.label.split(' ')[0]}
            </button>
          ))}
          <button onClick={() => setSheetOpen(true)} aria-label="More sections">
            <Icon name="more" size={17} />
            More
          </button>
        </div>
      </div>

      <Palette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {sheetOpen && (
        <div className="mobile-sheet" onClick={(e) => e.target === e.currentTarget && setSheetOpen(false)}>
          <div className="mobile-sheet-inner">
            <div className="row-between" style={{ marginBottom: 10 }}>
              <span className="label">All sections</span>
              <button className="btn btn-ghost btn-icon" aria-label="Close menu" onClick={() => setSheetOpen(false)}>
                <Icon name="x" size={15} />
              </button>
            </div>
            <NavList compact onNavigate={() => setSheetOpen(false)} />
            <div className="divider" />
            <button
              className="btn btn-ghost btn-block"
              onClick={() => {
                reset();
                setSheetOpen(false);
                push('Demo data restored');
              }}
            >
              <Icon name="refresh" size={14} /> Reset demo data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
