# HANDOFF: Baseline (personal finance coach, hackathon)

Moved from OpenCode to Antigravity because OpenCode hit its free usage limit mid-build.
Full detail is in `docs/opencode-session.md`. This file is the short version.

## Goal
Hackathon web app: a personal finance coach with a "living money model".
Must have: messy statement ingestion (PDF/CSV/SMS) with auto-categorization, a correction loop that learns rules,
recurring/subscription detection with alerts, a persistent profile (income, fixed costs, emergency fund, goals with dates),
a what-if goal simulator, drift nudges, a monthly review report, and guardrails (educate and model scenarios, never recommend securities).
User wants 20-25+ features, every button working, polished UI that is not "AI slop", and the `ui-ux-pro-max` skill used for UI/UX.

## Decisions (already made, keep them)
- Product name: **Baseline**. Locale: **INR (₹, lakh/crore)**, Indian banks and merchants.
- Hero feature: **What-if Simulator**. Second signature feature: correction/learning loop.
- Stack: **React + Vite + TypeScript**. Use `npm.cmd` on this machine (PowerShell blocks `npm.ps1`).
- Hash router (`src/lib/router.ts`) so a static build works from `file://`.
- One Context + `useReducer` store, persisted to localStorage key `baseline.state.v1`, with reset and undo.
- Design: warm paper + amber palette (no navy/purple, no gradients, no shadows on panels), IBM Plex Sans/Mono + Newsreader italic,
  6px radii, hairlines, hand-built SVG charts (no chart library), light/dark tokens.
- Screens: Overview, Inbox, Transactions, Rules, Recurring, Plan, Simulate, Review, Coach, Settings, plus a ⌘K palette.
- Seed persona: Ananya Rao, Bengaluru, salary ₹1,42,000, rent ₹42,000, 6 months of deterministic transactions. System date is 2026-10-31.
- Safe-to-spend = balance − emergency fund − goal savings − next 30 days of bills − ₹15,000 buffer.
- All coach and report copy stays scenario-modelling only. A guardrail disclosure must stay visible on Simulate and Review.

## Done
- Project scaffolded in `hack2/`. Domain engine, seed data, store, design system CSS, shared components and charts are written.
- All 10 screens, `App.tsx`, `main.tsx` and `scripts/make-sample-pdf.mjs` exist. The sample PDF was generated.
- Last results in the OpenCode log: `npm.cmd run build` passed (tsc + vite), `npm.cmd test` passed (26/26), dev server ran on port 5173.

## In progress when it stopped
- Browser QA sweep, route by route. It was inside the Transactions screen testing the correction → learned-rule flow
  (recategorizing "Truffles" from Other to Dining).
- Something to double-check there: after the correction, the toast said "The existing rule was updated", but the log showed a
  brand-new learned rule (`TRUFFLES ST MARKS ROAD`) with 0 hits. It may be a wrong toast message or a rule that isn't matching later.
  I did not confirm either way.

## Left to do
1. Re-run `npm.cmd run build` and `npm.cmd test` to confirm the current state is still green.
2. Finish the click-every-button sweep on all routes. Check the browser console, 1440px and 375px widths, dark mode, and print.
3. Check the correction → rule → retro-apply flow end to end (see above).
4. Write `QA.md` (a matrix of feature, tested, result) and fix any defects found.
5. Clean-up candidates: unused `useMoneyTicker` export in `charts.tsx`, unused imports in Inbox and Rules, duplicate `CATEGORY_MAP` imports in Rules.

## How to continue
Check `git status` first (or just read the files). Do not rewrite finished parts.
Start with step 1, report what you find, then continue with the QA sweep.
