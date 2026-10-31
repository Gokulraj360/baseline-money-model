import { useMemo, useState } from 'react';
import { compact, money } from '../lib/format';

export interface Point {
  key: string;
  value: number;
}

const W = 720;

function pathFor(points: { x: number; y: number }[]): string {
  return points
    .map((p, i) => {
      if (i === 0) return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C ${cx.toFixed(2)} ${prev.y.toFixed(2)}, ${cx.toFixed(2)} ${p.y.toFixed(2)}, ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    })
    .join(' ');
}

export function LineChart({
  actual,
  forecast = [],
  height = 220,
  band,
  showTable = true,
  ariaLabel = 'Cash balance over time',
}: {
  actual: Point[];
  forecast?: Point[];
  height?: number;
  band?: number;
  showTable?: boolean;
  ariaLabel?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 46, r: 10, t: 14, b: 24 };
  const all = [...actual, ...(forecast.length ? [{ ...forecast[0], value: actual[actual.length - 1]?.value ?? 0 }, ...forecast] : [])];
  const values = all.map((p) => p.value);
  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  // Keep a zero baseline only when the series actually goes negative. A balance
  // chart should show the variation in the balance, not flatten it against zero.
  const rawMin = lowest < 0 ? Math.min(lowest, 0) : lowest;
  const rawMax = highest > 0 ? Math.max(highest, 0) : highest + 1;
  const span = rawMax - rawMin || 1;
  const min = rawMin - span * 0.08;
  const max = rawMax + span * 0.1;

  const innerW = W - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const n = all.length;
  const xAt = (i: number) => pad.l + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v: number) => pad.t + innerH - ((v - min) / (max - min)) * innerH;

  const actualPts = actual.map((p, i) => ({ x: xAt(i), y: yAt(p.value) }));
  const forecastOffset = actual.length;
  const forecastPts = forecast.map((p, i) => ({ x: xAt(forecastOffset + i), y: yAt(p.value) }));
  const forecastAll = actual.length
    ? [{ x: xAt(actual.length - 1), y: yAt(actual[actual.length - 1].value) }, ...forecastPts]
    : forecastPts;

  const bandWidth = band ?? 0;
  const bandPts = forecast.length
    ? forecast.map((p, i) => ({
        x: xAt(forecastOffset + i),
        hi: yAt(p.value + bandWidth * Math.sqrt(i + 1)),
        lo: yAt(Math.max(0, p.value - bandWidth * Math.sqrt(i + 1))),
      }))
    : [];
  const bandPath = bandPts.length
    ? `M ${xAt(actual.length - 1)} ${yAt(actual[actual.length - 1]?.value ?? 0)} ` +
      bandPts.map((p) => `L ${p.x} ${p.hi}`).join(' ') +
      ' ' +
      [...bandPts].reverse().map((p) => `L ${p.x} ${p.lo}`).join(' ') +
      ' Z'
    : '';

  const gridCount = 4;
  const gridVals = Array.from({ length: gridCount + 1 }, (_, i) => min + ((max - min) * i) / gridCount);
  const areaPath = actualPts.length
    ? `${pathFor(actualPts)} L ${actualPts[actualPts.length - 1].x} ${pad.t + innerH} L ${actualPts[0].x} ${pad.t + innerH} Z`
    : '';

  const labels = [...actual, ...forecast];
  const hoverPoint = hover !== null ? all[Math.min(hover, all.length - 1)] : null;

  return (
    <div style={{ position: 'relative' }}>
      <svg
        className="chart"
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-label={ariaLabel}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * W;
          const ratio = (x - pad.l) / innerW;
          const idx = Math.round(ratio * (n - 1));
          setHover(Math.max(0, Math.min(n - 1, idx)));
        }}
      >
        {gridVals.map((v, i) => (
          <g key={i}>
            <line className="gridline" x1={pad.l} x2={W - pad.r} y1={yAt(v)} y2={yAt(v)} />
            <text x={pad.l - 8} y={yAt(v) + 3} textAnchor="end">
              {compact(v)}
            </text>
          </g>
        ))}
        {bandPath && <path className="band" d={bandPath} />}
        {areaPath && <path className="area" d={areaPath} />}
        {actualPts.length > 1 && <path className="line" d={pathFor(actualPts)} />}
        {forecastAll.length > 1 && <path className="line line-accent forecast" d={pathFor(forecastAll)} />}
        {actualPts.map((p, i) => (
          <circle key={i} className="dot" cx={p.x} cy={p.y} r={hover === i ? 3.4 : 2.2} />
        ))}
        {labels.map((p, i) => {
          const show = n <= 13 || i % 2 === 0;
          if (!show) return null;
          return (
            <text key={`${p.key}-${i}`} x={xAt(i)} y={height - 6} textAnchor="middle">
              {p.key.slice(5)}/{p.key.slice(2, 4)}
            </text>
          );
        })}
        {hover !== null && (
          <>
            <line
              x1={xAt(hover)}
              x2={xAt(hover)}
              y1={pad.t}
              y2={pad.t + innerH}
              stroke="var(--line-strong)"
              strokeDasharray="2 3"
            />
            <circle cx={xAt(hover)} cy={yAt(all[hover].value)} r={4} fill="var(--accent)" />
          </>
        )}
      </svg>
      {hoverPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${(xAt(hover!) / W) * 100}%`,
            top: 2,
            transform: 'translateX(-50%)',
            background: 'var(--ink)',
            color: 'var(--bg)',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 10.5,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {hoverPoint.key} · {money(hoverPoint.value)}
        </div>
      )}
      {showTable && (
        <details style={{ marginTop: 6 }}>
          <summary className="tiny" style={{ cursor: 'pointer', color: 'var(--muted)', listStyle: 'none' }}>
            View as table
          </summary>
          <div className="scroll-x" style={{ marginTop: 6 }}>
            <table className="tbl" style={{ fontSize: 11 }}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th className="right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {all.map((p, i) => (
                  <tr key={`${p.key}-${i}`}>
                    <td className="mono">{p.key}</td>
                    <td className="money">{money(p.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}

export function Sparkline({
  values,
  color = 'var(--ink)',
  height = 28,
  width = 92,
}: {
  values: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * (width - 2) + 1,
    y: height - 2 - ((v - min) / span) * (height - 4),
  }));
  return (
    <svg width={width} height={height} aria-hidden="true" style={{ overflow: 'visible' }}>
      <path
        d={pathFor(pts)}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MonthBars({
  data,
  height = 150,
}: {
  data: { key: string; income: number; outflow: number }[];
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 40, r: 6, t: 10, b: 20 };
  const W2 = 520;
  const innerW = W2 - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const max = Math.max(...data.map((d) => Math.max(d.income, d.outflow)), 1);
  const slot = innerW / Math.max(1, data.length);
  const bw = Math.min(12, slot * 0.28);
  const yAt = (v: number) => pad.t + innerH - (v / max) * innerH;

  return (
    <div style={{ position: 'relative' }}>
      <svg className="chart" viewBox={`0 0 ${W2} ${height}`} role="img" aria-label="Income against spending by month">
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <line key={r} className="gridline" x1={pad.l} x2={W2 - pad.r} y1={yAt(max * r)} y2={yAt(max * r)} />
        ))}
        <line className="axis" x1={pad.l} x2={W2 - pad.r} y1={yAt(0)} y2={yAt(0)} />
        {data.map((d, i) => {
          const cx = pad.l + slot * i + slot / 2;
          return (
            <g key={d.key} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={pad.l + slot * i} y={pad.t} width={slot} height={innerH} fill="transparent" />
              <rect className="bar-soft" x={cx - bw - 1} y={yAt(d.income)} width={bw} height={Math.max(1, yAt(0) - yAt(d.income))} rx={1} />
              <rect className="bar" x={cx + 1} y={yAt(d.outflow)} width={bw} height={Math.max(1, yAt(0) - yAt(d.outflow))} rx={1} />
              <text x={cx} y={height - 5} textAnchor="middle">{d.key.slice(5)}</text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${((pad.l + slot * hover + slot / 2) / W2) * 100}%`,
            top: 0,
            transform: 'translateX(-50%)',
            background: 'var(--ink)',
            color: 'var(--bg)',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          in {compact(data[hover].income)} · out {compact(data[hover].outflow)}
        </div>
      )}
      <div className="legend" style={{ marginTop: 4 }}>
        <span><i style={{ background: 'var(--line-strong)' }} /> Income</span>
        <span><i style={{ background: 'var(--ink)' }} /> Spending</span>
      </div>
    </div>
  );
}

