const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const inrPrecise = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export const money = (n: number, precise = false): string => {
  const v = Math.abs(n) < 0.005 ? 0 : n;
  return (precise ? inrPrecise : inr).format(v);
};

export const moneySigned = (n: number, precise = false): string => {
  if (Math.abs(n) < 0.005) return money(0, precise);
  return `${n > 0 ? '+' : '−'}${money(Math.abs(n), precise)}`;
};

export const num = (n: number): string => new Intl.NumberFormat('en-IN').format(n);

export const pct = (n: number, digits = 0): string =>
  `${n > 0 ? '' : ''}${n.toFixed(digits)}%`;

export const compact = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${(n / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`;
  return `${Math.round(n)}`;
};

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, n));

export const round = (n: number, step = 1): number => Math.round(n / step) * step;
