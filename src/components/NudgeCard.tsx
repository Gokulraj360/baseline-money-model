import { Icon, type IconName } from './Icon';
import type { Nudge } from '../types';
import { navigate } from '../lib/router';
import { useApp } from '../store/AppStore';
import { useToast } from './ui';
import { nudgeKindLabel } from '../domain/nudges';

const ICONS: Record<Nudge['kind'], IconName> = {
  drift: 'trendUp',
  'price-change': 'alert',
  unused: 'clock',
  goal: 'target',
  buffer: 'shield',
  payday: 'wallet',
  anomaly: 'info',
};

export function NudgeCard({ nudge, showMath = true }: { nudge: Nudge; showMath?: boolean }) {
  const { setNudgeState } = useApp();
  const { push } = useToast();

  return (
    <article className="nudge" aria-label={nudge.title}>
      <div className={`nudge-icon ${nudge.severity}`}>
        <Icon name={ICONS[nudge.kind]} size={14} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="row wrap" style={{ gap: 8 }}>
          <h3 className="nudge-title">{nudge.title}</h3>
          <span className="badge outline">{nudgeKindLabel(nudge.kind)}</span>
        </div>
        <p className="nudge-body">{nudge.body}</p>
        {showMath && nudge.math && (
          <p className="small" style={{ marginTop: 5, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>
            {nudge.math}
          </p>
        )}
        <div className="nudge-actions">
          {nudge.actionLabel && nudge.actionRoute && (
            <button className="btn btn-sm" onClick={() => navigate(nudge.actionRoute!.replace('#/', '/'))}>
              {nudge.actionLabel} <Icon name="chevronRight" size={12} />
            </button>
          )}
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => {
              setNudgeState(nudge.id, 'done');
              push('Marked as handled');
            }}
          >
            <Icon name="check" size={12} /> Done
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => {
              setNudgeState(nudge.id, 'snoozed');
              push('Snoozed for the rest of the month');
            }}
          >
            <Icon name="clock" size={12} /> Snooze
          </button>
          <button
            className="btn btn-sm btn-ghost"
            aria-label="Dismiss this nudge"
            onClick={() => {
              setNudgeState(nudge.id, 'dismissed');
              push('Nudge dismissed');
            }}
          >
            <Icon name="x" size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}