export function CategoryBars({
  data,
  total,
  max = 8,
}: {
  data: { category: string; amount: number; color: string; name: string }[];
  total: number;
  max?: number;
}) {
  const rows = data.slice(0, max);
  const biggest = Math.max(...rows.map((r) => r.amount), 1);
  return (
    <div className="stack-sm">
      {rows.map((r) => (
        <div key={r.category} className="row" style={{ gap: 10 }}>
          <span className="cat-dot" style={{ background: r.color }} />
          <span style={{ width: 108, fontSize: 11.5, flex: 'none' }} className="ellipsis">{r.name}</span>
          <div style={{ flex: 1, height: 7, background: 'var(--surface-3)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${(r.amount / biggest) * 100}%`, height: '100%', background: r.color, opacity: 0.85 }} />
          </div>
          <span className="num" style={{ width: 78, textAlign: 'right', fontSize: 11.5 }}>{money(r.amount)}</span>
          <span className="mono faint" style={{ width: 34, textAlign: 'right', fontSize: 10 }}>
            {total > 0 ? Math.round((r.amount / total) * 100) : 0}%
          </span>
        </div>
      ))}
      {data.length > max && (
        <div className="tiny" style={{ color: 'var(--muted)', paddingTop: 4 }}>
          + {data.length - max} more categories
        </div>
      )}
    </div>
  );
}

export function Donut({
  slices,
  size = 120,
  thickness = 14,
  center,
}: {
  slices: { value: number; color: string; label: string }[];
  size?: number;
  thickness?: number;
  center?: React.ReactNode;
}) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Spending split">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {slices.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            >
              <title>{s.label}</title>
            </circle>
          );
          offset += len;
          return el;
        })}
      </svg>
      {center && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          {center}
        </div>
      )}
    </div>
  );
}

