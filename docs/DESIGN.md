# DESIGN.md: Baseline UI/UX spec

Extracted from the OpenCode session. **Source of truth is `src/styles.css` in the repo.** This file is a readable copy.
Later small edits in OpenCode may have tweaked values, so if they differ, trust the CSS file.

## Principles (do not change)
- Warm paper palette with an amber accent. **No navy/purple, no gradients, no glass cards, no emoji icons.**
- Hairline borders instead of heavy shadows. 6px radius (10px for large surfaces). Dense dashboard layout (density 8/10, motion 4/10).
- Fonts: IBM Plex Sans (UI), IBM Plex Mono (all numbers, tabular, uppercase micro-labels), Newsreader italic (editorial accents only).
- Charts are hand-built SVG, no chart library. Solid line for actual, dashed for forecast, direct labels.
- Layout: 232px left rail (CSS var says 236px), top bar, ⌘K command palette, mobile nav sheet, light + dark themes, print styles, reduced-motion support.
- Contrast 4.5:1 for text, visible focus ring, keyboard navigation.

## Colour tokens (light, from styles.css)
```css
:root {
  --bg: #f3f1eb;
  --bg-deep: #ece9e1;
  --surface: #fbf9f4;
  --surface-2: #f6f3ec;
  --surface-3: #efebe2;
  --ink: #14171a;
  --ink-2: #3c4148;
  --muted: #686d75;
  --faint: #8b8f96;
  --line: #e0dbd0;
  --line-strong: #c9c2b3;
  --accent: #a9621a;
  --accent-ink: #fffaf2;
  --accent-soft: #f0e2cc;
  --positive: #26624a;
  --positive-soft: #dce9e1;
  --negative: #9c3a29;
  --negative-soft: #f2e0db;
  --info: #38556f;
  --info-soft: #dee7ee;
  --focus: #a9621a;
  --shadow-sm: 0 1px 0 rgba(20, 23, 26, 0.04);
  --shadow-md: 0 10px 30px -18px rgba(20, 23, 26, 0.35);
  --shadow-lg: 0 24px 60px -24px rgba(20, 23, 26, 0.45);
  --radius: 6px;
  --radius-lg: 10px;
  --rail: 236px;
  --font-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace;
  --font-serif: 'Newsreader', Georgia, serif;
  color-scheme: light;
}
:root { --rail: 208px; }
:root { --line: #a8a296; --line-strong: #7c766a; --muted: #4a4f57; }
```

## Dark theme tokens
```css
[data-theme='dark'] {
  --bg: #121416;
  --bg-deep: #0d0f10;
  --surface: #191c1f;
  --surface-2: #1e2225;
  --surface-3: #252a2e;
  --ink: #f1eee7;
  --ink-2: #d3cec4;
  --muted: #a3a099;
  --faint: #7f7c76;
  --line: #2c3135;
  --line-strong: #3d4348;
  --accent: #e0a659;
  --accent-ink: #1a1206;
  --accent-soft: #33271565;
  --positive: #7cb79a;
  --positive-soft: #1d3329;
  --negative: #dd8a76;
  --negative-soft: #33211d;
  --info: #8fb0c9;
  --info-soft: #1c2a33;
  --focus: #e0a659;
  --shadow-sm: 0 1px 0 rgba(0, 0, 0, 0.2);
  --shadow-md: 0 12px 34px -20px rgba(0, 0, 0, 0.8);
  --shadow-lg: 0 30px 70px -30px rgba(0, 0, 0, 0.9);
  color-scheme: dark;
}
```

## Fonts
```css
```

## Original plan palette (before implementation, slightly different hex values)
- paper #F6F4EF, ink #14171A, hairline #E3DED4, amber accent #B4711E, positive #2F6B4F, negative #A6402D, dark bg #14171A (warm charcoal).

## Note on the design-skill output
The `ui-ux-pro-max` search suggested a navy + purple (#0F172A / #8B5CF6) 'Ledgerly' palette. OpenCode deliberately **rejected** it. Do not use it.