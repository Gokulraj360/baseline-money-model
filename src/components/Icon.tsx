import React from 'react';

type IconName =
  | 'grid' | 'inbox' | 'receipt' | 'repeat' | 'target' | 'sliders' | 'file' | 'compass'
  | 'settings' | 'search' | 'sun' | 'moon' | 'plus' | 'upload' | 'download' | 'check'
  | 'x' | 'chevronRight' | 'chevronDown' | 'chevronLeft' | 'alert' | 'info' | 'trash'
  | 'pencil' | 'calendar' | 'filter' | 'undo' | 'shield' | 'printer' | 'arrowUpRight'
  | 'arrowDownRight' | 'split' | 'copy' | 'more' | 'clock' | 'wallet' | 'lock'
  | 'external' | 'spark' | 'trendUp' | 'trendDown' | 'bell' | 'user' | 'refresh' | 'eye' | 'eyeOff';

const PATHS: Record<IconName, React.ReactNode> = {
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="13.5" width="7" height="7" rx="1" /></>,
  inbox: <><path d="M3.5 13.5h4l1.6 2.6h5.8l1.6-2.6h4" /><path d="M5.6 4.5h12.8l2.1 9v4a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2v-4z" /></>,
  receipt: <><path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  repeat: <><path d="M17 2.5l3 3-3 3" /><path d="M4 11V9a3.5 3.5 0 0 1 3.5-3.5H20" /><path d="M7 21.5l-3-3 3-3" /><path d="M20 13v2a3.5 3.5 0 0 1-3.5 3.5H4" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  sliders: <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2.2" /><circle cx="10" cy="17" r="2.2" /></>,
  file: <><path d="M6 3.5h8l4 4v13H6z" /><path d="M14 3.5v4h4" /><path d="M9 12h6M9 16h6" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="M15.2 8.8l-2 4.4-4.4 2 2-4.4z" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.4M12 18.8v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.4 15.4L21 21" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>,
  moon: <><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  upload: <><path d="M12 16V4M7.5 8.5L12 4l4.5 4.5" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>,
  download: <><path d="M12 4v12M7.5 11.5L12 16l4.5-4.5" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>,
  check: <><path d="M4.5 12.5l5 5 10-11" /></>,
  x: <><path d="M6 6l12 12M18 6L6 18" /></>,
  chevronRight: <path d="M9.5 5.5l6.5 6.5-6.5 6.5" />,
  chevronDown: <path d="M5.5 9.5l6.5 6.5 6.5-6.5" />,
  chevronLeft: <path d="M14.5 5.5L8 12l6.5 6.5" />,
  alert: <><path d="M12 3.8L21 20H3z" /><path d="M12 9v5" /><circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><circle cx="12" cy="8" r=".9" fill="currentColor" stroke="none" /></>,
  trash: <><path d="M4 6.5h16M9.5 6.5V4h5v2.5M6.5 6.5l1 13h9l1-13" /><path d="M10 10.5v5M14 10.5v5" /></>,
  pencil: <><path d="M4 20l.8-4.2L16.3 4.3a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.2 19.2z" /><path d="M14.5 6.5l3 3" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="1.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>,
  filter: <path d="M3.5 5.5h17l-6.5 7.5v6l-4 2v-8z" />,
  undo: <><path d="M4 9.5h9a5.5 5.5 0 0 1 0 11H8" /><path d="M8 5L4 9.5 8 14" /></>,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.3 7.8-8 9-4.7-1.2-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4.5" /></>,
  printer: <><path d="M7 8V3.5h10V8" /><rect x="3.5" y="8" width="17" height="8" rx="1.5" /><path d="M7 13.5h10v7H7z" /></>,
  arrowUpRight: <><path d="M7 17L17 7M8 7h9v9" /></>,
  arrowDownRight: <><path d="M7 7l10 10M17 8v9H8" /></>,
  split: <><path d="M12 3v6M12 15v6" /><path d="M6 21v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" /><circle cx="12" cy="12" r="3" /></>,
  copy: <><rect x="8.5" y="8.5" width="12" height="12" rx="1.5" /><path d="M15.5 8.5v-3a1.5 1.5 0 0 0-1.5-1.5H5a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 5 16h3" /></>,
  more: <><circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.4l3.4 2" /></>,
  wallet: <><path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12.5v3" /><rect x="3.5" y="7.5" width="17" height="12" rx="2" /><path d="M15.5 13.5h2.5" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="1.5" /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" /></>,
  external: <><path d="M14 4h6v6M20 4l-8 8" /><path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" /></>,
  spark: <><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" /></>,
  trendUp: <><path d="M3.5 17l6-6 4 4 7-7.5" /><path d="M15 7.5h5.5V13" /></>,
  trendDown: <><path d="M3.5 7l6 6 4-4 7 7.5" /><path d="M15 16.5h5.5V11" /></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M20 3.5V8h-4.5" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 6.1A8.9 8.9 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-3 3.7M6.4 6.9A15.4 15.4 0 0 0 2.5 12S6 18 12 18c1.2 0 2.3-.2 3.3-.6" /></>,
};

export type { IconName };

export function Icon({
  name,
  size = 16,
  strokeWidth = 1.6,
  className,
  style,
  'aria-hidden': ariaHidden = true,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  'aria-hidden'?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden={ariaHidden}
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
