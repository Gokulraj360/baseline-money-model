export const pad = (n: number): string => String(n).padStart(2, '0');

export const toISO = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISO = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export const todayISO = (): string => toISO(new Date());

export const monthKey = (iso: string): string => iso.slice(0, 7);

export const monthLabel = (key: string, short = false): string => {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString('en-IN', {
    month: short ? 'short' : 'long',
    year: 'numeric',
  });
};

export const monthLabelShort = (key: string): string => {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'short' });
};

export const addMonths = (key: string, n: number): string => {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
};

export const addDays = (iso: string, n: number): string => {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

export const daysBetween = (a: string, b: string): number =>
  Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);

export const daysInMonth = (key: string): number => {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m, 0).getDate();
};

export const friendlyDate = (iso: string): string => {
  const d = parseISO(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const friendlyDateLong = (iso: string): string => {
  const d = parseISO(iso);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
};

export const relativeDays = (iso: string): string => {
  const diff = daysBetween(todayISO(), iso);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff === -1) return 'yesterday';
  if (diff > 1) return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
};

export const monthRange = (start: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => addMonths(start, i));

export const quarterOf = (key: string): string => {
  const [y, m] = key.split('-').map(Number);
  return `${y}-Q${Math.floor((m - 1) / 3) + 1}`;
};

export const nowMonth = (): string => todayISO().slice(0, 7);