export function ScenarioChart({
  actual,
  baseline,
  scenario,
  height = 260,
}: {
  actual: Point[];
  baseline: Point[];
  scenario: Point[];
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 50, r: 12, t: 16, b: 26 };
  const total = actual.length + Math.max(baseline.length, scenario.length);
  const allVals = [...actual, ...baseline, ...scenario].map((p) => p.value);
  const rawMin = Math.min(...allVals, 0);
  const rawMax = Math.max(...allVals, 1);
  const span = rawMax - rawMin || 1;
  const min = rawMin - span * 0.08;
  const max = rawMax + span * 0.08;
  const innerW = W - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const xAt = (i: number) => pad.l + (i / Math.max(1, total - 1)) * innerW;
  const yAt = (v: number) => pad.t + innerH - ((v - min) / (max - min)) * innerH;

  const actualPts = actual.map((p, i) => ({ x: xAt(i), y: yAt(p.value) }));
  const basePts = baseline.map((p, i) => ({ x: xAt(actual.length - 1 + i), y: yAt(p.value) }));
  const scnPts = scenario.map((p, i) => ({ x: xAt(actual.length - 1 + i), y: yAt(p.value) }));
  const anchor = actual.length ? { x: xAt(actual.length - 1), y: yAt(actual[actual.length - 1].value) } : null;

  const gridVals = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);
  const labels = [...actual, ...baseline];
  const hoverData =
    hover !== null
      ? {
          key: [...actual, ...baseline][hover]?.key ?? '',
          actual: actual[hover]?.value ?? null,
          baseline: baseline[hover - actual.length]?.value ?? null,
          scenario: scenario[hover - actual.length]?.value ?? null,
        }
      : null;

  return (
    <div style={{ position: 'relative' }}>
      <svg
        className="chart"
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-label="Baseline against scenario cash balance"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * W;
          const idx = Math.round(((x - pad.l) / innerW) * (total - 1));
          setHover(Math.max(0, Math.min(total - 1, idx)));
        }}
        onMouseLeave={() => setHover(null)}
      >
        {gridVals.map((v, i) => (
          <g key={i}>
            <line className="gridline" x1={pad.l} x2={W - pad.r} y1={yAt(v)} y2={yAt(v)} />
            <text x={pad.l - 8} y={yAt(v) + 3} textAnchor="end">{compact(v)}</text>
          </g>
        ))}
        {anchor && (
          <>
            <path className="line" d={pathFor([anchor, ...basePts])} style={{ stroke: 'var(--muted)', opacity: 0.55, strokeDasharray: '4 4' }} />
            <path className="line" d={pathFor([anchor, ...scnPts])} style={{ stroke: 'var(--accent)' }} />
          </>
        )}
        {actualPts.length > 1 && <path className="line" d={pathFor(actualPts)} />}
        {actualPts.map((p, i) => <circle key={i} className="dot" cx={p.x} cy={p.y} r={2} />)}
        {labels.map((p, i) =>
          i % 2 === 0 ? (
            <text key={`${p.key}-${i}`} x={xAt(i)} y={height - 7} textAnchor="middle">{p.key.slice(5)}/{p.key.slice(2, 4)}</text>
          ) : null
        )}
        {hover !== null && (
          <>
            <line x1={xAt(hover)} x2={xAt(hover)} y1={pad.t} y2={pad.t + innerH} stroke="var(--line-strong)" strokeDasharray="2 3" />
            {hoverData?.baseline != null && <circle cx={xAt(hover)} cy={yAt(hoverData.baseline)} r={3} fill="var(--muted)" />}
            {hoverData?.scenario != null && <circle cx={xAt(hover)} cy={yAt(hoverData.scenario)} r={3.6} fill="var(--accent)" />}
          </>
        )}
      </svg>
      {hoverData && (
        <div style={{ position: 'absolute', left: `${(xAt(hover!) / W) * 100}%`, top: 0, transform: 'translateX(-50%)', background: 'var(--ink)', color: 'var(--bg)', padding: '5px 9px', borderRadius: 4, fontSize: 10, fontFamily: 'var(--font-mono)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 2 }}>
          {hoverData.key}{hoverData.scenario != null ? ` · scenario ${compact(hoverData.scenario)}` : ''}{hoverData.baseline != null ? ` · base ${compact(hoverData.baseline)}` : ''}
        </div>
      )}
      <details style={{ marginTop: 6 }}>
        <summary className="tiny" style={{ cursor: 'pointer', color: 'var(--muted)', listStyle: 'none' }}>View the month-by-month table</summary>
        <div className="scroll-x" style={{ marginTop: 6 }}>
          <table className="tbl" style={{ fontSize: 11 }}>
            <thead><tr><th>Month</th><th className="right">Baseline</th><th className="right">Scenario</th></tr></thead>
            <tbody>
              {baseline.map((b, i) => (
                <tr key={b.key}>
                  <td className="mono">{b.key}</td>
                  <td className="money">{money(b.value)}</td>
                  <td className={`money ${(scenario[i]?.value ?? 0) >= b.value ? 'pos' : 'neg'}`}>{money(scenario[i]?.value ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export function useMoneyTicker() {
  return useMemo(() => ({ money, compact }), []);
}
