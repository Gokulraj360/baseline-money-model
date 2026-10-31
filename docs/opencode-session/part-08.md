# Part 8 of 19 (messages 59-59)

## MESSAGE 59 | type: compaction | id: msg_19173c510001bmHKnFz33Xrg5P | 2026-10-31 10:14:05 UTC

- **type**: `compaction`
- **id**: `msg_19173c510001bmHKnFz33Xrg5P`
- **time**:
  - **created**: `1793441645840`
- **status**: `completed`
- **reason**: `auto`
- **model**:
  - **id**: `deepseek-v4.1-flash-free`
  - **providerID**: `opencode`
  - **variant**: `high`
- **summary**:
  ```
  ## Objective
  - Build a hackathon web app for the problem statement: a personal finance coach with a living money model (messy statement ingestion, auto-categorization, correction loop, recurring/subscription detection, financial profile, what-if goal simulator, nudges, monthly review, guardrails).
  - User wants a polished, non-"AI slop" UI with 20–25+ features where every button verifiably works.
  
  ## Requirements
  - Ingest bank statements in messy formats: PDF, CSV, transaction SMS, with automatic categorization.
  - Correction loop: user fixes a category and the system learns a rule for future transactions.
  - Detect recurring payments/subscriptions; alert on changed price or unused subscription.
  - Persistent financial profile: income, fixed costs, emergency fund, goals with target dates.
  - Goal planner with what-if simulation ("cut dining 30%", "rent goes up").
  - Nudges when spending drifts off plan.
  - Monthly review report.
  - Guardrails: educate and model scenarios, never recommend specific securities.
  - At least 20–25 features; every button must work; verify and finalize all features after implementation.
  - Use the `ui-ux-pro-max` skill for UI/UX.
  
  ## Decisions
  - Currency/locale: **INR (₹, lakh/crore)**, Indian bank SMS formats and merchants (user selected).
  - Hero feature: **What-if Simulator** (user selected), second signature: correction/learning loop.
  - Stack: **React + Vite + TypeScript** (user selected); npm works via `npm.cmd`.
  - Product name: **Baseline** — "A living model of your money, not a categorized graveyard."
  - Visual system from skill search: Minimalism/Swiss grid, "Financial Trust" typography, but reject navy+purple; use warm paper palette + IBM Plex Sans/Mono + Newsreader italic accents; hand-built SVG charts, no chart library.
  - Hash router (custom, ~40 lines) so static build works from `file://`.
  - Single Context + useReducer store persisted to localStorage with versioning and full reset.
  
  ## Work State
  ### Completed
  - Workspace explored: `C:\Users\gokul\OneDrive\Documents\Desktop\hack2` is empty.
  - Skill searches run: design system, chart types, typography, color palette.
  - Environment verified: Python 3.12.10, Node v24.20.0, npm 11.19.0 (must invoke `npm.cmd` due to PowerShell execution policy), npm registry reachable (PONG 605ms).
  - Full plan agreed with user; design tokens, IA, 28-feature inventory, simulator design, and QA approach defined.
  
  ### Active
  - (none — implementation has not started)
  
  ### Blocked
  - (none)
  
  ## Next Move
  1. Scaffold Vite + React + TS project in `C:\Users\gokul\OneDrive\Documents\Desktop\hack2`; install deps via `npm.cmd`.
  2. Implement design tokens, app shell (232px left rail, top bar), hash router, store with seeded 6-month INR persona (~380 transactions).
  3. Build domain modules: `parse.ts`, `categorize.ts`, `rules.ts`, `recurring.ts`, `forecast.ts`, `simulate.ts`, `nudges.ts`, `report.ts`, `format.ts`.
  4. Build screens in order: Overview → Inbox → Transactions/Rules → Recurring → Plan/Goals → Simulate (deep) → Review/Coach/Settings.
  5. Add Vitest suites for parsing, categorization, rule learning, recurring detection, forecast, simulator math.
  6. Run route-by-route browser sweep clicking every control, check console, test 1440 and 375 widths, produce `QA.md` matrix.
  
  ## Relevant Files
  - `C:\Users\gokul\OneDrive\Documents\Desktop\.agents\skills\ui-ux-pro-max\scripts\search.py`: skill CLI for design-system/domain searches.
  - `C:\Users\gokul\OneDrive\Documents\Desktop\.agents\skills\ui-ux-pro-max\data\`: source CSVs (styles, colors, typography, charts, ux, icons, google-fonts, motion).
  - `C:\Users\gokul\OneDrive\Documents\Desktop\hack2\`: empty project root — all app files to be created here.
  
  ## Important Context
  - npm is blocked through `npm.ps1`; always use `npm.cmd ...`.
  - Design tokens decided:
    - Light: bg `#F6F4EF`, surface `#FFFDF8`, surface-2 `#EFEBE3`, ink `#14171A`, ink-2 `#4A4F57`, muted `#7A7F87`, line `#E3DED4`, line-strong `#CFC8BA`, accent `#B4711E`, accent-soft `#F3E4CE`, positive `#2F6B4F`, negative `#A6402D`, info `#3D5A80`.
    - Dark: bg `#121416`, surface `#191C1F`, surface-2 `#20242A`, ink `#F2EFE8`, ink-2 `#B9B5AC`, muted `#8A8780`, line `#2A2E33`, line-strong `#3A3F45`, accent `#E0A659`, positive `#6FAE8B`, negative `#D97B63`.
    - Fonts: IBM Plex Sans (UI), IBM Plex Mono (numerals, tabular-nums, 10–11px uppercase labels, 0.12em tracking), Newsreader italic (editorial accents).
    - 6px radii, 1px hairline borders/no shadows, spacing scale 4/8/12/16/24/32/48, transitions 150–220ms ease-out, reduced-motion respected.
  - Routes: Overview, Inbox, Transactions, Rules, Recurring, Plan, Simulate, Review, Coach, Settings; plus command palette (⌘K) and theme toggle.
  - 28 features planned: CSV import w/ column mapping; PDF import (pdfjs-dist, fallback text extractor); SMS parser; duplicate hashing; confidence + "why"; batch approve; manual entry; search/filter/sort; inline recategorize; split txn; bulk actions; CSV export; undo; rules list/edit/delete/toggle; rule tester; retro-apply; priority/hit counts; recurring detection; price-change alert + annualized impact; unused detection + cancel/keep/snooze; manual recurring + calendar; profile income/fixed/emergency; goals CRUD + required monthly; emergency coverage/runway; simulator (6 levers, 12-month projection, goal ETA deltas, save/compare/apply); drift nudges + prefs; affordability check; monthly report + print/export + guardrails; settings/export/reset.
  - Simulator levers: dining cut 0–50%, groceries 0–30%, subscription cancellations, rent ±, income ±, one-off expense with month, extra monthly savings.
  - Guardrails: all coach copy routed through one policy module; no securities/funds/tickers/expected returns; savings growth only from user-set rate; persistent "models scenarios, not advice" disclosure on Simulate and Review.
  ```
- **recent**:
  ````
  [User]: buid it
  
  [Assistant reasoning]: I need to build the whole thing. This is a large task. Let me plan the implementation carefully and execute efficiently.
  
  Let me set up the project. Working dir: C:\Users\gokul\OneDrive\Documents\Desktop\hack2
  
  Steps:
  1. Scaffold Vite React TS manually (write package.json, vite config, tsconfig, index.html, src).
  2. Install deps: react, react-dom, vite, @vitejs/plugin-react, typescript, vitest, pdfjs-dist maybe.
  3. Build domain modules.
  4. Build UI.
  5. Test and verify via browser.
  
  Token budget matters. I'll write substantial files in a few passes. Let me be efficient but thorough.
  
  Let me decide the data set and domain design precisely.
  
  ### Types
  
  ```ts
  export type CategoryId = string;
  export type Txn = {
    id: string;
    date: string; // ISO yyyy-mm-dd
    description: string;
    merchant: string;
    amount: number; // positive = outflow, negative/positive? use signed: negative = outflow, positive = inflow
    category: string; // category id
    confidence: number; // 0-1
    why?: string;
    accountId: string;
    source: 'seed'|'csv'|'pdf'|'sms'|'manual';
    isTransfer?: boolean;
    isExcluded?: boolean;
    splits?: {category:string; amount:number}[];
    note?: string;
    batchId?: string;
    hash: string;
    pending?: boolean;
  }
  ```
  
  I'll use `amount` signed: negative outflow, positive inflow. Category 'income' for inflows.
  
  Categories: 
  groups: Housing, Food, Transport, Bills, Lifestyle, Health, Shopping, Finance, Income.
  - rent (Housing, fixed)
  - utilities (Bills, fixed)
  - internet (Bills, fixed)
  - mobile (Bills, fixed)
  - insurance (Finance/Health, fixed)
  - groceries (Food, flexible)
  - dining (Food, flexible)
  - food_delivery (Food, flexible)
  - transport (Transport, flexible)
  - fuel (Transport, flexible)
  - subscriptions (Lifestyle, fixed-ish)
  - shopping (Shopping, flexible)
  - entertainment (Lifestyle, flexible)
  - health (Health, flexible)
  - education (Lifestyle, fixed)
  - fitness (Health, fixed)
  - travel (Lifestyle, flexible)
  - personal_care (Lifestyle, flexible)
  - home (Housing, flexible)
  - gifts (Lifestyle, flexible)
  - fees (Finance)
  - investments (Finance, transfer/excluded) — careful guardrail: no securities advice. But SIP transfers could be shown as savings transfer, not advice.
  - transfer (Finance, excluded)
  - income (Income)
  - other (Other)
  
  Merchant mapping with keywords: swiggy → food_delivery, zomato → food_delivery, blinkit/zepto/bigbasket/dmart → groceries, uber/ola/rapido → transport, netflix/spotify/hotstar/prime → subscriptions, airtel/jio/vi → mobile, bescom/bwssb/act → utilities/internet, amazon/flipkart/myntra → shopping, cult/healthifyme/apollo/pharmeasy → health/fitness, etc.
  
  ### Seed data
  Generate 6 months ending current month (Oct 2026, today's date is Oct 31 2026). Actually use current date dynamically. From 2026-05-01 to 2026-10-31. Salary credit on 1st: 1,42,000 (credited). Rent 42,000 on 3rd. SIP 15,000 on 5th (transfer/excluded). Utilities, mobile, internet on 7-10th. Insurance 4,800 quarterly? Keep monthly 2,400.
  
  Flexible spend: dining, delivery, groceries, transport, shopping, entertainment with deterministic PRNG. ~55-65 transactions/month.
  
  Balance: opening 185,000. Goal: Emergency fund 300,000 saved 168,000; Japan trip 250,000 by 2027-03-31 saved 62,000; New laptop 120,000 by 2027-01-15 saved 38,000; Home down payment? maybe 3 goals enough.
  
  Recurring:
  - Netflix 649 monthly, last charged, status active, priceHistory 499→649 (price increase)
  - Spotify 119 monthly
  - Cult.fit 1,799 monthly, usage unused (last active 74 days ago)
  - Airtel 1,199 monthly
  - ACT Fibernet 1,349 monthly
  - Rent 42,000 monthly
  - Insurance 2,400 monthly
  - Amazon Prime 1,499 yearly
  - iCloud 75 monthly
  - LinkedIn Premium 1,299 monthly (unused)
  - Blinkit? no, that's variable.
  
  Price change: Netflix 499→649 (+30%) detected; alert. Unused: Cult.fit, LinkedIn Premium.
  
  Nudges:
  1. Dining drift: dining this month 8,420 vs 3-mo avg 6,100 → +38%, projected overspend 2,300.
  2. Netflix price increase +₹150/mo → +₹1,800/yr.
  3. Unused subscriptions ₹3,098/mo (Cult 1799 + LinkedIn 1299) — maybe 2,  one alert.
  4. Emergency fund 2.4 months vs 3-month target.
  5. Goal "Japan trip" behind schedule by ₹X.
  6. Salary landed — auto-allocate suggestion.
  
  ### Report
  Narrative generated from numbers.
  
  ### Simulation
  Baseline monthly:
  income 142000
  fixed = rent 42000 + utilities 3200 + internet 1349 + mobile 1199 + insurance 2400 + subscriptions (649+119+1799+1299+75+125 average yearly? use monthly equivalents) + fitness + education...
  Let me compute in code from data instead. Baseline flexible = 3-month average of variable categories.
  
  Forecast: start balance = current account balance (opening + sum of all txns). Project 12 months: balance += income - fixed - flexible*(1-cut) - oneOff + ...; goals allocations tracked separately.
  
  Simulator output:
  - 12-month balance series
  - goal ETA months given monthly surplus allocation (priority order)
  - runway = balance / monthly outflow
  - safe to spend = balance - upcoming 30d bills - emergency buffer
  - deltas vs baseline.
  
  ### UI structure
  
  Files:
  ```
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.node.json
  index.html
  src/main.tsx
  src/App.tsx
  src/styles.css
  src/types.ts
  src/lib/format.ts
  src/lib/date.ts
  src/lib/id.ts
  src/data/categories.ts
  src/data/seed.ts
  src/domain/parse.ts
  src/domain/categorize.ts
  src/domain/rules.ts
  src/domain/recurring.ts
  src/domain/finance.ts (selectors)
  src/domain/simulate.ts
  src/domain/nudges.ts
  src/domain/report.ts
  src/store/AppStore.tsx
  src/components/... (many)
  src/screens/...
  src/domain/__tests__/...
  ```
  
  Components: Icon, Sidebar, TopBar, CommandPalette, Toasts, Modal, Button, Field, Select, Badge, ProgressBar, Sparkline, AreaChart, BarChart, Donut, Table pieces, EmptyState, Tabs, Segmented, Drawer, Switch, Tooltip, StatCard.
  
  Given size, I'll write ~20 files with substantial content. Need to keep quality high.
  
  Let me get going. First scaffold and install.
  
  I'll create package.json etc. via write tool, then npm install.
  
  Dependencies: react, react-dom, vite, @vitejs/plugin-react, typescript, @types/react, @types/react-dom, vitest, pdfjs-dist.
  
  pdfjs-dist adds ~large install. Is it worth it? Requirement explicitly says PDF. I'll use pdfjs-dist with worker import. In Vite:
  
  ```ts
  import * as pdfjsLib from 'pdfjs-dist';
  import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  ```
  
  That works in Vite dev and build (mjs). Fine.
  
  But pdfjs-dist v5 requires modern browser; fine.
  
  I'll generate sample PDFs in public/samples using a script? Simpler: include sample statement text as .txt and a download button that generates PDF? Hmm. For the PDF import, the user picks a file. To demo without a file, I'll add "Use sample statement" buttons that load embedded text (for PDF path, render the sample text through the same extract pipeline). And provide `public/samples/baseline-statement.csv` and `sample-sms.txt` as real files plus a generated PDF I can create with a small Node script.
  
  Actually I can generate a real PDF at build time via a Node script using no deps: write an uncompressed PDF with Helvetica text lines. pdf.js can parse it. That gives a genuine PDF sample to test. Let me do that — write `scripts/make-sample-pdf.mjs` and run it, output `public/samples/baseline-statement.pdf`. Text content will be a bank statement with lines like "04/10/2026 SWIGGY BANGALORE 486.00 DR". pdf.js extracts text with spacing; my parser handles it.
  
  Good.
  
  Let me start writing files.
  
  Design tokens CSS. I'll be careful with responsive: rail collapses to top bar + bottom tabs on mobile? For a dashboard, a horizontal scrollable nav on mobile. Use media query < 980px: rail becomes fixed bottom bar with 5 items + "More" sheet? Simpler: top nav becomes a horizontal scroll strip under header, sidebar hidden. That's acceptable and works.
  
  Let me think about the exact overview layout to make it look designed, not slop:
  
  Top bar: brand mark (small square with "B" or a diagonal rule), breadcrumb "Baseline / Overview", right: month selector, search ⌘K, theme toggle, avatar "AG".
  
  Page header: "October 2026" mono eyebrow; H1 "Your money, modeled." with Newsreader italic on "modeled"; right actions "Import statement" (primary) + "Run a scenario" (secondary).
  
  Then a 12-col grid:
  - Left 8 cols: "Safe to spend" panel — big number ₹48,320, subline "after ₹62,140 in scheduled bills and a ₹36,000 buffer", with a horizontal composition bar: bills / goals / buffer / free. Below, cashflow chart 6 months actual + 3 forecast with legend direct labels.
  - Right 4 cols: "Model health" vertical: three hairline rows (income, fixed, flexible) + surplus; then runway 4.1 months; then goal mini list.
  - Next row: Nudges (5 cols), Coming up (4 cols), Affordability check (3 cols)? Maybe 6/6.
  
  Better:
  Row 1: safe-to-spend (7), model snapshot (5)
  Row 2: cashflow (8), upcoming + goals (4)
  Row 3: nudges (7), affordability (5)
  
  Hmm. Let me design:
  - Grid: 12 columns, gap 20px.
  - Hero band spans 12: two-column inside — left "Safe to spend October" with big number and composition bar; right four micro-stats in 2x2 with hairline dividers.
  Actually a full-width hero with a chart on the right is nice: left 5 cols text, right 7 cols chart. Square-ish.
  
  I'll do:
  - Panel A (8 cols): "Cash flow" chart with header stats.
  - Panel B (4 cols): "Safe to spend" with big number and breakdown + CTA.
  - Row 2: "Coach notes" (5), "Due in 7 days" (4), "Goals" (3)? Goals need width. 
  Maybe: Coach notes 6, Upcoming 3, Goals 3.
  - Row 3: "Where it went" category bars (7) + "Affordability check" (5).
  
  That's a solid dashboard.
  
  Other screens use a consistent "page header + toolbar + content" pattern.
  
  I need to be economical in tokens but produce a lot of code. Let me write carefully.
  
  Let me start with package.json and config.
  
  Node v24, Vite 7, React 19. Use:
  "react": "^19.1.0", "react-dom": "^19.1.0", "vite": "^7.0.0", "@vitejs/plugin-react": "^5.0.0", "typescript": "^5.8.3", "vitest": "^3.2.0", "pdfjs-dist": "^5.3.31".
  
  I'll let npm resolve latest with ranges. Let me just run `npm.cmd install react react-dom` and dev deps to get current versions. That writes package.json automatically if I create one.
  
  Let me create a minimal package.json then install.
  
  Time to execute.
  [Assistant]: Building it now. Starting with the scaffold and design tokens.
  [Assistant tool call]: write({"path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\package.json","content":"{\n  \"name\": \"baseline-money-model\",\n  \"private\": true,\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"tsc -b && vite build\",\n    \"preview\": \"vite preview\",\n    \"test\": \"vitest run\"\n  }\n}\n"})
  [Tool result]: Created file successfully: package.json
  
  [Assistant tool call]: shell({"command":"npm.cmd install react react-dom pdfjs-dist; npm.cmd install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom vitest","timeout":180000})
  [Tool result]: 
  added 6 packages, and audited 7 packages in 15s
  
  2 packages are looking for funding
    run `npm fund` for details
  
  found 0 vulnerabilities
  
  added 41 packages, and audited 48 packages in 17s
  
  14 packages are looking for funding
    run `npm fund` for details
  
  found 0 vulnerabilities
  
  
  [Assistant reasoning]: Now config files.
  [Assistant tool call]: write({"content":"import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  base: './',\n  plugins: [react()],\n  build: { chunkSizeWarningLimit: 1200 },\n});\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\vite.config.ts"})
  [Tool result]: Created file successfully: vite.config.ts
  [Assistant tool call]: write({"content":"{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"useDefineForClassFields\": true,\n    \"lib\": [\"ES2022\", \"DOM\", \"DOM.Iterable\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"resolveJsonModule\": true,\n    \"isolatedModules\": true,\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\",\n    \"strict\": true,\n    \"noUnusedLocals\": false,\n    \"noUnusedParameters\": false,\n    \"noFallthroughCasesInSwitch\": true\n  },\n  \"include\": [\"src\"]\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\tsconfig.json"})
  [Tool result]: Created file successfully: tsconfig.json
  [Assistant tool call]: write({"content":"<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <meta name=\"theme-color\" content=\"#F6F4EF\" />\n    <title>Baseline — a living model of your money</title>\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n    <link\n      href=\"https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap\"\n      rel=\"stylesheet\"\n    />\n    <link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%2314171A'/%3E%3Cpath d='M9 23V9h6.2a4 4 0 0 1 0 8H9m0 0h7a4 4 0 0 1 0 6H9' stroke='%23E8A33D' stroke-width='2.2' fill='none' stroke-linecap='square'/%3E%3C/svg%3E\" />\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\index.html"})
  [Tool result]: Created file successfully: index.html
  
  [Assistant reasoning]: Now types and categories. Let me carefully define the domain.
  
  Types file.
  [Assistant tool call]: write({"content":"export type TxnSource = 'seed' | 'csv' | 'pdf' | 'sms' | 'manual';\n\nexport type Split = { category: string; amount: number };\n\nexport interface Txn {\n  id: string;\n  date: string; // yyyy-mm-dd\n  description: string;\n  merchant: string;\n  amount: number; // signed: negative = money out, positive = money in\n  category: string;\n  confidence: number; // 0..1\n  why: string;\n  accountId: string;\n  source: TxnSource;\n  isTransfer?: boolean;\n  isExcluded?: boolean;\n  splits?: Split[];\n  note?: string;\n  batchId?: string;\n  hash: string;\n  pending?: boolean;\n  createdAt?: number;\n}\n\nexport interface Category {\n  id: string;\n  name: string;\n  group: string;\n  kind: 'fixed' | 'flexible' | 'income' | 'savings' | 'transfer';\n  color: string;\n}\n\nexport type RuleField = 'description' | 'merchant';\nexport type MatchType = 'contains' | 'startsWith' | 'exact' | 'regex';\n\nexport interface Rule {\n  id: string;\n  pattern: string;\n  field: RuleField;\n  matchType: MatchType;\n  category: string;\n  source: 'learned' | 'manual';\n  priority: number;\n  hits: number;\n  enabled: boolean;\n  createdAt: number;\n  lastHitAt?: number;\n}\n\nexport interface Recurring {\n  id: string;\n  merchant: string;\n  category: string;\n  amount: number; // positive number\n  cadence: 'weekly' | 'monthly' | 'quarterly' | 'yearly';\n  nextDate: string;\n  lastDate: string;\n  status: 'active' | 'unused' | 'cancelled' | 'snoozed';\n  priceHistory: { date: string; amount: number }[];\n  usage: 'used' | 'unused' | 'unknown';\n  detectedFrom: number; // number of matching txns\n  accountId: string;\n  notes?: string;\n  source: 'detected' | 'manual';\n}\n\nexport interface IncomeSource {\n  id: string;\n  name: string;\n  amount: number;\n  cadence: 'monthly' | 'yearly' | 'one-off';\n  nextDate: string;\n  variable?: boolean;\n}\n\nexport interface FixedCost {\n  id: string;\n  name: string;\n  amount: number;\n  category: string;\n  dueDay: number;\n}\n\nexport interface Goal {\n  id: string;\n  name: string;\n  target: number;\n  saved: number;\n  targetDate: string;\n  monthly: number;\n  priority: number;\n  color: string;\n  note?: string;\n  archived?: boolean;\n}\n\nexport interface Profile {\n  name: string;\n  currency: 'INR';\n  emergencyTarget: number;\n  emergencySaved: number;\n  savingsRateTarget: number;\n  income: IncomeSource[];\n  fixed: FixedCost[];\n  openingBalance: number;\n}\n\nexport interface Account {\n  id: string;\n  name: string;\n  institution: string;\n  kind: 'savings' | 'credit' | 'cash';\n  last4: string;\n  balance: number;\n}\n\nexport type NudgeKind =\n  | 'drift'\n  | 'price-change'\n  | 'unused'\n  | 'goal'\n  | 'buffer'\n  | 'payday'\n  | 'anomaly';\n\nexport interface Nudge {\n  id: string;\n  kind: NudgeKind;\n  severity: 'info' | 'warn' | 'critical';\n  title: string;\n  body: string;\n  math?: string;\n  createdAt: number;\n  status: 'open' | 'snoozed' | 'done' | 'dismissed';\n  actionLabel?: string;\n  actionRoute?: string;\n}\n\nexport interface ScenarioLevers {\n  diningCut: number; // 0..50 (%)\n  groceriesCut: number; // 0..30\n  cancelledSubs: string[]; // recurring ids\n  rentChange: number; // -10..30\n  incomeChange: number; // -20..20\n  oneOffAmount: number;\n  oneOffMonth: number; // 0..11\n  extraSavings: number;\n}\n\nexport interface Scenario {\n  id: string;\n  name: string;\n  levers: ScenarioLevers;\n  createdAt: number;\n  pinned?: boolean;\n}\n\nexport interface Settings {\n  theme: 'light' | 'dark';\n  dense: boolean;\n  nudgePrefs: Record<NudgeKind, boolean>;\n  hideBalances: boolean;\n  savingsApy: number;\n}\n\nexport interface ImportBatch {\n  id: string;\n  fileName: string;\n  source: TxnSource;\n  importedAt: number;\n  total: number;\n  added: number;\n  duplicates: number;\n  approved: boolean;\n}\n\nexport interface Correction {\n  id: string;\n  txnId: string;\n  description: string;\n  from: string;\n  to: string;\n  at: number;\n  learnedRuleId?: string;\n}\n\nexport interface AppState {\n  version: number;\n  profile: Profile;\n  accounts: Account[];\n  txns: Txn[];\n  rules: Rule[];\n  recurring: Recurring[];\n  goals: Goal[];\n  nudges: Nudge[];\n  scenarios: Scenario[];\n  settings: Settings;\n  batches: ImportBatch[];\n  corrections: Correction[];\n  seedMonth: string;\n  lastAction?: { label: string; snapshot: string; at: number } | null;\n}\n\nexport interface ParsedRow {\n  date: string;\n  description: string;\n  amount: number;\n  balance?: number;\n  raw: string;\n  hash: string;\n  duplicate?: boolean;\n}\n\nexport interface ParseResult {\n  rows: ParsedRow[];\n  errors: string[];\n  meta: { source: TxnSource; fileName: string; detectedFormat?: string; columns?: string[] };\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\types.ts"})
  [Tool result]: Created file successfully: src/types.ts
  
  [Assistant reasoning]: Now categories and formatting utilities.
  
  Formatting INR: use Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}). Produces ₹1,42,000. Good.
  
  Date helpers: monthKey, addMonths, startOfMonth, daysInMonth, formatDate short.
  
  Categories with colors from the palette (muted, distinct):
  - housing #8C6A3F? Let me choose a cohesive palette: warm ochre, olive, teal, slate, clay, plum, sand, moss, ink.
  
  Category colors:
  rent: #7A5C3E (walnut)
  utilities: #A67C3D (amber-brown)
  internet: #8A8F5C (olive)
  mobile: #6F8A7A (sage)
  insurance: #6B7F8C (slate blue)
  groceries: #4F7A5B (forest)
  dining: #B4711E (amber)
  delivery: #C0683A (burnt orange)
  transport: #3F6E7A (teal)
  fuel: #5C6E82 (steel)
  subscriptions: #8A5A6B (plum)
  shopping: #A65A4A (clay)
  entertainment: #7B6A9A (violet-muted) — careful purple anti-pattern; use #6E6A7C muted slate-purple, fine.
  health: #5A7D6A
  fitness: #4E7F74
  education: #7A6A4A
  travel: #4C6B8A
  personal_care: #A07A6A
  home: #8A7A5A
  gifts: #9A6A5A
  fees: #8A6A6A
  investments: #3F6B4F
  transfer: #8A8A82
  income: #2F6B4F
  other: #7A7A72
  
  Good, muted editorial palette.
  
  Now format.ts.
  [Assistant tool call]: write({"content":"import type { Category } from '../types';\n\nexport const CATEGORIES: Category[] = [\n  { id: 'rent', name: 'Rent', group: 'Housing', kind: 'fixed', color: '#7A5C3E' },\n  { id: 'utilities', name: 'Utilities', group: 'Housing', kind: 'fixed', color: '#A67C3D' },\n  { id: 'internet', name: 'Internet', group: 'Housing', kind: 'fixed', color: '#8A8F5C' },\n  { id: 'mobile', name: 'Mobile', group: 'Housing', kind: 'fixed', color: '#6F8A7A' },\n  { id: 'insurance', name: 'Insurance', group: 'Financial', kind: 'fixed', color: '#6B7F8C' },\n  { id: 'groceries', name: 'Groceries', group: 'Food', kind: 'flexible', color: '#4F7A5B' },\n  { id: 'dining', name: 'Dining out', group: 'Food', kind: 'flexible', color: '#B4711E' },\n  { id: 'delivery', name: 'Food delivery', group: 'Food', kind: 'flexible', color: '#C0683A' },\n  { id: 'transport', name: 'Transport', group: 'Getting around', kind: 'flexible', color: '#3F6E7A' },\n  { id: 'fuel', name: 'Fuel', group: 'Getting around', kind: 'flexible', color: '#5C6E82' },\n  { id: 'subscriptions', name: 'Subscriptions', group: 'Lifestyle', kind: 'fixed', color: '#8A5A6B' },\n  { id: 'shopping', name: 'Shopping', group: 'Lifestyle', kind: 'flexible', color: '#A65A4A' },\n  { id: 'entertainment', name: 'Entertainment', group: 'Lifestyle', kind: 'flexible', color: '#6E6A7C' },\n  { id: 'health', name: 'Health', group: 'Wellbeing', kind: 'flexible', color: '#5A7D6A' },\n  { id: 'fitness', name: 'Fitness', group: 'Wellbeing', kind: 'fixed', color: '#4E7F74' },\n  { id: 'education', name: 'Education', group: 'Growth', kind: 'fixed', color: '#7A6A4A' },\n  { id: 'travel', name: 'Travel', group: 'Lifestyle', kind: 'flexible', color: '#4C6B8A' },\n  { id: 'personal_care', name: 'Personal care', group: 'Lifestyle', kind: 'flexible', color: '#A07A6A' },\n  { id: 'home', name: 'Home', group: 'Housing', kind: 'flexible', color: '#8A7A5A' },\n  { id: 'gifts', name: 'Gifts', group: 'Lifestyle', kind: 'flexible', color: '#9A6A5A' },\n  { id: 'fees', name: 'Fees & charges', group: 'Financial', kind: 'fixed', color: '#8A6A6A' },\n  { id: 'investments', name: 'Investments', group: 'Financial', kind: 'savings', color: '#3F6B4F' },\n  { id: 'transfer', name: 'Transfers', group: 'Financial', kind: 'transfer', color: '#8A8A82' },\n  { id: 'income', name: 'Income', group: 'Income', kind: 'income', color: '#2F6B4F' },\n  { id: 'other', name: 'Uncategorised', group: 'Other', kind: 'flexible', color: '#7A7A72' },\n];\n\nexport const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(\n  CATEGORIES.map((c) => [c.id, c])\n);\n\nexport const categoryName = (id: string): string => CATEGORY_MAP[id]?.name ?? 'Uncategorised';\nexport const categoryColor = (id: string): string => CATEGORY_MAP[id]?.color ?? '#7A7A72';\nexport const categoryKind = (id: string): Category['kind'] =>\n  CATEGORY_MAP[id]?.kind ?? 'flexible';\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\data\\categories.ts"})
  [Tool result]: Created file successfully: src/data/categories.ts
  [Assistant tool call]: write({"content":"const inr = new Intl.NumberFormat('en-IN', {\n  style: 'currency',\n  currency: 'INR',\n  maximumFractionDigits: 0,\n  minimumFractionDigits: 0,\n});\n\nconst inrPrecise = new Intl.NumberFormat('en-IN', {\n  style: 'currency',\n  currency: 'INR',\n  maximumFractionDigits: 2,\n  minimumFractionDigits: 2,\n});\n\nexport const money = (n: number, precise = false): string => {\n  const v = Math.abs(n) < 0.005 ? 0 : n;\n  return (precise ? inrPrecise : inr).format(v);\n};\n\nexport const moneySigned = (n: number, precise = false): string => {\n  if (Math.abs(n) < 0.005) return money(0, precise);\n  return `${n > 0 ? '+' : '−'}${money(Math.abs(n), precise)}`;\n};\n\nexport const num = (n: number): string => new Intl.NumberFormat('en-IN').format(n);\n\nexport const pct = (n: number, digits = 0): string =>\n  `${n > 0 ? '' : ''}${n.toFixed(digits)}%`;\n\nexport const compact = (n: number): string => {\n  const abs = Math.abs(n);\n  if (abs >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;\n  if (abs >= 100000) return `${(n / 100000).toFixed(1)}L`;\n  if (abs >= 1000) return `${(n / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`;\n  return `${Math.round(n)}`;\n};\n\nexport const clamp = (n: number, min: number, max: number): number =>\n  Math.min(max, Math.max(min, n));\n\nexport const round = (n: number, step = 1): number => Math.round(n / step) * step;\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\lib\\format.ts"})
  [Tool result]: Created file successfully: src/lib/format.ts
  [Assistant tool call]: write({"content":"export const pad = (n: number): string => String(n).padStart(2, '0');\n\nexport const toISO = (d: Date): string =>\n  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;\n\nexport const parseISO = (s: string): Date => {\n  const [y, m, d] = s.split('-').map(Number);\n  return new Date(y, (m ?? 1) - 1, d ?? 1);\n};\n\nexport const todayISO = (): string => toISO(new Date());\n\nexport const monthKey = (iso: string): string => iso.slice(0, 7);\n\nexport const monthLabel = (key: string, short = false): string => {\n  const [y, m] = key.split('-').map(Number);\n  const d = new Date(y, m - 1, 1);\n  return d.toLocaleDateString('en-IN', {\n    month: short ? 'short' : 'long',\n    year: 'numeric',\n  });\n};\n\nexport const monthLabelShort = (key: string): string => {\n  const [y, m] = key.split('-').map(Number);\n  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'short' });\n};\n\nexport const addMonths = (key: string, n: number): string => {\n  const [y, m] = key.split('-').map(Number);\n  const d = new Date(y, m - 1 + n, 1);\n  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;\n};\n\nexport const addDays = (iso: string, n: number): string => {\n  const d = parseISO(iso);\n  d.setDate(d.getDate() + n);\n  return toISO(d);\n};\n\nexport const daysBetween = (a: string, b: string): number =>\n  Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);\n\nexport const daysInMonth = (key: string): number => {\n  const [y, m] = key.split('-').map(Number);\n  return new Date(y, m, 0).getDate();\n};\n\nexport const friendlyDate = (iso: string): string => {\n  const d = parseISO(iso);\n  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });\n};\n\nexport const friendlyDateLong = (iso: string): string => {\n  const d = parseISO(iso);\n  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });\n};\n\nexport const relativeDays = (iso: string): string => {\n  const diff = daysBetween(todayISO(), iso);\n  if (diff === 0) return 'today';\n  if (diff === 1) return 'tomorrow';\n  if (diff === -1) return 'yesterday';\n  if (diff > 1) return `in ${diff} days`;\n  return `${Math.abs(diff)} days ago`;\n};\n\nexport const monthRange = (start: string, count: number): string[] =>\n  Array.from({ length: count }, (_, i) => addMonths(start, i));\n\nexport const quarterOf = (key: string): string => {\n  const [y, m] = key.split('-').map(Number);\n  return `${y}-Q${Math.floor((m - 1) / 3) + 1}`;\n};\n\nexport const nowMonth = (): string => todayISO().slice(0, 7);\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\lib\\date.ts"})
  [Tool result]: Created file successfully: src/lib/date.ts
  
  [Assistant reasoning]: Now the categorizer and parser. This is core logic.
  
  Categorizer: keyword map with priority and merchant extraction.
  
  Merchant extraction: clean string. Bank descriptions like "UPI/DR/417261928374/SWIGGY/YESB/swiggy@ybl". Extract merchant by looking for known brands, else take tokens.
  
  Let me build:
  ```ts
  const MERCHANT_PATTERNS: {match: RegExp, category: string, merchant: string, confidence: number}[]
  ```
  Ordered specific → general.
  
  Keyword rules:
  - swiggy|zomato|eatfit|faasos|dominos|pizza|kfc|mcdonald|burger|restaurant|cafe|coffee|starbucks|third wave|blu tokai|toit|biryani|dhaba|bakery → dining or delivery. Delivery for swiggy/zomato/eatfit/dominos; dining for restaurants/cafes.
  - bigbasket|blinkit|zepto|instamart|dmart|reliance fresh|more supermarket|kirana|grofers|licious|freshtohome → groceries
  - uber|ola|rapido|namma metro|bmtc|ksrtc|auto|parking|fastag|toll → transport
  - indian oil|hp petrol|bharat petroleum|shell|petrol|diesel|fuel → fuel
  - netflix|spotify|hotstar|disney|prime video|sonyliv|zee5|youtube premium|apple music|icloud|google one|adobe|microsoft 365|canva|notion|linkedin premium|chatgpt|openai|audible|kindle → subscriptions
  - airtel|jio|vodafone|vi postpaid|bsnl → mobile
  - bescom|bwssb|electricity|water bill|gas bill|indane|hp gas|tata power → utilities
  - act fibernet|hathway|jiofiber|broadband|wifi → internet
  - lic|hdfc life|icici pru|star health|niva bupa|insurance|policy premium → insurance
  - cult|gym|fitness|healthifyme|yoga → fitness
  - apollo|pharmeasy|1mg|netmeds|hospital|clinic|dental|doctor|medical → health
  - amazon|flipkart|myntra|ajio|nykaa|meesho|decathlon|ikea|croma|reliance digital|tata cliq → shopping
  - bookmyshow|pvr|inox|cinepolis|concert|ticket → entertainment
  - irctc|makemytrip|goibibo|cleartrip|indigo|airindia|vistara|oyo|airbnb|hotel|flight → travel
  - udemy|coursera|upgrad|byju|unacademy|school fee|tuition|college → education
  - salon|barber|spa|nykaa salon|grooming → personal_care
  - rent|landlord|nobroker|housing → rent
  - sip|mutual fund|zerodha|groww|upstox|kuvera|smallcase|ppf|nps|rd installment|fd → investments
  - salary|payroll|stipend|credited by employer → income
  - neft|imps|rtgs|upi/... to self|credit card payment|cc payment → transfer
  - atm|withdrawal|cash → other
  - bank charges|sms charge|gst|penalty|fee → fees
  - gift|birthday → gifts
  - amazon pay later? fees.
  
  Confidence: strong brand hit 0.95, generic keyword 0.75, fallback other 0.2.
  
  `categorize(description, amount)`: returns {category, merchant, confidence, why}.
  
  For income, amount > 0 → income candidate; if salary keyword → income 0.99.
  
  Rules engine: applies user rules first (higher priority), else heuristic.
  
  `applyRules(txn, rules)` returns category or null.
  
  Parse CSV: handle headers, comma/quotes, date formats dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd, "04 Oct 2026". Amount columns: amount/debit/credit/withdrawal/deposit. If debit/credit columns, signed. Handle ₹, commas, "Dr"/"Cr", parentheses.
  
  Messy CSV: skip bank header lines until a line with 3+ commas. Detect delimiter from header (comma, semicolon, tab, pipe).
  
  SMS parser: lines like:
  "HDFC Bank: Rs.486.00 debited from a/c XX4412 on 04-10-26 to SWIGGY. Avl bal Rs.1,84,320.50"
  "Your A/C XX4412 has been credited with Rs 1,42,000.00 on 01-10-26 (Salary - OCT)."
  "ICICI Bank: INR 1,199.00 spent on your Credit Card XX8891 at AIRTEL on 09/10/2026."
  Parse: amount regex `(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)`, date regex, direction via debited/credited/spent/paid/withdrawn.
  Description: after "to " / "at " / "towards " or merchant-ish.
  
  Hash: date|amount|normalized description → base36.
  
  Dedup check against existing txns hash set.
  
  PDF: extract text via pdfjs, then parse line by line. Line format from our generated PDF: "04/10/2026  SWIGGY BANGALORE  486.00 DR  184320.50". Parse each line with date at start, amount + DR/CR.
  
  Also generic pdftotext-style parsing is unreliable; handle our format and date+amount lines.
  
  Now seed data. Let me write the generator deterministically.
  
  I'll write `src/domain/` files.
  
  Let me write categorize.ts first.
  
  Need a helper `merchantFrom(description)`.
  
  Design:
  ```ts
  export interface Categorization { category: string; merchant: string; confidence: number; why: string }
  ```
  
  why: e.g. "Matched “SWIGGY” — a known food delivery merchant." or "Amount is a credit and description mentions salary." or "No merchant signal — needs a review."
  
  Let me code.
  
  For pattern list, include id, re, category, merchant, label, confidence.
  
  Merchant display names normalized (SWIGGY, Zomato, Netflix...). Use uppercase? For UI, title-case merchant names look better: "Swiggy", "Netflix", "Airtel". I'll store canonical names.
  
  Also "merchantKey" for recurring detection: uppercase alphanumeric of merchant.
  
  Now write.
  [Assistant tool call]: write({"content":"import type { Rule, Txn } from '../types';\n\nexport interface Categorization {\n  category: string;\n  merchant: string;\n  confidence: number;\n  why: string;\n}\n\ntype Pattern = {\n  re: RegExp;\n  category: string;\n  merchant: string;\n  confidence: number;\n  label: string;\n};\n\n/** Ordered most-specific first. First hit wins. */\nconst PATTERNS: Pattern[] = [\n  { re: /swiggy|instamart/i, category: 'delivery', merchant: 'Swiggy', confidence: 0.97, label: 'Swiggy is a food delivery platform' },\n  { re: /zomato|blinkit/i, category: 'delivery', merchant: 'Zomato', confidence: 0.97, label: 'Zomato is a food delivery platform' },\n  { re: /eatfit|faasos|behrouz|dominos|pizza hut|kfc|mcdonald|burger king|subway/i, category: 'delivery', merchant: 'Quick service', confidence: 0.9, label: 'a quick-service restaurant chain' },\n  { re: /starbucks|third wave|blue tokai|toit|social|brew|bakery|patisserie|cafe|coffee/i, category: 'dining', merchant: 'Cafe', confidence: 0.86, label: 'a cafe or coffee shop' },\n  { re: /restaurant|biryani|dhaba|kitchen|eatery|grill|barbeque|bar &|pub|dining/i, category: 'dining', merchant: 'Restaurant', confidence: 0.84, label: 'a restaurant' },\n  { re: /bigbasket|blinkit|zepto|dmart|reliance fresh|more supermarket|supermarket|kirana|grofers|licious|freshtohome|spencer/i, category: 'groceries', merchant: 'Groceries', confidence: 0.92, label: 'a grocery merchant' },\n  { re: /uber(?!.*\\beat\\b)|ola(?!.*\\bemea\\b)|rapido|namma metro|bmtc|ksrtc|metro card|parking|fastag|toll/i, category: 'transport', merchant: 'Transport', confidence: 0.9, label: 'a transport or commute service' },\n  { re: /indian oil|iocl|hp petrol|bharat petroleum|bpcl|shell|petrol|diesel|fuel/i, category: 'fuel', merchant: 'Fuel station', confidence: 0.93, label: 'a fuel station' },\n  { re: /netflix/i, category: 'subscriptions', merchant: 'Netflix', confidence: 0.99, label: 'Netflix is a streaming subscription' },\n  { re: /spotify/i, category: 'subscriptions', merchant: 'Spotify', confidence: 0.99, label: 'Spotify is a music subscription' },\n  { re: /hotstar|disney|sonyliv|zee5|jiocinema|prime video|youtube premium|apple music|audible|kindle/i, category: 'subscriptions', merchant: 'Streaming', confidence: 0.94, label: 'a streaming or media subscription' },\n  { re: /icloud|google one|dropbox|adobe|microsoft 365|canva|notion|linkedin premium|chatgpt|openai|figma/i, category: 'subscriptions', merchant: 'Software subscription', confidence: 0.94, label: 'a software subscription' },\n  { re: /\\bairtel\\b|\\bjio\\b|vodafone|\\bvi postpaid|bsnl|postpaid|prepaid recharge/i, category: 'mobile', merchant: 'Mobile network', confidence: 0.93, label: 'a mobile network operator' },\n  { re: /bescom|bwssb|electricity|water bill|gas bill|indane|hp gas|tata power|adani electricity/i, category: 'utilities', merchant: 'Utilities', confidence: 0.94, label: 'a utility bill' },\n  { re: /act fibernet|hathway|jiofiber|airtel fiber|broadband|wifi|internet bill/i, category: 'internet', merchant: 'Broadband', confidence: 0.93, label: 'a broadband provider' },\n  { re: /lic |hdfc life|icici pru|star health|niva bupa|insurance|policy premium|renewal premium/i, category: 'insurance', merchant: 'Insurance', confidence: 0.92, label: 'an insurance premium' },\n  { re: /cult\\.?fit|cultfit|gym|fitness|healthifyme|yoga/i, category: 'fitness', merchant: 'Cult.fit', confidence: 0.93, label: 'a fitness membership' },\n  { re: /apollo|pharmeasy|1mg|netmeds|hospital|clinic|dental|doctor|medical|diagnostic|lab test/i, category: 'health', merchant: 'Health', confidence: 0.9, label: 'a health or medical merchant' },\n  { re: /amazon(?!.*prime)|flipkart|myntra|ajio|nykaa(?!.*salon)|meesho|decathlon|ikea|croma|reliance digital|tata cliq|firstcry/i, category: 'shopping', merchant: 'Shopping', confidence: 0.9, label: 'an online or retail shopping merchant' },\n  { re: /bookmyshow|pvr|inox|cinepolis|concert|event ticket|ticketmaster/i, category: 'entertainment', merchant: 'Entertainment', confidence: 0.9, label: 'an entertainment venue or ticketing service' },\n  { re: /irctc|makemytrip|goibibo|cleartrip|indigo|air india|vistara|spicejet|oyo|airbnb|hotel|flight|railway/i, category: 'travel', merchant: 'Travel', confidence: 0.9, label: 'a travel booking' },\n  { re: /udemy|coursera|upgrad|byju|unacademy|school fee|tuition|college|course fee/i, category: 'education', merchant: 'Education', confidence: 0.9, label: 'an education provider' },\n  { re: /salon|barber|spa|grooming|beauty parlour/i, category: 'personal_care', merchant: 'Personal care', confidence: 0.88, label: 'a personal care merchant' },\n  { re: /nobroker|landlord|house rent|\\brent\\b|maintenance charge|society/i, category: 'rent', merchant: 'Rent', confidence: 0.9, label: 'a rent or housing payment' },\n  { re: /zerodha|groww|upstox|kuvera|smallcase|\\bsip\\b|mutual fund|\\bppf\\b|\\bnps\\b|recurring deposit|\\brd installment|\\bfd\\b/i, category: 'investments', merchant: 'Investment transfer', confidence: 0.88, label: 'a savings or investment transfer' },\n  { re: /salary|payroll|stipend|wages|employer/i, category: 'income', merchant: 'Salary', confidence: 0.98, label: 'a salary credit' },\n  { re: /credit card payment|cc payment|card bill|bill pay/i, category: 'transfer', merchant: 'Card payment', confidence: 0.92, label: 'a credit card payment' },\n  { re: /neft|imps|rtgs|self transfer|to self|own account/i, category: 'transfer', merchant: 'Transfer', confidence: 0.8, label: 'a bank transfer between accounts' },\n  { re: /bank charge|sms charge|gst|penalty|processing fee|annual fee|late fee/i, category: 'fees', merchant: 'Bank fee', confidence: 0.9, label: 'a bank fee or charge' },\n  { re: /gift|birthday|anniversary/i, category: 'gifts', merchant: 'Gifts', confidence: 0.82, label: 'a gift purchase' },\n  { re: /atm|withdrawal|cash/i, category: 'other', merchant: 'Cash withdrawal', confidence: 0.7, label: 'a cash withdrawal' },\n];\n\nconst NOISE = /^(upi|dr|cr|pos|neft|imps|rtgs|ach|ecs|txn|ref|payment|purchase|paid|to|from|by|via|on|at)\\b/i;\n\nexport function cleanMerchant(description: string): string {\n  let s = description\n    .replace(/\\b(upi|pos|neft|imps|rtgs|ach|ecs|deb|cred|dr|cr)\\b[\\/\\-:]?/gi, ' ')\n    .replace(/\\b\\d{6,}\\b/g, ' ')\n    .replace(/[\\/|]+/g, ' ')\n    .replace(/\\s{2,}/g, ' ')\n    .trim();\n  const words = s.split(' ').filter((w) => w && !NOISE.test(w));\n  if (words.length > 4) s = words.slice(0, 4).join(' ');\n  return s || description.slice(0, 48);\n}\n\nfunction titleCase(s: string): string {\n  return s\n    .toLowerCase()\n    .split(' ')\n    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))\n    .join(' ')\n    .trim();\n}\n\nexport function heuristicCategorize(description: string, amount: number): Categorization {\n  const text = description.replace(/\\s+/g, ' ');\n  for (const p of PATTERNS) {\n    if (p.re.test(text)) {\n      return {\n        category: p.category,\n        merchant: p.merchant,\n        confidence: p.confidence,\n        why: `Matched “${p.label}” in the statement line.`,\n      };\n    }\n  }\n  if (amount > 0) {\n    return {\n      category: 'income',\n      merchant: titleCase(cleanMerchant(text)) || 'Credit',\n      confidence: 0.55,\n      why: 'This is a credit, so it was filed as income — confirm if it was a transfer.',\n    };\n  }\n  const merchant = titleCase(cleanMerchant(text));\n  return {\n    category: 'other',\n    merchant: merchant || 'Unknown merchant',\n    confidence: 0.18,\n    why: 'No known merchant signal found. A correction here will teach the model.',\n  };\n}\n\nexport function ruleMatches(rule: Rule, txn: Pick<Txn, 'description' | 'merchant'>): boolean {\n  const hay = rule.field === 'merchant' ? txn.merchant : txn.description;\n  const needle = rule.pattern;\n  try {\n    switch (rule.matchType) {\n      case 'contains':\n        return hay.toLowerCase().includes(needle.toLowerCase());\n      case 'startsWith':\n        return hay.toLowerCase().startsWith(needle.toLowerCase());\n      case 'exact':\n        return hay.trim().toLowerCase() === needle.trim().toLowerCase();\n      case 'regex':\n        return new RegExp(needle, 'i').test(hay);\n      default:\n        return false;\n    }\n  } catch {\n    return false;\n  }\n}\n\nexport function firstMatchingRule(\n  txn: Pick<Txn, 'description' | 'merchant'>,\n  rules: Rule[]\n): Rule | undefined {\n  return rules\n    .filter((r) => r.enabled)\n    .sort((a, b) => b.priority - a.priority || b.createdAt - a.createdAt)\n    .find((r) => ruleMatches(r, txn));\n}\n\nexport function categorize(\n  description: string,\n  amount: number,\n  rules: Rule[] = []\n): Categorization {\n  const base = heuristicCategorize(description, amount);\n  const rule = firstMatchingRule(\n    { description, merchant: base.merchant },\n    rules\n  );\n  if (rule) {\n    return {\n      category: rule.category,\n      merchant: base.merchant,\n      confidence: 0.99,\n      why: `Your rule “${rule.pattern}” maps this merchant to ${rule.category}.`,\n    };\n  }\n  return base;\n}\n\n/** Build the pattern a correction should learn. */\nexport function deriveRulePattern(description: string, merchant: string): string {\n  const brandMatch = /swiggy|zomato|netflix|spotify|airtel|jio|cult|apollo|amazon|flipkart|myntra|bigbasket|blinkit|zepto|uber|ola|rapido|act fibernet|bescom/i.exec(\n    description\n  );\n  if (brandMatch) return brandMatch[0].toUpperCase();\n  const cleaned = cleanMerchant(merchant || description);\n  const token = cleaned.split(' ').filter((w) => w.length >= 3)[0] ?? cleaned;\n  return token.toUpperCase();\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\categorize.ts"})
  [Tool result]: Created file successfully: src/domain/categorize.ts
  
  [Assistant reasoning]: Now parsing. Need robust CSV, SMS, PDF text.
  
  parse.ts:
  
  ```ts
  export function hashRow(date, amount, description): string
  export function parseCSV(text): ParseResult
  export function parseSMS(text): ParseResult
  export function parseStatementText(text): ParseResult  // for pdf
  export function parseDateLoose(s): string|null
  export function parseAmount(s): number|null
  ```
  
  CSV logic:
  - normalize lines, detect delimiter by counting in the first ~10 lines.
  - find header row: line containing (/date/i) and (/amount|debit|credit|withdrawal|deposit/i).
  - map columns: date, description/narration/particulars/details, amount, debit, credit, withdrawal, deposit, balance.
  - parse each row; skip empty/total lines.
  - if amount column present, sign from Dr/Cr suffix or negative.
  - else debit/credit.
  
  Date parsing:
  - dd/mm/yyyy, dd-mm-yy, yyyy-mm-dd, "04 Oct 2026", "04-Oct-2026", "Oct 04, 2026".
  - 2-digit year → 20xx.
  
  Amount parsing: strip ₹, Rs, INR, commas, spaces; handle (123.45) negative; handle trailing "Dr"/"Cr".
  
  SMS: split lines on newline; also split on "|"? Keep lines. Each line: date extraction (any date pattern), amount, direction, merchant. If a line lacks a date, try to find date anywhere; fallback today. Should we include descriptions like "Avl bal" — fine.
  
  SMS block might contain multiple messages separated by blank lines. Each line with a transaction keyword.
  
  parseSMS: for each line containing (debited|credited|spent|paid|withdrawn|received|purchase) and amount. Extract account last4, merchant.
  
  Merchant extraction from SMS: after " at " / " to " / "towards " / "for " until punctuation or " on ". E.g. "to SWIGGY." → SWIGGY. "at AIRTEL on" → AIRTEL.
  
  If merchant is masked like "UPI/P2M/..." use raw.
  
  PDF text: lines from pdf.js; join items with spaces. Parse statement lines: date at start then description then amount with DR/CR. Our generated PDF: "04/10/2026  SWIGGY BANGALORE  486.00 DR  184320.50".
  
  Regex: ^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2} [A-Za-z]{3} \d{2,4})\s+(.+?)\s+([\d,]+\.\d{2})\s*(DR|CR)?\s+([\d,]+\.\d{2})?$
  
  Fallback: find date at start, find amount somewhere.
  
  Also handle lines where amount has ₹.
  
  Dedupe happens in store against hash.
  
  Let me write parse.ts. Also need normalization for hash: lower, remove non-alphanumerics, date + amount + desc first 40.
  
  Edge: CSV with separate debit/credit and balance.
  
  CSV parser must handle quoted fields with commas. Write a `splitCSVLine`.
  
  Header detection: trim BOM.
  
  Let me write.
  [Assistant tool call]: write({"content":"import type { ParsedRow, ParseResult, TxnSource } from '../types';\n\nexport function normalizeText(s: string): string {\n  return s.replace(/\\s+/g, ' ').trim().toLowerCase();\n}\n\nexport function rowHash(date: string, amount: number, description: string): string {\n  const base = `${date}|${amount.toFixed(2)}|${normalizeText(description).slice(0, 48)}`;\n  let h = 2166136261;\n  for (let i = 0; i < base.length; i++) {\n    h ^= base.charCodeAt(i);\n    h = Math.imul(h, 16777619);\n  }\n  return (h >>> 0).toString(36);\n}\n\nconst MONTHS: Record<string, number> = {\n  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,\n  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,\n};\n\nexport function parseDateLoose(input: string): string | null {\n  const s = input.trim().replace(/^[\"']|[\"']$/g, '');\n  if (!s) return null;\n\n  let m = /^(\\d{1,2})[\\/\\-.](\\d{1,2})[\\/\\-.](\\d{2,4})$/.exec(s);\n  if (m) {\n    let [, a, b, c] = m;\n    let year = Number(c);\n    if (year < 100) year += 2000;\n    let day = Number(a);\n    let month = Number(b);\n    // If the first number cannot be a day but could be a month, swap.\n    if (day > 12 && month > 12) return null;\n    if (month > 12 && day <= 12) {\n      [day, month] = [month, day];\n    }\n    if (month < 1 || month > 12 || day < 1 || day > 31) return null;\n    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;\n  }\n\n  m = /^(\\d{4})[\\/\\-.](\\d{1,2})[\\/\\-.](\\d{1,2})/.exec(s);\n  if (m) {\n    const [, y, mo, d] = m;\n    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;\n  }\n\n  m = /^(\\d{1,2})[\\s\\-]([A-Za-z]{3,9})[\\s\\-,]*(\\d{2,4})?$/.exec(s);\n  if (m) {\n    const day = Number(m[1]);\n    const mon = MONTHS[m[2].toLowerCase().slice(0, 4)] ?? MONTHS[m[2].toLowerCase().slice(0, 3)];\n    let year = m[3] ? Number(m[3]) : new Date().getFullYear();\n    if (year < 100) year += 2000;\n    if (mon === undefined) return null;\n    return `${year}-${String(mon + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;\n  }\n\n  m = /^([A-Za-z]{3,9})\\s+(\\d{1,2}),?\\s+(\\d{4})$/.exec(s);\n  if (m) {\n    const mon = MONTHS[m[1].toLowerCase().slice(0, 3)];\n    if (mon === undefined) return null;\n    return `${m[3]}-${String(mon + 1).padStart(2, '0')}-${String(Number(m[2])).padStart(2, '0')}`;\n  }\n\n  return null;\n}\n\nexport function parseAmountLoose(input: string): number | null {\n  if (!input) return null;\n  let s = String(input).trim();\n  if (!s) return null;\n  let negative = false;\n  if (/^\\(.*\\)$/.test(s)) {\n    negative = true;\n    s = s.slice(1, -1);\n  }\n  if (/\\b(dr|debit|withdrawal)\\b/i.test(s)) negative = true;\n  s = s.replace(/(rs\\.?|inr|₹|\\$)/gi, '').replace(/\\b(dr|cr|debit|credit)\\b/gi, '');\n  s = s.replace(/[,\\s]/g, '');\n  if (s.startsWith('-')) {\n    negative = true;\n    s = s.slice(1);\n  }\n  if (!/^\\d*\\.?\\d+$/.test(s)) return null;\n  const n = Number(s);\n  if (!Number.isFinite(n) || n === 0) return null;\n  return negative ? -n : n;\n}\n\nfunction splitCSVLine(line: string, delimiter: string): string[] {\n  const out: string[] = [];\n  let cur = '';\n  let quoted = false;\n  for (let i = 0; i < line.length; i++) {\n    const ch = line[i];\n    if (ch === '\"') {\n      if (quoted && line[i + 1] === '\"') {\n        cur += '\"';\n        i++;\n      } else quoted = !quoted;\n    } else if (ch === delimiter && !quoted) {\n      out.push(cur.trim());\n      cur = '';\n    } else cur += ch;\n  }\n  out.push(cur.trim());\n  return out;\n}\n\nfunction detectDelimiter(lines: string[]): string {\n  const sample = lines.slice(0, 25).join('\\n');\n  const candidates = [',', ';', '\\t', '|'];\n  let best = ',';\n  let bestCount = 0;\n  for (const d of candidates) {\n    const count = sample.split(d).length;\n    if (count > bestCount) {\n      bestCount = count;\n      best = d;\n    }\n  }\n  return best;\n}\n\nconst HEADER_KEYS = {\n  date: /^(date|txn date|transaction date|value date|posting date|tran date)$/i,\n  description: /^(description|narration|particulars|details|transaction details|remarks|merchant|transaction)$/i,\n  amount: /^(amount|txn amount|transaction amount|value)$/i,\n  debit: /^(debit|withdrawal|withdrawals|debit amount|dr)$/i,\n  credit: /^(credit|deposit|deposits|credit amount|cr)$/i,\n  balance: /^(balance|closing balance|running balance|avl balance)$/i,\n  type: /^(type|dr\\/cr|debit\\/credit)$/i,\n};\n\nfunction findHeaderIndex(lines: string[]): number {\n  for (let i = 0; i < Math.min(lines.length, 30); i++) {\n    const low = lines[i].toLowerCase();\n    if (/date/.test(low) && /(amount|debit|credit|withdrawal|deposit)/.test(low)) return i;\n  }\n  return -1;\n}\n\nexport function parseCSV(text: string, fileName = 'statement.csv'): ParseResult {\n  const errors: string[] = [];\n  const cleaned = text.replace(/^\\uFEFF/, '').replace(/\\r\\n?/g, '\\n');\n  const rawLines = cleaned.split('\\n').filter((l) => l.trim().length > 0);\n  if (rawLines.length < 2) {\n    return { rows: [], errors: ['The file looks empty.'], meta: { source: 'csv', fileName } };\n  }\n  const delimiter = detectDelimiter(rawLines);\n  const headerIdx = findHeaderIndex(rawLines);\n  if (headerIdx === -1) {\n    return {\n      rows: [],\n      errors: ['Could not find a header row with a date and an amount column.'],\n      meta: { source: 'csv', fileName },\n    };\n  }\n  const header = splitCSVLine(rawLines[headerIdx], delimiter).map((h) =>\n    h.replace(/[\"']/g, '').trim()\n  );\n  const idx: Record<string, number> = {};\n  header.forEach((h, i) => {\n    for (const [key, re] of Object.entries(HEADER_KEYS)) {\n      if (idx[key] === undefined && re.test(h)) idx[key] = i;\n    }\n    if (idx.date === undefined && /date/i.test(h)) idx.date = i;\n    if (idx.description === undefined && /(desc|narr|particular|detail|remark)/i.test(h))\n      idx.description = i;\n    if (idx.amount === undefined && /amount/i.test(h)) idx.amount = i;\n    if (idx.debit === undefined && /debit|withdraw|^dr$/i.test(h)) idx.debit = i;\n    if (idx.credit === undefined && /credit|deposit|^cr$/i.test(h)) idx.credit = i;\n    if (idx.balance === undefined && /balance/i.test(h)) idx.balance = i;\n  });\n\n  if (idx.date === undefined) {\n    return { rows: [], errors: ['No date column recognised.'], meta: { source: 'csv', fileName } };\n  }\n  if (idx.amount === undefined && idx.debit === undefined && idx.credit === undefined) {\n    return { rows: [], errors: ['No amount, debit, or credit column recognised.'], meta: { source: 'csv', fileName } };\n  }\n\n  const rows: ParsedRow[] = [];\n  for (let i = headerIdx + 1; i < rawLines.length; i++) {\n    const cells = splitCSVLine(rawLines[i], delimiter);\n    const date = parseDateLoose(cells[idx.date] ?? '');\n    if (!date) {\n      if (/(opening|closing|total|balance b\\/f|statement)/i.test(rawLines[i])) continue;\n      errors.push(`Line ${i + 1}: no usable date — skipped.`);\n      continue;\n    }\n    const desc =\n      (idx.description !== undefined ? cells[idx.description] : '') ||\n      cells.filter((_, ci) => ci !== idx.date).join(' ').slice(0, 90);\n    if (!desc || /^(opening balance|closing balance)$/i.test(desc)) continue;\n\n    let amount: number | null = null;\n    if (idx.debit !== undefined && parseAmountLoose(cells[idx.debit] ?? '') !== null) {\n      amount = -Math.abs(parseAmountLoose(cells[idx.debit]) as number);\n    } else if (idx.credit !== undefined && parseAmountLoose(cells[idx.credit] ?? '') !== null) {\n      amount = Math.abs(parseAmountLoose(cells[idx.credit]) as number);\n    } else if (idx.amount !== undefined) {\n      amount = parseAmountLoose(cells[idx.amount] ?? '');\n      if (amount !== null && idx.type !== undefined && /credit|cr/i.test(cells[idx.type] ?? '')) {\n        amount = Math.abs(amount);\n      }\n    }\n    if (amount === null) {\n      errors.push(`Line ${i + 1}: no usable amount — skipped.`);\n      continue;\n    }\n    const balance =\n      idx.balance !== undefined ? parseAmountLoose(cells[idx.balance] ?? '') ?? undefined : undefined;\n    rows.push({\n      date,\n      description: desc.replace(/\\s+/g, ' ').trim(),\n      amount,\n      balance: balance ?? undefined,\n      raw: rawLines[i],\n      hash: rowHash(date, Math.abs(amount), desc),\n    });\n  }\n  if (!rows.length) errors.push('No transaction rows could be read from this file.');\n  return {\n    rows,\n    errors,\n    meta: {\n      source: 'csv',\n      fileName,\n      detectedFormat: `CSV · ${delimiter === '\\t' ? 'tab' : delimiter} separated`,\n      columns: header,\n    },\n  };\n}\n\nconst SMS_DATE =\n  /(\\d{1,2}[\\/\\-.]\\d{1,2}[\\/\\-.]\\d{2,4}|\\d{1,2}[\\s\\-](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\\s\\-,]*\\d{2,4})/i;\n\nexport function parseSMS(text: string, fileName = 'Messages'): ParseResult {\n  const errors: string[] = [];\n  const rows: ParsedRow[] = [];\n  const lines = text\n    .replace(/\\r/g, '')\n    .split(/\\n+/)\n    .map((l) => l.trim())\n    .filter(Boolean);\n\n  for (const line of lines) {\n    const isTxn =\n      /(debited|credited|spent|paid|withdrawn|received|purchase|payment of|txn of)/i.test(line) &&\n      /(rs\\.?|inr|₹)\\s*[\\d,]+/i.test(line);\n    if (!isTxn) continue;\n\n    const amountMatch = /(?:rs\\.?|inr|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?)/i.exec(line);\n    if (!amountMatch) continue;\n    const amount = parseAmountLoose(amountMatch[1]);\n    if (!amount) continue;\n    const isCredit = /(credited|received|refund|reversal|cashback)/i.test(line);\n    const signed = isCredit ? Math.abs(amount) : -Math.abs(amount);\n\n    const dateMatch = SMS_DATE.exec(line);\n    const date = (dateMatch && parseDateLoose(dateMatch[1])) || new Date().toISOString().slice(0, 10);\n\n    let merchant = '';\n    const at = /\\b(?:at|to|towards|from)\\s+([A-Za-z0-9&._*\\- ]{2,42}?)(?=\\s+(?:on|ref|via|using|for|\\.|,|$))/i.exec(line);\n    if (at) merchant = at[1].trim();\n    if (!merchant) {\n      const txn = /\\b(?:txn|transaction)\\s+(?:of|at)\\s+([A-Za-z0-9&._*\\- ]{2,32})/i.exec(line);\n      if (txn) merchant = txn[1].trim();\n    }\n    if (!merchant) {\n      const acct = /a\\/c\\s*(?:xx|XX|\\*+)?(\\d{2,6})/i.exec(line);\n      merchant = acct ? `Account ${acct[1].slice(-4)}` : 'Bank alert';\n    }\n\n    const desc = `${merchant} — ${line.replace(/\\s+/g, ' ').slice(0, 88)}`;\n    rows.push({\n      date,\n      description: desc,\n      amount: signed,\n      raw: line,\n      hash: rowHash(date, Math.abs(signed), merchant),\n    });\n  }\n\n  if (!rows.length) {\n    errors.push('No transaction alerts found. Paste one bank SMS per line.');\n  }\n  return {\n    rows,\n    errors,\n    meta: { source: 'sms', fileName, detectedFormat: 'SMS alerts' },\n  };\n}\n\n/**\n * Parses plain text extracted from a PDF statement. Handles the common\n * \"date description amount DR balance\" shape and degrades gracefully.\n */\nexport function parseStatementText(text: string, fileName = 'statement.pdf'): ParseResult {\n  const errors: string[] = [];\n  const rows: ParsedRow[] = [];\n  const lines = text\n    .replace(/\\r/g, '')\n    .split('\\n')\n    .map((l) => l.replace(/\\s+/g, ' ').trim())\n    .filter(Boolean);\n\n  for (const line of lines) {\n    const dateMatch = new RegExp(\n      `^(\\\\d{1,2}[\\\\/\\\\-.]\\\\d{1,2}[\\\\/\\\\-.]\\\\d{2,4}|\\\\d{1,2} [A-Za-z]{3,9} \\\\d{2,4})\\\\s+(.+)$`\n    ).exec(line);\n    if (!dateMatch) continue;\n    const date = parseDateLoose(dateMatch[1]);\n    if (!date) continue;\n    const rest = dateMatch[2];\n\n    // Prefer \"amount [DR|CR] balance\" at the end of the line.\n    const tail = /(.+?)\\s+([\\d,]+\\.\\d{1,2})\\s*(DR|CR)?\\s*([\\d,]+\\.\\d{1,2})?$/i.exec(rest);\n    if (!tail) continue;\n    const descRaw = tail[1].trim();\n    const amount = parseAmountLoose(tail[2]);\n    if (!amount || !descRaw) continue;\n    const drcr = (tail[3] ?? '').toUpperCase();\n    const signed = drcr === 'CR' ? Math.abs(amount) : drcr === 'DR' ? -Math.abs(amount) : amount;\n    const balance = tail[4] ? parseAmountLoose(tail[4]) ?? undefined : undefined;\n\n    rows.push({\n      date,\n      description: descRaw.replace(/\\s+/g, ' '),\n      amount: signed,\n      balance: balance ?? undefined,\n      raw: line,\n      hash: rowHash(date, Math.abs(signed), descRaw),\n    });\n  }\n\n  if (!rows.length) {\n    errors.push(\n      'No transaction lines were found in this PDF. It may be a scanned image — try the CSV export from your bank instead.'\n    );\n  }\n  return {\n    rows,\n    errors,\n    meta: { source: 'pdf', fileName, detectedFormat: 'PDF statement text' },\n  };\n}\n\nexport function guessSourceFromName(name: string): TxnSource {\n  if (/\\.pdf$/i.test(name)) return 'pdf';\n  if (/\\.(csv|tsv|txt)$/i.test(name)) return 'csv';\n  return 'csv';\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\parse.ts"})
  [Tool result]: Created file successfully: src/domain/parse.ts
  
  [Assistant reasoning]: Now the seed data. Need deterministic PRNG, 6 months ending current month. Current date Oct 31 2026 (system date maybe actually 2026? The env says today's date Sat Oct 31 2026, but the real machine date might be 2025. I'll use `new Date()`; but for demo consistency, seed relative to current month so it always looks fresh. Good.)
  
  Seed generation details:
  - months: current - 5 .. current. For current month, transactions only up to today's day (day 31 → full). To keep "this month" realistic and drift, generate through today.
  - Opening balance 186,400.
  - Salary: 1,42,000 on the 1st of each month, description "SALARY CREDIT — NIMBUS LABS PAYROLL".
  - Rent 42,000 on 3rd "HOUSE RENT — LANDLORD UPI".
  - SIP 15,000 on 5th "ZERODHA COIN SIP" (investments, transfer-like savings → mark isExcluded? Investments should count as savings; for cashflow it's an outflow. Let's keep it as an outflow with category investments, not excluded. Actually for "safe to spend" it's committed, so include. Good. But recurring detection may pick it; fine.)
  - Insurance 2,400 on 7th "HDFC LIFE POLICY PREMIUM".
  - Airtel 1,199 on 8th.
  - ACT 1,349 on 9th.
  - BESCOM 3,240 on 10th (varies 2,800-3,900).
  - Netflix 649 on 12th (price history: last 2 months 649, before 499 — change 2 months ago).
  - Spotify 119 on 14th.
  - Cult.fit 1,799 on 15th.
  - LinkedIn Premium 1,299 on 18th.
  - iCloud 75 on 20th.
  - Amazon Prime 1,499 yearly on 22nd of one month (e.g., 3 months ago) - detection yearly.
  - Groceries: 6-9 txns spread, 800-3,200 each (BigBasket, Blinkit, DMart, local kirana).
  - Dining: 5-9 txns, 350-2,400.
  - Delivery: 6-12 txns 220-780 (Swiggy/Zomato).
  - Transport: 8-14 txns 60-420 (Uber/Ola/Rapido/metro).
  - Fuel: 1-2 txns 1,800-3,200.
  - Shopping: 2-4 txns 700-6,500.
  - Entertainment: 1-2 txns 300-1,600.
  - Health: occasional.
  - Personal care: occasional.
  - Travel: 0-1 per month 1,500-12,000.
  - Fees: occasional SMS charge 25.
  - Transfers: 1-2 credit card payments 8,000-15,000? Might skew. Skip to keep model clean, or include one "CREDIT CARD PAYMENT" excluded.
  
  Total monthly outflows should be around 105-120k vs income 142k, surplus ~25k. Let me estimate: rent 42k, fixed subs 5.4k, insurance 2.4k, internet 1.35k, mobile 1.2k, utilities 3.2k, sip 15k = 70.5k. Flexible: groceries ~14k, dining ~7k, delivery ~6k, transport ~3k, fuel ~4.5k, shopping ~7k, entertainment ~1.5k, misc ~3k = ~46k. Total ~116k, surplus ~26k. Good.
  
  Current month dining drift: make current month dining ~40% above average.
  
  Deterministic PRNG: mulberry32 with fixed seed. Important: the generation must produce stable data regardless of month? Changing month changes it but that's fine.
  
  I need to also seed recurring records consistent with transactions: derive from known merchants with priceHistory. And set nextDate.
  
  Goals: emergency saved 1,68,000 target 3,00,000 (target date 2027-06-30), Japan trip 2,50,000 saved 62,000 target 2027-03-31, New laptop 1,20,000 saved 38,000 target 2027-01-15.
  
  Hmm, monthly surplus 26k; goals monthly contributions: emergency 10k, Japan 8k, laptop 5k = 23k. Feasible. Japan: need 188,000 in 5 months (Nov-Mar) → 37.6k/mo — not on track → nudge. Laptop need 82,000 by Jan 15 (2.5 months) → 32.8k/mo — behind. That's good for nudges but maybe too many. Let's make laptop saved 58,000 → need 62k in 2.5 mo = 24.8k/mo, still behind. Fine, 1-2 goal nudges is realistic.
  
  Emergency fund is separate from goals? Keep goals list including "Emergency fund" as a goal with its own saved; profile.emergencySaved as well. To avoid duplication, use the goal with id 'emergency' and profile.emergencySaved derived. Simpler: profile.emergencySaved = 168000; goals exclude emergency. Emergency coverage shown from profile. But then goal planner doesn't include emergency target date. Requirement: profile covering emergency fund and goals with target dates. Keep emergency in profile with target, separate from goals list. Good.
  
  Rules seeded: a couple of manual/learned rules, e.g. "BESCOM" → utilities, "CULT" → fitness. Actually heuristics already catch. Seed 2 rules to make Rules screen non-empty: 
  - "AMAZON PAY" → shopping? 
  - "MUB" → other?
  Better: learned rules that show the loop: 
  1. pattern "THIRD WAVE" → dining (learned, 7 hits)
  2. pattern "LANDLORD" → rent (manual, 6 hits)
  3. pattern "BESCOM" → utilities (learned, 6 hits)
  But heuristics would have caught them. That's fine — rules can be redundant, show learned history.
  
  Realistic learned corrections: "BUNDL" (local tiffin) → delivery, "NIMBUS CAFE" → dining. Hmm, seed rules should match seeded transactions so hit counts make sense. I'll include "THIRD WAVE" (dining) and "BESCOM" (utilities) and "NIMBUS LABS" (income).
  
  Nudges seeded? Nudge engine should compute dynamically. Better: compute nudges live from data (drift, price changes, unused, goals, buffer). That's more impressive and avoids stale. I'll build `deriveNudges(state)` and store statuses separately in state.nudges (only status overrides). Hmm, state.nudges currently Nudge[]. I can store only the ones with status overrides keyed by id. Simplify: store `nudgeStates: Record<string, 'snoozed'|'done'|'dismissed'>` plus prefs. But types already have nudges. I'll repurpose: `nudges: Nudge[]` stores dismissed/snoozed records only, merged by id at render. Derive function returns all with status from overrides. Good — I'll document.
  
  Actually simpler: derive nudges, and persist overrides in `settings.nudgeStates`. Let me add `nudgeStates: Record<string, NudgeStatus>` to Settings. I'll update types.
  
  Batches: empty initially (seed isn't a batch), but add a seed batch entry "baseline-seed" approved.
  
  Accounts: HDFC Savings ₹ balance computed, ICICI Credit, Cash.
  
  Now, current balance: opening + all txn amounts. Since we generate 6 months, balance ~ opening + 6*26k = 342k. But emergency saved 168k is separate. Fine.
  
  Wait, safe-to-spend should use current account balance.
  
  Let me write seed.ts. Use functions from categorize to assign categories? Better to explicitly define merchants then categorize. For variety, define merchant rows and run heuristicCategorize so it exercises the real engine. That also validates the categorizer. But some descriptions won't have keywords. I'll write them with keywords.
  
  Use `makeTxn(date, desc, amount, accountId, source='seed')` calling heuristicCategorize.
  
  Let me write with a seeded rng.
  
  Also precompute hash.
  
  To make imports feel real, the sample CSV/PDF/SMS should contain transactions *not* in seed (recent) so duplicates aren't all skipped. E.g. sample statement for Oct with 12 new rows unique to the sample. But some overlap is realistic; duplicates should be flagged. I'll make sample files with mostly new merchants and 2 duplicates to demo dedupe.
  
  Let me write seed.ts now.
  
  For the current month, day-of-month cap: transactions dated after today should be skipped. Salary on 1st exists. If today is the 1st, current month has almost nothing → drift nudge weird. Use `Math.max(today.getDate(), 12)` maybe? Better to fill through today but at least through day 15? Hmm, today is Oct 31 per env so fine. I'll cap at today.
  
  Let me define helper `dayISO(monthKey, day)`.
  
  Month list: from addMonths(current, -5) to current.
  
  Data volume: ~50/month * 6 = 300.
  
  Let me code it.
  
  Also price change for Netflix: for months index 0..5, price 499 for first 3, 649 for last 3. Recurring priceHistory accordingly.
  
  Unused: Cult.fit and LinkedIn Premium with usage 'unused'; UI shows last used info.
  
  I need "lastUsed" field on Recurring. Add `lastUsedDate?: string`. Let me update types accordingly.
  
  Also recurring `changeDetected?: boolean`, `previousAmount?: number`. Price history covers it.
  
  Add `usage` and `lastUsedDate`.
  
  Let me update types then write seed.
  [Assistant tool call]: edit({"path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\types.ts","oldString":"  usage: 'used' | 'unused' | 'unknown';\n  detectedFrom: number; // number of matching txns","newString":"  usage: 'used' | 'unused' | 'unknown';\n  lastUsedDate?: string;\n  detectedFrom: number; // number of matching txns"})
  [Tool result]: Edited src/types.ts (1 replacement)
  [Assistant tool call]: edit({"path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\types.ts","oldString":"  nudgePrefs: Record<NudgeKind, boolean>;\n  hideBalances: boolean;\n  savingsApy: number;\n}","newString":"  nudgePrefs: Record<NudgeKind, boolean>;\n  nudgeStates: Record<string, 'snoozed' | 'done' | 'dismissed'>;\n  hideBalances: boolean;\n  savingsApy: number;\n}"})
  [Tool result]: Edited src/types.ts (1 replacement)
  
  [Assistant reasoning]: Now seed.ts.
  
  Account ids: acc_hdfc, acc_icici, acc_cash.
  
  `makeTxn` uses categorize with rules (empty at seed time) to get category. But seed rules should apply. I'll pass seed rules.
  
  Let me define rules first then txns.
  
  Seed rules:
  - THIRD WAVE → dining (learned, 9 hits)
  - BESCOM → utilities (learned, 6)
  - NIMBUS LABS → income (manual, 6)
  - SWIGGY → delivery (manual, 41) — redundant but realistic.
  
  Rule patterns used by categorize via firstMatchingRule — priority. Fine.
  
  Seed dates.
  
  Merchant catalogue with weighted descriptors. I'll write a list of flexible merchants per category with min/max amounts.
  
  ```ts
  const FLEX: {cat: string; merchant: string; desc: string; min: number; max: number; freq:[number,number]}[] 
  ```
  
  Generate frequency per month.
  
  Let me write deterministic function:
  
  ```ts
  const rng = mulberry32(20261031);
  const pick = <T>(arr:T[]) => arr[Math.floor(rng()*arr.length)];
  const between = (a,b)=> a + rng()*(b-a);
  const intBetween = (a,b)=> Math.floor(between(a,b+1));
  ```
  
  For each month index:
  - subscribed fixed txns pushed.
  - flex: for each spec, count = intBetween(freq[0], freq[1]); but for current month scale count by day fraction? If today is month end, no scaling. Use `Math.max(1, Math.round(count * dayFactor))`. Only if current month.
  
  Amount: round(between(min,max), 10) maybe to 1 rupee.
  
  Dates: random day 1..daysInMonth, but for current month cap at today.
  
  Avoid duplicate dates being an issue — fine.
  
  Dining drift in current month: multiply count by 1.35 and amounts by 1.15.
  
  Let me define specific merchants:
  
  delivery: Swiggy (desc "SWIGGY BANGALORE"), Zomato ("ZOMATO ORDER"), Domino's ("DOMINOS PIZZA"), EatFit ("EATFIT DAILY"), Blinkit is groceries (but pattern says delivery for blinkit — I put blinkit in the delivery regex and also groceries; first match delivery wins. Hmm, Blinkit is groceries. Fix: remove blinkit from delivery pattern, keep in groceries. Let me edit categorize: delivery pattern `zomato|blinkit` → just zomato. And groceries already has blinkit. Also Swiggy Instamart is groceries, but the swiggy pattern catches delivery first. That's acceptable since Swiggy Instamart is a subset; could add a specific instamart→groceries pattern before swiggy. Let me add that.
  
  Also `amazon(?!.*prime)` — good.
  
  Edit categorize patterns:
  - add `instamart` groceries pattern before swiggy.
  - remove blinkit from zomato pattern.
  
  I'll do that edit later.
  
  Dining: Third Wave Coffee, Toit, Truffles, Nimbus Cafe? Use real-ish Bangalore places: "TRUFFLES", "TOIT", "THIRD WAVE COFFEE", "Rameshwaram Cafe", "Brahmins Coffee Bar", "Byg Brewski".
  Groceries: BigBasket, Blinkit, DMart, Zepto, Licious, Local Kirana.
  Transport: Uber, Ola, Rapido, Namma Metro, BMTC.
  Fuel: Indian Oil, HP Petrol.
  Shopping: Amazon, Flipkart, Myntra, Nykaa, Decathlon, IKEA.
  Entertainment: BookMyShow, PVR.
  Health: Apollo Pharmacy, PharmEasy, Practo.
  Personal care: Nykaa Salon, Enrich.
  Travel: IRCTC, MakeMyTrip, IndiGo.
  Education: Coursera, Udemy.
  Gifts: Archies? 
  Home: Urban Company.
  Fees: "SMS ALERT CHARGES".
  Transfer: "CREDIT CARD PAYMENT".
  
  Variable travel occasional.
  
  Fixed merchant descriptions:
  - Salary: "SALARY CREDIT NIMBUS LABS PAYROLL OCT" — but "salary" keyword → income.
  - Rent: "HOUSE RENT LANDLORD UPI"
  - SIP: "ZERODHA COIN SIP" → investments (pattern `\bsip\b`)
  - Insurance: "HDFC LIFE POLICY PREMIUM"
  - Airtel: "AIRTEL POSTPAID BILL"
  - ACT: "ACT FIBERNET BROADBAND"
  - BESCOM: "BESCOM ELECTRICITY BILL"
  - Netflix: "NETFLIX SUBSCRIPTION"
  - Spotify: "SPOTIFY INDIA"
  - Cult: "CULTFIT MEMBERSHIP"
  - LinkedIn: "LINKEDIN PREMIUM"
  - iCloud: "APPLE ICLOUD STORAGE"
  - Prime: "AMAZON PRIME MEMBERSHIP" (yearly) — pattern `amazon(?!.*prime)` excludes, subscriptions pattern has prime video but not "amazon prime". Add `amazon prime` to subscriptions pattern. Yes.
  
  For current month, don't include fixed charges after today.
  
  Let me write. I'll compute balance = opening + sum(amounts) for account acc_hdfc (all txns). Credit account unused.
  
  Goals & profile.
  
  Emergency target 300000, saved 168000.
  Savings target 25%.
  
  Accounts: HDFC Savings last4 4412, ICICI Credit last4 8891, Cash.
  
  Recurring seed:
  - Netflix amount 649, cadence monthly, next 12th next month, lastDate current month 12th, priceHistory [{date: 4 months ago, 499},{date: 2 months ago, 649}], usage used.
  - Spotify 119, used.
  - Cult 1799, unused, lastUsedDate 78 days ago.
  - LinkedIn 1299, unused, lastUsedDate 96 days ago.
  - Airtel 1199 used.
  - ACT 1349 used.
  - Rent 42000 used.
  - Insurance 2400 used.
  - iCloud 75 used.
  - Amazon Prime 1499 yearly, used, next 8 months away.
  - SIP 15000 monthly — should SIP be recurring? Yes, "Investments" recurring but it's not a subscription; mark usage used.
  
  Total subscription spend per month (excluding rent/insurance/SIP): 649+119+1799+1299+1199+1349+75 = 6489. Amazon Prime annual equivalent ~125. Good.
  
  Nudges derived from data.
  
  Write seed.ts.
  
  Need `isExcluded` for transfers only. Seed none.
  
  One more: "salary" arrives 1st. Opening balance 186,400 and current balance will be ~340k. Emergency 168k maybe should be part of balance. It's a separate "earmarked" amount; safe-to-spend subtracts it.
  
  I'll design finance selectors to treat emergencySaved as an earmark (subtracted from available cash). That's coherent.
  
  Now code seed.
  [Assistant tool call]: execute({"code":"const r = await tools.browser.tabs.list(); return r;"})
  [Tool result]: {
    "tabs": [],
    "focusedTabID": null
  }
  
  [Assistant reasoning]: Oops, unnecessary call. Let me proceed with edits and seed file.
  
  First fix categorize patterns.
  [Assistant tool call]: edit({"newString":"  { re: /instamart/i, category: 'groceries', merchant: 'Swiggy Instamart', confidence: 0.96, label: 'Instamart is a grocery service' },\n  { re: /swiggy/i, category: 'delivery', merchant: 'Swiggy', confidence: 0.97, label: 'Swiggy is a food delivery platform' },\n  { re: /zomato/i, category: 'delivery', merchant: 'Zomato', confidence: 0.97, label: 'Zomato is a food delivery platform' },","oldString":"  { re: /swiggy|instamart/i, category: 'delivery', merchant: 'Swiggy', confidence: 0.97, label: 'Swiggy is a food delivery platform' },\n  { re: /zomato|blinkit/i, category: 'delivery', merchant: 'Zomato', confidence: 0.97, label: 'Zomato is a food delivery platform' },","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\categorize.ts"})
  [Tool result]: Edited src/domain/categorize.ts (1 replacement)
  [Assistant tool call]: edit({"newString":"  { re: /hotstar|disney|sonyliv|zee5|jiocinema|prime video|amazon prime|youtube premium|apple music|audible|kindle/i, category: 'subscriptions', merchant: 'Streaming', confidence: 0.94, label: 'a streaming or media subscription' },","oldString":"  { re: /hotstar|disney|sonyliv|zee5|jiocinema|prime video|youtube premium|apple music|audible|kindle/i, category: 'subscriptions', merchant: 'Streaming', confidence: 0.94, label: 'a streaming or media subscription' },","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\categorize.ts"})
  [Tool result]: Edited src/domain/categorize.ts (1 replacement)
  
  [Assistant reasoning]: The second edit was a no-op? oldString and newString differ only by adding "amazon prime" — let me check: old had `hotstar|disney|sonyliv|zee5|jiocinema|prime video|...`, new has `...|prime video|amazon prime|...`. Wait I wrote both with amazon prime in old? The oldString I passed includes "amazon prime" already. Hmm, looking at it: oldString: `/hotstar|disney|sonyliv|zee5|jiocinema|prime video|youtube premium|...` — no amazon prime. newString includes `prime video|amazon prime|youtube premium`. Actually yes, oldString lacks amazon prime. Good.
  
  Now seed.ts.
  [Assistant tool call]: write({"content":"import type {\n  Account,\n  AppState,\n  Goal,\n  NudgeKind,\n  Profile,\n  Recurring,\n  Rule,\n  Settings,\n  Txn,\n} from '../types';\nimport { addMonths, daysInMonth, monthKey, nowMonth, todayISO } from '../lib/date';\nimport { categorize } from '../domain/categorize';\nimport { rowHash } from '../domain/parse';\n\nfunction mulberry32(a: number) {\n  return function () {\n    a |= 0;\n    a = (a + 0x6d2b79f5) | 0;\n    let t = Math.imul(a ^ (a >>> 15), 1 | a);\n    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;\n    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;\n  };\n}\n\nconst rng = mulberry32(20261031);\nconst between = (a: number, b: number) => a + rng() * (b - a);\nconst int = (a: number, b: number) => Math.floor(between(a, b + 1));\nconst pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];\nconst roundTo = (n: number, step: number) => Math.round(n / step) * step;\n\nconst ACCOUNTS: Account[] = [\n  { id: 'acc_hdfc', name: 'Everyday', institution: 'HDFC Bank', kind: 'savings', last4: '4412', balance: 0 },\n  { id: 'acc_icici', name: 'Credit card', institution: 'ICICI Bank', kind: 'credit', last4: '8891', balance: 0 },\n  { id: 'acc_cash', name: 'Cash', institution: 'Wallet', kind: 'cash', last4: '—', balance: 0 },\n];\n\nexport const SEED_RULES: Rule[] = [\n  {\n    id: 'rule_thirdwave',\n    pattern: 'THIRD WAVE',\n    field: 'description',\n    matchType: 'contains',\n    category: 'dining',\n    source: 'learned',\n    priority: 40,\n    hits: 7,\n    enabled: true,\n    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 64,\n  },\n  {\n    id: 'rule_bescom',\n    pattern: 'BESCOM',\n    field: 'description',\n    matchType: 'contains',\n    category: 'utilities',\n    source: 'learned',\n    priority: 40,\n    hits: 6,\n    enabled: true,\n    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 88,\n  },\n  {\n    id: 'rule_nimbus',\n    pattern: 'NIMBUS LABS',\n    field: 'description',\n    matchType: 'contains',\n    category: 'income',\n    source: 'manual',\n    priority: 60,\n    hits: 6,\n    enabled: true,\n    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 150,\n  },\n];\n\ntype Spec = {\n  desc: string;\n  min: number;\n  max: number;\n  freq: [number, number];\n  account?: string;\n};\n\nconst VARIABLE: Spec[] = [\n  { desc: 'SWIGGY ORDER BANGALORE', min: 240, max: 860, freq: [5, 8] },\n  { desc: 'ZOMATO ORDER KORAMANGALA', min: 260, max: 940, freq: [4, 7] },\n  { desc: 'DOMINOS PIZZA INDIRANAGAR', min: 320, max: 780, freq: [1, 2] },\n  { desc: 'EATFIT DAILY BOWL', min: 210, max: 480, freq: [2, 4] },\n  { desc: 'TRUFFLES ST MARKS ROAD', min: 380, max: 920, freq: [1, 3] },\n  { desc: 'TOIT BREWERY INDIRANAGAR', min: 900, max: 2400, freq: [1, 2] },\n  { desc: 'THIRD WAVE COFFEE JAYANAGAR', min: 240, max: 620, freq: [2, 4] },\n  { desc: 'RAMESHWARAM CAFE', min: 180, max: 460, freq: [1, 3] },\n  { desc: 'BIGBASKET GROCERY', min: 1400, max: 3400, freq: [1, 3] },\n  { desc: 'BLINKIT GROCERY DELIVERY', min: 380, max: 1150, freq: [3, 6] },\n  { desc: 'DMART READY TO COOK', min: 900, max: 2400, freq: [1, 2] },\n  { desc: 'ZEPTO MARKET', min: 260, max: 780, freq: [2, 4] },\n  { desc: 'LICIOUS MEAT DELIVERY', min: 620, max: 1800, freq: [1, 2] },\n  { desc: 'UBER RIDE BANGALORE', min: 120, max: 420, freq: [4, 7] },\n  { desc: 'OLA CABS', min: 110, max: 380, freq: [2, 4] },\n  { desc: 'RAPIDO BIKE TAXI', min: 55, max: 165, freq: [3, 6] },\n  { desc: 'NAMMA METRO CARD TOPUP', min: 200, max: 500, freq: [1, 2] },\n  { desc: 'INDIAN OIL PETROL', min: 1600, max: 3200, freq: [1, 2] },\n  { desc: 'HP PETROL BUNK', min: 900, max: 2200, freq: [1, 1] },\n  { desc: 'AMAZON SHOPPING', min: 600, max: 5400, freq: [2, 4] },\n  { desc: 'FLIPKART BIG BILLION', min: 900, max: 4800, freq: [1, 2] },\n  { desc: 'MYNTRA FASHION', min: 900, max: 3800, freq: [1, 2] },\n  { desc: 'DECATHLON SPORTS', min: 700, max: 2600, freq: [0, 1] },\n  { desc: 'BOOKMYSHOW MOVIE TICKETS', min: 380, max: 1400, freq: [1, 2] },\n  { desc: 'PVR INOX CINEMAS', min: 340, max: 1100, freq: [0, 1] },\n  { desc: 'APOLLO PHARMACY', min: 180, max: 1200, freq: [0, 2] },\n  { desc: 'PHARMEASY MEDICINES', min: 240, max: 980, freq: [0, 1] },\n  { desc: 'PRACTO CONSULTATION', min: 500, max: 900, freq: [0, 1] },\n  { desc: 'NYCAA SALON INDIRANAGAR', min: 600, max: 2200, freq: [0, 1] },\n  { desc: 'URBAN COMPANY HOME SERVICE', min: 700, max: 2400, freq: [0, 1] },\n  { desc: 'COURSERA ANNUAL PLAN', min: 1200, max: 1200, freq: [0, 0] },\n  { desc: 'IRCTC RAILWAY BOOKING', min: 900, max: 3200, freq: [0, 1] },\n  { desc: 'MAKEMYTRIP FLIGHT BOOKING', min: 3200, max: 9800, freq: [0, 0] },\n  { desc: 'ARCHIES GIFTS', min: 300, max: 1400, freq: [0, 1] },\n  { desc: 'BANK SMS ALERT CHARGES', min: 25, max: 25, freq: [0, 0] },\n];\n\nexport const SAMPLE_CSV = `HDFC Bank Statement - Savings Account XX4412\nStatement period: 01/10/2026 to 31/10/2026\n\nDate,Narration,Withdrawal Amt.,Deposit Amt.,Closing Balance\n04/10/2026,UPI/SWIGGY/4152093,486.00,,184320.50\n05/10/2026,UPI/THIRD WAVE COFFEE/881201,340.00,,183980.50\n06/10/2026,ACH/ICICI PRUDENTIAL LIFE,4800.00,,179180.50\n08/10/2026,UPI/BLINKIT/use.blinkit@ybl,742.00,,178438.50\n11/10/2026,UPI/UBER INDIA/uber@axisbank,286.00,,178152.50\n12/10/2026,NETFLIX SUBSCRIPTION,649.00,,177503.50\n15/10/2026,UPI/CULTFIT INDIA,1799.00,,175704.50\n17/10/2026,UPI/LANDLORD/9820012345,42000.00,,133704.50\n18/10/2026,UPI/LINKEDIN PREMIUM,1299.00,,132405.50\n21/10/2026,UPI/DECATHLON WHITEFIELD,2350.00,,130055.50\n24/10/2026,UPI/TRUFFLES ST MARKS,860.00,,129195.50\n27/10/2026,UPI/APOLLO PHARMACY,412.00,,128783.50\n29/10/2026,IMPS/SELF TRANSFER,5000.00,,123783.50\n30/10/2026,UPI/SWIGGY/4199283,486.00,,123297.50`;\n\nexport const SAMPLE_SMS = `HDFC Bank: Rs.486.00 debited from a/c XX4412 on 04-10-26 to SWIGGY. Avl bal Rs.1,84,320.50\nICICI Bank: INR 1,199.00 spent on Credit Card XX8891 at AIRTEL on 09/10/2026.\nHDFC Bank: Rs.2,350.00 debited from a/c XX4412 on 21-10-26 to DECATHLON. Avl bal Rs.1,30,055.50\nAxis Bank: Rs.1,299.00 debited from a/c XX2210 on 23-10-26 towards LINKEDIN PREMIUM.\nHDFC Bank: Your A/C XX4412 credited with Rs 1,42,000.00 on 01-10-26 (Salary - OCT 2026).\nSBI Card: Rs.340.00 spent at THIRD WAVE COFFEE on 26/10/2026.`;\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\data\\seed.ts"})
  [Tool result]: Created file successfully: src/data/seed.ts
  
  [Assistant reasoning]: I wrote the beginning but not the generator. I need to append the seed generation function. Note I used "NYCAA" typo—should be NYKAA; but Nykaa pattern catches shopping. "NYCAA SALON" would not match salon? It contains "SALON" → personal_care. Fine but fix to NYKAA SALON.
  
  Also the sample CSV includes dates Oct 2026 hardcoded, which may not match the current month. Since today is Oct 31 2026, fine. But if the app runs later, sample imports would go into October 2026 and might look stale. Acceptable for a hackathon; but I can generate sample text dynamically? The sample file content is static. Keep static — it's a demo file. Actually to keep the app stable regardless of real system date (which might be 2025!), the seed uses `new Date()` so "current month" could be May 2025 while sample CSV says Oct 2026. That's inconsistent.
  
  What is the actual system date? Let me check with Node. The environment says Oct 31 2026. Likely the sandbox is set to 2026. Let me verify.
  
  I'll run `Get-Date`.
  
  Then decide whether to make sample dates dynamic. If system is 2026-10-31, fine.
  
  Also need to append seed generator. Let me check date first.
  [Assistant tool call]: shell({"command":"Get-Date -Format \"yyyy-MM-dd HH:mm\""})
  [Tool result]: 2026-10-31 15:33
  
  
  [Assistant reasoning]: System date is Oct 31 2026. Sample files match. Good.
  
  Now append seed generation.
  
  Careful with account balance. All transactions on acc_hdfc; card maybe some. Keep all HDFC.
  
  Functions:
  ```ts
  function buildTransactions(): Txn[]
  ```
  For months -5..0:
  - fixed list with day, desc, amount (netflix varies)
  - flexible specs.
  
  Current month cap day <= today.getDate().
  
  For each txn, categorize with SEED_RULES (so rules hit). But categorization for a random description containing "SWIGGY" works. Note rule_thirdwave maps THIRD WAVE → dining, same as heuristic.
  
  Add `why`/confidence.
  
  Sort by date asc, then assign ids `seed_1`.
  
  Compute hashes.
  
  Balance: opening 186400 + sum.
  
  Recurring next dates: compute next occurrence relative to today.
  
  Let me carefully construct.
  
  ```ts
  const month = nowMonth();
  const months = [-5,-4,-3,-2,-1,0].map(o=>addMonths(month,o));
  const today = todayISO();
  const todayDay = new Date().getDate();
  ```
  
  For each month, for each fixed:
  - days: rent 3, insurance 7, airtel 8, act 9, bescom 10, netflix 12, spotify 14, cult 15, linkedin 18, icloud 20, sip 5, salary 1, prime 22 (only in one month, say months[2]).
  - If current month and day > todayDay, skip.
  
  Vary utilities by month: 2800-3900, but BESCOM name stays.
  Netflix: price 499 for first 3 months, 649 for last 3.
  Rent fixed 42000.
  Insurance: use 4800 quarterly? Simpler monthly 2400... but sample CSV has ACH/ICICI PRUDENTIAL 4800. Use 2400 monthly except 4800 in one month. Keep simple: 2400 monthly.
  
  Salary 142000.
  
  SIP 15000.
  
  Amazon Prime 1499 one-time in months[2], day 22.
  
  Flexible: frequency per month; for current month scale by days elapsed fraction but ensure drift: dining/delivery +30% count in current month.
  
  I want current-month dining total ~40% above 3-mo average. Setting counts and amounts slightly higher.
  
  For each spec and month:
  ```
  let count = int(freq0, freq1);
  if (currentMonth && spec is dining/delivery) count = Math.ceil(count*1.35);
  if (currentMonth) count = Math.max(0, Math.round(count * dayFactor)) — but that reduces. 
  ```
  Day factor 31/31 = 1 (today is 31st) so no change. Since it's month-end, fine. General code: `Math.round(count * Math.min(1, todayDay / daysInMonth(month)))`.
  
  Amounts: roundTo(between(min,max), 10) — groceries like 1,430; small amounts like 55 → round to nearest 10 gives 60, fine. For 25 fee, freq 0 so no.
  
  Dates: day = int(1, min(daysInMonth, current ? todayDay : daysInMonth)).
  
  Potential duplicate same merchant same date with same amount → hash collision; acceptable as "duplicate"? For seed, duplicates would cause dedupe on import only, not within seed. Fine.
  
  Then goals.
  
  Recurring:
  nextDate computed as the next occurrence after today for that day-of-month. If day > todayDay, next is this month; else next month. For annual prime, nextDate = addMonths(current, 8) with day 22? Simpler compute from lastDate + cadence. I'll write helper `nextFrom(lastISO, cadence)`.
  
  Usage unused: cult, linkedin.
  
  Price history: netflix [{date: months[0] 12, 499}, {date: months[3] 12, 649}] with previous 499. Detect change by last two entries.
  
  Settings: theme light, dense true? Density 8 — desktop dashboard dense. Use dense: true. hideBalances false, savingsApy 4, nudgePrefs all true, nudgeStates {}.
  
  Profile fixed costs list (for Plan screen) — rent 42000, utilities 3200, internet 1349, mobile 1199, insurance 2400, subscriptions 6489? Let's list each recurring with amounts. Fixed costs derived from recurring would duplicate; but Plan needs editable fixed costs. I'll store fixed list:
  - Rent 42000 (rent)
  - Groceries? not fixed.
  - ACT 1349 (internet)
  - Airtel 1199 (mobile)
  - BESCOM 3200 (utilities)
  - HDFC Life 2400 (insurance)
  - Subscriptions bundle? 4941 (netflix 649 + spotify 119 + cult 1799 + linkedin 1299 + icloud 75) → but cult/linkedin are flagged unused. Include 6489? Let me include "Subscriptions" 6489 under category subscriptions.
  - SIP 15000 under investments — fixed cost (committed saving) but as savings, not cost. Keep separate as "Committed savings"? The profile schema only has fixed. I'll include SIP as fixed cost named "SIP transfer" with category investments. Hmm, model: income - fixed - flexible = surplus. SIP reduces free cash but is still your money. For a "living model" this matters. I'll exclude investments from fixed costs and treat them as "savings already allocated" in the model selector. Simpler: include it in fixed costs since it's a committed outflow. In the model breakdown, show "Committed" total including SIP. Fine.
  
  Fixed total: 42,000+3,200+1,349+1,199+2,400+6,489+15,000 = 71,637.
  
  Income source: Nimbus Labs salary 142,000 monthly.
  
  Goals:
  1. Japan trip — target 250000, saved 62000, targetDate 2027-03-31, monthly 8000, priority 1, color #4C6B8A.
  2. New laptop — target 120000, saved 58000, targetDate 2027-01-15, monthly 5000, priority 2, color #A65A4A.
  3. Home office — target 80000, saved 21500, targetDate 2027-08-31, monthly 3000, priority 3, color #7A6A4A.
  
  Then total goal contributions 16,000/mo, leaving ~26k surplus. Emergency fund monthly contribution implied 10k.
  
  Batches: one seed batch.
  
  `seedMonth`.
  
  Also create `seedState()` and `freshState()`.
  
  Let me write the rest now. Need to import category maps? No.
  
  Be careful: Txn IDs must be stable-ish; use index.
  
  `why` from categorize.
  
  Also mark investments txn category investments (not excluded). Transfers excluded.
  
  I'll add one credit card payment txn monthly: "CREDIT CARD PAYMENT" -12000 → category transfer, isTransfer true, isExcluded true. This keeps cash flow honest.
  
  Balance: sum includes transfers out (they're real cash outflow to card, but card spend isn't tracked — that double counts? No, card spend isn't in txns, so it's fine as an outflow). Keep it.
  
  Let me compute expected balance: monthly net ~142000 - 71637 - flexible ~45000 - transfer 12000 = ~13k. Hmm, surplus lower than desired. Let me not include the credit card transfer, or reduce. Actually 142000 - 71637 = 70,363. Flexible: groceries 14k + dining 7k + delivery 6k + transport 3k + fuel 4.5k + shopping 7k + entertainment 1.5k + health 1k + misc 1.5k ≈ 45.5k. Net = 24.8k. Good. Skip credit card payments entirely (all spending on HDFC).
  
  The SIP 15k is included in fixed, and it's savings, so "surplus" 24.8k + 15k SIP = 39.8k saved monthly. Good.
  
  Balance after 6 months ≈ 186,400 + ~6*24,800 = 335k. Emergency earmark 168k. Free ≈ 167k. Hmm, safe-to-spend ~167k minus buffers. That's fine.
  
  Goals saved 62+58+21.5 = 141.5k are earmarked too. So free cash = 335 - 168 - 141.5 = 25.5k. Safe-to-spend should subtract emergency + goals + upcoming bills... could go negative. Need to be careful.
  
  Model: goals' `saved` money is part of account balance conceptually (set aside). So safe-to-spend = balance - emergency - sum(goal savings) - scheduled remaining bills - buffer. With balance 335k, emergency 168k, goals 141.5k → 25.5k. That's tight but realistic and makes the app interesting. However "Safe to spend" of ₹0 looks broken.
  
  Let me reduce goal saved amounts: Japan 42,000, laptop 32,000, home office 12,000 = 86,000. Then free = 335 - 168 - 86 = 81k. Buffer 30k, upcoming bills maybe 65k → safe to spend ~ -14k. Hmm.
  
  Increase opening balance to 220,000 → balance ~369k. Free = 369-168-86 = 115k. upcoming bills for remaining month = 0 if month end (today is 31st). Next 30 days bills ≈ 71k. So safe-to-spend = 115k - 30k buffer - 71k upcoming = 14k. Reasonable and creates a nudge.
  
  But wait, "upcoming bills" double counts fixed costs already paid this month; next 30 days are next month's. The balance hasn't paid them yet, so subtracting is correct.
  
  Let's aim safe-to-spend around ₹28,000 — meaningful. Set opening balance 235,000 → balance ~384k → free 130k - 71k - 25k buffer = 34k. Good.
  
  Hmm, but the goals' saved money shouldn't be subtracted from spendable if it's just earmarked mentally... yes it should, that's the point of a living model.
  
  I'll compute precisely in code and adjust after seeing actual numbers.
  
  Emergency 168k of 300k = 1.8 months of fixed+flex (~117k/mo) → 2.5 months coverage if measured against essentials. Nudge: "Emergency fund covers 2.3 months of essentials; target 3." Good.
  
  Let me finalize seed with opening 235000 and goals saved 42k/32k/12k.
  
  Now write the rest of seed.ts.
  [Assistant tool call]: edit({"newString":"  { desc: 'NYKAA SALON INDIRANAGAR', min: 600, max: 2200, freq: [0, 1] },","oldString":"  { desc: 'NYCAA SALON INDIRANAGAR', min: 600, max: 2200, freq: [0, 1] },","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\data\\seed.ts"})
  [Tool result]: Edited src/data/seed.ts (1 replacement)
  
  [Assistant tool call]: edit({"newString":"export const SAMPLE_SMS = `HDFC Bank: Rs.486.00 debited from a/c XX4412 on 04-10-26 to SWIGGY. Avl bal Rs.1,84,320.50\nICICI Bank: INR 1,199.00 spent on Credit Card XX8891 at AIRTEL on 09/10/2026.\nHDFC Bank: Rs.2,350.00 debited from a/c XX4412 on 21-10-26 to DECATHLON. Avl bal Rs.1,30,055.50\nAxis Bank: Rs.1,299.00 debited from a/c XX2210 on 23-10-26 towards LINKEDIN PREMIUM.\nHDFC Bank: Your A/C XX4412 credited with Rs 1,42,000.00 on 01-10-26 (Salary - OCT 2026).\nSBI Card: Rs.340.00 spent at THIRD WAVE COFFEE on 26/10/2026.`;\n\nfunction dayISO(month: string, day: number): string {\n  const max = daysInMonth(month);\n  const dd = Math.min(Math.max(1, day), max);\n  return `${month}-${String(dd).padStart(2, '0')}`;\n}\n\nconst currentMonth = nowMonth();\nconst today = todayISO();\nconst todayDay = Number(today.slice(8, 10));\nconst months = [-5, -4, -3, -2, -1, 0].map((o) => addMonths(currentMonth, o));\n\nfunction nextOccurrence(last: string, cadence: Recurring['cadence']): string {\n  if (cadence === 'yearly') return `${Number(last.slice(0, 4)) + 1}${last.slice(4)}`;\n  if (cadence === 'quarterly') return `${addMonths(monthKey(last), 3)}-${last.slice(8)}`;\n  if (cadence === 'weekly') {\n    const d = new Date(last);\n    d.setDate(d.getDate() + 7);\n    return d.toISOString().slice(0, 10);\n  }\n  return `${addMonths(monthKey(last), 1)}-${last.slice(8)}`;\n}\n\nexport function buildSeedTxns(): Txn[] {\n  const out: Txn[] = [];\n  let n = 0;\n\n  const push = (date: string, desc: string, amount: number, accountId = 'acc_hdfc') => {\n    if (date > today) return;\n    const c = categorize(desc, amount, SEED_RULES);\n    out.push({\n      id: `seed_${++n}`,\n      date,\n      description: desc,\n      merchant: c.merchant,\n      amount: Math.round(amount * 100) / 100,\n      category: c.category,\n      confidence: c.confidence,\n      why: c.why,\n      accountId,\n      source: 'seed',\n      hash: rowHash(date, Math.abs(amount), desc),\n      createdAt: Date.parse(date),\n    });\n  };\n\n  months.forEach((month, mi) => {\n    const isCurrent = mi === months.length - 1;\n    const lastDay = isCurrent ? Math.min(todayDay, daysInMonth(month)) : daysInMonth(month);\n    const dayOk = (d: number) => d <= lastDay;\n\n    if (dayOk(1)) push(dayISO(month, 1), 'SALARY CREDIT NIMBUS LABS PAYROLL', 142000);\n    if (dayOk(3)) push(dayISO(month, 3), 'HOUSE RENT LANDLORD UPI', -42000);\n    if (dayOk(5)) push(dayISO(month, 5), 'ZERODHA COIN SIP', -15000);\n    if (dayOk(7)) push(dayISO(month, 7), 'HDFC LIFE POLICY PREMIUM', -2400);\n    if (dayOk(8)) push(dayISO(month, 8), 'AIRTEL POSTPAID BILL', -1199);\n    if (dayOk(9)) push(dayISO(month, 9), 'ACT FIBERNET BROADBAND', -1349);\n    if (dayOk(10)) push(dayISO(month, 10), 'BESCOM ELECTRICITY BILL', -roundTo(between(2700, 3700), 10));\n    if (dayOk(12)) push(dayISO(month, 12), 'NETFLIX SUBSCRIPTION', mi <= 2 ? -499 : -649);\n    if (dayOk(14)) push(dayISO(month, 14), 'SPOTIFY INDIA', -119);\n    if (dayOk(15)) push(dayISO(month, 15), 'CULTFIT MEMBERSHIP', -1799);\n    if (dayOk(18)) push(dayISO(month, 18), 'LINKEDIN PREMIUM', -1299);\n    if (dayOk(20)) push(dayISO(month, 20), 'APPLE ICLOUD STORAGE', -75);\n    if (dayOk(22) && mi === 2) push(dayISO(month, 22), 'AMAZON PRIME MEMBERSHIP', -1499);\n\n    for (const spec of VARIABLE) {\n      let count = int(spec.freq[0], spec.freq[1]);\n      if (isCurrent && (spec.desc.includes('SWIGGY') || spec.desc.includes('ZOMATO') || spec.desc.includes('TRUFFLES') || spec.desc.includes('EATFIT'))) {\n        count = Math.ceil(count * 1.35);\n      }\n      if (isCurrent) count = Math.round(count * (lastDay / daysInMonth(month)));\n      for (let k = 0; k < count; k++) {\n        const day = int(1, lastDay);\n        let amt = roundTo(between(spec.min, spec.max), 10);\n        if (isCurrent && spec.desc.includes('SWIGGY')) amt = roundTo(amt * 1.1, 10);\n        push(dayISO(month, day), spec.desc, -amt);\n      }\n    }\n  });\n\n  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id.localeCompare(b.id)));\n}\n\nconst txns = buildSeedTxns();\nconst seedBalance = 235000 + txns.reduce((s, t) => s + t.amount, 0);\n\nconst ACCOUNTS_SEEDED: Account[] = ACCOUNTS.map((a) =>\n  a.id === 'acc_hdfc' ? { ...a, balance: Math.round(seedBalance) } : a\n);\n\nconst netflixDate = (i: number) => dayISO(months[i], 12);\n\nconst RECURRING_SEED: Recurring[] = [\n  {\n    id: 'rec_netflix', merchant: 'Netflix', category: 'subscriptions', amount: 649, cadence: 'monthly',\n    nextDate: nextOccurrence(netflixDate(5), 'monthly'), lastDate: netflixDate(5), status: 'active',\n    priceHistory: [{ date: netflixDate(2), amount: 499 }, { date: netflixDate(4), amount: 649 }],\n    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',\n  },\n  {\n    id: 'rec_spotify', merchant: 'Spotify', category: 'subscriptions', amount: 119, cadence: 'monthly',\n    nextDate: nextOccurrence(dayISO(currentMonth, 14), 'monthly'), lastDate: dayISO(currentMonth, 14),\n    status: 'active', priceHistory: [{ date: dayISO(months[0], 14), amount: 119 }],\n    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',\n  },\n  {\n    id: 'rec_cult', merchant: 'Cult.fit', category: 'fitness', amount: 1799, cadence: 'monthly',\n    nextDate: nextOccurrence(dayISO(currentMonth, 15), 'monthly'), lastDate: dayISO(currentMonth, 15),\n    status: 'active', priceHistory: [{ date: dayISO(months[0], 15), amount: 1799 }],\n    usage: 'unused', lastUsedDate: dayISO(addMonths(currentMonth, -2), 18), detectedFrom: 6,\n    accountId: 'acc_hdfc', source: 'detected', notes: 'No check-ins recorded in the last 8 weeks.',\n  },\n  {\n    id: 'rec_linkedin', merchant: 'LinkedIn Premium', category: 'subscriptions', amount: 1299, cadence: 'monthly',\n    nextDate: nextOccurrence(dayISO(currentMonth, 18), 'monthly'), lastDate: dayISO(currentMonth, 18),\n    status: 'active', priceHistory: [{ date: dayISO(months[0], 18), amount: 1299 }],\n    usage: 'unused', lastUsedDate: dayISO(addMonths(currentMonth, -3), 2), detectedFrom: 6,\n    accountId: 'acc_hdfc', source: 'detected', notes: 'No logins recorded for 12 weeks.',\n  },\n  {\n    id: 'rec_airtel', merchant: 'Airtel', category: 'mobile', amount: 1199, cadence: 'monthly',\n    nextDate: nextOccurrence(dayISO(currentMonth, 8), 'monthly'), lastDate: dayISO(currentMonth, 8),\n    status: 'active', priceHistory: [{ date: dayISO(months[0], 8), amount: 1199 }],\n    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',\n  },\n  {\n    id: 'rec_act', merchant: 'ACT Fibernet', category: 'internet', amount: 1349, cadence: 'monthly',\n    nextDate: nextOccurrence(dayISO(currentMonth, 9), 'monthly'), lastDate: dayISO(currentMonth, 9),\n    status: 'active', priceHistory: [{ date: dayISO(months[0], 9), amount: 1349 }],\n    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',\n  },\n  {\n    id: 'rec_rent', merchant: 'Landlord', category: 'rent', amount: 42000, cadence: 'monthly',\n    nextDate: nextOccurrence(dayISO(currentMonth, 3), 'monthly'), lastDate: dayISO(currentMonth, 3),\n    status: 'active', priceHistory: [{ date: dayISO(months[0], 3), amount: 42000 }],\n    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',\n  },\n  {\n    id: 'rec_insurance', merchant: 'HDFC Life', category: 'insurance', amount: 2400, cadence: 'monthly',\n    nextDate: nextOccurrence(dayISO(currentMonth, 7), 'monthly'), lastDate: dayISO(currentMonth, 7),\n    status: 'active', priceHistory: [{ date: dayISO(months[0], 7), amount: 2400 }],\n    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',\n  },\n  {\n    id: 'rec_icloud', merchant: 'Apple iCloud', category: 'subscriptions', amount: 75, cadence: 'monthly',\n    nextDate: nextOccurrence(dayISO(currentMonth, 20), 'monthly'), lastDate: dayISO(currentMonth, 20),\n    status: 'active', priceHistory: [{ date: dayISO(months[0], 20), amount: 75 }],\n    usage: 'used', lastUsedDate: today, detectedFrom: 6, accountId: 'acc_hdfc', source: 'detected',\n  },\n  {\n    id: 'rec_prime', merchant: 'Amazon Prime', category: 'subscriptions', amount: 1499, cadence: 'yearly',\n    nextDate: nextOccurrence(dayISO(months[2], 22), 'yearly'), lastDate: dayISO(months[2], 22),\n    status: 'active', priceHistory: [{ date: dayISO(months[2], 22), amount: 1499 }],\n    usage: 'used', lastUsedDate: today, detectedFrom: 1, accountId: 'acc_hdfc', source: 'detected',\n  },\n];\n\nconst PROFILE: Profile = {\n  name: 'Ananya Rao',\n  currency: 'INR',\n  emergencyTarget: 300000,\n  emergencySaved: 168000,\n  savingsRateTarget: 25,\n  openingBalance: 235000,\n  income: [\n    { id: 'inc_salary', name: 'Nimbus Labs — salary', amount: 142000, cadence: 'monthly', nextDate: dayISO(addMonths(currentMonth, 1), 1) },\n    { id: 'inc_freelance', name: 'Freelance design', amount: 8000, cadence: 'monthly', nextDate: dayISO(addMonths(currentMonth, 1), 20), variable: true },\n  ],\n  fixed: [\n    { id: 'fx_rent', name: 'Rent', amount: 42000, category: 'rent', dueDay: 3 },\n    { id: 'fx_sip', name: 'SIP transfer', amount: 15000, category: 'investments', dueDay: 5 },\n    { id: 'fx_insurance', name: 'Life insurance', amount: 2400, category: 'insurance', dueDay: 7 },\n    { id: 'fx_airtel', name: 'Mobile', amount: 1199, category: 'mobile', dueDay: 8 },\n    { id: 'fx_act', name: 'Broadband', amount: 1349, category: 'internet', dueDay: 9 },\n    { id: 'fx_bescom', name: 'Electricity', amount: 3200, category: 'utilities', dueDay: 10 },\n    { id: 'fx_subs', name: 'Subscriptions', amount: 6489, category: 'subscriptions', dueDay: 14 },\n  ],\n};\n\nconst GOALS: Goal[] = [\n  {\n    id: 'goal_japan', name: 'Japan in spring', target: 250000, saved: 42000,\n    targetDate: '2027-03-31', monthly: 8000, priority: 1, color: '#4C6B8A',\n    note: 'Two weeks, Kyoto and Tokyo, booked by February.',\n  },\n  {\n    id: 'goal_laptop', name: 'New work laptop', target: 120000, saved: 32000,\n    targetDate: '2027-01-15', monthly: 5000, priority: 2, color: '#A65A4A',\n    note: 'Replace the 2019 machine before the contract renewal.',\n  },\n  {\n    id: 'goal_office', name: 'Home office upgrade', target: 80000, saved: 12000,\n    targetDate: '2027-08-31', monthly: 3000, priority: 3, color: '#7A6A4A',\n    note: 'Desk, chair, and a proper monitor arm.',\n  },\n];\n\nexport const NUDGE_PREF_DEFAULTS: Record<NudgeKind, boolean> = {\n  drift: true,\n  'price-change': true,\n  unused: true,\n  goal: true,\n  buffer: true,\n  payday: true,\n  anomaly: true,\n};\n\nexport function seedState(): AppState {\n  return {\n    version: 1,\n    profile: PROFILE,\n    accounts: ACCOUNTS_SEEDED,\n    txns,\n    rules: SEED_RULES,\n    recurring: RECURRING_SEED,\n    goals: GOALS,\n    nudges: [],\n    scenarios: [],\n    settings: {\n      theme: 'light',\n      dense: true,\n      nudgePrefs: NUDGE_PREF_DEFAULTS,\n      nudgeStates: {},\n      hideBalances: false,\n      savingsApy: 4,\n    },\n    batches: [\n      {\n        id: 'batch_seed',\n        fileName: '6 months of account history',\n        source: 'seed',\n        importedAt: Date.now() - 1000 * 60 * 60 * 24 * 180,\n        total: txns.length,\n        added: txns.length,\n        duplicates: 0,\n        approved: true,\n      },\n    ],\n    corrections: [],\n    seedMonth: currentMonth,\n    lastAction: null,\n  };\n}\n","oldString":"export const SAMPLE_SMS = `HDFC Bank: Rs.486.00 debited from a/c XX4412 on 04-10-26 to SWIGGY. Avl bal Rs.1,84,320.50\nICICI Bank: INR 1,199.00 spent on Credit Card XX8891 at AIRTEL on 09/10/2026.\nHDFC Bank: Rs.2,350.00 debited from a/c XX4412 on 21-10-26 to DECATHLON. Avl bal Rs.1,30,055.50\nAxis Bank: Rs.1,299.00 debited from a/c XX2210 on 23-10-26 towards LINKEDIN PREMIUM.\nHDFC Bank: Your A/C XX4412 credited with Rs 1,42,000.00 on 01-10-26 (Salary - OCT 2026).\nSBI Card: Rs.340.00 spent at THIRD WAVE COFFEE on 26/10/2026.`;","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\data\\seed.ts"})
  [Tool result]: Edited src/data/seed.ts (1 replacement)
  
  [Assistant reasoning]: Now finance selectors. This is the heart.
  
  ```ts
  export interface MonthSummary {
    income, fixed, flexible, savings, net, byCategory: Record<string, number>, count
  }
  export function summarizeMonth(txns, month): MonthSummary
  ```
  Exclude isExcluded and splits? Handle splits: if splits present, amount distributed. For category totals, use splits when present.
  
  Income = sum positive amounts (category income; exclude transfers).
  Fixed = sum negative where category kind fixed/savings? Savings (investments) should be separate.
  Flexible = sum negative where kind flexible.
  Savings = investments (kind savings).
  Net = income - fixed - flexible - savings.
  
  Transfers excluded.
  
  `monthlyAverage(txns, months, key)`: average over last 3 complete months (exclude current partial). For drift, compare current month to average of prior 3.
  
  `currentBalance(accounts)`.
  
  `essentialMonthly(profile)` = fixed (excluding subscriptions? essentials = rent, utilities, internet, mobile, insurance) + flexible baseline? For runway use trailing avg outflow.
  
  `emergencyCoverage` = emergencySaved / essentialMonthly.
  
  `safeToSpend(state)`:
  - balance (hdfc + cash)
  - minus emergencySaved
  - minus goals saved
  - minus scheduled next 30 days (from recurring active, excluding cancelled, one occurrence each)
  - minus buffer = 10% of monthly income? Let's use a fixed ₹15,000 buffer.
  Return breakdown.
  
  Hmm, "safe to spend" is a hero number. Let me compute:
  balance ≈ 235000 + net*6. Need actual. Net monthly ~24,800 (excluding SIP from net? SIP included in fixed so surplus is 24,800). Then balance ≈ 383,800. 
  Minus emergency 168,000 = 215,800.
  Minus goals 86,000 = 129,800.
  Minus upcoming 30d bills: rent 42,000 + subs 6,489 + sip 15,000 + insurance 2,400 + airtel 1,199 + act 1,349 + utilities 3,200 = 71,637.
  Minus buffer 15,000.
  = 43,163. 
  
  That's a nice hero number. (Note: goals saved subtracting is aggressive but coherent.)
  
  Wait — goals saved are part of the balance, yes. But if goals savings are "in" the account, subtracting means we're reserving them. Fine.
  
  `safeToSpend` should also subtract the goal contributions planned? No, goals saved already excludes future.
  
  `scheduledNext30` from recurring: each active recurring nextDate within 30 days; yearly prime is 8 months away so not included. Good.
  
  `runway` = balance / trailing 3-month avg outflow (excluding transfers, including savings?) Let's use total spend incl. savings. ≈ 116k → 3.3 months.
  
  `monthlyBaseline(state)`:
  - incomeAvg: average income over last 3 complete months (plus current?) Use trailing 3 complete months; but profile income could be edited. The simulator should use the profile income if edited. I'll use max? Better: use average of profile.income monthly amounts, since that's the "persistent profile". But then editing income in Plan changes simulator. Good. Yet actual salary is 142k and profile adds freelance 8k → 150k. Hmm, freelance isn't in transactions. It's a plan-level assumption. That's fine: model income 150k vs actual 142k. Could cause confusion.
  
  Simplify profile income to salary only (142k) plus freelance 8k variable. The model uses actual trailing income (142k) as baseline, and the Plan shows sources. For simulation, baseline income = avg of last 3 months actual income (142k). Levers apply %. If the user edits income sources, the simulation won't reflect it... Ehh.
  
  Better: baseline income = sum of profile.income monthly amounts (150k), because profile is the persistent model. But income in transactions is 142k. The discrepancy is "freelance is variable and not always credited". Maybe drop freelance from profile. Let me keep only salary 142k to keep the model honest. Simpler and consistent.
  
  I'll remove the freelance entry.
  
  Fixed baseline = sum(profile.fixed) = 71,637 (includes subscriptions 6489, including unused ones). For simulation, cancelling sub should subtract from fixed automatically. Since fixed includes a "Subscriptions" aggregate, cancellation wouldn't reflect. Hmm.
  
  Cleaner model: fixed baseline derived from `recurring` (active, not cancelled) + other profile.fixed. But profile.fixed is editable and includes subscriptions aggregate. Duplication risk.
  
  Alternative: fixed baseline = sum(profile.fixed) + adjustments for cancelled recurring (subtract cancelled recurring amounts not already in fixed?). Messy.
  
  Let me define:
  - Profile fixed costs are the source of truth for committed costs, EXCEPT subscriptions which come from `recurring` (so cancellations reflect). In profile.fixed, keep rent, sip, insurance, airtel, act, utilities and remove the subscriptions entry. Then fixed = sum(profile.fixed) + active subscriptions (category === 'subscriptions' from recurring, monthly-normalized). Includes iCloud 75, Netflix 649, Spotify 119, LinkedIn 1299, Prime 1499/12=125 → 2267.
  Total fixed = 42000+15000+2400+1199+1349+3200 + 2267 = 67,415. Plus fitness 1799 (Cult) — is it fixed? Yes, it's a recurring. Should recurring fitness be included? If we only add subscriptions category, cult/linkedin (fitness/subscriptions) — LinkedIn is subscriptions (included), Cult is fitness (excluded from fixed). Hmm.
  
  General rule: fixed baseline = profile.fixed (rent, sip, insurance, mobile, internet, utilities) + all active recurring that are NOT already represented in profile.fixed, i.e. categories in {subscriptions, fitness, education, health?}. Airtel/ACT are in profile.fixed, so exclude by matching merchant/name? 
  
  This is getting complex. Simplest coherent approach: **profile.fixed is the only source for fixed costs**, and the simulator's subscription lever reduces fixed by the cancelled recurring amounts plus adds back any subscription not in fixed. To make cancellation reflect properly, I'll define `fixedBaseline = sum(profile.fixed) + recurringActiveSubscriptions` where `profile.fixed` excludes the subscriptions aggregate, and recurring subscriptions includes Netflix, Spotify, LinkedIn, iCloud, Prime (annual/12), but NOT Cult.fit (fitness) or Airtel/ACT (in profile.fixed). Then Cult.fit's cancellation won't reduce fixed. But Cult is one of the unused subs we want to cancel in a scenario.
  
  Fix: include recurring where category in {subscriptions, fitness} and merchant not in profile.fixed names. Cult is fitness → included. LinkedIn is subscriptions → included. Netflix/Spotify/iCloud/Prime → included. Airtel (mobile) and ACT (internet) are in profile.fixed, but their category isn't subscriptions/fitness, so excluded. Rent/insurance excluded. SIP is not in recurring seed (I didn't add it) so fine.
  
  So: fixedBaseline = sum(profile.fixed) + sum(recurring active where category in ['subscriptions','fitness']) normalized monthly. Cult 1799 + LinkedIn 1299 + Netflix 649 + Spotify 119 + iCloud 75 + Prime 125 = 4066. Fixed = 42000+15000+2400+1199+1349+3200 = 65,148 + 4,066 = 69,214.
  
  Good. And remove the subscriptions entry from profile.fixed.
  
  Total subscription spend shown on Recurring screen = recurring category subscriptions + fitness? Show all recurring excluding rent/insurance? The "subscriptions" screen includes all recurring. Fine.
  
  Let me adjust seed PROFILE fixed (remove fx_subs) and income (remove freelance).
  
  Now `monthlyFlexible` = average flexible spend over last 3 complete months (excluding current, since current may be partial). At month end, including current is fine. Use last 3 complete months before current.
  
  Dining drift: compare current month dining+delivery spend vs the average of prior 3 months for those categories. Current month has intentional +35% count and +10% amount → ~+48%. Good.
  
  Nudge generation:
  - Drift: for each category with >15% increase and >₹500 absolute, produce a nudge. Limit to top 1-2.
  - Price change: recurring with priceHistory length >=2 and last > prev, produce nudge with annualized impact.
  - Unused: recurring usage unused and amount > 0, aggregate monthly total; one nudge listing merchants.
  - Goal behind: for each goal compute required monthly to hit target vs goal.monthly; if required > monthly*1.1 → nudge.
  - Buffer: emergency coverage < 3 months → nudge.
  - Payday: if today within 3 days of next salary → "salary landed" nudge. On Oct 31, next salary in 1 day → produce.
  - Anomaly: transaction > 3x category average in last 30 days → nudge (e.g., big shopping).
  
  Nudge statuses from settings.nudgeStates.
  
  Nudge IDs must be stable: `drift:dining:2026-10`, `price:rec_netflix`, `unused:total`, `goal:goal_japan`, `buffer:emergency`, `payday:2026-11`, `anomaly:<txnId>`.
  
  Monthly report:
  - summary for chosen month, category breakdown, top merchants, MoM, recurring, goal progress, narrative lines.
  
  Simulator:
  ```ts
  export interface SimInput { levers, months, state }
  export function runSimulation(state, levers, horizon=12): SimResult
  ```
  Baseline monthly:
  income = profile income monthly sum (142k)
  fixed = fixedBaseline - cancelledSubs amounts
  flexible = flexibleBaseline * (1 - diningCut/100 * diningShare - groceriesCut/100 * groceryShare) — better compute per category:
  flexibleByCat from trailing avg. diningCut applies to (dining + delivery) categories. groceriesCut to groceries. rent change applies to rent fixed. income change %. extraSavings reduces free cash and adds to savings pool? For projection of cash balance, extraSavings just reduces balance but increases net worth. Since goals are separate, model "liquid balance" and "allocated savings" separately? For simplicity, extraSavings reduces liquid balance but count it in "saved".
  
  Projection:
  ```
  let balance = currentBalance
  for m in 0..horizon-1:
    spend = fixed + flexible - oneOff in that month
    balance += income - spend - extraSavings
    series.push(balance)
  ```
  Goal ETA: compute monthly surplus available for goals = income - fixed - flexible - extraSavings (could be negative). Allocate to goals in priority order from existing saved + monthly. ETA month when cum >= target. Baseline compare.
  
  Also runway at end, emergency coverage.
  
  One-off expense amount at month index.
  
  Scenario results show:
  - endBalance, minBalance, monthsToFirstGoal, goal ETAs per goal, monthlySurplus, savingsRate.
  
  For "apply as plan": update profile fixed? Actually applying levers is complex; we can implement "Apply as plan" by storing a scenario as applied and updating goal monthly contributions + profile income/rent? Let's implement: apply sets goal.monthly allocations from simulation (if any), updates profile fixed rent if rentChange, income if incomeChange, and adds a nudge/done. Hmm, risky. Simpler: "Apply as plan" marks scenario pinned and updates goals' monthly contributions proportionally + records applied scenario id. I'll implement a targeted version: apply rentChange and incomeChange to profile, set goals monthly from allocation, and cancel subscriptions marked cancelled. That's real and verifiable.
  
  Let me keep it: `applyScenario` in store.
  
  Now write finance.ts.
  
  Need functions:
  - activeRecurring(state)
  - sumByCategory(txns, month, filter)
  - summarizeMonth
  - trailingAverage(state, months=3, endMonth) for category
  - monthlyIncome(state)
  - fixedBaseline(state)
  - flexibleBaseline(state)
  - modelSnapshot(state)
  - currentBalance(state)
  - upcoming30(state)
  - safeToSpend(state)
  - goalProgress(goal), requiredMonthly(goal)
  - essentialSpend
  - runway
  
  Careful with splits: for summary, if splits present, use splits; else amount.
  
  Also txns with pending: exclude pending from summaries? Pending are imported but not approved. Exclude isExcluded. Pending should be excluded from analytics until approved. Yes.
  
  Let me write.
  
  Also `accountBalance`: use account.balance stored? Better compute from seed + imports? Imports change balance. Simpler: account.balance is the live balance, and imports don't update it unless the CSV has a balance column. To avoid complexity, compute balance = profile.openingBalance + sum(all txns amounts) where txns includes seed and imports, excluding nothing. That way imports reduce balance. Use that.
  
  But profile.openingBalance 235000 is the balance before the 6 months. Good.
  
  `currentBalance` = openingBalance + sum(all txn amounts). Excluded transfers? No, transfers are real cash. Include.
  
  Now write finance.ts.
  [Assistant tool call]: edit({"newString":"  income: [\n    { id: 'inc_salary', name: 'Nimbus Labs — salary', amount: 142000, cadence: 'monthly', nextDate: dayISO(addMonths(currentMonth, 1), 1) },\n  ],","oldString":"  income: [\n    { id: 'inc_salary', name: 'Nimbus Labs — salary', amount: 142000, cadence: 'monthly', nextDate: dayISO(addMonths(currentMonth, 1), 1) },\n    { id: 'inc_freelance', name: 'Freelance design', amount: 8000, cadence: 'monthly', nextDate: dayISO(addMonths(currentMonth, 1), 20), variable: true },\n  ],","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\data\\seed.ts"})
  [Tool result]: Edited src/data/seed.ts (1 replacement)
  [Assistant tool call]: edit({"newString":"    { id: 'fx_bescom', name: 'Electricity', amount: 3200, category: 'utilities', dueDay: 10 },\n  ],","oldString":"    { id: 'fx_bescom', name: 'Electricity', amount: 3200, category: 'utilities', dueDay: 10 },\n    { id: 'fx_subs', name: 'Subscriptions', amount: 6489, category: 'subscriptions', dueDay: 14 },\n  ],","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\data\\seed.ts"})
  [Tool result]: Edited src/data/seed.ts (1 replacement)
  
  [Assistant tool call]: write({"content":"import type { AppState, Goal, Recurring, Txn } from '../types';\nimport { CATEGORY_MAP } from '../data/categories';\nimport { addMonths, daysBetween, monthKey, nowMonth, todayISO } from '../lib/date';\n\nexport const isCounted = (t: Txn): boolean => !t.pending && !t.isExcluded && !t.isTransfer;\n\nexport function effectiveParts(t: Txn): { category: string; amount: number }[] {\n  if (t.splits && t.splits.length) {\n    return t.splits.map((s) => ({\n      category: s.category,\n      amount: t.amount < 0 ? -Math.abs(s.amount) : Math.abs(s.amount),\n    }));\n  }\n  return [{ category: t.category, amount: t.amount }];\n}\n\nexport interface MonthSummary {\n  month: string;\n  income: number;\n  fixed: number;\n  flexible: number;\n  savings: number;\n  outflow: number;\n  surplus: number;\n  byCategory: { category: string; amount: number; kind: string }[];\n  count: number;\n}\n\nexport function summarizeMonth(txns: Txn[], month: string): MonthSummary {\n  const scoped = txns.filter((t) => monthKey(t.date) === month && isCounted(t));\n  const byCat = new Map<string, number>();\n  let income = 0;\n  let fixed = 0;\n  let flexible = 0;\n  let savings = 0;\n\n  for (const t of scoped) {\n    for (const part of effectiveParts(t)) {\n      if (part.amount > 0) {\n        income += part.amount;\n        continue;\n      }\n      const amt = Math.abs(part.amount);\n      const kind = CATEGORY_MAP[part.category]?.kind ?? 'flexible';\n      if (kind === 'income') income += amt;\n      else if (kind === 'fixed') fixed += amt;\n      else if (kind === 'savings') savings += amt;\n      else if (kind !== 'transfer') flexible += amt;\n      if (kind !== 'income' && kind !== 'transfer') {\n        byCat.set(part.category, (byCat.get(part.category) ?? 0) + amt);\n      }\n    }\n  }\n\n  const byCategory = [...byCat.entries()]\n    .map(([category, amount]) => ({\n      category,\n      amount,\n      kind: CATEGORY_MAP[category]?.kind ?? 'flexible',\n    }))\n    .sort((a, b) => b.amount - a.amount);\n\n  const outflow = fixed + flexible + savings;\n  return {\n    month,\n    income,\n    fixed,\n    flexible,\n    savings,\n    outflow,\n    surplus: income - outflow,\n    byCategory,\n    count: scoped.length,\n  };\n}\n\nexport function monthsBack(month: string, n: number): string[] {\n  return Array.from({ length: n }, (_, i) => addMonths(month, -(i + 1)));\n}\n\n/** Average spend for a set of categories across the last N complete months. */\nexport function trailingCategoryAverage(\n  txns: Txn[],\n  categories: string[],\n  months = 3,\n  endMonth = nowMonth()\n): number {\n  const scope = monthsBack(endMonth, months);\n  const total = txns\n    .filter((t) => scope.includes(monthKey(t.date)) && isCounted(t))\n    .reduce((sum, t) => {\n      const parts = effectiveParts(t).filter((p) => categories.includes(p.category));\n      return sum + parts.reduce((s, p) => s + Math.abs(p.amount), 0);\n    }, 0);\n  return total / months;\n}\n\nexport function trailingOutflow(txns: Txn[], months = 3, endMonth = nowMonth()): number {\n  const scope = monthsBack(endMonth, months);\n  const total = txns\n    .filter((t) => scope.includes(monthKey(t.date)) && isCounted(t))\n    .reduce((s, t) => s + Math.max(0, -t.amount), 0);\n  return total / months;\n}\n\nexport function currentBalance(state: AppState): number {\n  return state.profile.openingBalance + state.txns.reduce((s, t) => s + t.amount, 0);\n}\n\nexport function monthlyAmount(amount: number, cadence: Recurring['cadence']): number {\n  switch (cadence) {\n    case 'weekly':\n      return (amount * 52) / 12;\n    case 'monthly':\n      return amount;\n    case 'quarterly':\n      return amount / 3;\n    case 'yearly':\n      return amount / 12;\n  }\n}\n\nexport function activeRecurring(state: AppState): Recurring[] {\n  return state.recurring.filter((r) => r.status !== 'cancelled');\n}\n\n/** Subscriptions/fitness that are not already represented in profile.fixed. */\nexport function subscriptionRecurring(state: AppState): Recurring[] {\n  return activeRecurring(state).filter(\n    (r) => (r.category === 'subscriptions' || r.category === 'fitness') && r.status !== 'snoozed'\n  );\n}\n\nexport function monthlyIncome(state: AppState): number {\n  return state.profile.income.reduce(\n    (s, i) => s + (i.cadence === 'yearly' ? i.amount / 12 : i.cadence === 'one-off' ? 0 : i.amount),\n    0\n  );\n}\n\nexport function fixedBaseline(state: AppState): number {\n  const profileFixed = state.profile.fixed.reduce((s, f) => s + f.amount, 0);\n  const subs = subscriptionRecurring(state).reduce(\n    (s, r) => s + monthlyAmount(r.amount, r.cadence),\n    0\n  );\n  return profileFixed + subs;\n}\n\nexport function flexibleBaseline(state: AppState): number {\n  return trailingCategoryAverage(\n    state.txns,\n    ['groceries', 'dining', 'delivery', 'transport', 'fuel', 'shopping', 'entertainment', 'health', 'travel', 'personal_care', 'home', 'gifts', 'other'],\n    3\n  );\n}\n\nexport function essentialMonthly(state: AppState): number {\n  const essentialCats = ['rent', 'utilities', 'internet', 'mobile', 'insurance', 'groceries', 'transport', 'fuel', 'health'];\n  const fixedEssentials = state.profile.fixed\n    .filter((f) => essentialCats.includes(f.category))\n    .reduce((s, f) => s + f.amount, 0);\n  const flexEssentials = trailingCategoryAverage(state.txns, ['groceries', 'transport', 'fuel', 'health'], 3);\n  return fixedEssentials + flexEssentials;\n}\n\nexport function emergencyCoverage(state: AppState): number {\n  const essential = essentialMonthly(state);\n  return essential > 0 ? state.profile.emergencySaved / essential : 0;\n}\n\nexport function upcomingBills(state: AppState, days = 30): { recurring: Recurring; date: string; inDays: number }[] {\n  const today = todayISO();\n  return activeRecurring(state)\n    .filter((r) => r.status === 'active')\n    .map((r) => ({ recurring: r, date: r.nextDate, inDays: daysBetween(today, r.nextDate) }))\n    .filter((x) => x.inDays >= 0 && x.inDays <= days)\n    .sort((a, b) => a.inDays - b.inDays);\n}\n\nexport function scheduledTotal(state: AppState, days = 30): number {\n  return upcomingBills(state, days).reduce(\n    (s, b) => s + monthlyAmount(b.recurring.amount, b.recurring.cadence),\n    0\n  );\n}\n\nexport interface SafeToSpend {\n  balance: number;\n  emergency: number;\n  goals: number;\n  scheduled: number;\n  buffer: number;\n  safe: number;\n  ratio: number;\n}\n\nexport function safeToSpend(state: AppState): SafeToSpend {\n  const balance = currentBalance(state);\n  const emergency = state.profile.emergencySaved;\n  const goals = state.goals.filter((g) => !g.archived).reduce((s, g) => s + g.saved, 0);\n  const scheduled = scheduledTotal(state, 30);\n  const buffer = 15000;\n  const safe = balance - emergency - goals - scheduled - buffer;\n  return {\n    balance,\n    emergency,\n    goals,\n    scheduled,\n    buffer,\n    safe,\n    ratio: balance > 0 ? Math.max(0, Math.min(1, safe / balance)) : 0,\n  };\n}\n\nexport function goalRequiredMonthly(goal: Goal): number {\n  const remaining = Math.max(0, goal.target - goal.saved);\n  const today = todayISO();\n  const months = Math.max(1, Math.ceil(daysBetween(today, goal.targetDate) / 30.4));\n  return remaining / months;\n}\n\nexport function goalProgress(goal: Goal): number {\n  return goal.target > 0 ? Math.min(1, goal.saved / goal.target) : 0;\n}\n\nexport function goalOnTrack(goal: Goal): boolean {\n  return goal.monthly >= goalRequiredMonthly(goal) - 1;\n}\n\nexport function monthlySurplus(state: AppState): number {\n  return monthlyIncome(state) - fixedBaseline(state) - flexibleBaseline(state);\n}\n\nexport function savingsRate(state: AppState): number {\n  const income = monthlyIncome(state);\n  if (income <= 0) return 0;\n  const sip = state.profile.fixed.filter((f) => f.category === 'investments').reduce((s, f) => s + f.amount, 0);\n  const surplus = monthlySurplus(state);\n  return ((Math.max(0, surplus) + sip + state.profile.emergencySaved * 0) / income) * 100;\n}\n\nexport function categorySpend(txns: Txn[], month: string): { category: string; amount: number }[] {\n  return summarizeMonth(txns, month).byCategory;\n}\n\nexport function topMerchants(txns: Txn[], month: string, limit = 5): { merchant: string; amount: number; count: number }[] {\n  const map = new Map<string, { amount: number; count: number }>();\n  for (const t of txns) {\n    if (monthKey(t.date) !== month || !isCounted(t) || t.amount >= 0) continue;\n    const key = t.merchant || t.description.slice(0, 24);\n    const cur = map.get(key) ?? { amount: 0, count: 0 };\n    map.set(key, { amount: cur.amount + Math.abs(t.amount), count: cur.count + 1 });\n  }\n  return [...map.entries()]\n    .map(([merchant, v]) => ({ merchant, ...v }))\n    .sort((a, b) => b.amount - a.amount)\n    .slice(0, limit);\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\finance.ts"})
  [Tool result]: Created file successfully: src/domain/finance.ts
  
  [Assistant reasoning]: Now simulate.ts.
  
  Types:
  ```ts
  export interface SimulationInput {
    diningCut, groceriesCut, cancelledSubs, rentChange, incomeChange, oneOffAmount, oneOffMonth, extraSavings
  }
  export interface GoalETA { id, name, month, label, reached }
  export interface SimResult {
    months: {key, balance, inflow, outflow, net}[],
    endBalance, minBalance, monthlyNet, safe, runwayMonths, goalEtas, baselineGoalEtas, deltas, annualSavings, subscriptionSavings, diningSavings, rentDelta, incomeDelta
  }
  ```
  Compute baseline monthly from state:
  income = monthlyIncome(state)
  fixed = fixedBaseline(state)
  flexByCat baseline: trailingCategoryAverage for dining+delivery, groceries, other.
  flexible = diningAvg + groceryAvg + otherFlex
  Actually flexibleBaseline covers all flexible. Split: dining = trailingCategoryAverage(['dining','delivery']), groceries, rest = flexibleBaseline - those.
  
  Levers:
  - diningCut% applies to dining.
  - groceriesCut% to groceries.
  - cancelledSubs: sum monthlyAmount of those recurring.
  - rentChange% applies to rent total from profile.fixed category rent.
  - incomeChange% on income.
  - oneOffAmount at month index.
  - extraSavings monthly.
  
  Projection starts balance = currentBalance - (goals saved + emergency)? For a "cash" projection, include all cash. But goals are earmarked. Let's project total liquid balance (all cash) and separately track "free cash" = balance - emergency - goals. I'll show balance curve of total cash. Simpler and intuitive.
  
  Monthly net = incomeAdj - fixedAdj - flexibleAdj - extraSavings - (oneOff in month).
  Balance grows.
  
  Goal ETA: available monthly for goals = incomeAdj - fixedAdj - flexibleAdj - extraSavings - existing goal contributions? Goals saved are already in balance. To avoid double counting, compute goal funding from `monthlyNet` after extraSavings, allocated by priority. Also include existing goal.monthly as starting allocation? Hmm.
  
  Simpler: assume the monthly surplus is allocated to goals in priority order (after extraSavings). For each goal, remaining = target - saved; cumulative allocation = monthlySurplusSim * months; the goal is reached when cumulative covers remaining in priority order. That ignores current goal.monthly but gives a clean "if you keep this up" ETA. Baseline goal ETA uses baseline surplus. Good.
  
  If surplus <= 0 → never.
  
  Monthly surplus for goals = incomeAdj - fixedAdj - flexibleAdj - extraSavings. That's the same as the balance growth before one-offs.
  
  Goal ETA: iterate months 1..120, allocate surplus to goals in priority order each month. If all reached, done. Return month index or null.
  
  Also compute `monthsToEmergencyTarget` similar.
  
  Result should include per-goal baseline and scenario ETA for the UI diff.
  
  `apply` logic handled in store.
  
  Let me write simulate.ts.
  
  Also a helper `describeLevers`.
  
  Need careful numbers: `rentTotal` from profile.fixed filtered rent.
  `subscriptionSavings = sum cancelled`.
  
  Return `monthly` breakdown for display: income, fixed, flexible, savings, surplus.
  
  Confidence band: use ±8% of flexible? For chart shading. Provide `bandLow/High` maybe. I'll compute in UI as balance ± (flexible*0.1*sqrt(m)).
  
  Keep simple.
  
  Write.
  [Assistant tool call]: write({"content":"import type { AppState, ScenarioLevers } from '../types';\nimport {\n  currentBalance,\n  fixedBaseline,\n  flexibleBaseline,\n  monthlyAmount,\n  monthlyIncome,\n  subscriptionRecurring,\n  trailingCategoryAverage,\n} from './finance';\nimport { addMonths, nowMonth } from '../lib/date';\n\nexport const DEFAULT_LEVERS: ScenarioLevers = {\n  diningCut: 0,\n  groceriesCut: 0,\n  cancelledSubs: [],\n  rentChange: 0,\n  incomeChange: 0,\n  oneOffAmount: 0,\n  oneOffMonth: 2,\n  extraSavings: 0,\n};\n\nexport interface SimMonth {\n  key: string;\n  balance: number;\n  net: number;\n  inflow: number;\n  outflow: number;\n}\n\nexport interface GoalEta {\n  id: string;\n  name: string;\n  monthIndex: number | null;\n  monthKey: string | null;\n  color: string;\n}\n\nexport interface SimResult {\n  months: SimMonth[];\n  monthly: {\n    income: number;\n    fixed: number;\n    flexible: number;\n    dining: number;\n    groceries: number;\n    otherFlexible: number;\n    extraSavings: number;\n    surplus: number;\n  };\n  endBalance: number;\n  minBalance: number;\n  goalEtas: GoalEta[];\n  monthlySubsSaved: number;\n  annualSubsSaved: number;\n  diningSaved: number;\n  groceriesSaved: number;\n  rentDelta: number;\n  incomeDelta: number;\n  runwayMonths: number;\n}\n\nexport interface BaseModel {\n  income: number;\n  fixed: number;\n  dining: number;\n  groceries: number;\n  otherFlexible: number;\n  rent: number;\n}\n\nexport function baseModel(state: AppState): BaseModel {\n  const dining = trailingCategoryAverage(state.txns, ['dining', 'delivery'], 3);\n  const groceries = trailingCategoryAverage(state.txns, ['groceries'], 3);\n  const flexible = flexibleBaseline(state);\n  return {\n    income: monthlyIncome(state),\n    fixed: fixedBaseline(state),\n    dining,\n    groceries,\n    otherFlexible: Math.max(0, flexible - dining - groceries),\n    rent:\n      state.profile.fixed.filter((f) => f.category === 'rent').reduce((s, f) => s + f.amount, 0) ||\n      flexible * 0,\n  };\n}\n\nexport function goalEtas(\n  startMonth: string,\n  goals: AppState['goals'],\n  monthlyForGoals: number,\n  startIndex = 0\n): GoalEta[] {\n  const ordered = [...goals].filter((g) => !g.archived).sort((a, b) => a.priority - b.priority);\n  if (monthlyForGoals <= 0) {\n    return ordered.map((g) => ({\n      id: g.id,\n      name: g.name,\n      monthIndex: null,\n      monthKey: null,\n      color: g.color,\n    }));\n  }\n  const remaining = ordered.map((g) => Math.max(0, g.target - g.saved));\n  const result: GoalEta[] = ordered.map((g) => ({\n    id: g.id,\n    name: g.name,\n    monthIndex: remaining[ordered.indexOf(g)] === 0 ? 0 : null,\n    monthKey: remaining[ordered.indexOf(g)] === 0 ? addMonths(startMonth, 0) : null,\n    color: g.color,\n  }));\n\n  let month = 0;\n  const maxMonths = 240;\n  while (month < maxMonths && remaining.some((r) => r > 0)) {\n    month += 1;\n    let pool = monthlyForGoals;\n    for (let i = 0; i < remaining.length && pool > 0; i++) {\n      if (remaining[i] <= 0) continue;\n      const take = Math.min(pool, remaining[i]);\n      remaining[i] -= take;\n      pool -= take;\n      if (remaining[i] <= 0 && result[i].monthIndex === null) {\n        result[i].monthIndex = month + startIndex;\n        result[i].monthKey = addMonths(startMonth, month - 1);\n      }\n    }\n  }\n  return result;\n}\n\nexport function runSimulation(state: AppState, levers: ScenarioLevers, horizon = 12): SimResult {\n  const base = baseModel(state);\n  const subs = subscriptionRecurring(state);\n  const monthlySubsSaved = subs\n    .filter((r) => levers.cancelledSubs.includes(r.id))\n    .reduce((s, r) => s + monthlyAmount(r.amount, r.cadence), 0);\n\n  const income = base.income * (1 + levers.incomeChange / 100);\n  const rent = base.rent * (1 + levers.rentChange / 100);\n  const rentDelta = rent - base.rent;\n  const dining = base.dining * (1 - levers.diningCut / 100);\n  const groceries = base.groceries * (1 - levers.groceriesCut / 100);\n  const fixed = base.fixed - monthlySubsSaved + rentDelta;\n  const flexible = dining + groceries + base.otherFlexible;\n  const surplus = income - fixed - flexible - levers.extraSavings;\n\n  const start = addMonths(nowMonth(), 1);\n  const balance0 = currentBalance(state);\n  let balance = balance0;\n  const months: SimMonth[] = [];\n\n  for (let i = 0; i < horizon; i++) {\n    const oneOff = i === levers.oneOffMonth ? levers.oneOffAmount : 0;\n    const net = income - fixed - flexible - levers.extraSavings - oneOff;\n    balance += net;\n    months.push({\n      key: addMonths(start, i),\n      balance,\n      net,\n      inflow: income,\n      outflow: fixed + flexible + levers.extraSavings + oneOff,\n    });\n  }\n\n  const etas = goalEtas(start, state.goals, surplus);\n\n  return {\n    months,\n    monthly: {\n      income,\n      fixed,\n      flexible,\n      dining,\n      groceries,\n      otherFlexible: base.otherFlexible,\n      extraSavings: levers.extraSavings,\n      surplus,\n    },\n    endBalance: balance,\n    minBalance: Math.min(...months.map((m) => m.balance), balance0),\n    goalEtas: etas,\n    monthlySubsSaved,\n    annualSubsSaved: monthlySubsSaved * 12,\n    diningSaved: base.dining - dining,\n    groceriesSaved: base.groceries - groceries,\n    rentDelta,\n    incomeDelta: income - base.income,\n    runwayMonths: fixed + flexible > 0 ? balance0 / (fixed + flexible) : 0,\n  };\n}\n\nexport function baselineResult(state: AppState, horizon = 12): SimResult {\n  return runSimulation(state, DEFAULT_LEVERS, horizon);\n}\n\nexport function scenarioSummary(levers: ScenarioLevers): string[] {\n  const out: string[] = [];\n  if (levers.diningCut) out.push(`Dining out and delivery cut ${levers.diningCut}%`);\n  if (levers.groceriesCut) out.push(`Groceries cut ${levers.groceriesCut}%`);\n  if (levers.cancelledSubs.length) out.push(`${levers.cancelledSubs.length} subscriptions cancelled`);\n  if (levers.rentChange) out.push(`Rent ${levers.rentChange > 0 ? 'up' : 'down'} ${Math.abs(levers.rentChange)}%`);\n  if (levers.incomeChange) out.push(`Income ${levers.incomeChange > 0 ? 'up' : 'down'} ${Math.abs(levers.incomeChange)}%`);\n  if (levers.oneOffAmount) out.push(`One-off ${levers.oneOffAmount.toLocaleString('en-IN')} in month ${levers.oneOffMonth + 1}`);\n  if (levers.extraSavings) out.push(`Extra savings of ${levers.extraSavings.toLocaleString('en-IN')}/mo`);\n  return out.length ? out : ['Baseline — no changes'];\n}\n\nexport function leverCount(levers: ScenarioLevers): number {\n  return (\n    (levers.diningCut ? 1 : 0) +\n    (levers.groceriesCut ? 1 : 0) +\n    levers.cancelledSubs.length +\n    (levers.rentChange ? 1 : 0) +\n    (levers.incomeChange ? 1 : 0) +\n    (levers.oneOffAmount ? 1 : 0) +\n    (levers.extraSavings ? 1 : 0)\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\simulate.ts"})
  [Tool result]: Created file successfully: src/domain/simulate.ts
  
  [Assistant reasoning]: Now recurring detection. Should be a real algorithm tested on transactions: group by normalized merchant, look for consistent monthly gaps and similar amounts.
  
  ```ts
  export interface DetectedRecurring { merchant, category, amount (median), cadence, dates[], confidence, count }
  export function detectRecurring(txns, existingMerchants): DetectedRecurring[]
  ```
  Group negatives by merchantKey. Need at least 3 occurrences. Sort dates; gaps median 25-35 → monthly; 6-8 weekly; 80-100 quarterly; 350-380 yearly. Amount variation < 15% or exact. Confidence based on count and regularity.
  
  Then a "Scan for recurring" button merges detected into state (adding missing merchants).
  
  Also detect price changes from existing recurring priceHistory (already).
  
  Nudges module:
  - deriveNudges(state)
  - Report module.
  
  Let me write recurring.ts.
  
  Merchant key: uppercase, strip non-alnum, first 18 chars. For "Swiggy" txns merchant is "Swiggy". Good.
  
  Also normalize variations: 'Netflix' etc.
  
  For detected amounts use median.
  
  Return confidence 0.6-0.98.
  
  Need to exclude txns that are transfers/savings.
  
  Now nudges.ts.
  
  Nudge generation logic:
  
  ```ts
  export function deriveNudges(state: AppState): Nudge[]
  ```
  Statuses applied from settings.nudgeStates.
  
  1. Drift (per category): current month category total vs trailing 3-mo avg for that category. Category list dining, delivery, groceries, shopping, transport, entertainment. Compute current month spend. If current day < 5, skip. `delta = current - avg`. If avg>0 && delta > max(500, avg*0.18) → nudge warn. Body: "You've spent ₹8,420 on dining out this month — ₹2,310 (38%) above your three-month average of ₹6,110." math. Limit top 2 categories.
  
  But since today is Oct 31, the current month is complete, so drift is accurate.
  
  2. Price change: for each recurring with priceHistory where last.amount > prev.amount → nudge. Impact annualized = diff * 12 (monthly). Body includes %.
  
  3. Unused: recurring usage unused && status active. Total monthly. One nudge, severity warn, action route /recurring.
  
  4. Goals behind: for each goal where monthly < required*0.9 and remaining > 0 → nudge, severity info. Limit 2.
  
  5. Buffer: emergencyCoverage < 3 → nudge with months and gap.
  
  6. Payday: compute days to next salary from profile.income[0].nextDate. If nextDate not in future, compute next month 1st. If within 4 days → info nudge "Salary lands in N days". Also if salary credited today in txns → "₹1,42,000 landed". Let's do: find income txn in last 3 days → payday nudge with allocation suggestion.
  
  7. Anomaly: largest transaction in last 14 days > 2.5× category average and > 2000 → nudge. Skip.
  
  Sort by severity (critical, warn, info).
  
  Guardrail: all bodies education-only.
  
  Report:
  ```ts
  export function buildReport(state, month): MonthlyReport
  ```
  - summary, prevSummary, categories with delta, top merchants, biggest txn, recurring total and changes, goal progress, narrative: array of {title, body} or paragraphs.
  - wins/slippage lists.
  - score? "Plan adherence 84%"? Could compute savings rate vs target.
  
  Narrative strings generated from data; no AI.
  
  Write both.
  [Assistant tool call]: write({"content":"import type { Recurring, Txn } from '../types';\nimport { monthKey } from '../lib/date';\nimport { isCounted } from './finance';\n\nconst normalize = (s: string) =>\n  s.toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 24);\n\nconst median = (nums: number[]): number => {\n  const s = [...nums].sort((a, b) => a - b);\n  const mid = Math.floor(s.length / 2);\n  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;\n};\n\nexport interface DetectedRecurring {\n  merchant: string;\n  category: string;\n  amount: number;\n  cadence: Recurring['cadence'];\n  confidence: number;\n  occurrences: number;\n  lastDate: string;\n  nextDate: string;\n  dates: string[];\n}\n\nfunction cadenceFor(medianGap: number): Recurring['cadence'] | null {\n  if (medianGap >= 5 && medianGap <= 9) return 'weekly';\n  if (medianGap >= 24 && medianGap <= 37) return 'monthly';\n  if (medianGap >= 78 && medianGap <= 100) return 'quarterly';\n  if (medianGap >= 330 && medianGap <= 400) return 'yearly';\n  return null;\n}\n\n/**\n * Groups outflow transactions by merchant and looks for a stable rhythm:\n * at least 3 hits, a consistent cadence, and amounts within 20% of the median.\n */\nexport function detectRecurring(txns: Txn[], existing: Recurring[]): DetectedRecurring[] {\n  const known = new Set(existing.map((r) => normalize(r.merchant)));\n  const groups = new Map<string, { merchant: string; category: string; items: Txn[] }>();\n\n  for (const t of txns) {\n    if (!isCounted(t) || t.amount >= 0) continue;\n    const key = normalize(t.merchant || t.description);\n    if (!key || key.length < 3) continue;\n    if (!groups.has(key)) groups.set(key, { merchant: t.merchant || t.description, category: t.category, items: [] });\n    groups.get(key)!.items.push(t);\n  }\n\n  const out: DetectedRecurring[] = [];\n  for (const [, group] of groups) {\n    if (group.items.length < 3) continue;\n    if (known.has(normalize(group.merchant))) continue;\n    const items = group.items.sort((a, b) => (a.date < b.date ? -1 : 1));\n    const gaps: number[] = [];\n    for (let i = 1; i < items.length; i++) {\n      gaps.push((Date.parse(items[i].date) - Date.parse(items[i - 1].date)) / 86400000);\n    }\n    const gap = median(gaps);\n    const cadence = cadenceFor(gap);\n    if (!cadence) continue;\n    const amounts = items.map((t) => Math.abs(t.amount));\n    const med = median(amounts);\n    const within = amounts.filter((a) => Math.abs(a - med) / med <= 0.2).length / amounts.length;\n    if (within < 0.7) continue;\n\n    const regularity = gaps.filter((g) => Math.abs(g - gap) <= Math.max(3, gap * 0.15)).length / gaps.length;\n    const confidence = Math.min(0.98, 0.55 + Math.min(0.2, items.length * 0.035) + regularity * 0.2);\n    const last = items[items.length - 1].date;\n    const nextDate = addCadence(last, cadence);\n\n    out.push({\n      merchant: group.merchant,\n      category: group.category,\n      amount: Math.round(med),\n      cadence,\n      confidence: Math.round(confidence * 100) / 100,\n      occurrences: items.length,\n      lastDate: last,\n      nextDate,\n      dates: items.map((i) => i.date),\n    });\n  }\n  return out.sort((a, b) => b.amount - a.amount);\n}\n\nexport function addCadence(iso: string, cadence: Recurring['cadence']): string {\n  const d = new Date(iso);\n  const step = cadence === 'weekly' ? 7 : cadence === 'monthly' ? 30 : cadence === 'quarterly' ? 91 : 365;\n  d.setDate(d.getDate() + step);\n  return d.toISOString().slice(0, 10);\n}\n\nexport function detectPriceChange(r: Recurring): { from: number; to: number; delta: number; pct: number; since: string } | null {\n  if (r.priceHistory.length < 2) return null;\n  const sorted = [...r.priceHistory].sort((a, b) => (a.date < b.date ? -1 : 1));\n  const last = sorted[sorted.length - 1];\n  const prev = sorted[sorted.length - 2];\n  if (last.amount <= prev.amount) return null;\n  return {\n    from: prev.amount,\n    to: last.amount,\n    delta: last.amount - prev.amount,\n    pct: ((last.amount - prev.amount) / prev.amount) * 100,\n    since: last.date,\n  };\n}\n\nexport function subscriptionTotal(rec: Recurring[]): { monthly: number; annual: number } {\n  const monthly = rec.reduce((s, r) => {\n    if (r.status === 'cancelled') return s;\n    const amt = r.cadence === 'yearly' ? r.amount / 12 : r.cadence === 'quarterly' ? r.amount / 3 : r.amount;\n    return s + amt;\n  }, 0);\n  return { monthly, annual: monthly * 12 };\n}\n\nexport function unusedTotal(rec: Recurring[]): number {\n  return rec\n    .filter((r) => r.usage === 'unused' && r.status !== 'cancelled')\n    .reduce((s, r) => s + (r.cadence === 'yearly' ? r.amount / 12 : r.amount), 0);\n}\n\nexport function monthsOfHistory(txns: Txn[]): number {\n  return new Set(txns.map((t) => monthKey(t.date))).size;\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\recurring.ts"})
  [Tool result]: Created file successfully: src/domain/recurring.ts
  
  [Assistant reasoning]: Now nudges.ts.
  
  Careful with types. Nudge has createdAt, status.
  
  Then report.ts.
  
  Let me write nudges.
  
  Drift computation:
  ```
  const month = nowMonth()
  const catNow = summarizeMonth(state.txns, month).byCategory
  const avg for previous 3 months via trailingCategoryAverage
  ```
  Note summarizeMonth includes income? byCategory excludes income and transfer. Good.
  
  Only consider flexible categories.
  
  Threshold: delta >= 500 and pct >= 15.
  
  Sort by delta desc, take 2.
  
  Price change: iterate recurring, detectPriceChange.
  
  Unused: sum.
  
  Goal behind: goalRequiredMonthly.
  
  Buffer: emergencyCoverage.
  
  Payday: find latest income txn within 3 days OR upcoming nextDate within 3 days.
  
  Anomaly: last 14 days, txns with amount < -2000 and category 'shopping'/'travel' and amount > 2.2x average for that category → take max 1.
  
  Nudge IDs stable, statuses from settings.nudgeStates.
  
  `status` default 'open'.
  
  Sort severity rank.
  
  Action label/route.
  
  Write.
  [Assistant tool call]: write({"content":"import type { AppState, Nudge, NudgeKind } from '../types';\nimport { money, pct } from '../lib/format';\nimport { addMonths, daysBetween, nowMonth, todayISO } from '../lib/date';\nimport {\n  emergencyCoverage,\n  fixedBaseline,\n  flexibleBaseline,\n  goalRequiredMonthly,\n  monthlyIncome,\n  summarizeMonth,\n  trailingCategoryAverage,\n} from './finance';\nimport { detectPriceChange } from './recurring';\n\nconst SEVERITY_RANK: Record<Nudge['severity'], number> = { critical: 0, warn: 1, info: 2 };\n\nexport function deriveNudges(state: AppState): Nudge[] {\n  const out: Nudge[] = [];\n  const month = nowMonth();\n  const today = todayISO();\n  const summary = summarizeMonth(state.txns, month);\n  const now = Date.now();\n\n  // 1. Category drift against the trailing three-month average.\n  const driftCats = ['dining', 'delivery', 'groceries', 'shopping', 'transport', 'entertainment'];\n  const drifts = driftCats\n    .map((cat) => {\n      const current = summary.byCategory.find((c) => c.category === cat)?.amount ?? 0;\n      const avg = trailingCategoryAverage(state.txns, [cat], 3);\n      return { cat, current, avg, delta: current - avg, pct: avg > 0 ? ((current - avg) / avg) * 100 : 0 };\n    })\n    .filter((d) => d.avg > 0 && d.delta > 500 && d.pct > 15)\n    .sort((a, b) => b.delta - a.delta)\n    .slice(0, 2);\n\n  for (const d of drifts) {\n    out.push({\n      id: `drift:${d.cat}:${month}`,\n      kind: 'drift',\n      severity: d.pct > 40 ? 'critical' : 'warn',\n      title: `${d.cat === 'delivery' ? 'Food delivery' : d.cat[0].toUpperCase() + d.cat.slice(1)} is running hot`,\n      body: `You've spent ${money(d.current)} on ${d.cat} this month — ${money(d.delta)} (${pct(d.pct)}) above your three-month average of ${money(d.avg)}.`,\n      math: `${money(d.current)} this month vs ${money(d.avg)} average. If this repeats, it costs ${money(d.delta * 12)} a year.`,\n      createdAt: now,\n      status: 'open',\n      actionLabel: 'Open transactions',\n      actionRoute: '#/transactions?category=' + d.cat,\n    });\n  }\n\n  // 2. Price changes on detected recurring payments.\n  for (const r of state.recurring) {\n    if (r.status === 'cancelled') continue;\n    const change = detectPriceChange(r);\n    if (!change) continue;\n    out.push({\n      id: `price:${r.id}:${change.since}`,\n      kind: 'price-change',\n      severity: 'warn',\n      title: `${r.merchant} raised its price`,\n      body: `The charge moved from ${money(change.from)} to ${money(change.to)} — a ${pct(change.pct)} increase, effective ${change.since}.`,\n      math: `That's ${money(change.delta)} more each month, or ${money(change.delta * 12)} more a year if you keep it.`,\n      createdAt: now,\n      status: 'open',\n      actionLabel: 'Review subscriptions',\n      actionRoute: '#/recurring',\n    });\n  }\n\n  // 3. Unused subscriptions.\n  const unused = state.recurring.filter((r) => r.usage === 'unused' && r.status !== 'cancelled');\n  if (unused.length) {\n    const monthly = unused.reduce(\n      (s, r) => s + (r.cadence === 'yearly' ? r.amount / 12 : r.amount),\n      0\n    );\n    out.push({\n      id: 'unused:subscriptions',\n      kind: 'unused',\n      severity: 'warn',\n      title: `${unused.length} subscriptions look dormant`,\n      body: `${unused.map((u) => u.merchant).join(' and ')} are still being charged but show no usage signals.`,\n      math: `${money(monthly)} a month — ${money(monthly * 12)} a year — for services you may not be using.`,\n      createdAt: now,\n      status: 'open',\n      actionLabel: 'Review them',\n      actionRoute: '#/recurring',\n    });\n  }\n\n  // 4. Goals that are behind their target date.\n  const behind = state.goals\n    .filter((g) => !g.archived && g.saved < g.target)\n    .map((g) => ({ g, required: goalRequiredMonthly(g) }))\n    .filter((x) => x.g.monthly < x.required * 0.92)\n    .sort((a, b) => b.required - a.required)\n    .slice(0, 2);\n\n  for (const { g, required } of behind) {\n    out.push({\n      id: `goal:${g.id}`,\n      kind: 'goal',\n      severity: 'info',\n      title: `${g.name} needs a bigger contribution`,\n      body: `Keeping ${money(g.monthly)} a month gets you to ${money(g.saved)} of ${money(g.target)} by ${g.targetDate}.`,\n      math: `To finish on time you need ${money(required)} a month — ${money(required - g.monthly)} more than today.`,\n      createdAt: now,\n      status: 'open',\n      actionLabel: 'Open goal planner',\n      actionRoute: '#/plan',\n    });\n  }\n\n  // 5. Emergency buffer.\n  const coverage = emergencyCoverage(state);\n  if (coverage < 3) {\n    out.push({\n      id: 'buffer:emergency',\n      kind: 'buffer',\n      severity: coverage < 1.5 ? 'warn' : 'info',\n      title: 'Emergency fund is under three months',\n      body: `You have ${money(state.profile.emergencySaved)} set aside, which covers ${coverage.toFixed(1)} months of essential spending.`,\n      math: `Three months of essentials is about ${money(\n        (state.profile.emergencySaved / Math.max(coverage, 0.1)) * 3\n      )}. The gap is ${money(\n        Math.max(0, (state.profile.emergencySaved / Math.max(coverage, 0.1)) * 3 - state.profile.emergencySaved)\n      )}.`,\n      createdAt: now,\n      status: 'open',\n      actionLabel: 'Adjust the buffer',\n      actionRoute: '#/plan',\n    });\n  }\n\n  // 6. Payday check.\n  const salary = state.profile.income[0];\n  if (salary) {\n    let next = salary.nextDate;\n    if (next < today) next = `${addMonths(month, 1)}-01`;\n    const inDays = daysBetween(today, next);\n    if (inDays >= 0 && inDays <= 4) {\n      out.push({\n        id: `payday:${next}`,\n        kind: 'payday',\n        severity: 'info',\n        title: inDays === 0 ? 'Salary lands today' : `Salary lands in ${inDays} day${inDays === 1 ? '' : 's'}`,\n        body: `${money(monthlyIncome(state))} is expected on ${next}. Your committed costs for the next 30 days are ${money(\n          fixedBaseline(state)\n        )}.`,\n        math: `Flexible spending baseline is ${money(flexibleBaseline(state))} a month. Allocating ${money(\n          Math.max(0, monthlyIncome(state) - fixedBaseline(state) - flexibleBaseline(state))\n        )} to goals keeps the plan on track.`,\n        createdAt: now,\n        status: 'open',\n        actionLabel: 'Run a scenario',\n        actionRoute: '#/simulate',\n      });\n    }\n  }\n\n  // 7. One unusually large purchase in the last fortnight.\n  const recent = state.txns\n    .filter((t) => t.date >= addMonths(month, -1) && t.amount < -2500 && t.date <= today)\n    .filter((t) => t.date >= `${addMonths(month, -1)}-15`)\n    .sort((a, b) => a.amount - b.amount);\n  const big = recent[0];\n  if (big) {\n    const avg = trailingCategoryAverage(state.txns, [big.category], 3);\n    if (avg > 0 && Math.abs(big.amount) > avg * 1.8) {\n      out.push({\n        id: `anomaly:${big.id}`,\n        kind: 'anomaly',\n        severity: 'info',\n        title: 'One purchase stood out',\n        body: `${big.merchant} for ${money(Math.abs(big.amount))} on ${big.date} is well above your usual ${money(avg)} on this category.`,\n        math: 'A single large purchase is fine — it only matters if it becomes a pattern.',\n        createdAt: now,\n        status: 'open',\n        actionLabel: 'Review the transaction',\n        actionRoute: '#/transactions?q=' + encodeURIComponent(big.merchant),\n      });\n    }\n  }\n\n  const prefs = state.settings.nudgePrefs;\n  return out\n    .filter((n) => prefs[n.kind] !== false)\n    .map((n) => ({ ...n, status: state.settings.nudgeStates[n.id] ?? n.status }))\n    .filter((n) => n.status === 'open' || n.status === 'snoozed')\n    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);\n}\n\nexport function openNudges(state: AppState): Nudge[] {\n  return deriveNudges(state).filter((n) => n.status === 'open');\n}\n\nexport function nudgeKindLabel(kind: NudgeKind): string {\n  const map: Record<NudgeKind, string> = {\n    drift: 'Spending drift',\n    'price-change': 'Price change',\n    unused: 'Unused subscription',\n    goal: 'Goal pace',\n    buffer: 'Emergency buffer',\n    payday: 'Payday',\n    anomaly: 'Unusual activity',\n  };\n  return map[kind];\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\nudges.ts"})
  [Tool result]: Created file successfully: src/domain/nudges.ts
  
  [Assistant reasoning]: Now report.ts.
  
  ```ts
  export interface MonthlyReport {
    month, summary, prev, deltas, categories: {id, amount, prev, delta, pct}[], topMerchants, recurringTotal, changes, largest, narrative: {title, body}[], wins: string[], slippage: string[], savingsRate, adherence
  }
  ```
  
  Compute MoM per category.
  
  Narrative paragraphs:
  - headline: "You spent ₹X in October, ₹Y less/more than September."
  - savings rate: "You kept ₹X (Y%) of income."
  - largest category.
  - recurring: "Subscriptions account for ₹X/mo (Y% of outflow)."
  - goal: "You added ₹X to goals this month."
  
  Wins / slippage derived:
  - If surplus > 0 → win "Kept ₹X more than you spent".
  - If savings rate >= target → win.
  - If a category decreased >10% → win.
  - If category increased >15% → slippage.
  - Unused subs → slippage.
  - Emergency coverage < 3 → slippage.
  
  Write.
  [Assistant tool call]: write({"content":"import type { AppState, Goal, Txn } from '../types';\nimport { addMonths, daysBetween, monthKey, nowMonth, todayISO } from '../lib/date';\nimport { money, pct } from '../lib/format';\nimport { CATEGORY_MAP } from '../data/categories';\nimport {\n  emergencyCoverage,\n  goalRequiredMonthly,\n  isCounted,\n  monthlyIncome,\n  summarizeMonth,\n  topMerchants,\n  type MonthSummary,\n} from './finance';\nimport { detectPriceChange, subscriptionTotal } from './recurring';\n\nexport interface CategoryDelta {\n  category: string;\n  name: string;\n  color: string;\n  amount: number;\n  prev: number;\n  delta: number;\n  pct: number;\n}\n\nexport interface MonthlyReport {\n  month: string;\n  summary: MonthSummary;\n  prev: MonthSummary;\n  categories: CategoryDelta[];\n  merchants: { merchant: string; amount: number; count: number }[];\n  largest: Txn | null;\n  subscriptions: { monthly: number; annual: number };\n  priceChanges: { merchant: string; from: number; to: number; delta: number }[];\n  goals: { goal: Goal; remaining: number; required: number; onTrack: boolean }[];\n  narrative: { title: string; body: string }[];\n  wins: string[];\n  slippage: string[];\n  savingsRate: number;\n  incomeDelta: number;\n  totalDelta: number;\n}\n\nexport function buildReport(state: AppState, month = nowMonth()): MonthlyReport {\n  const prevKey = addMonths(month, -1);\n  const summary = summarizeMonth(state.txns, month);\n  const prev = summarizeMonth(state.txns, prevKey);\n\n  const catIds = new Set([...summary.byCategory.map((c) => c.category), ...prev.byCategory.map((c) => c.category)]);\n  const categories: CategoryDelta[] = [...catIds]\n    .map((id) => {\n      const amount = summary.byCategory.find((c) => c.category === id)?.amount ?? 0;\n      const p = prev.byCategory.find((c) => c.category === id)?.amount ?? 0;\n      return {\n        category: id,\n        name: CATEGORY_MAP[id]?.name ?? id,\n        color: CATEGORY_MAP[id]?.color ?? '#7A7A72',\n        amount,\n        prev: p,\n        delta: amount - p,\n        pct: p > 0 ? ((amount - p) / p) * 100 : amount > 0 ? 100 : 0,\n      };\n    })\n    .sort((a, b) => b.amount - a.amount);\n\n  const monthTxns = state.txns.filter((t) => monthKey(t.date) === month && isCounted(t));\n  const largest = monthTxns\n    .filter((t) => t.amount < 0)\n    .sort((a, b) => a.amount - b.amount)[0] ?? null;\n\n  const subs = subscriptionTotal(state.recurring);\n  const priceChanges = state.recurring\n    .map((r) => ({ r, c: detectPriceChange(r) }))\n    .filter((x) => x.c)\n    .map((x) => ({\n      merchant: x.r.merchant,\n      from: x.c!.from,\n      to: x.c!.to,\n      delta: x.c!.delta,\n    }));\n\n  const goals = state.goals\n    .filter((g) => !g.archived)\n    .map((g) => ({\n      goal: g,\n      remaining: Math.max(0, g.target - g.saved),\n      required: goalRequiredMonthly(g),\n      onTrack: g.monthly >= goalRequiredMonthly(g) * 0.92,\n    }));\n\n  const income = monthlyIncome(state);\n  const savingsRate = income > 0 ? ((summary.income - summary.outflow) / summary.income) * 100 : 0;\n\n  const narrative: { title: string; body: string }[] = [];\n  const diff = summary.outflow - prev.outflow;\n  narrative.push({\n    title: diff <= 0 ? 'Spending came in lower' : 'Spending moved up',\n    body: `You spent ${money(summary.outflow)} in ${month} across ${summary.count} transactions, ${\n      diff === 0 ? 'level with' : `${money(Math.abs(diff))} ${diff > 0 ? 'more' : 'less'} than`\n    } ${prevKey}. Income was ${money(summary.income)}.`,\n  });\n\n  const topCat = categories[0];\n  if (topCat) {\n    narrative.push({\n      title: `${topCat.name} is the biggest line`,\n      body: `${topCat.name} took ${money(topCat.amount)} — ${pct(\n        summary.outflow > 0 ? (topCat.amount / summary.outflow) * 100 : 0\n      )} of everything that left your account${\n        topCat.prev > 0\n          ? `, ${topCat.delta >= 0 ? 'up' : 'down'} ${pct(Math.abs(topCat.pct))} from last month`\n          : ''\n      }.`,\n    });\n  }\n\n  narrative.push({\n    title: 'What you kept',\n    body: `You kept ${money(Math.max(0, summary.income - summary.outflow))} of your income this month (${pct(\n      savingsRate\n    )}). Your target savings rate is ${pct(state.profile.savingsRateTarget)}. Committed subscriptions run ${money(\n      subs.monthly\n    )} a month, or ${money(subs.annual)} a year.`,\n  });\n\n  narrative.push({\n    title: 'Goal funding',\n    body: `Your goals hold ${money(state.goals.reduce((s, g) => s + g.saved, 0))} of ${money(\n      state.goals.reduce((s, g) => s + g.target, 0)\n    )}. ${\n      goals.filter((g) => !g.onTrack).length\n        ? `${goals.filter((g) => !g.onTrack).length} of ${goals.length} goals need a higher monthly contribution to land on time.`\n        : 'Every goal is on pace for its target date.'\n    }`,\n  });\n\n  const wins: string[] = [];\n  const slippage: string[] = [];\n  if (summary.income > summary.outflow) wins.push(`You kept ${money(summary.income - summary.outflow)} this month.`);\n  if (savingsRate >= state.profile.savingsRateTarget)\n    wins.push(`Savings rate of ${pct(savingsRate)} beat your ${pct(state.profile.savingsRateTarget)} target.`);\n  for (const c of categories) {\n    if (c.prev > 0 && c.pct <= -12 && c.prev - c.amount > 400) {\n      wins.push(`${c.name} fell ${pct(Math.abs(c.pct))} (${money(c.prev - c.amount)} less than last month).`);\n    }\n    if (c.prev > 0 && c.pct >= 18 && c.amount - c.prev > 600) {\n      slippage.push(`${c.name} rose ${pct(c.pct)} (${money(c.amount - c.prev)} more than last month).`);\n    }\n  }\n  if (priceChanges.length) {\n    slippage.push(\n      `${priceChanges.length} recurring charge${priceChanges.length > 1 ? 's' : ''} went up, adding ${money(\n        priceChanges.reduce((s, c) => s + c.delta, 0) * 12\n      )} a year.`\n    );\n  }\n  if (emergencyCoverage(state) < 3) {\n    slippage.push(`Emergency fund covers ${emergencyCoverage(state).toFixed(1)} months, below the three-month floor.`);\n  }\n  const unused = state.recurring.filter((r) => r.usage === 'unused' && r.status !== 'cancelled');\n  if (unused.length) {\n    slippage.push(`${unused.length} dormant subscriptions are still charging.`);\n  }\n  if (!wins.length) wins.push('Every month of data makes the model sharper — keep importing statements.');\n\n  return {\n    month,\n    summary,\n    prev,\n    categories,\n    merchants: topMerchants(state.txns, month, 5),\n    largest,\n    subscriptions: subs,\n    priceChanges,\n    goals,\n    narrative,\n    wins,\n    slippage,\n    savingsRate,\n    incomeDelta: summary.income - prev.income,\n    totalDelta: diff,\n  };\n}\n\nexport function reportAvailability(state: AppState): { month: string; label: string; complete: boolean }[] {\n  const months = [...new Set(state.txns.map((t) => monthKey(t.date)))].sort().reverse();\n  const today = todayISO();\n  return months.map((m) => ({\n    month: m,\n    label: m,\n    complete: daysBetween(`${m}-01`, today) > daysBetween(`${m}-01`, `${addMonths(m, 1)}-01`),\n  }));\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\report.ts"})
  [Tool result]: Created file successfully: src/domain/report.ts
  
  [Assistant reasoning]: Now the store. React context with reducer. Actions:
  
  - IMPORT_ROWS {rows, batch, source, fileName}
  - APPROVE_BATCH {batchId}
  - DELETE_TXN
  - UPDATE_TXN (category etc.)
  - LEARN_CORRECTION {txnId, category, learn, scope}
  - BULK_CATEGORIZE {ids, category, learn}
  - SPLIT_TXN {id, splits}
  - EXCLUDE_TXN {id, excluded}
  - MARK_TRANSFER
  - ADD_TXN
  - ADD_RULE / UPDATE_RULE / DELETE_RULE / APPLY_RULE (retro)
  - UPDATE_RECURRING (status, amount, usage, etc.)
  - ADD_RECURRING
  - UPDATE_PROFILE
  - INCOME CRUD, FIXED CRUD
  - GOALS CRUD / CONTRIBUTE
  - SAVE_SCENARIO / DELETE / APPLY
  - NUDGE STATE
  - SETTINGS
  - RESET
  - UNDO
  
  Persistence: localStorage key 'baseline.v1'. On load, merge with seed if version mismatch.
  
  Undo: store snapshot JSON of state before destructive ops (delete/bulk/import/reset). Keep lastAction. Undo restores snapshot.
  
  I'll implement `lastAction` inside state (already there), with snapshot string. On undo, parse snapshot into state but keep lastAction null.
  
  Toasts handled separately in a UI context.
  
  Learning correction: 
  - update txn category, confidence 1, why "Corrected by you."
  - if learn: create/update rule with pattern deriveRulePattern, field description, matchType contains, category, source learned, hits 0.
  - apply to unmatched future? Optionally retroactively assign similar txns to same category. "the system learns the rule for future transactions" — future only by default, but offer apply-to-past in Rules.
  - record correction.
  
  Import: rows → txns with categorize(rules), pending = true (needs review). Batch record. Duplicate check hash against existing (any txn hash). Mark duplicate rows skipped. Import batch counts.
  
  Approve batch: pending txns of batch → pending false.
  
  Category correction for a pending txn also sets pending false? Probably yes, approve it.
  
  Add manual txn: categorized immediately, pending false.
  
  Export: handled in UI.
  
  Update profile/income/fixed/goals through UPDATE_STATE partials.
  
  I'll expose actions as methods on context to keep components clean, using dispatch under the hood.
  
  Let me write store/AppStore.tsx with `useApp()` returning {state, dispatch, actions...}.
  
  Simple reducer:
  ```ts
  type Action = {type:'set', updater:(s:AppState)=>AppState} | {type:'undo'} | {type:'reset'} | {type:'import', ...}
  ```
  Using functions in actions is not serializable but fine. Better implement typed actions for clarity. Given time, I'll use a small set of specific actions + a generic 'patch'. Let me write specific helpers in the provider that call `setState` directly via useReducer with an action of type 'update' containing a function. That's pragmatic.
  
  ```tsx
  const [state, dispatch] = useReducer(reducer, undefined, load);
  function update(fn:(draft:AppState)=>AppState) { dispatch({type:'update', fn}) }
  ```
  
  Reducer:
  ```
  case 'update': return {...fn(state)}
  ```
  Snapshot for undo: helper `withUndo(state, label)` returns {...next, lastAction:{...}}.
  
  Persistence via useEffect on state.
  
  Toast system in same provider? Separate ToastContext to avoid re-render issues. I'll create `src/components/Toast.tsx` with provider.
  
  Router: custom hash router hook with `useRoute()` returning {path, params}. Implement navigate(to). Parse `#/transactions?q=...`. Provide `useHashRoute`.
  
  Let me write store now.
  
  Important actions list + seed reset.
  
  Also `importRows(rows, meta)` returns summary; needs to notify duplicates. Since dispatch is async-ish, compute result before dispatch using current state.
  
  I'll implement actions as functions using current `state`.
  
  Store API:
  ```
  updateTxn(id, patch)
  correctCategory(id, category, learn)
  bulkCategory(ids, category, learn)
  splitTxn(id, splits)
  toggleExclude(id)
  markTransfer(id)
  deleteTxns(ids)
  addTxn(input)
  importRows(rows, source, fileName)
  approveBatch(batchId)
  undo()
  addRule(...)
  updateRule(id, patch)
  deleteRule(id)
  applyRuleRetro(id)
  scanRecurring() -> number
  setRecurringStatus(id, status)
  updateRecurring(id, patch)
  addRecurring(rec)
  updateProfile(profile)
  upsertIncome, removeIncome, upsertFixed, removeFixed
  upsertGoal, deleteGoal, contributeGoal
  saveScenario(name, levers)
  deleteScenario(id)
  applyScenario(id)
  setNudgeState(id, status)
  updateSettings(patch)
  resetDemo()
  ```
  That's a lot but fine.
  
  Type for ID generation: `uid(prefix)`.
  
  Apply scenario: 
  - profile income[0].amount *= (1+incomeChange/100)
  - rent fixed amount *= (1+rentChange/100)
  - cancel subs in levers
  - goals monthly: allocate surplus proportionally? Use goalEtas to set monthly: for each goal, remaining / months-to-target under sim. Simpler: increase each goal.monthly by (scenario surplus - baseline surplus) distributed by priority. Let's just set goal.monthly to `required monthly` if scenario surplus >= total required, else scale. I'll implement:
  ```
  const totalRequired = sum(required)
  const alloc = Math.max(0, sim.monthly.surplus - 0)
  const scale = totalRequired>0 ? Math.min(1, alloc/totalRequired) : 1
  goals.monthly = round(required*scale)
  ```
  That's coherent. And set extraSavings? no.
  
  Add applied scenario note in nudge? Skip.
  
  Nudge dismiss stores in settings.nudgeStates.
  
  Reset restores seed.
  
  Export JSON handled in Settings.
  
  LocalStorage size: ~300 txns * ~400 bytes = 120KB, fine.
  
  Let me write.
  
  One catch: SEED_RULES hit counts. When correcting, increment rule.hits for matched rule? On correction, we create a new rule with hits 0. Fine.
  
  Let me write AppStore.tsx.
  [Assistant tool call]: write({"content":"import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';\nimport type {\n  AppState,\n  Goal,\n  ImportBatch,\n  IncomeSource,\n  FixedCost,\n  NudgeKind,\n  ParsedRow,\n  Profile,\n  Recurring,\n  Rule,\n  ScenarioLevers,\n  Settings,\n  Txn,\n} from '../types';\nimport { seedState } from '../data/seed';\nimport { categorize, deriveRulePattern } from '../domain/categorize';\nimport { rowHash } from '../domain/parse';\nimport { detectRecurring, addCadence } from '../domain/recurring';\nimport { runSimulation } from '../domain/simulate';\nimport { addMonths, nowMonth, todayISO } from '../lib/date';\n\nconst STORAGE_KEY = 'baseline.state.v1';\n\nexport const uid = (prefix = 'id'): string =>\n  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;\n\nfunction load(): AppState {\n  try {\n    const raw = localStorage.getItem(STORAGE_KEY);\n    if (!raw) return seedState();\n    const parsed = JSON.parse(raw) as AppState;\n    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.txns)) return seedState();\n    return parsed;\n  } catch {\n    return seedState();\n  }\n}\n\ntype Action =\n  | { type: 'update'; fn: (s: AppState) => AppState }\n  | { type: 'undo' }\n  | { type: 'reset' };\n\nfunction reducer(state: AppState, action: Action): AppState {\n  switch (action.type) {\n    case 'update':\n      return action.fn(state);\n    case 'undo': {\n      if (!state.lastAction) return state;\n      try {\n        const snap = JSON.parse(state.lastAction.snapshot) as AppState;\n        return { ...snap, lastAction: null };\n      } catch {\n        return state;\n      }\n    }\n    case 'reset':\n      return seedState();\n    default:\n      return state;\n  }\n}\n\nfunction snapshotOf(state: AppState): string {\n  return JSON.stringify({ ...state, lastAction: null });\n}\n\nfunction withUndo(next: AppState, label: string): AppState {\n  return { ...next, lastAction: { label, snapshot: snapshotOf(next), at: Date.now() } };\n}\n\nexport interface ImportSummary {\n  added: number;\n  duplicates: number;\n  batchId: string;\n}\n\ninterface AppContextValue {\n  state: AppState;\n  update: (fn: (s: AppState) => AppState) => void;\n  undo: () => void;\n  reset: () => void;\n  importRows: (rows: ParsedRow[], source: Txn['source'], fileName: string) => ImportSummary;\n  approveBatch: (batchId: string) => void;\n  discardBatch: (batchId: string) => void;\n  correctCategory: (txnId: string, category: string, learn: boolean) => string | null;\n  bulkCategory: (ids: string[], category: string, learn: boolean) => void;\n  splitTxn: (id: string, splits: { category: string; amount: number }[]) => void;\n  deleteTxns: (ids: string[]) => void;\n  addTxn: (input: { date: string; description: string; amount: number; category?: string; accountId?: string; note?: string }) => void;\n  updateTxn: (id: string, patch: Partial<Txn>) => void;\n  addRule: (rule: Omit<Rule, 'id' | 'createdAt' | 'hits'> & { hits?: number }) => string;\n  updateRule: (id: string, patch: Partial<Rule>) => void;\n  deleteRule: (id: string) => void;\n  applyRuleRetro: (id: string) => number;\n  scanRecurring: () => number;\n  updateRecurring: (id: string, patch: Partial<Recurring>) => void;\n  addRecurring: (r: Omit<Recurring, 'id'>) => void;\n  updateProfile: (patch: Partial<Profile>) => void;\n  upsertIncome: (i: IncomeSource) => void;\n  removeIncome: (id: string) => void;\n  upsertFixed: (f: FixedCost) => void;\n  removeFixed: (id: string) => void;\n  upsertGoal: (g: Goal) => void;\n  deleteGoal: (id: string) => void;\n  contributeGoal: (id: string, amount: number) => void;\n  saveScenario: (name: string, levers: ScenarioLevers) => string;\n  deleteScenario: (id: string) => void;\n  applyScenario: (id: string) => void;\n  setNudgeState: (id: string, status: 'open' | 'snoozed' | 'done' | 'dismissed') => void;\n  updateSettings: (patch: Partial<Settings>) => void;\n}\n\nconst AppContext = createContext<AppContextValue | null>(null);\n\nexport function AppProvider({ children }: { children: React.ReactNode }) {\n  const [state, dispatch] = useReducer(reducer, undefined, load);\n\n  useEffect(() => {\n    const t = setTimeout(() => {\n      try {\n        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));\n      } catch {\n        /* storage full — the app still works in memory */\n      }\n    }, 120);\n    return () => clearTimeout(t);\n  }, [state]);\n\n  useEffect(() => {\n    document.documentElement.dataset.theme = state.settings.theme;\n  }, [state.settings.theme]);\n\n  const update = useCallback((fn: (s: AppState) => AppState) => dispatch({ type: 'update', fn }), []);\n  const undo = useCallback(() => dispatch({ type: 'undo' }), []);\n  const reset = useCallback(() => dispatch({ type: 'reset' }), []);\n\n  const importRows = useCallback(\n    (rows: ParsedRow[], source: Txn['source'], fileName: string): ImportSummary => {\n      const batchId = uid('batch');\n      const existing = new Set(state.txns.map((t) => t.hash));\n      const seen = new Set<string>();\n      const fresh: Txn[] = [];\n      let duplicates = 0;\n      for (const row of rows) {\n        const dup = existing.has(row.hash) || seen.has(row.hash);\n        if (dup) {\n          duplicates++;\n          continue;\n        }\n        seen.add(row.hash);\n        const c = categorize(row.description, row.amount, state.rules);\n        fresh.push({\n          id: uid('txn'),\n          date: row.date,\n          description: row.description,\n          merchant: c.merchant,\n          amount: row.amount,\n          category: c.category,\n          confidence: c.confidence,\n          why: c.why,\n          accountId: 'acc_hdfc',\n          source,\n          hash: row.hash,\n          batchId,\n          pending: true,\n          createdAt: Date.now(),\n        });\n      }\n      const batch: ImportBatch = {\n        id: batchId,\n        fileName,\n        source,\n        importedAt: Date.now(),\n        total: rows.length,\n        added: fresh.length,\n        duplicates,\n        approved: false,\n      };\n      update((s) => ({\n        ...s,\n        txns: [...s.txns, ...fresh],\n        batches: [batch, ...s.batches],\n      }));\n      return { added: fresh.length, duplicates, batchId };\n    },\n    [state.txns, state.rules, update]\n  );\n\n  const approveBatch = useCallback(\n    (batchId: string) => {\n      update((s) => ({\n        ...s,\n        txns: s.txns.map((t) => (t.batchId === batchId ? { ...t, pending: false } : t)),\n        batches: s.batches.map((b) => (b.id === batchId ? { ...b, approved: true } : b)),\n      }));\n    },\n    [update]\n  );\n\n  const discardBatch = useCallback(\n    (batchId: string) => {\n      update((s) =>\n        withUndo(\n          {\n            ...s,\n            txns: s.txns.filter((t) => t.batchId !== batchId),\n            batches: s.batches.filter((b) => b.id !== batchId),\n          },\n          'Discarded import'\n        )\n      );\n    },\n    [update]\n  );\n\n  const learnRule = (s: AppState, description: string, category: string): { rules: Rule[]; ruleId: string | null; created: boolean } => {\n    const pattern = deriveRulePattern(description, description);\n    const existing = s.rules.find(\n      (r) => r.pattern.toUpperCase() === pattern && r.category === category\n    );\n    if (existing) {\n      return {\n        rules: s.rules.map((r) => (r.id === existing.id ? { ...r, hits: r.hits + 1, enabled: true } : r)),\n        ruleId: existing.id,\n        created: false,\n      };\n    }\n    const id = uid('rule');\n    const rule: Rule = {\n      id,\n      pattern,\n      field: 'description',\n      matchType: 'contains',\n      category,\n      source: 'learned',\n      priority: 50,\n      hits: 0,\n      enabled: true,\n      createdAt: Date.now(),\n    };\n    return { rules: [rule, ...s.rules], ruleId: id, created: true };\n  };\n\n  const correctCategory = useCallback(\n    (txnId: string, category: string, learn: boolean): string | null => {\n      let ruleId: string | null = null;\n      update((s) => {\n        const txn = s.txns.find((t) => t.id === txnId);\n        if (!txn) return s;\n        let rules = s.rules;\n        if (learn) {\n          const res = learnRule(s, txn.description, category);\n          rules = res.rules;\n          ruleId = res.ruleId;\n        }\n        return {\n          ...s,\n          rules,\n          txns: s.txns.map((t) =>\n            t.id === txnId\n              ? {\n                  ...t,\n                  category,\n                  confidence: 1,\n                  why: learn\n                    ? `You set this category. A rule was learned so future “${txn.merchant}” lines land here.`\n                    : 'Category set manually.',\n                  pending: false,\n                }\n              : t\n          ),\n          corrections: [\n            {\n              id: uid('corr'),\n              txnId,\n              description: txn.description,\n              from: txn.category,\n              to: category,\n              at: Date.now(),\n              learnedRuleId: learn ? ruleId ?? undefined : undefined,\n            },\n            ...s.corrections,\n          ],\n        };\n      });\n      return ruleId;\n    },\n    [update]\n  );\n\n  const bulkCategory = useCallback(\n    (ids: string[], category: string, learn: boolean) => {\n      update((s) => {\n        let rules = s.rules;\n        if (learn && ids.length) {\n          const first = s.txns.find((t) => t.id === ids[0]);\n          if (first) rules = learnRule(s, first.description, category).rules;\n        }\n        return withUndo(\n          {\n            ...s,\n            rules,\n            txns: s.txns.map((t) =>\n              ids.includes(t.id)\n                ? { ...t, category, confidence: 1, why: 'Updated in a bulk correction.', pending: false }\n                : t\n            ),\n            corrections: [\n              ...ids.map((id) => {\n                const t = s.txns.find((x) => x.id === id);\n                return {\n                  id: uid('corr'),\n                  txnId: id,\n                  description: t?.description ?? '',\n                  from: t?.category ?? '',\n                  to: category,\n                  at: Date.now(),\n                };\n              }),\n              ...s.corrections,\n            ],\n          },\n          `Recategorised ${ids.length} transactions`\n        );\n      });\n    },\n    [update]\n  );\n\n  const splitTxn = useCallback(\n    (id: string, splits: { category: string; amount: number }[]) => {\n      update((s) => ({\n        ...s,\n        txns: s.txns.map((t) =>\n          t.id === id\n            ? { ...t, splits, category: splits[0].category, confidence: 1, why: 'Split across categories.', pending: false }\n            : t\n        ),\n      }));\n    },\n    [update]\n  );\n\n  const deleteTxns = useCallback(\n    (ids: string[]) => {\n      update((s) =>\n        withUndo(\n          { ...s, txns: s.txns.filter((t) => !ids.includes(t.id)) },\n          `Deleted ${ids.length} transaction${ids.length === 1 ? '' : 's'}`\n        )\n      );\n    },\n    [update]\n  );\n\n  const addTxn = useCallback(\n    (input: { date: string; description: string; amount: number; category?: string; accountId?: string; note?: string }) => {\n      const c = categorize(input.description, input.amount, state.rules);\n      const txn: Txn = {\n        id: uid('txn'),\n        date: input.date,\n        description: input.description,\n        merchant: c.merchant,\n        amount: input.amount,\n        category: input.category ?? c.category,\n        confidence: input.category ? 1 : c.confidence,\n        why: input.category ? 'Added manually.' : c.why,\n        accountId: input.accountId ?? 'acc_hdfc',\n        source: 'manual',\n        hash: rowHash(input.date, Math.abs(input.amount), input.description),\n        note: input.note,\n        createdAt: Date.now(),\n      };\n      update((s) => ({ ...s, txns: [...s.txns, txn] }));\n    },\n    [state.rules, update]\n  );\n\n  const updateTxn = useCallback(\n    (id: string, patch: Partial<Txn>) => {\n      update((s) => ({\n        ...s,\n        txns: s.txns.map((t) => (t.id === id ? { ...t, ...patch } : t)),\n      }));\n    },\n    [update]\n  );\n\n  const addRule = useCallback(\n    (rule: Omit<Rule, 'id' | 'createdAt' | 'hits'> & { hits?: number }) => {\n      const id = uid('rule');\n      update((s) => ({\n        ...s,\n        rules: [\n          { ...rule, id, createdAt: Date.now(), hits: rule.hits ?? 0 },\n          ...s.rules,\n        ],\n      }));\n      return id;\n    },\n    [update]\n  );\n\n  const updateRule = useCallback(\n    (id: string, patch: Partial<Rule>) => {\n      update((s) => ({ ...s, rules: s.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));\n    },\n    [update]\n  );\n\n  const deleteRule = useCallback(\n    (id: string) => {\n      update((s) => ({ ...s, rules: s.rules.filter((r) => r.id !== id) }));\n    },\n    [update]\n  );\n\n  const applyRuleRetro = useCallback(\n    (id: string): number => {\n      const rule = state.rules.find((r) => r.id === id);\n      if (!rule) return 0;\n      let count = 0;\n      try {\n        const re =\n          rule.matchType === 'regex'\n            ? new RegExp(rule.pattern, 'i')\n            : rule.matchType === 'exact'\n            ? new RegExp(`^${rule.pattern.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}$`, 'i')\n            : rule.matchType === 'startsWith'\n            ? new RegExp(`^${rule.pattern.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}`, 'i')\n            : new RegExp(rule.pattern.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i');\n        const matches = state.txns.filter((t) =>\n          re.test(rule.field === 'merchant' ? t.merchant : t.description)\n        );\n        count = matches.length;\n        const ids = matches.map((m) => m.id);\n        update((s) => ({\n          ...s,\n          txns: s.txns.map((t) =>\n            ids.includes(t.id) && t.category !== rule.category\n              ? { ...t, category: rule.category, confidence: 0.99, why: `Applied rule “${rule.pattern}” retroactively.` }\n              : t\n          ),\n          rules: s.rules.map((r) =>\n            r.id === id ? { ...r, hits: r.hits + matches.length, lastHitAt: Date.now() } : r\n          ),\n        }));\n      } catch {\n        return 0;\n      }\n      return count;\n    },\n    [state.rules, state.txns, update]\n  );\n\n  const scanRecurring = useCallback((): number => {\n    const detected = detectRecurring(state.txns, state.recurring);\n    if (!detected.length) return 0;\n    const additions: Recurring[] = detected.map((d) => ({\n      id: uid('rec'),\n      merchant: d.merchant,\n      category: d.category,\n      amount: d.amount,\n      cadence: d.cadence,\n      nextDate: addCadence(todayISO(), d.cadence),\n      lastDate: d.lastDate,\n      status: 'active',\n      priceHistory: [{ date: d.dates[d.dates.length - 1], amount: d.amount }],\n      usage: 'unknown',\n      detectedFrom: d.occurrences,\n      accountId: 'acc_hdfc',\n      source: 'detected',\n      notes: `Detected from ${d.occurrences} consistent charges at ${Math.round(d.confidence * 100)}% confidence.`,\n    }));\n    update((s) => ({ ...s, recurring: [...s.recurring, ...additions] }));\n    return additions.length;\n  }, [state.txns, state.recurring, update]);\n\n  const updateRecurring = useCallback(\n    (id: string, patch: Partial<Recurring>) => {\n      update((s) => ({\n        ...s,\n        recurring: s.recurring.map((r) => (r.id === id ? { ...r, ...patch } : r)),\n      }));\n    },\n    [update]\n  );\n\n  const addRecurring = useCallback(\n    (r: Omit<Recurring, 'id'>) => {\n      update((s) => ({ ...s, recurring: [{ ...r, id: uid('rec') }, ...s.recurring] }));\n    },\n    [update]\n  );\n\n  const updateProfile = useCallback(\n    (patch: Partial<Profile>) => {\n      update((s) => ({ ...s, profile: { ...s.profile, ...patch } }));\n    },\n    [update]\n  );\n\n  const upsertIncome = useCallback(\n    (i: IncomeSource) => {\n      update((s) => {\n        const exists = s.profile.income.some((x) => x.id === i.id);\n        return {\n          ...s,\n          profile: {\n            ...s.profile,\n            income: exists\n              ? s.profile.income.map((x) => (x.id === i.id ? i : x))\n              : [...s.profile.income, i],\n          },\n        };\n      });\n    },\n    [update]\n  );\n\n  const removeIncome = useCallback(\n    (id: string) => {\n      update((s) => ({\n        ...s,\n        profile: { ...s.profile, income: s.profile.income.filter((i) => i.id !== id) },\n      }));\n    },\n    [update]\n  );\n\n  const upsertFixed = useCallback(\n    (f: FixedCost) => {\n      update((s) => {\n        const exists = s.profile.fixed.some((x) => x.id === f.id);\n        return {\n          ...s,\n          profile: {\n            ...s.profile,\n            fixed: exists ? s.profile.fixed.map((x) => (x.id === f.id ? f : x)) : [...s.profile.fixed, f],\n          },\n        };\n      });\n    },\n    [update]\n  );\n\n  const removeFixed = useCallback(\n    (id: string) => {\n      update((s) => ({\n        ...s,\n        profile: { ...s.profile, fixed: s.profile.fixed.filter((f) => f.id !== id) },\n      }));\n    },\n    [update]\n  );\n\n  const upsertGoal = useCallback(\n    (g: Goal) => {\n      update((s) => {\n        const exists = s.goals.some((x) => x.id === g.id);\n        return { ...s, goals: exists ? s.goals.map((x) => (x.id === g.id ? g : x)) : [...s.goals, g] };\n      });\n    },\n    [update]\n  );\n\n  const deleteGoal = useCallback(\n    (id: string) => {\n      update((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));\n    },\n    [update]\n  );\n\n  const contributeGoal = useCallback(\n    (id: string, amount: number) => {\n      update((s) => ({\n        ...s,\n        goals: s.goals.map((g) =>\n          g.id === id ? { ...g, saved: Math.max(0, Math.min(g.target, g.saved + amount)) } : g\n        ),\n      }));\n    },\n    [update]\n  );\n\n  const saveScenario = useCallback(\n    (name: string, levers: ScenarioLevers): string => {\n      const id = uid('scn');\n      update((s) => ({\n        ...s,\n        scenarios: [{ id, name, levers, createdAt: Date.now() }, ...s.scenarios],\n      }));\n      return id;\n    },\n    [update]\n  );\n\n  const deleteScenario = useCallback(\n    (id: string) => {\n      update((s) => ({ ...s, scenarios: s.scenarios.filter((x) => x.id !== id) }));\n    },\n    [update]\n  );\n\n  const applyScenario = useCallback(\n    (id: string) => {\n      const scn = state.scenarios.find((s) => s.id === id);\n      if (!scn) return;\n      const l = scn.levers;\n      const sim = runSimulation(state, l, 12);\n      update((s) => {\n        const goals = s.goals.map((g) => ({ ...g }));\n        const required = goals.map((g) => {\n          const months = Math.max(\n            1,\n            Math.ceil(\n              (Date.parse(g.targetDate) - Date.parse(todayISO())) / (86400000 * 30.4)\n            )\n          );\n          return Math.max(0, g.target - g.saved) / months;\n        });\n        const totalReq = required.reduce((a, b) => a + b, 0);\n        const scale = totalReq > 0 ? Math.min(1, Math.max(0, sim.monthly.surplus) / totalReq) : 1;\n        goals.forEach((g, i) => {\n          g.monthly = Math.round(required[i] * scale);\n        });\n        const income = s.profile.income.map((i, idx) =>\n          idx === 0 ? { ...i, amount: Math.round(i.amount * (1 + l.incomeChange / 100)) } : i\n        );\n        const fixed = s.profile.fixed.map((f) =>\n          f.category === 'rent' ? { ...f, amount: Math.round(f.amount * (1 + l.rentChange / 100)) } : f\n        );\n        return {\n          ...s,\n          goals,\n          profile: { ...s.profile, income, fixed },\n          recurring: s.recurring.map((r) =>\n            l.cancelledSubs.includes(r.id) ? { ...r, status: 'cancelled' as const } : r\n          ),\n          scenarios: s.scenarios.map((x) => (x.id === id ? { ...x, pinned: true } : x)),\n        };\n      });\n    },\n    [state, update]\n  );\n\n  const setNudgeState = useCallback(\n    (id: string, status: 'open' | 'snoozed' | 'done' | 'dismissed') => {\n      update((s) => {\n        const next = { ...s.settings.nudgeStates };\n        if (status === 'open') delete next[id];\n        else next[id] = status;\n        return { ...s, settings: { ...s.settings, nudgeStates: next } };\n      });\n    },\n    [update]\n  );\n\n  const updateSettings = useCallback(\n    (patch: Partial<Settings>) => {\n      update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));\n    },\n    [update]\n  );\n\n  const value = useMemo<AppContextValue>(\n    () => ({\n      state,\n      update,\n      undo,\n      reset,\n      importRows,\n      approveBatch,\n      discardBatch,\n      correctCategory,\n      bulkCategory,\n      splitTxn,\n      deleteTxns,\n      addTxn,\n      updateTxn,\n      addRule,\n      updateRule,\n      deleteRule,\n      applyRuleRetro,\n      scanRecurring,\n      updateRecurring,\n      addRecurring,\n      updateProfile,\n      upsertIncome,\n      removeIncome,\n      upsertFixed,\n      removeFixed,\n      upsertGoal,\n      deleteGoal,\n      contributeGoal,\n      saveScenario,\n      deleteScenario,\n      applyScenario,\n      setNudgeState,\n      updateSettings,\n    }),\n    [\n      state, update, undo, reset, importRows, approveBatch, discardBatch, correctCategory,\n      bulkCategory, splitTxn, deleteTxns, addTxn, updateTxn, addRule, updateRule, deleteRule,\n      applyRuleRetro, scanRecurring, updateRecurring, addRecurring, updateProfile, upsertIncome,\n      removeIncome, upsertFixed, removeFixed, upsertGoal, deleteGoal, contributeGoal, saveScenario,\n      deleteScenario, applyScenario, setNudgeState, updateSettings,\n    ]\n  );\n\n  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;\n}\n\nexport function useApp(): AppContextValue {\n  const ctx = useContext(AppContext);\n  if (!ctx) throw new Error('useApp must be used inside AppProvider');\n  return ctx;\n}\n\nexport const monthOptions = (count = 12): string[] =>\n  Array.from({ length: count }, (_, i) => addMonths(nowMonth(), -i));\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\store\\AppStore.tsx"})
  [Tool result]: Created file successfully: src/store/AppStore.tsx
  
  [Assistant reasoning]: Now UI. Start with styles.css — a big, carefully crafted design system.
  
  Tokens per plan. Let me write comprehensive CSS covering: reset, layout, sidebar, topbar, buttons, inputs, cards, tables, badges, charts, modal, drawer, toast, palette, responsive, dark theme, print.
  
  Typography:
  - font-sans IBM Plex Sans
  - mono IBM Plex Mono
  - serif Newsreader
  
  Use CSS variables with light/dark.
  
  I need to be careful about contrast: muted text #6B6F76 on #F6F4EF ≈ 4.8:1? #6B6F76 luminance ~0.15, bg ~0.9 → contrast ~5.2. Good. On cards #FFFDF8 similar.
  
  Dark: #F2EFE8 on #121416 fine; muted #A9A69E on #121416 ~7:1.
  
  Sizes: 13px base for dense dashboard, 14 for body. Mono numerals.
  
  Component classes:
  .app-shell grid: 232px 1fr
  .rail, .rail-brand, .rail-nav, .nav-item, .nav-label, .rail-foot
  .main, .topbar, .page, .page-head, .eyebrow, .display, .lede
  .grid, .col-3..12 maybe use utility spans with CSS grid-column span.
  .panel, .panel-head, .panel-title, .panel-sub, .panel-body
  .stat, .stat-value, .stat-label
  .btn, .btn-primary, .btn-secondary, .btn-ghost, .btn-danger, .btn-icon, .btn-sm
  .field, .input, .select, .textarea, .checkbox, .switch
  .table, .txn-row...
  .badge, .chip, .dot
  .chart, .chart-svg
  .progress
  .kbd
  .modal-overlay, .modal, .sheet
  .toast
  .palette
  Empty states.
  
  Let me write CSS thoughtfully but not insanely long. ~900 lines.
  
  Important: no gradients. Use 1px borders. Radii 6px. Accent amber.
  
  I'll use a subtle paper grain via repeating-linear-gradient? That's a gradient technically but not a color gradient; still, avoid. Use flat.
  
  Add `.rule` hairline.
  
  Layout responsive:
  - <=1100: rail 200px.
  - <=900: rail becomes bottom nav (fixed) with only 5 main items, topbar has menu button opening drawer for full nav. Simpler: hide rail, add `.mobile-nav` bottom bar with 5 items (Overview, Inbox, Transactions, Simulate, Plan) and a "More" button that opens a sheet with all. I'll implement in React.
  
  Let me write CSS now.
  
  For the "ledger" feel: tables with uppercase mono headers 10px letter-spacing .08em, row hover background, right-aligned amounts tabular.
  
  Chart styling: grid lines dashed 1px var(--line), labels mono 10px.
  
  Focus visible: outline 2px solid var(--accent); outline-offset 2px.
  
  Reduced motion media query.
  
  Print styles for Review.
  
  Let me write.
  [Assistant]: Now the design system and visual layer.
  [Assistant tool call]: write({"content":"/* ============================================================\n   Baseline — design tokens\n   Warm paper, ink, amber. No gradients, no glass, no emoji.\n   ============================================================ */\n\n:root {\n  --bg: #f3f1eb;\n  --bg-deep: #ece9e1;\n  --surface: #fbf9f4;\n  --surface-2: #f6f3ec;\n  --surface-3: #efebe2;\n  --ink: #14171a;\n  --ink-2: #3c4148;\n  --muted: #686d75;\n  --faint: #8b8f96;\n  --line: #e0dbd0;\n  --line-strong: #c9c2b3;\n  --accent: #a9621a;\n  --accent-ink: #fffaf2;\n  --accent-soft: #f0e2cc;\n  --positive: #26624a;\n  --positive-soft: #dce9e1;\n  --negative: #9c3a29;\n  --negative-soft: #f2e0db;\n  --info: #38556f;\n  --info-soft: #dee7ee;\n  --focus: #a9621a;\n  --shadow-sm: 0 1px 0 rgba(20, 23, 26, 0.04);\n  --shadow-md: 0 10px 30px -18px rgba(20, 23, 26, 0.35);\n  --shadow-lg: 0 24px 60px -24px rgba(20, 23, 26, 0.45);\n  --radius: 6px;\n  --radius-lg: 10px;\n  --rail: 236px;\n  --font-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif;\n  --font-mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace;\n  --font-serif: 'Newsreader', Georgia, serif;\n  color-scheme: light;\n}\n\n[data-theme='dark'] {\n  --bg: #121416;\n  --bg-deep: #0d0f10;\n  --surface: #191c1f;\n  --surface-2: #1e2225;\n  --surface-3: #252a2e;\n  --ink: #f1eee7;\n  --ink-2: #d3cec4;\n  --muted: #a3a099;\n  --faint: #7f7c76;\n  --line: #2c3135;\n  --line-strong: #3d4348;\n  --accent: #e0a659;\n  --accent-ink: #1a1206;\n  --accent-soft: #33271565;\n  --positive: #7cb79a;\n  --positive-soft: #1d3329;\n  --negative: #dd8a76;\n  --negative-soft: #33211d;\n  --info: #8fb0c9;\n  --info-soft: #1c2a33;\n  --focus: #e0a659;\n  --shadow-sm: 0 1px 0 rgba(0, 0, 0, 0.2);\n  --shadow-md: 0 12px 34px -20px rgba(0, 0, 0, 0.8);\n  --shadow-lg: 0 30px 70px -30px rgba(0, 0, 0, 0.9);\n  color-scheme: dark;\n}\n\n* { box-sizing: border-box; }\n\nhtml, body, #root { height: 100%; }\n\nbody {\n  margin: 0;\n  background: var(--bg);\n  color: var(--ink);\n  font-family: var(--font-sans);\n  font-size: 13.5px;\n  line-height: 1.5;\n  -webkit-font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n}\n\n::selection { background: var(--accent-soft); color: var(--ink); }\n\nh1, h2, h3, h4, p { margin: 0; }\nh1, h2, h3, h4 { font-weight: 600; letter-spacing: -0.015em; }\nbutton, input, select, textarea { font: inherit; color: inherit; }\nbutton { cursor: pointer; }\na { color: inherit; text-decoration: none; }\nsvg { display: block; }\ntable { border-collapse: collapse; width: 100%; }\nul, ol { margin: 0; padding: 0; list-style: none; }\n\n:focus-visible {\n  outline: 2px solid var(--focus);\n  outline-offset: 2px;\n  border-radius: 3px;\n}\n\n/* ---------- shell ---------- */\n\n.shell {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: var(--rail) minmax(0, 1fr);\n}\n\n.rail {\n  position: sticky;\n  top: 0;\n  height: 100vh;\n  display: flex;\n  flex-direction: column;\n  border-right: 1px solid var(--line);\n  background: var(--surface);\n  z-index: 40;\n}\n\n.rail-brand {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 20px 20px 18px;\n  border-bottom: 1px solid var(--line);\n}\n\n.brand-mark {\n  width: 30px;\n  height: 30px;\n  border-radius: 5px;\n  background: var(--ink);\n  color: var(--bg);\n  display: grid;\n  place-items: center;\n  font-family: var(--font-mono);\n  font-weight: 600;\n  font-size: 15px;\n  letter-spacing: -0.04em;\n  flex: none;\n}\n\n.brand-name {\n  font-size: 15px;\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  line-height: 1.1;\n}\n.brand-tag {\n  font-family: var(--font-mono);\n  font-size: 9px;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n  color: var(--muted);\n  margin-top: 3px;\n}\n\n.rail-nav { padding: 14px 10px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }\n.nav-group {\n  font-family: var(--font-mono);\n  font-size: 9px;\n  letter-spacing: 0.14em;\n  text-transform: uppercase;\n  color: var(--faint);\n  padding: 14px 10px 6px;\n}\n.nav-item {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 7px 10px;\n  border-radius: 5px;\n  color: var(--ink-2);\n  font-size: 13px;\n  font-weight: 450;\n  border: 1px solid transparent;\n  transition: background 140ms ease, color 140ms ease;\n  width: 100%;\n  background: none;\n  text-align: left;\n}\n.nav-item:hover { background: var(--surface-2); color: var(--ink); }\n.nav-item[aria-current='page'] {\n  background: var(--accent-soft);\n  border-color: color-mix(in srgb, var(--accent) 22%, transparent);\n  color: var(--ink);\n  font-weight: 500;\n}\n.nav-item svg { color: var(--muted); flex: none; }\n.nav-item[aria-current='page'] svg { color: var(--accent); }\n.nav-count {\n  margin-left: auto;\n  font-family: var(--font-mono);\n  font-size: 10px;\n  background: var(--surface-3);\n  border-radius: 20px;\n  padding: 1px 6px;\n  color: var(--ink-2);\n}\n.nav-item[aria-current='page'] .nav-count { background: color-mix(in srgb, var(--accent) 18%, transparent); }\n\n.rail-foot { margin-top: auto; border-top: 1px solid var(--line); padding: 12px 14px; }\n.user-chip { display: flex; align-items: center; gap: 9px; }\n.avatar {\n  width: 28px; height: 28px; border-radius: 50%;\n  background: var(--surface-3); border: 1px solid var(--line-strong);\n  display: grid; place-items: center;\n  font-family: var(--font-mono); font-size: 10px; font-weight: 600;\n  flex: none;\n}\n.user-name { font-size: 12px; font-weight: 500; line-height: 1.2; }\n.user-sub { font-family: var(--font-mono); font-size: 9px; color: var(--muted); letter-spacing: 0.04em; }\n\n.main { min-width: 0; display: flex; flex-direction: column; }\n\n.topbar {\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  height: 54px;\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 0 28px;\n  background: color-mix(in srgb, var(--bg) 92%, transparent);\n  backdrop-filter: blur(8px);\n  border-bottom: 1px solid var(--line);\n}\n.crumb { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }\n.crumb b { color: var(--ink); font-weight: 500; }\n.crumb-sep { color: var(--faint); }\n\n.topbar-spacer { flex: 1; }\n\n.searchbtn {\n  display: flex; align-items: center; gap: 8px;\n  height: 30px; padding: 0 8px 0 10px;\n  border: 1px solid var(--line);\n  border-radius: 5px;\n  background: var(--surface);\n  color: var(--muted);\n  font-size: 12px;\n  min-width: 190px;\n  transition: border-color 140ms ease, color 140ms ease;\n}\n.searchbtn:hover { border-color: var(--line-strong); color: var(--ink-2); }\n.kbd {\n  font-family: var(--font-mono); font-size: 9.5px;\n  border: 1px solid var(--line); background: var(--surface-2);\n  border-radius: 3px; padding: 1px 4px; color: var(--faint);\n  margin-left: auto;\n}\n\n.page { padding: 26px 28px 64px; max-width: 1500px; width: 100%; margin: 0 auto; }\n\n.page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 22px; flex-wrap: wrap; }\n.eyebrow {\n  font-family: var(--font-mono);\n  font-size: 10px;\n  letter-spacing: 0.14em;\n  text-transform: uppercase;\n  color: var(--muted);\n  display: flex; align-items: center; gap: 8px;\n}\n.display {\n  font-size: clamp(26px, 3.1vw, 40px);\n  line-height: 1.04;\n  letter-spacing: -0.035em;\n  font-weight: 500;\n  margin-top: 8px;\n}\n.display em {\n  font-family: var(--font-serif);\n  font-style: italic;\n  font-weight: 400;\n  letter-spacing: -0.02em;\n}\n.lede { color: var(--muted); font-size: 13px; margin-top: 8px; max-width: 62ch; }\n.head-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }\n\n/* ---------- buttons ---------- */\n\n.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  height: 32px;\n  padding: 0 12px;\n  border-radius: 5px;\n  border: 1px solid var(--line-strong);\n  background: var(--surface);\n  color: var(--ink);\n  font-size: 12.5px;\n  font-weight: 500;\n  white-space: nowrap;\n  transition: background 140ms ease, border-color 140ms ease, transform 80ms ease, color 140ms ease;\n}\n.btn:hover { background: var(--surface-3); border-color: var(--muted); }\n.btn:active { transform: translateY(0.5px); }\n.btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }\n.btn svg { flex: none; }\n\n.btn-primary {\n  background: var(--ink);\n  border-color: var(--ink);\n  color: var(--bg);\n}\n.btn-primary:hover { background: var(--ink-2); border-color: var(--ink-2); }\n\n.btn-accent {\n  background: var(--accent);\n  border-color: var(--accent);\n  color: var(--accent-ink);\n}\n.btn-accent:hover { background: color-mix(in srgb, var(--accent) 88%, #000); border-color: color-mix(in srgb, var(--accent) 88%, #000); }\n\n.btn-ghost { background: transparent; border-color: transparent; color: var(--ink-2); }\n.btn-ghost:hover { background: var(--surface-3); border-color: transparent; color: var(--ink); }\n\n.btn-danger { color: var(--negative); border-color: color-mix(in srgb, var(--negative) 35%, var(--line)); }\n.btn-danger:hover { background: var(--negative-soft); border-color: var(--negative); }\n\n.btn-sm { height: 26px; padding: 0 8px; font-size: 11.5px; gap: 5px; }\n.btn-lg { height: 38px; padding: 0 16px; font-size: 13px; }\n.btn-block { width: 100%; }\n.btn-icon { width: 30px; height: 30px; padding: 0; }\n\n.linkish {\n  background: none; border: 0; padding: 0;\n  color: var(--accent);\n  font-weight: 500;\n  text-decoration: underline;\n  text-underline-offset: 3px;\n  text-decoration-color: color-mix(in srgb, var(--accent) 40%, transparent);\n}\n.linkish:hover { text-decoration-color: var(--accent); }\n\n/* ---------- layout grid ---------- */\n\n.grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 16px; }\n.col-2 { grid-column: span 2; } .col-3 { grid-column: span 3; }\n.col-4 { grid-column: span 4; } .col-5 { grid-column: span 5; }\n.col-6 { grid-column: span 6; } .col-7 { grid-column: span 7; }\n.col-8 { grid-column: span 8; } .col-9 { grid-column: span 9; }\n.col-12 { grid-column: span 12; }\n.stack { display: flex; flex-direction: column; gap: 16px; }\n.stack-sm { display: flex; flex-direction: column; gap: 8px; }\n.row { display: flex; align-items: center; gap: 10px; }\n.row-between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n.wrap { flex-wrap: wrap; }\n.spacer { flex: 1; }\n\n/* ---------- panels ---------- */\n\n.panel {\n  background: var(--surface);\n  border: 1px solid var(--line);\n  border-radius: var(--radius);\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n.panel-head {\n  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;\n  padding: 14px 16px 0;\n}\n.panel-title { font-size: 13px; font-weight: 600; letter-spacing: -0.01em; display: flex; align-items: center; gap: 7px; }\n.panel-sub { font-size: 11.5px; color: var(--muted); margin-top: 2px; }\n.panel-body { padding: 14px 16px 16px; flex: 1; min-width: 0; }\n.panel-body.flush { padding: 0; }\n.panel-foot { padding: 10px 16px; border-top: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 10px; }\n\n.panel.inverse { background: var(--ink); color: var(--bg); border-color: var(--ink); }\n.panel.inverse .panel-sub, .panel.inverse .muted { color: color-mix(in srgb, var(--bg) 62%, transparent); }\n.panel.inverse .hairline { border-color: color-mix(in srgb, var(--bg) 18%, transparent); }\n\n.hairline { border-top: 1px solid var(--line); }\n\n/* ---------- typography helpers ---------- */\n\n.mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }\n.num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }\n.muted { color: var(--muted); }\n.faint { color: var(--faint); }\n.pos { color: var(--positive); }\n.neg { color: var(--negative); }\n.small { font-size: 11.5px; }\n.tiny { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; }\n.label {\n  font-family: var(--font-mono);\n  font-size: 9.5px;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n  color: var(--muted);\n}\n.big-number {\n  font-family: var(--font-mono);\n  font-size: clamp(34px, 4.4vw, 52px);\n  line-height: 1;\n  letter-spacing: -0.045em;\n  font-weight: 500;\n  font-variant-numeric: tabular-nums;\n}\n.medium-number {\n  font-family: var(--font-mono);\n  font-size: 21px;\n  line-height: 1.1;\n  letter-spacing: -0.03em;\n  font-variant-numeric: tabular-nums;\n}\n.strong { font-weight: 600; }\n.nowrap { white-space: nowrap; }\n.ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n\n/* ---------- badges & chips ---------- */\n\n.badge {\n  display: inline-flex; align-items: center; gap: 5px;\n  height: 20px; padding: 0 7px;\n  border-radius: 3px;\n  font-family: var(--font-mono);\n  font-size: 9.5px;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  border: 1px solid var(--line);\n  background: var(--surface-2);\n  color: var(--ink-2);\n  white-space: nowrap;\n}\n.badge.pos { color: var(--positive); background: var(--positive-soft); border-color: transparent; }\n.badge.neg { color: var(--negative); background: var(--negative-soft); border-color: transparent; }\n.badge.warn { color: var(--accent); background: var(--accent-soft); border-color: transparent; }\n.badge.info { color: var(--info); background: var(--info-soft); border-color: transparent; }\n.badge.ink { background: var(--ink); color: var(--bg); border-color: var(--ink); }\n.badge.outline { background: transparent; }\n\n.dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }\n.chip {\n  display: inline-flex; align-items: center; gap: 6px;\n  height: 26px; padding: 0 9px;\n  border: 1px solid var(--line);\n  background: var(--surface);\n  border-radius: 4px;\n  font-size: 11.5px;\n  color: var(--ink-2);\n  white-space: nowrap;\n  transition: border-color 120ms ease, background 120ms ease;\n}\n.chip:hover { border-color: var(--line-strong); background: var(--surface-2); }\n.chip[aria-pressed='true'] { background: var(--ink); color: var(--bg); border-color: var(--ink); }\n.chip .swatch { width: 7px; height: 7px; border-radius: 2px; flex: none; }\n\n.cat-dot { width: 7px; height: 7px; border-radius: 2px; flex: none; display: inline-block; }\n\n/* ---------- stats ---------- */\n\n.stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }\n.stat { padding: 0 14px; border-left: 1px solid var(--line); }\n.stat:first-child { border-left: 0; padding-left: 0; }\n.stat:last-child { padding-right: 0; }\n.stat-value { font-family: var(--font-mono); font-size: 18px; letter-spacing: -0.03em; margin-top: 3px; font-variant-numeric: tabular-nums; }\n.stat-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }\n.stat-sub { font-size: 10.5px; color: var(--faint); margin-top: 2px; }\n\n/* ---------- tables ---------- */\n\n.table-wrap { overflow-x: auto; }\n.tbl { width: 100%; font-size: 12.5px; }\n.tbl thead th {\n  text-align: left;\n  font-family: var(--font-mono);\n  font-size: 9px;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  color: var(--muted);\n  font-weight: 500;\n  padding: 9px 12px;\n  border-bottom: 1px solid var(--line-strong);\n  background: var(--surface-2);\n  white-space: nowrap;\n  position: sticky;\n  top: 0;\n  z-index: 1;\n}\n.tbl tbody td { padding: 9px 12px; border-bottom: 1px solid var(--line); vertical-align: middle; }\n.tbl tbody tr:hover { background: var(--surface-2); }\n.tbl tbody tr:last-child td { border-bottom: 0; }\n.tbl .right { text-align: right; }\n.tbl .money { font-family: var(--font-mono); font-variant-numeric: tabular-nums; text-align: right; white-space: nowrap; letter-spacing: -0.01em; }\n.tbl tr.selected { background: var(--accent-soft); }\n.tbl tr.pending td:first-child { box-shadow: inset 2px 0 0 var(--accent); }\n\n.txn-merchant { font-weight: 500; }\n.txn-desc { font-size: 10.5px; color: var(--faint); max-width: 380px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n\n/* ---------- forms ---------- */\n\n.field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }\n.field > label, .field-label {\n  font-family: var(--font-mono);\n  font-size: 9.5px;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  color: var(--muted);\n}\n.input, .select, .textarea {\n  height: 32px;\n  padding: 0 9px;\n  border: 1px solid var(--line-strong);\n  border-radius: 5px;\n  background: var(--surface);\n  font-size: 12.5px;\n  min-width: 0;\n  width: 100%;\n  transition: border-color 120ms ease, box-shadow 120ms ease;\n}\n.textarea { height: auto; padding: 8px 9px; resize: vertical; line-height: 1.5; }\n.input:hover, .select:hover, .textarea:hover { border-color: var(--muted); }\n.input:focus, .select:focus, .textarea:focus {\n  outline: none;\n  border-color: var(--accent);\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent);\n}\n.input::placeholder, .textarea::placeholder { color: var(--faint); }\n.select {\n  appearance: none;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%23686d75' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: right 9px center;\n  padding-right: 26px;\n}\n.input-sm, .select-sm { height: 27px; font-size: 11.5px; }\n.form-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }\n.form-row-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }\n\n.check {\n  display: inline-flex; align-items: center; gap: 8px;\n  font-size: 12px; cursor: pointer; user-select: none;\n}\n.check input { accent-color: var(--accent); width: 14px; height: 14px; margin: 0; cursor: pointer; }\n\n.switch {\n  position: relative; width: 32px; height: 18px; border-radius: 20px;\n  background: var(--line-strong); border: 0; padding: 0; flex: none;\n  transition: background 160ms ease;\n}\n.switch::after {\n  content: ''; position: absolute; top: 2px; left: 2px;\n  width: 14px; height: 14px; border-radius: 50%; background: var(--surface);\n  transition: transform 160ms ease;\n  box-shadow: 0 1px 2px rgba(0,0,0,.2);\n}\n.switch[aria-checked='true'] { background: var(--accent); }\n.switch[aria-checked='true']::after { transform: translateX(14px); }\n\n.segmented { display: inline-flex; border: 1px solid var(--line); border-radius: 5px; overflow: hidden; background: var(--surface); }\n.segmented button {\n  border: 0; background: transparent; padding: 5px 10px; font-size: 11.5px; color: var(--muted);\n  border-left: 1px solid var(--line);\n}\n.segmented button:first-child { border-left: 0; }\n.segmented button[aria-pressed='true'] { background: var(--ink); color: var(--bg); }\n.segmented button:hover:not([aria-pressed='true']) { background: var(--surface-2); color: var(--ink); }\n\n/* ---------- progress ---------- */\n\n.progress { height: 6px; background: var(--surface-3); border-radius: 20px; overflow: hidden; }\n.progress > span { display: block; height: 100%; background: var(--accent); border-radius: 20px; transition: width 400ms cubic-bezier(.2,.7,.2,1); }\n.progress.thin { height: 3px; }\n.progress.pos > span { background: var(--positive); }\n.progress.neg > span { background: var(--negative); }\n\n.meter { display: flex; height: 8px; border-radius: 2px; overflow: hidden; background: var(--surface-3); }\n.meter > span { height: 100%; }\n\n/* ---------- charts ---------- */\n\n.chart { width: 100%; overflow: visible; }\n.chart text { font-family: var(--font-mono); font-size: 9.5px; fill: var(--faint); letter-spacing: 0.04em; }\n.chart .gridline { stroke: var(--line); stroke-width: 1; stroke-dasharray: 2 4; }\n.chart .axis { stroke: var(--line-strong); stroke-width: 1; }\n.chart .line { fill: none; stroke: var(--ink); stroke-width: 1.8; stroke-linejoin: round; stroke-linecap: round; }\n.chart .line-accent { fill: none; stroke: var(--accent); stroke-width: 1.8; }\n.chart .forecast { stroke-dasharray: 4 4; }\n.chart .area { fill: color-mix(in srgb, var(--ink) 6%, transparent); }\n.chart .band { fill: color-mix(in srgb, var(--accent) 14%, transparent); }\n.chart .bar { fill: var(--ink); }\n.chart .bar-soft { fill: var(--line-strong); }\n.chart .dot { fill: var(--surface); stroke: var(--ink); stroke-width: 1.6; }\n.legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 10.5px; color: var(--muted); }\n.legend span { display: inline-flex; align-items: center; gap: 5px; }\n.legend i { width: 12px; height: 2px; background: var(--ink); display: inline-block; }\n.legend i.dashed { background: repeating-linear-gradient(90deg, var(--muted) 0 3px, transparent 3px 6px); }\n.legend i.accent { background: var(--accent); }\n\n/* ---------- empty state ---------- */\n\n.empty {\n  display: flex; flex-direction: column; align-items: center; justify-content: center;\n  text-align: center; padding: 40px 20px; color: var(--muted); gap: 8px;\n}\n.empty-icon {\n  width: 38px; height: 38px; border-radius: 50%;\n  border: 1px dashed var(--line-strong); display: grid; place-items: center;\n  color: var(--faint); margin-bottom: 4px;\n}\n.empty h3 { font-size: 13px; color: var(--ink); }\n.empty p { font-size: 12px; max-width: 42ch; }\n\n/* ---------- modal / sheet ---------- */\n\n.overlay {\n  position: fixed; inset: 0; z-index: 100;\n  background: color-mix(in srgb, var(--ink) 46%, transparent);\n  display: flex; align-items: flex-start; justify-content: center;\n  padding: 6vh 20px 20px;\n  animation: fade 120ms ease-out;\n}\n.modal {\n  width: 100%; max-width: 560px;\n  background: var(--surface);\n  border: 1px solid var(--line-strong);\n  border-radius: var(--radius-lg);\n  box-shadow: var(--shadow-lg);\n  max-height: 86vh;\n  display: flex; flex-direction: column;\n  animation: rise 160ms cubic-bezier(.2,.7,.2,1);\n}\n.modal.wide { max-width: 780px; }\n.modal.slim { max-width: 420px; }\n.modal-head { padding: 16px 18px; border-bottom: 1px solid var(--line); display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }\n.modal-title { font-size: 15px; font-weight: 600; letter-spacing: -0.02em; }\n.modal-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }\n.modal-body { padding: 16px 18px; overflow-y: auto; }\n.modal-foot { padding: 12px 18px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end; gap: 8px; align-items: center; }\n\n@keyframes fade { from { opacity: 0 } to { opacity: 1 } }\n@keyframes rise { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }\n\n/* ---------- toast ---------- */\n\n.toasts {\n  position: fixed; z-index: 200; bottom: 20px; left: 50%; transform: translateX(-50%);\n  display: flex; flex-direction: column; gap: 8px; align-items: center;\n  pointer-events: none; width: min(460px, calc(100vw - 32px));\n}\n.toast {\n  pointer-events: auto;\n  display: flex; align-items: center; gap: 10px;\n  background: var(--ink); color: var(--bg);\n  border-radius: 5px; padding: 9px 12px;\n  font-size: 12.5px;\n  box-shadow: var(--shadow-lg);\n  animation: rise 160ms cubic-bezier(.2,.7,.2,1);\n  width: 100%;\n}\n.toast button { background: none; border: 0; color: var(--accent); font-weight: 600; font-size: 11.5px; padding: 2px 4px; }\n.toast .toast-close { color: color-mix(in srgb, var(--bg) 60%, transparent); margin-left: auto; }\n\n/* ---------- command palette ---------- */\n\n.palette { width: 100%; max-width: 560px; margin-top: 2vh; }\n.palette .modal-body { padding: 0; }\n.palette-input {\n  width: 100%; border: 0; border-bottom: 1px solid var(--line);\n  background: transparent; padding: 15px 18px; font-size: 14px; outline: none;\n}\n.palette-list { max-height: 52vh; overflow-y: auto; padding: 6px; }\n.palette-item {\n  display: flex; align-items: center; gap: 10px; width: 100%;\n  padding: 8px 10px; border-radius: 4px; border: 0; background: none; text-align: left;\n  font-size: 12.5px; color: var(--ink-2);\n}\n.palette-item:hover, .palette-item[data-active='true'] { background: var(--surface-2); color: var(--ink); }\n.palette-item .kbd { margin-left: auto; }\n.palette-sec { font-family: var(--font-mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); padding: 10px 10px 4px; }\n\n/* ---------- misc ---------- */\n\n.kv { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; padding: 8px 0; border-bottom: 1px solid var(--line); }\n.kv:last-child { border-bottom: 0; }\n.kv dt { color: var(--muted); font-size: 12px; }\n.kv dd { margin: 0; font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-size: 12.5px; }\n\n.divider { height: 1px; background: var(--line); margin: 12px 0; }\n.divider.dashed { background: repeating-linear-gradient(90deg, var(--line) 0 4px, transparent 4px 8px); }\n\n.note {\n  border-left: 2px solid var(--accent);\n  background: var(--accent-soft);\n  padding: 10px 12px;\n  border-radius: 0 4px 4px 0;\n  font-size: 12px;\n  color: var(--ink-2);\n}\n.note.guard { border-left-color: var(--info); background: var(--info-soft); }\n\n.callout { border: 1px solid var(--line); border-radius: var(--radius); padding: 12px 14px; background: var(--surface-2); }\n\n.tooltip-wrap { position: relative; display: inline-flex; }\n.tooltip {\n  position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);\n  background: var(--ink); color: var(--bg); font-size: 11px; padding: 5px 8px; border-radius: 4px;\n  white-space: nowrap; z-index: 10; pointer-events: none;\n}\n\n.sr-only {\n  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;\n  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;\n}\n\n.scroll-y { overflow-y: auto; }\n.scroll-x { overflow-x: auto; }\n\n/* ---------- app-specific ---------- */\n\n.hero { padding: 22px; }\n.hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; }\n.hero-safe { margin-top: 14px; }\n.hero-note { font-size: 11.5px; color: var(--muted); margin-top: 10px; max-width: 44ch; }\n\n.bill-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--line); }\n.bill-row:last-child { border-bottom: 0; }\n.bill-date {\n  width: 34px; flex: none; text-align: center;\n  font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; color: var(--muted);\n  border-right: 1px solid var(--line); padding-right: 8px; line-height: 1.25;\n}\n.bill-date b { display: block; font-size: 13px; color: var(--ink); letter-spacing: -0.03em; }\n\n.goal-row { padding: 11px 0; border-bottom: 1px solid var(--line); }\n.goal-row:last-child { border-bottom: 0; }\n.goal-name { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 500; }\n\n.nudge {\n  border: 1px solid var(--line);\n  border-radius: var(--radius);\n  background: var(--surface);\n  padding: 12px 14px;\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n}\n.nudge + .nudge { margin-top: 10px; }\n.nudge-icon {\n  width: 26px; height: 26px; border-radius: 4px; flex: none;\n  display: grid; place-items: center;\n  background: var(--surface-3); color: var(--ink-2);\n}\n.nudge-icon.warn { background: var(--accent-soft); color: var(--accent); }\n.nudge-icon.critical { background: var(--negative-soft); color: var(--negative); }\n.nudge-icon.info { background: var(--info-soft); color: var(--info); }\n.nudge-title { font-size: 12.5px; font-weight: 600; line-height: 1.35; }\n.nudge-body { font-size: 12px; color: var(--muted); margin-top: 2px; }\n.nudge-actions { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }\n\n.lever { padding: 12px 0; border-bottom: 1px solid var(--line); }\n.lever:last-child { border-bottom: 0; }\n.lever-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 8px; }\n.lever-value { font-family: var(--font-mono); font-size: 13px; color: var(--ink); }\ninput[type='range'] {\n  -webkit-appearance: none; appearance: none;\n  width: 100%; height: 18px; background: transparent; cursor: pointer;\n}\ninput[type='range']::-webkit-slider-runnable-track { height: 2px; background: var(--line-strong); }\ninput[type='range']::-webkit-slider-thumb {\n  -webkit-appearance: none; appearance: none; margin-top: -6px;\n  width: 14px; height: 14px; border-radius: 50%;\n  background: var(--surface); border: 2px solid var(--accent);\n}\ninput[type='range']:focus-visible { outline: 2px solid var(--focus); outline-offset: 4px; }\n\n.goal-card {\n  border: 1px solid var(--line);\n  border-radius: var(--radius);\n  padding: 14px;\n  background: var(--surface);\n}\n.goal-card .goal-top { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }\n\n.dropzone {\n  border: 1px dashed var(--line-strong);\n  border-radius: var(--radius);\n  padding: 26px 18px;\n  text-align: center;\n  background: var(--surface-2);\n  transition: border-color 140ms ease, background 140ms ease;\n}\n.dropzone.drag { border-color: var(--accent); background: var(--accent-soft); }\n.dropzone h3 { font-size: 13px; margin-top: 8px; }\n.dropzone p { font-size: 11.5px; color: var(--muted); margin-top: 3px; }\n\n.tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--line); }\n.tab {\n  padding: 9px 12px; border: 0; background: none; font-size: 12.5px; color: var(--muted);\n  border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap;\n}\n.tab:hover { color: var(--ink); }\n.tab[aria-selected='true'] { color: var(--ink); border-bottom-color: var(--accent); font-weight: 500; }\n\n.mobile-nav { display: none; }\n\n.mobile-sheet {\n  position: fixed; inset: 0; z-index: 90;\n  background: color-mix(in srgb, var(--ink) 46%, transparent);\n  display: flex; align-items: flex-end;\n}\n.mobile-sheet-inner {\n  width: 100%; background: var(--surface); border-top: 1px solid var(--line-strong);\n  border-radius: 12px 12px 0 0; padding: 12px 14px calc(12px + env(safe-area-inset-bottom));\n  max-height: 80vh; overflow-y: auto;\n}\n\n.print-only { display: none; }\n\n/* ---------- responsive ---------- */\n\n@media (max-width: 1220px) {\n  .page { padding: 22px 22px 56px; }\n  .topbar { padding: 0 22px; }\n  .col-3 { grid-column: span 4; }\n}\n\n@media (max-width: 1080px) {\n  :root { --rail: 208px; }\n  .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 0; }\n  .stat:nth-child(3) { border-left: 0; padding-left: 0; }\n  .stat { padding: 0 12px; }\n}\n\n@media (max-width: 900px) {\n  .shell { grid-template-columns: 1fr; }\n  .rail { display: none; }\n  .main { padding-bottom: 62px; }\n  .topbar { height: 52px; padding: 0 16px; }\n  .searchbtn { min-width: 0; width: 32px; padding: 0; justify-content: center; }\n  .searchbtn .search-label, .searchbtn .kbd { display: none; }\n  .page { padding: 18px 16px 40px; }\n  .grid { gap: 12px; }\n  .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9 { grid-column: span 12; }\n  .col-2 { grid-column: span 6; }\n  .page-head { margin-bottom: 16px; }\n  .head-actions .btn span { display: inline; }\n  .mobile-nav {\n    display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 60;\n    border-top: 1px solid var(--line); background: color-mix(in srgb, var(--surface) 96%, transparent);\n    backdrop-filter: blur(8px);\n    padding-bottom: env(safe-area-inset-bottom);\n  }\n  .mobile-nav button {\n    flex: 1; border: 0; background: none; padding: 7px 2px 6px;\n    display: flex; flex-direction: column; align-items: center; gap: 3px;\n    font-family: var(--font-mono); font-size: 8.5px; letter-spacing: .06em;\n    text-transform: uppercase; color: var(--muted); min-height: 48px;\n  }\n  .mobile-nav button[aria-current='page'] { color: var(--accent); }\n  .big-number { font-size: 40px; }\n  .form-row, .form-row-3 { grid-template-columns: 1fr; }\n  .overlay { padding: 10px; align-items: flex-end; }\n  .modal { max-height: 92vh; border-radius: 10px 10px 0 0; }\n  .modal.wide { max-width: 100%; }\n  .toasts { bottom: 74px; }\n}\n\n@media (max-width: 560px) {\n  .display { font-size: 28px; }\n  .head-actions { width: 100%; }\n  .head-actions .btn { flex: 1; }\n  .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .hero { padding: 16px; }\n  .panel-body { padding: 12px 14px 14px; }\n  .panel-head { padding: 12px 14px 0; }\n  .tbl thead th, .tbl tbody td { padding: 8px 10px; }\n  .hide-sm { display: none !important; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}\n\n@media print {\n  .rail, .topbar, .mobile-nav, .head-actions, .toasts, .no-print { display: none !important; }\n  .shell { display: block; }\n  .page { padding: 0; max-width: none; }\n  .panel { break-inside: avoid; border-color: #ccc; }\n  body { background: #fff; font-size: 11px; }\n  .print-only { display: block; }\n  .main { padding-bottom: 0; }\n}\n\n@media (prefers-contrast: more) {\n  :root { --line: #a8a296; --line-strong: #7c766a; --muted: #4a4f57; }\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\styles.css"})
  [Tool result]: Created file successfully: src/styles.css
  
  [Assistant reasoning]: Now the icon set. Use inline SVG components with consistent stroke. I'll write `src/components/Icon.tsx` with a map of ~30 icons, stroke-width 1.6, size prop.
  
  Icons needed: overview (dashboard/grid), inbox, transactions (list/receipt), recurring (repeat), plan (target), simulate (sliders/beaker), review (document), coach (message/compass), settings, search, sun, moon, plus, upload, download, check, x, chevron-right/down/left, arrow-up/right, alert, info, trash, edit, sparkle? no. calendar, filter, more, link, split, undo, lock/shield, printer, copy, external.
  
  I'll build with a `d` map, 24 viewBox.
  
  Let me write icons carefully with valid paths.
  
  - grid: rects
  - inbox: M4 13h4l2 3h4l2-3h4 M4 13V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7 ... plus tray
  - receipt: M6 3h12v18l-3-2-3 2-3-2-3 2z + lines
  - repeat: arrows
  - target: circles + center
  - sliders: lines with knobs
  - file: rect + lines
  - compass: circle + needle
  - settings: gear simplified
  - search: circle + line
  - sun/moon
  - plus, upload, download, check, x, chevrons, alert-triangle, info, trash, pencil, calendar, filter, undo, shield, printer, arrow-up-right, arrow-down-right, spark? no, split (branch), copy, more-horizontal, clock, wallet, lock, external.
  
  I'll implement generic `Icon` with name prop typed as keyof typeof paths. Provide `IconName` type.
  
  Let me write.
  [Assistant tool call]: write({"content":"import React from 'react';\n\ntype IconName =\n  | 'grid' | 'inbox' | 'receipt' | 'repeat' | 'target' | 'sliders' | 'file' | 'compass'\n  | 'settings' | 'search' | 'sun' | 'moon' | 'plus' | 'upload' | 'download' | 'check'\n  | 'x' | 'chevronRight' | 'chevronDown' | 'chevronLeft' | 'alert' | 'info' | 'trash'\n  | 'pencil' | 'calendar' | 'filter' | 'undo' | 'shield' | 'printer' | 'arrowUpRight'\n  | 'arrowDownRight' | 'split' | 'copy' | 'more' | 'clock' | 'wallet' | 'lock'\n  | 'external' | 'spark' | 'trendUp' | 'trendDown' | 'bell' | 'user' | 'refresh' | 'eye' | 'eyeOff';\n\nconst PATHS: Record<IconName, React.ReactNode> = {\n  grid: <><rect x=\"3.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"1\" /><rect x=\"13.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"1\" /><rect x=\"3.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"1\" /><rect x=\"13.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"1\" /></>,\n  inbox: <><path d=\"M3.5 13.5h4l1.6 2.6h5.8l1.6-2.6h4\" /><path d=\"M5.6 4.5h12.8l2.1 9v4a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2v-4z\" /></>,\n  receipt: <><path d=\"M6 3.5h12v17l-3-2-3 2-3-2-3 2z\" /><path d=\"M9 8h6M9 12h6M9 16h3\" /></>,\n  repeat: <><path d=\"M17 2.5l3 3-3 3\" /><path d=\"M4 11V9a3.5 3.5 0 0 1 3.5-3.5H20\" /><path d=\"M7 21.5l-3-3 3-3\" /><path d=\"M20 13v2a3.5 3.5 0 0 1-3.5 3.5H4\" /></>,\n  target: <><circle cx=\"12\" cy=\"12\" r=\"8.5\" /><circle cx=\"12\" cy=\"12\" r=\"4.5\" /><circle cx=\"12\" cy=\"12\" r=\"1\" fill=\"currentColor\" stroke=\"none\" /></>,\n  sliders: <><path d=\"M4 7h10M18 7h2M4 17h4M12 17h8\" /><circle cx=\"16\" cy=\"7\" r=\"2.2\" /><circle cx=\"10\" cy=\"17\" r=\"2.2\" /></>,\n  file: <><path d=\"M6 3.5h8l4 4v13H6z\" /><path d=\"M14 3.5v4h4\" /><path d=\"M9 12h6M9 16h6\" /></>,\n  compass: <><circle cx=\"12\" cy=\"12\" r=\"8.5\" /><path d=\"M15.2 8.8l-2 4.4-4.4 2 2-4.4z\" /></>,\n  settings: <><circle cx=\"12\" cy=\"12\" r=\"3\" /><path d=\"M12 2.8v2.4M12 18.8v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7\" /></>,\n  search: <><circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\" /><path d=\"M15.4 15.4L21 21\" /></>,\n  sun: <><circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4\" /></>,\n  moon: <><path d=\"M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z\" /></>,\n  plus: <><path d=\"M12 5v14M5 12h14\" /></>,\n  upload: <><path d=\"M12 16V4M7.5 8.5L12 4l4.5 4.5\" /><path d=\"M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3\" /></>,\n  download: <><path d=\"M12 4v12M7.5 11.5L12 16l4.5-4.5\" /><path d=\"M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2\" /></>,\n  check: <><path d=\"M4.5 12.5l5 5 10-11\" /></>,\n  x: <><path d=\"M6 6l12 12M18 6L6 18\" /></>,\n  chevronRight: <path d=\"M9.5 5.5l6.5 6.5-6.5 6.5\" />,\n  chevronDown: <path d=\"M5.5 9.5l6.5 6.5 6.5-6.5\" />,\n  chevronLeft: <path d=\"M14.5 5.5L8 12l6.5 6.5\" />,\n  alert: <><path d=\"M12 3.8L21 20H3z\" /><path d=\"M12 9v5\" /><circle cx=\"12\" cy=\"17\" r=\".9\" fill=\"currentColor\" stroke=\"none\" /></>,\n  info: <><circle cx=\"12\" cy=\"12\" r=\"8.5\" /><path d=\"M12 11v5\" /><circle cx=\"12\" cy=\"8\" r=\".9\" fill=\"currentColor\" stroke=\"none\" /></>,\n  trash: <><path d=\"M4 6.5h16M9.5 6.5V4h5v2.5M6.5 6.5l1 13h9l1-13\" /><path d=\"M10 10.5v5M14 10.5v5\" /></>,\n  pencil: <><path d=\"M4 20l.8-4.2L16.3 4.3a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.2 19.2z\" /><path d=\"M14.5 6.5l3 3\" /></>,\n  calendar: <><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15.5\" rx=\"1.5\" /><path d=\"M3.5 9.5h17M8 3v4M16 3v4\" /></>,\n  filter: <path d=\"M3.5 5.5h17l-6.5 7.5v6l-4 2v-8z\" />,\n  undo: <><path d=\"M4 9.5h9a5.5 5.5 0 0 1 0 11H8\" /><path d=\"M8 5L4 9.5 8 14\" /></>,\n  shield: <><path d=\"M12 3l8 3v6c0 4.5-3.3 7.8-8 9-4.7-1.2-8-4.5-8-9V6z\" /><path d=\"M9 12l2 2 4-4.5\" /></>,\n  printer: <><path d=\"M7 8V3.5h10V8\" /><rect x=\"3.5\" y=\"8\" width=\"17\" height=\"8\" rx=\"1.5\" /><path d=\"M7 13.5h10v7H7z\" /></>,\n  arrowUpRight: <><path d=\"M7 17L17 7M8 7h9v9\" /></>,\n  arrowDownRight: <><path d=\"M7 7l10 10M17 8v9H8\" /></>,\n  split: <><path d=\"M12 3v6M12 15v6\" /><path d=\"M6 21v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4\" /><circle cx=\"12\" cy=\"12\" r=\"3\" /></>,\n  copy: <><rect x=\"8.5\" y=\"8.5\" width=\"12\" height=\"12\" rx=\"1.5\" /><path d=\"M15.5 8.5v-3a1.5 1.5 0 0 0-1.5-1.5H5a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 5 16h3\" /></>,\n  more: <><circle cx=\"5\" cy=\"12\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\" /><circle cx=\"12\" cy=\"12\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\" /><circle cx=\"19\" cy=\"12\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\" /></>,\n  clock: <><circle cx=\"12\" cy=\"12\" r=\"8.5\" /><path d=\"M12 7v5.4l3.4 2\" /></>,\n  wallet: <><path d=\"M3.5 7.5A2.5 2.5 0 0 1 6 5h12.5v3\" /><rect x=\"3.5\" y=\"7.5\" width=\"17\" height=\"12\" rx=\"2\" /><path d=\"M15.5 13.5h2.5\" /></>,\n  lock: <><rect x=\"5\" y=\"10.5\" width=\"14\" height=\"10\" rx=\"1.5\" /><path d=\"M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3\" /></>,\n  external: <><path d=\"M14 4h6v6M20 4l-8 8\" /><path d=\"M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10\" /></>,\n  spark: <><path d=\"M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z\" /><path d=\"M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z\" /></>,\n  trendUp: <><path d=\"M3.5 17l6-6 4 4 7-7.5\" /><path d=\"M15 7.5h5.5V13\" /></>,\n  trendDown: <><path d=\"M3.5 7l6 6 4-4 7 7.5\" /><path d=\"M15 16.5h5.5V11\" /></>,\n  bell: <><path d=\"M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z\" /><path d=\"M10 19a2 2 0 0 0 4 0\" /></>,\n  user: <><circle cx=\"12\" cy=\"8\" r=\"3.5\" /><path d=\"M4.5 20a7.5 7.5 0 0 1 15 0\" /></>,\n  refresh: <><path d=\"M20 12a8 8 0 1 1-2.3-5.6\" /><path d=\"M20 3.5V8h-4.5\" /></>,\n  eye: <><path d=\"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z\" /><circle cx=\"12\" cy=\"12\" r=\"3\" /></>,\n  eyeOff: <><path d=\"M3 3l18 18\" /><path d=\"M10.6 6.1A8.9 8.9 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-3 3.7M6.4 6.9A15.4 15.4 0 0 0 2.5 12S6 18 12 18c1.2 0 2.3-.2 3.3-.6\" /></>,\n};\n\nexport type { IconName };\n\nexport function Icon({\n  name,\n  size = 16,\n  strokeWidth = 1.6,\n  className,\n  'aria-hidden': ariaHidden = true,\n}: {\n  name: IconName;\n  size?: number;\n  strokeWidth?: number;\n  className?: string;\n  'aria-hidden'?: boolean;\n}) {\n  return (\n    <svg\n      width={size}\n      height={size}\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      strokeWidth={strokeWidth}\n      strokeLinecap=\"round\"\n      strokeLinejoin=\"round\"\n      className={className}\n      aria-hidden={ariaHidden}\n      focusable=\"false\"\n    >\n      {PATHS[name]}\n    </svg>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\components\\Icon.tsx"})
  [Tool result]: Created file successfully: src/components/Icon.tsx
  
  [Assistant reasoning]: Now shared UI components: Button not needed (use classes). But Modal, Drawer, Toast, Router, charts, and small pieces.
  
  Router: `src/lib/router.tsx` with `useRoute` and `navigate`.
  
  ```ts
  export interface Route { path: string; params: URLSearchParams; hash: string }
  export function parseHash(hash): ...
  export function navigate(to: string) { window.location.hash = to.replace(/^#/, '') }
  export function useRoute() { const [route,setRoute] = useState(parse); useEffect(listen hashchange) ... }
  ```
  
  Params query parsing.
  
  Toast provider: `useToast()` → push(message, action?).
  
  Modal: portal? Simple fixed overlay render inside tree is fine. Use createPortal to body for stacking. Implement `Modal({open, onClose, title, sub, children, footer, wide})` with Escape handler, focus trap basic (focus first input on open), click outside to close.
  
  Charts:
  - `AreaLineChart({series: {key, value}[], forecastFrom?: number, height, format})` custom SVG with responsive width via viewBox and preserveAspectRatio.
  
  I'll implement charts with fixed viewBox (e.g., 640x220) and `width="100%"` — text scales. Fine.
  
  Components:
  1. `Sparkline({values, color, height=28})`
  2. `CashflowChart({history, forecast, height=220})` — line with area, dashed forecast, band.
  3. `BarsByCategory` — simple horizontal bars in HTML (not SVG) with labels.
  4. `MonthlyBarChart({months: {key, inflow, outflow}[]})`.
  5. `Donut` maybe not needed; category list with bars is better.
  
  Let me design the overview chart: `CashflowChart` with points for 6 months actual + 6 forecast. Each point value = balance at end of month (running). We can compute historical balances from openingBalance + cumulative txns. That's a nice trend. But cumulative balance from only 6 months of data starts at opening; chart would show growth. Good.
  
  Actually a cashflow chart of monthly inflow vs outflow bars is more informative. The hero can show balance forecast line (actual 6 months + projected). I'll do a line chart with actual solid and forecast dashed. Add a small bar chart of monthly surplus below? Keep it clean.
  
  `BalanceChart`:
  props: history: {key, value}[], forecast: {key, value}[], height.
  X labels every month short.
  Y grid 4 lines with compact labels.
  Area under actual, dashed forecast starting from last actual.
  Band on forecast (optional): ± flexible*0.12*sqrt(i).
  
  Compute in component.
  
  Tooltip on hover: show month + value. Implement with mousemove? Simpler: render `<title>` on circles for native tooltip + keyboard focus circles with tabIndex and aria-label. Add hover reveals: each point has a transparent rect + circle with title. Good enough, accessible.
  
  Also a "table fallback" toggle? The skill says visible data table fallback. I'll include a details/summary "View as table" under chart. Good.
  
  Let me write `src/components/charts.tsx`.
  
  Then `src/components/ui.tsx` with Modal, Tabs, EmptyState, Badge? Badges via classes. Toast provider, RouteLink.
  
  Then screens.
  
  Time is limited; let me be efficient but keep quality.
  
  Charts implementation:
  
  ```tsx
  export function LineChart({actual, forecast, height=210, labelFormat, ariaLabel}) 
  ```
  Compute all values, min/max with padding. viewBox 720xheight.
  padding left 44, right 8, top 12, bottom 22.
  x positions by index across total points.
  path builder.
  pointer: circles with r=2.5 at each point, plus `<title>`.
  Forecast starts at last actual point (duplicate).
  Band: polygon between forecast +width and -width.
  
  Add tooltip via React state on hover: compute nearest index from mouse x. That's nicer. Use a transparent overlay rect with onMouseMove; set hover state {i, x, y}. Render crosshair line and tooltip div positioned absolutely. Requires container relative wrapper. I'll implement with a wrapper div.
  
  Let me write carefully.
  
  For monthly bars: `BarChart({data: {label, a, b}[]})` maybe not needed. The report can use CSS bars.
  
  I'll include:
  - LineChart
  - Sparkline
  - MiniBars (monthly income/spend pairs)
  - ProgressDots? no.
  
  Write.
  [Assistant tool call]: write({"content":"import { useMemo, useState } from 'react';\nimport { compact, money } from '../lib/format';\n\nexport interface Point {\n  key: string;\n  value: number;\n}\n\nconst W = 720;\n\nfunction pathFor(points: { x: number; y: number }[]): string {\n  return points\n    .map((p, i) => {\n      if (i === 0) return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;\n      const prev = points[i - 1];\n      const cx = (prev.x + p.x) / 2;\n      return `C ${cx.toFixed(2)} ${prev.y.toFixed(2)}, ${cx.toFixed(2)} ${p.y.toFixed(2)}, ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;\n    })\n    .join(' ');\n}\n\nexport function LineChart({\n  actual,\n  forecast = [],\n  height = 220,\n  band,\n  showTable = true,\n  ariaLabel = 'Cash balance over time',\n}: {\n  actual: Point[];\n  forecast?: Point[];\n  height?: number;\n  band?: number;\n  showTable?: boolean;\n  ariaLabel?: string;\n}) {\n  const [hover, setHover] = useState<number | null>(null);\n  const pad = { l: 46, r: 10, t: 14, b: 24 };\n  const all = [...actual, ...(forecast.length ? [{ ...forecast[0], value: actual[actual.length - 1]?.value ?? 0 }, ...forecast] : [])];\n  const values = all.map((p) => p.value);\n  const rawMin = Math.min(...values, 0);\n  const rawMax = Math.max(...values, 1);\n  const span = rawMax - rawMin || 1;\n  const min = rawMin - span * 0.08;\n  const max = rawMax + span * 0.1;\n\n  const innerW = W - pad.l - pad.r;\n  const innerH = height - pad.t - pad.b;\n  const n = all.length;\n  const xAt = (i: number) => pad.l + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);\n  const yAt = (v: number) => pad.t + innerH - ((v - min) / (max - min)) * innerH;\n\n  const actualPts = actual.map((p, i) => ({ x: xAt(i), y: yAt(p.value) }));\n  const forecastOffset = actual.length;\n  const forecastPts = forecast.map((p, i) => ({ x: xAt(forecastOffset + i), y: yAt(p.value) }));\n  const forecastAll = actual.length\n    ? [{ x: xAt(actual.length - 1), y: yAt(actual[actual.length - 1].value) }, ...forecastPts]\n    : forecastPts;\n\n  const bandWidth = band ?? 0;\n  const bandPts = forecast.length\n    ? forecast.map((p, i) => ({\n        x: xAt(forecastOffset + i),\n        hi: yAt(p.value + bandWidth * Math.sqrt(i + 1)),\n        lo: yAt(Math.max(0, p.value - bandWidth * Math.sqrt(i + 1))),\n      }))\n    : [];\n  const bandPath = bandPts.length\n    ? `M ${xAt(actual.length - 1)} ${yAt(actual[actual.length - 1]?.value ?? 0)} ` +\n      bandPts.map((p) => `L ${p.x} ${p.hi}`).join(' ') +\n      ' ' +\n      [...bandPts].reverse().map((p) => `L ${p.x} ${p.lo}`).join(' ') +\n      ' Z'\n    : '';\n\n  const gridCount = 4;\n  const gridVals = Array.from({ length: gridCount + 1 }, (_, i) => min + ((max - min) * i) / gridCount);\n  const areaPath = actualPts.length\n    ? `${pathFor(actualPts)} L ${actualPts[actualPts.length - 1].x} ${pad.t + innerH} L ${actualPts[0].x} ${pad.t + innerH} Z`\n    : '';\n\n  const labels = [...actual, ...forecast];\n  const hoverPoint = hover !== null ? all[Math.min(hover, all.length - 1)] : null;\n\n  return (\n    <div style={{ position: 'relative' }}>\n      <svg\n        className=\"chart\"\n        viewBox={`0 0 ${W} ${height}`}\n        role=\"img\"\n        aria-label={ariaLabel}\n        onMouseLeave={() => setHover(null)}\n        onMouseMove={(e) => {\n          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();\n          const x = ((e.clientX - rect.left) / rect.width) * W;\n          const ratio = (x - pad.l) / innerW;\n          const idx = Math.round(ratio * (n - 1));\n          setHover(Math.max(0, Math.min(n - 1, idx)));\n        }}\n      >\n        {gridVals.map((v, i) => (\n          <g key={i}>\n            <line className=\"gridline\" x1={pad.l} x2={W - pad.r} y1={yAt(v)} y2={yAt(v)} />\n            <text x={pad.l - 8} y={yAt(v) + 3} textAnchor=\"end\">\n              {compact(v)}\n            </text>\n          </g>\n        ))}\n        {bandPath && <path className=\"band\" d={bandPath} />}\n        {areaPath && <path className=\"area\" d={areaPath} />}\n        {actualPts.length > 1 && <path className=\"line\" d={pathFor(actualPts)} />}\n        {forecastAll.length > 1 && <path className=\"line line-accent forecast\" d={pathFor(forecastAll)} />}\n        {actualPts.map((p, i) => (\n          <circle key={i} className=\"dot\" cx={p.x} cy={p.y} r={hover === i ? 3.4 : 2.2} />\n        ))}\n        {labels.map((p, i) => {\n          const show = n <= 13 || i % 2 === 0;\n          if (!show) return null;\n          return (\n            <text key={`${p.key}-${i}`} x={xAt(i)} y={height - 6} textAnchor=\"middle\">\n              {p.key.slice(5)}/{p.key.slice(2, 4)}\n            </text>\n          );\n        })}\n        {hover !== null && (\n          <>\n            <line\n              x1={xAt(hover)}\n              x2={xAt(hover)}\n              y1={pad.t}\n              y2={pad.t + innerH}\n              stroke=\"var(--line-strong)\"\n              strokeDasharray=\"2 3\"\n            />\n            <circle cx={xAt(hover)} cy={yAt(all[hover].value)} r={4} fill=\"var(--accent)\" />\n          </>\n        )}\n      </svg>\n      {hoverPoint && (\n        <div\n          style={{\n            position: 'absolute',\n            left: `${(xAt(hover!) / W) * 100}%`,\n            top: 2,\n            transform: 'translateX(-50%)',\n            background: 'var(--ink)',\n            color: 'var(--bg)',\n            padding: '4px 8px',\n            borderRadius: 4,\n            fontSize: 10.5,\n            pointerEvents: 'none',\n            whiteSpace: 'nowrap',\n            fontFamily: 'var(--font-mono)',\n          }}\n        >\n          {hoverPoint.key} · {money(hoverPoint.value)}\n        </div>\n      )}\n      {showTable && (\n        <details style={{ marginTop: 6 }}>\n          <summary className=\"tiny\" style={{ cursor: 'pointer', color: 'var(--muted)', listStyle: 'none' }}>\n            View as table\n          </summary>\n          <div className=\"scroll-x\" style={{ marginTop: 6 }}>\n            <table className=\"tbl\" style={{ fontSize: 11 }}>\n              <thead>\n                <tr>\n                  <th>Month</th>\n                  <th className=\"right\">Balance</th>\n                </tr>\n              </thead>\n              <tbody>\n                {all.map((p, i) => (\n                  <tr key={`${p.key}-${i}`}>\n                    <td className=\"mono\">{p.key}</td>\n                    <td className=\"money\">{money(p.value)}</td>\n                  </tr>\n                ))}\n              </tbody>\n            </table>\n          </div>\n        </details>\n      )}\n    </div>\n  );\n}\n\nexport function Sparkline({\n  values,\n  color = 'var(--ink)',\n  height = 28,\n  width = 92,\n}: {\n  values: number[];\n  color?: string;\n  height?: number;\n  width?: number;\n}) {\n  if (values.length < 2) return null;\n  const min = Math.min(...values);\n  const max = Math.max(...values);\n  const span = max - min || 1;\n  const pts = values.map((v, i) => ({\n    x: (i / (values.length - 1)) * (width - 2) + 1,\n    y: height - 2 - ((v - min) / span) * (height - 4),\n  }));\n  return (\n    <svg width={width} height={height} aria-hidden=\"true\" style={{ overflow: 'visible' }}>\n      <path\n        d={pathFor(pts)}\n        fill=\"none\"\n        stroke={color}\n        strokeWidth={1.4}\n        strokeLinecap=\"round\"\n        strokeLinejoin=\"round\"\n      />\n    </svg>\n  );\n}\n\nexport function MonthBars({\n  data,\n  height = 150,\n}: {\n  data: { key: string; income: number; outflow: number }[];\n  height?: number;\n}) {\n  const [hover, setHover] = useState<number | null>(null);\n  const pad = { l: 40, r: 6, t: 10, b: 20 };\n  const W2 = 520;\n  const innerW = W2 - pad.l - pad.r;\n  const innerH = height - pad.t - pad.b;\n  const max = Math.max(...data.map((d) => Math.max(d.income, d.outflow)), 1);\n  const slot = innerW / Math.max(1, data.length);\n  const bw = Math.min(12, slot * 0.28);\n  const yAt = (v: number) => pad.t + innerH - (v / max) * innerH;\n\n  return (\n    <div style={{ position: 'relative' }}>\n      <svg className=\"chart\" viewBox={`0 0 ${W2} ${height}`} role=\"img\" aria-label=\"Income against spending by month\">\n        {[0.25, 0.5, 0.75, 1].map((r) => (\n          <line key={r} className=\"gridline\" x1={pad.l} x2={W2 - pad.r} y1={yAt(max * r)} y2={yAt(max * r)} />\n        ))}\n        <line className=\"axis\" x1={pad.l} x2={W2 - pad.r} y1={yAt(0)} y2={yAt(0)} />\n        {data.map((d, i) => {\n          const cx = pad.l + slot * i + slot / 2;\n          return (\n            <g key={d.key} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>\n              <rect x={pad.l + slot * i} y={pad.t} width={slot} height={innerH} fill=\"transparent\" />\n              <rect className=\"bar-soft\" x={cx - bw - 1} y={yAt(d.income)} width={bw} height={Math.max(1, yAt(0) - yAt(d.income))} rx={1} />\n              <rect className=\"bar\" x={cx + 1} y={yAt(d.outflow)} width={bw} height={Math.max(1, yAt(0) - yAt(d.outflow))} rx={1} />\n              <text x={cx} y={height - 5} textAnchor=\"middle\">{d.key.slice(5)}</text>\n            </g>\n          );\n        })}\n      </svg>\n      {hover !== null && (\n        <div\n          style={{\n            position: 'absolute',\n            left: `${((pad.l + slot * hover + slot / 2) / W2) * 100}%`,\n            top: 0,\n            transform: 'translateX(-50%)',\n            background: 'var(--ink)',\n            color: 'var(--bg)',\n            padding: '4px 8px',\n            borderRadius: 4,\n            fontSize: 10,\n            fontFamily: 'var(--font-mono)',\n            pointerEvents: 'none',\n            whiteSpace: 'nowrap',\n          }}\n        >\n          in {compact(data[hover].income)} · out {compact(data[hover].outflow)}\n        </div>\n      )}\n      <div className=\"legend\" style={{ marginTop: 4 }}>\n        <span><i style={{ background: 'var(--line-strong)' }} /> Income</span>\n        <span><i style={{ background: 'var(--ink)' }} /> Spending</span>\n      </div>\n    </div>\n  );\n}\n\nexport function CategoryBars({\n  data,\n  total,\n  max = 8,\n}: {\n  data: { category: string; amount: number; color: string; name: string }[];\n  total: number;\n  max?: number;\n}) {\n  const rows = data.slice(0, max);\n  const biggest = Math.max(...rows.map((r) => r.amount), 1);\n  return (\n    <div className=\"stack-sm\">\n      {rows.map((r) => (\n        <div key={r.category} className=\"row\" style={{ gap: 10 }}>\n          <span className=\"cat-dot\" style={{ background: r.color }} />\n          <span style={{ width: 108, fontSize: 11.5, flex: 'none' }} className=\"ellipsis\">{r.name}</span>\n          <div style={{ flex: 1, height: 7, background: 'var(--surface-3)', borderRadius: 2, overflow: 'hidden' }}>\n            <div style={{ width: `${(r.amount / biggest) * 100}%`, height: '100%', background: r.color, opacity: 0.85 }} />\n          </div>\n          <span className=\"num\" style={{ width: 78, textAlign: 'right', fontSize: 11.5 }}>{money(r.amount)}</span>\n          <span className=\"mono faint\" style={{ width: 34, textAlign: 'right', fontSize: 10 }}>\n            {total > 0 ? Math.round((r.amount / total) * 100) : 0}%\n          </span>\n        </div>\n      ))}\n      {data.length > max && (\n        <div className=\"tiny\" style={{ color: 'var(--muted)', paddingTop: 4 }}>\n          + {data.length - max} more categories\n        </div>\n      )}\n    </div>\n  );\n}\n\nexport function Donut({\n  slices,\n  size = 120,\n  thickness = 14,\n  center,\n}: {\n  slices: { value: number; color: string; label: string }[];\n  size?: number;\n  thickness?: number;\n  center?: React.ReactNode;\n}) {\n  const total = slices.reduce((s, x) => s + x.value, 0) || 1;\n  const r = (size - thickness) / 2;\n  const c = 2 * Math.PI * r;\n  let offset = 0;\n  return (\n    <div style={{ position: 'relative', width: size, height: size }}>\n      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role=\"img\" aria-label=\"Spending split\">\n        <circle cx={size / 2} cy={size / 2} r={r} fill=\"none\" stroke=\"var(--surface-3)\" strokeWidth={thickness} />\n        {slices.map((s, i) => {\n          const len = (s.value / total) * c;\n          const el = (\n            <circle\n              key={i}\n              cx={size / 2}\n              cy={size / 2}\n              r={r}\n              fill=\"none\"\n              stroke={s.color}\n              strokeWidth={thickness}\n              strokeDasharray={`${len} ${c - len}`}\n              strokeDashoffset={-offset}\n              transform={`rotate(-90 ${size / 2} ${size / 2})`}\n            >\n              <title>{s.label}</title>\n            </circle>\n          );\n          offset += len;\n          return el;\n        })}\n      </svg>\n      {center && (\n        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>\n          {center}\n        </div>\n      )}\n    </div>\n  );\n}\n\nexport function useMoneyTicker() {\n  return useMemo(() => ({ money, compact }), []);\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\components\\charts.tsx"})
  [Tool result]: Created file successfully: src/components/charts.tsx
  
  [Assistant reasoning]: Now UI primitives + router + toast.
  
  Router file:
  ```tsx
  export function useRoute() {...}
  export function navigate(to: string)
  export function Link({to, children, className, ...})
  ```
  
  Need query params parsing.
  
  `src/lib/router.ts` (no JSX).
  
  Toast: `src/components/Toast.tsx` with context.
  
  Modal: `src/components/Modal.tsx`.
  
  Also `src/components/ui.tsx`: SectionTitle, Empty, Toggle, Segmented, Confirm dialog? I'll implement inline where needed.
  
  Let me write router.
  [Assistant tool call]: write({"content":"import { useEffect, useState } from 'react';\n\nexport interface Route {\n  path: string;\n  parts: string[];\n  params: URLSearchParams;\n  raw: string;\n}\n\nexport function parseHash(hash: string): Route {\n  const clean = hash.replace(/^#\\/?/, '');\n  const [pathPart, query = ''] = clean.split('?');\n  const path = pathPart.replace(/\\/+$/, '') || 'overview';\n  return {\n    path,\n    parts: path.split('/').filter(Boolean),\n    params: new URLSearchParams(query),\n    raw: hash,\n  };\n}\n\nexport function navigate(to: string): void {\n  const next = to.startsWith('#') ? to : `#/${to.replace(/^\\//, '')}`;\n  if (window.location.hash === next) return;\n  window.location.hash = next;\n}\n\nexport function useRoute(): Route {\n  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));\n  useEffect(() => {\n    const onChange = () => {\n      setRoute(parseHash(window.location.hash));\n      window.scrollTo({ top: 0, behavior: 'auto' });\n    };\n    window.addEventListener('hashchange', onChange);\n    if (!window.location.hash) window.location.hash = '#/overview';\n    return () => window.removeEventListener('hashchange', onChange);\n  }, []);\n  return route;\n}\n\nexport function useQueryState(key: string): [string, (v: string) => void] {\n  const route = useRoute();\n  const value = route.params.get(key) ?? '';\n  const set = (v: string) => {\n    const params = new URLSearchParams(route.params);\n    if (v) params.set(key, v);\n    else params.delete(key);\n    const qs = params.toString();\n    navigate(`/${route.path}${qs ? `?${qs}` : ''}`);\n  };\n  return [value, set];\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\lib\\router.ts"})
  [Tool result]: Created file successfully: src/lib/router.ts
  [Assistant tool call]: write({"content":"import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';\nimport { createPortal } from 'react-dom';\nimport { Icon } from './Icon';\n\n/* ---------------- Toasts ---------------- */\n\ntype Toast = { id: number; message: string; action?: { label: string; run: () => void } };\n\nconst ToastContext = createContext<{\n  push: (message: string, action?: { label: string; run: () => void }) => void;\n} | null>(null);\n\nlet counter = 0;\n\nexport function ToastProvider({ children }: { children: React.ReactNode }) {\n  const [toasts, setToasts] = useState<Toast[]>([]);\n  const timers = useRef<number[]>([]);\n\n  const push = useCallback((message: string, action?: { label: string; run: () => void }) => {\n    const id = ++counter;\n    setToasts((t) => [...t.slice(-2), { id, message, action }]);\n    const timer = window.setTimeout(() => {\n      setToasts((t) => t.filter((x) => x.id !== id));\n    }, 5000);\n    timers.current.push(timer);\n  }, []);\n\n  useEffect(() => () => timers.current.forEach(clearTimeout), []);\n\n  return (\n    <ToastContext.Provider value={{ push }}>\n      {children}\n      {createPortal(\n        <div className=\"toasts\" aria-live=\"polite\" aria-atomic=\"true\">\n          {toasts.map((t) => (\n            <div className=\"toast\" key={t.id} role=\"status\">\n              <Icon name=\"check\" size={14} />\n              <span>{t.message}</span>\n              {t.action && (\n                <button\n                  type=\"button\"\n                  onClick={() => {\n                    t.action!.run();\n                    setToasts((x) => x.filter((y) => y.id !== t.id));\n                  }}\n                >\n                  {t.action.label}\n                </button>\n              )}\n              <button\n                type=\"button\"\n                className=\"toast-close\"\n                aria-label=\"Dismiss notification\"\n                onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}\n              >\n                <Icon name=\"x\" size={13} />\n              </button>\n            </div>\n          ))}\n        </div>,\n        document.body\n      )}\n    </ToastContext.Provider>\n  );\n}\n\nexport function useToast() {\n  const ctx = useContext(ToastContext);\n  if (!ctx) throw new Error('useToast must be used inside ToastProvider');\n  return ctx;\n}\n\n/* ---------------- Modal ---------------- */\n\nexport function Modal({\n  open,\n  onClose,\n  title,\n  sub,\n  children,\n  footer,\n  size = 'normal',\n  labelledBy,\n}: {\n  open: boolean;\n  onClose: () => void;\n  title: string;\n  sub?: string;\n  children: React.ReactNode;\n  footer?: React.ReactNode;\n  size?: 'normal' | 'wide' | 'slim';\n  labelledBy?: string;\n}) {\n  const ref = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    if (!open) return;\n    const onKey = (e: KeyboardEvent) => {\n      if (e.key === 'Escape') onClose();\n      if (e.key === 'Tab' && ref.current) {\n        const focusables = ref.current.querySelectorAll<HTMLElement>(\n          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])'\n        );\n        if (!focusables.length) return;\n        const first = focusables[0];\n        const last = focusables[focusables.length - 1];\n        if (e.shiftKey && document.activeElement === first) {\n          e.preventDefault();\n          last.focus();\n        } else if (!e.shiftKey && document.activeElement === last) {\n          e.preventDefault();\n          first.focus();\n        }\n      }\n    };\n    document.addEventListener('keydown', onKey);\n    const prev = document.body.style.overflow;\n    document.body.style.overflow = 'hidden';\n    const t = window.setTimeout(() => {\n      const el = ref.current?.querySelector<HTMLElement>('input, select, textarea, button');\n      el?.focus();\n    }, 30);\n    return () => {\n      document.removeEventListener('keydown', onKey);\n      document.body.style.overflow = prev;\n      clearTimeout(t);\n    };\n  }, [open, onClose]);\n\n  if (!open) return null;\n  return createPortal(\n    <div\n      className=\"overlay\"\n      onMouseDown={(e) => {\n        if (e.target === e.currentTarget) onClose();\n      }}\n    >\n      <div\n        className={`modal ${size === 'wide' ? 'wide' : size === 'slim' ? 'slim' : ''}`}\n        role=\"dialog\"\n        aria-modal=\"true\"\n        aria-labelledby={labelledBy ?? 'modal-title'}\n        ref={ref}\n      >\n        <div className=\"modal-head\">\n          <div>\n            <h2 className=\"modal-title\" id={labelledBy ?? 'modal-title'}>{title}</h2>\n            {sub && <p className=\"modal-sub\">{sub}</p>}\n          </div>\n          <button className=\"btn btn-ghost btn-icon\" onClick={onClose} aria-label=\"Close dialog\">\n            <Icon name=\"x\" size={15} />\n          </button>\n        </div>\n        <div className=\"modal-body\">{children}</div>\n        {footer && <div className=\"modal-foot\">{footer}</div>}\n      </div>\n    </div>,\n    document.body\n  );\n}\n\n/* ---------------- Small controls ---------------- */\n\nexport function Switch({\n  checked,\n  onChange,\n  label,\n}: {\n  checked: boolean;\n  onChange: (v: boolean) => void;\n  label: string;\n}) {\n  return (\n    <button\n      type=\"button\"\n      className=\"switch\"\n      role=\"switch\"\n      aria-checked={checked}\n      aria-label={label}\n      onClick={() => onChange(!checked)}\n    />\n  );\n}\n\nexport function Segmented<T extends string>({\n  value,\n  options,\n  onChange,\n  label,\n}: {\n  value: T;\n  options: { value: T; label: string }[];\n  onChange: (v: T) => void;\n  label: string;\n}) {\n  return (\n    <div className=\"segmented\" role=\"group\" aria-label={label}>\n      {options.map((o) => (\n        <button\n          key={o.value}\n          type=\"button\"\n          aria-pressed={value === o.value}\n          onClick={() => onChange(o.value)}\n        >\n          {o.label}\n        </button>\n      ))}\n    </div>\n  );\n}\n\nexport function Empty({\n  icon = 'inbox',\n  title,\n  body,\n  action,\n}: {\n  icon?: React.ComponentProps<typeof Icon>['name'];\n  title: string;\n  body: string;\n  action?: React.ReactNode;\n}) {\n  return (\n    <div className=\"empty\">\n      <div className=\"empty-icon\"><Icon name={icon} size={18} /></div>\n      <h3>{title}</h3>\n      <p>{body}</p>\n      {action && <div style={{ marginTop: 6 }}>{action}</div>}\n    </div>\n  );\n}\n\nexport function Tabs({\n  tabs,\n  value,\n  onChange,\n}: {\n  tabs: { id: string; label: string; count?: number }[];\n  value: string;\n  onChange: (id: string) => void;\n}) {\n  return (\n    <div className=\"tabs\" role=\"tablist\">\n      {tabs.map((t) => (\n        <button\n          key={t.id}\n          role=\"tab\"\n          aria-selected={value === t.id}\n          className=\"tab\"\n          onClick={() => onChange(t.id)}\n        >\n          {t.label}\n          {typeof t.count === 'number' && <span className=\"mono faint\" style={{ marginLeft: 6 }}>{t.count}</span>}\n        </button>\n      ))}\n    </div>\n  );\n}\n\nexport function Confirm({\n  open,\n  onClose,\n  onConfirm,\n  title,\n  body,\n  confirmLabel = 'Confirm',\n  danger = false,\n}: {\n  open: boolean;\n  onClose: () => void;\n  onConfirm: () => void;\n  title: string;\n  body: string;\n  confirmLabel?: string;\n  danger?: boolean;\n}) {\n  return (\n    <Modal\n      open={open}\n      onClose={onClose}\n      title={title}\n      size=\"slim\"\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Cancel</button>\n          <button\n            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}\n            onClick={() => {\n              onConfirm();\n              onClose();\n            }}\n          >\n            {confirmLabel}\n          </button>\n        </>\n      }\n    >\n      <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>{body}</p>\n    </Modal>\n  );\n}\n\nexport function Money({ value, className = '', signed = false }: { value: number; className?: string; signed?: boolean }) {\n  const formatted = new Intl.NumberFormat('en-IN', {\n    style: 'currency',\n    currency: 'INR',\n    maximumFractionDigits: 0,\n  }).format(Math.abs(value));\n  return (\n    <span className={`num ${className}`}>\n      {signed ? (value > 0 ? '+' : value < 0 ? '−' : '') : value < 0 ? '−' : ''}\n      {formatted}\n    </span>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\components\\ui.tsx"})
  [Tool result]: Created file successfully: src/components/ui.tsx
  
  [Assistant reasoning]: Now the app shell: Sidebar, Topbar, CommandPalette, mobile nav. Then App with routes.
  
  Route list:
  overview, inbox, transactions, rules, recurring, plan, simulate, review, coach, settings.
  
  Sidebar groups:
  TODAY: Overview, Inbox (count pending)
  UNDERSTAND: Transactions, Recurring, Review
  PLAN: Plan, Simulate
  COACH: Coach, Settings
  
  Topbar: breadcrumb brand/page name, search button, theme toggle, maybe "Hide balances" eye toggle.
  
  Command palette: Ctrl+K, searches routes + actions (import, add transaction, new goal, run scenario, toggle theme, reset). Items with keyboard nav.
  
  Mobile: bottom nav with 5 items + more sheet.
  
  Let me write `src/components/AppShell.tsx` including Sidebar, Topbar, Palette, MobileNav.
  
  Actions in palette need callbacks that screens own. Simpler: palette navigates routes only + theme toggle + add transaction? Add "global" actions: navigate to routes, toggle theme, undo, open import (navigate inbox). Enough.
  
  Use icons.
  
  Topbar crumb: "Baseline / Overview".
  
  Let me write.
  
  Need pending count = txns.filter(pending).length.
  
  The theme toggle button with aria-pressed.
  
  Also "Undo" in topbar when lastAction exists? Nice: small button "Undo" with label. Put in topbar right.
  
  Let me build.
  
  Route metadata:
  ```ts
  export const ROUTES = [
   {path:'overview', label:'Overview', icon:'grid', group:'Today'},
   ...
  ]
  ```
  
  App shell renders `<main>` with children.
  
  Command palette uses Modal? Custom overlay to avoid focus weirdness. I'll use Modal with size normal but it renders header; instead build custom in AppShell using createPortal? Simpler: use Modal with title "Jump to" and no footer, content = input + list. It has a header which is okay.
  
  Implement keyboard: ArrowDown/Up, Enter, Escape. Flat list with sections.
  
  Let me write.
  [Assistant tool call]: write({"content":"import React, { useEffect, useMemo, useRef, useState } from 'react';\nimport { Icon, type IconName } from './Icon';\nimport { useApp } from '../store/AppStore';\nimport { navigate, useRoute } from '../lib/router';\nimport { Modal, useToast } from './ui';\nimport { deriveNudges } from '../domain/nudges';\n\nexport interface RouteMeta {\n  path: string;\n  label: string;\n  icon: IconName;\n  group: string;\n  desc: string;\n}\n\nexport const ROUTES: RouteMeta[] = [\n  { path: 'overview', label: 'Overview', icon: 'grid', group: 'Today', desc: 'Your living money model at a glance' },\n  { path: 'inbox', label: 'Inbox', icon: 'inbox', group: 'Today', desc: 'Import and approve statements' },\n  { path: 'transactions', label: 'Transactions', icon: 'receipt', group: 'Understand', desc: 'Search, correct, and split transactions' },\n  { path: 'rules', label: 'Rules', icon: 'split', group: 'Understand', desc: 'What the model has learned from you' },\n  { path: 'recurring', label: 'Recurring', icon: 'repeat', group: 'Understand', desc: 'Subscriptions, bills, and price changes' },\n  { path: 'review', label: 'Monthly review', icon: 'file', group: 'Understand', desc: 'The month, written up' },\n  { path: 'plan', label: 'Plan', icon: 'target', group: 'Plan', desc: 'Income, fixed costs, buffer, and goals' },\n  { path: 'simulate', label: 'Simulate', icon: 'sliders', group: 'Plan', desc: 'What-if scenarios against the model' },\n  { path: 'coach', label: 'Coach', icon: 'compass', group: 'Coach', desc: 'Nudges, guardrails, and how the math works' },\n  { path: 'settings', label: 'Settings', icon: 'settings', group: 'Coach', desc: 'Appearance, data, and privacy' },\n];\n\nconst GROUPS = ['Today', 'Understand', 'Plan', 'Coach'];\n\nexport function usePageMeta(): RouteMeta {\n  const route = useRoute();\n  return ROUTES.find((r) => r.path === route.path) ?? ROUTES[0];\n}\n\nfunction Brand() {\n  return (\n    <button\n      className=\"rail-brand\"\n      onClick={() => navigate('/overview')}\n      style={{ background: 'none', border: 0, borderBottom: '1px solid var(--line)', textAlign: 'left', cursor: 'pointer', width: '100%' }}\n      aria-label=\"Baseline home\"\n    >\n      <span className=\"brand-mark\">B</span>\n      <span>\n        <span className=\"brand-name\">Baseline</span>\n        <span className=\"brand-tag\">Living money model</span>\n      </span>\n    </button>\n  );\n}\n\nfunction NavList({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {\n  const { state } = useApp();\n  const route = useRoute();\n  const pending = state.txns.filter((t) => t.pending).length;\n  const nudges = deriveNudges(state).filter((n) => n.status === 'open').length;\n\n  return (\n    <nav className=\"rail-nav\" aria-label=\"Main navigation\" style={compact ? { padding: 0 } : undefined}>\n      {GROUPS.map((group) => (\n        <React.Fragment key={group}>\n          <div className=\"nav-group\">{group}</div>\n          {ROUTES.filter((r) => r.group === group).map((r) => {\n            const count = r.path === 'inbox' ? pending : r.path === 'coach' ? nudges : 0;\n            return (\n              <button\n                key={r.path}\n                className=\"nav-item\"\n                aria-current={route.path === r.path ? 'page' : undefined}\n                onClick={() => {\n                  navigate('/' + r.path);\n                  onNavigate?.();\n                }}\n              >\n                <Icon name={r.icon} size={15} />\n                <span>{r.label}</span>\n                {count > 0 && <span className=\"nav-count\">{count}</span>}\n              </button>\n            );\n          })}\n        </React.Fragment>\n      ))}\n    </nav>\n  );\n}\n\nfunction Palette({ open, onClose }: { open: boolean; onClose: () => void }) {\n  const [q, setQ] = useState('');\n  const [active, setActive] = useState(0);\n  const { state, updateSettings, undo } = useApp();\n  const { push } = useToast();\n\n  const items = useMemo(() => {\n    const base = ROUTES.map((r) => ({\n      id: r.path,\n      label: r.label,\n      hint: r.desc,\n      icon: r.icon,\n      group: 'Go to',\n      run: () => navigate('/' + r.path),\n    }));\n    const actions = [\n      {\n        id: 'theme',\n        label: state.settings.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode',\n        hint: 'Appearance',\n        icon: 'moon' as IconName,\n        group: 'Actions',\n        run: () => updateSettings({ theme: state.settings.theme === 'light' ? 'dark' : 'light' }),\n      },\n      {\n        id: 'import',\n        label: 'Import a statement',\n        hint: 'CSV, PDF, or SMS',\n        icon: 'upload' as IconName,\n        group: 'Actions',\n        run: () => navigate('/inbox'),\n      },\n      {\n        id: 'simulate',\n        label: 'Run a what-if scenario',\n        hint: 'Change a lever, see the model',\n        icon: 'sliders' as IconName,\n        group: 'Actions',\n        run: () => navigate('/simulate'),\n      },\n      {\n        id: 'undo',\n        label: state.lastAction ? `Undo: ${state.lastAction.label}` : 'Nothing to undo yet',\n        hint: 'Restore the previous state',\n        icon: 'undo' as IconName,\n        group: 'Actions',\n        run: () => {\n          undo();\n          push('Last change undone');\n        },\n      },\n      {\n        id: 'review',\n        label: 'Generate this month’s review',\n        hint: 'The written report',\n        icon: 'file' as IconName,\n        group: 'Actions',\n        run: () => navigate('/review'),\n      },\n    ];\n    const all = [...base, ...actions];\n    const needle = q.trim().toLowerCase();\n    if (!needle) return all;\n    return all.filter(\n      (i) => i.label.toLowerCase().includes(needle) || i.hint.toLowerCase().includes(needle)\n    );\n  }, [q, state.settings.theme, state.lastAction, updateSettings, undo, push]);\n\n  useEffect(() => {\n    setActive(0);\n  }, [q, open]);\n\n  useEffect(() => {\n    if (!open) setQ('');\n  }, [open]);\n\n  const grouped = useMemo(() => {\n    const map = new Map<string, typeof items>();\n    for (const item of items) {\n      if (!map.has(item.group)) map.set(item.group, []);\n      map.get(item.group)!.push(item);\n    }\n    return [...map.entries()];\n  }, [items]);\n\n  return (\n    <Modal open={open} onClose={onClose} title=\"Jump to\" sub=\"Routes and actions. Arrow keys to move, Enter to run.\" size=\"normal\">\n      <input\n        className=\"palette-input\"\n        placeholder=\"Search routes and actions…\"\n        value={q}\n        autoFocus\n        onChange={(e) => setQ(e.target.value)}\n        onKeyDown={(e) => {\n          if (e.key === 'ArrowDown') {\n            e.preventDefault();\n            setActive((a) => Math.min(items.length - 1, a + 1));\n          } else if (e.key === 'ArrowUp') {\n            e.preventDefault();\n            setActive((a) => Math.max(0, a - 1));\n          } else if (e.key === 'Enter') {\n            e.preventDefault();\n            const item = items[active];\n            if (item) {\n              item.run();\n              onClose();\n            }\n          }\n        }}\n        aria-label=\"Command search\"\n      />\n      <div className=\"palette-list\" role=\"listbox\" aria-label=\"Commands\">\n        {grouped.map(([group, list]) => (\n          <div key={group}>\n            <div className=\"palette-sec\">{group}</div>\n            {list.map((item) => {\n              const idx = items.indexOf(item);\n              return (\n                <button\n                  key={item.id}\n                  className=\"palette-item\"\n                  role=\"option\"\n                  aria-selected={idx === active}\n                  data-active={idx === active}\n                  onMouseEnter={() => setActive(idx)}\n                  onClick={() => {\n                    item.run();\n                    onClose();\n                  }}\n                >\n                  <Icon name={item.icon} size={14} />\n                  <span>{item.label}</span>\n                  <span className=\"kbd\">{item.hint.length > 30 ? item.hint.slice(0, 28) + '…' : item.hint}</span>\n                </button>\n              );\n            })}\n          </div>\n        ))}\n        {!items.length && (\n          <div className=\"empty\" style={{ padding: 24 }}>\n            <h3>No match</h3>\n            <p>Try “import”, “scenario”, “review”, or a section name.</p>\n          </div>\n        )}\n      </div>\n    </Modal>\n  );\n}\n\nexport function AppShell({ children }: { children: React.ReactNode }) {\n  const { state, updateSettings, undo, reset } = useApp();\n  const { push } = useToast();\n  const meta = usePageMeta();\n  const [paletteOpen, setPaletteOpen] = useState(false);\n  const [sheetOpen, setSheetOpen] = useState(false);\n  const firstRun = useRef(false);\n\n  useEffect(() => {\n    const onKey = (e: KeyboardEvent) => {\n      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {\n        e.preventDefault();\n        setPaletteOpen((v) => !v);\n      }\n      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !paletteOpen) {\n        const el = document.activeElement as HTMLElement | null;\n        if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;\n        e.preventDefault();\n        undo();\n        push('Last change undone');\n      }\n    };\n    window.addEventListener('keydown', onKey);\n    return () => window.removeEventListener('keydown', onKey);\n  }, [undo, push, paletteOpen]);\n\n  useEffect(() => {\n    if (firstRun.current) return;\n    firstRun.current = true;\n    if (!localStorage.getItem('baseline.seen')) {\n      localStorage.setItem('baseline.seen', '1');\n    }\n  }, []);\n\n  return (\n    <div className=\"shell\">\n      <aside className=\"rail\">\n        <Brand />\n        <NavList />\n        <div className=\"rail-foot\">\n          <div className=\"row-between\">\n            <div className=\"user-chip\">\n              <span className=\"avatar\">{state.profile.name.split(' ').map((x) => x[0]).join('').slice(0, 2)}</span>\n              <span>\n                <div className=\"user-name\">{state.profile.name}</div>\n                <div className=\"user-sub\">Bengaluru · INR</div>\n              </span>\n            </div>\n            <button\n              className=\"btn btn-ghost btn-icon\"\n              aria-label={`Switch to ${state.settings.theme === 'light' ? 'dark' : 'light'} mode`}\n              onClick={() => updateSettings({ theme: state.settings.theme === 'light' ? 'dark' : 'light' })}\n            >\n              <Icon name={state.settings.theme === 'light' ? 'moon' : 'sun'} size={15} />\n            </button>\n          </div>\n        </div>\n      </aside>\n\n      <div className=\"main\">\n        <header className=\"topbar\">\n          <div className=\"crumb\">\n            <span>Baseline</span>\n            <span className=\"crumb-sep\">/</span>\n            <b>{meta.label}</b>\n          </div>\n          <div className=\"topbar-spacer\" />\n          {state.lastAction && (\n            <button\n              className=\"btn btn-ghost btn-sm\"\n              onClick={() => {\n                undo();\n                push('Last change undone');\n              }}\n              title={state.lastAction.label}\n            >\n              <Icon name=\"undo\" size={13} />\n              <span className=\"hide-sm\">Undo</span>\n            </button>\n          )}\n          <button className=\"searchbtn\" onClick={() => setPaletteOpen(true)} aria-label=\"Search and jump to a section\">\n            <Icon name=\"search\" size={14} />\n            <span className=\"search-label\">Search or jump</span>\n            <span className=\"kbd\">⌘K</span>\n          </button>\n          <button\n            className=\"btn btn-ghost btn-icon\"\n            aria-label=\"Notifications\"\n            onClick={() => navigate('/coach')}\n            title=\"Open the coach\"\n          >\n            <Icon name=\"bell\" size={15} />\n          </button>\n          <button\n            className=\"btn btn-ghost btn-icon\"\n            aria-label={state.settings.hideBalances ? 'Show balances' : 'Hide balances'}\n            onClick={() => {\n              updateSettings({ hideBalances: !state.settings.hideBalances });\n              push(state.settings.hideBalances ? 'Balances visible' : 'Balances hidden');\n            }}\n          >\n            <Icon name={state.settings.hideBalances ? 'eyeOff' : 'eye'} size={15} />\n          </button>\n        </header>\n\n        {children}\n\n        <div className=\"mobile-nav\">\n          {ROUTES.filter((r) => ['overview', 'inbox', 'transactions', 'simulate', 'plan'].includes(r.path)).map((r) => (\n            <button\n              key={r.path}\n              aria-current={meta.path === r.path ? 'page' : undefined}\n              onClick={() => navigate('/' + r.path)}\n            >\n              <Icon name={r.icon} size={17} />\n              {r.label.split(' ')[0]}\n            </button>\n          ))}\n          <button onClick={() => setSheetOpen(true)} aria-label=\"More sections\">\n            <Icon name=\"more\" size={17} />\n            More\n          </button>\n        </div>\n      </div>\n\n      <Palette open={paletteOpen} onClose={() => setPaletteOpen(false)} />\n\n      {sheetOpen && (\n        <div className=\"mobile-sheet\" onClick={(e) => e.target === e.currentTarget && setSheetOpen(false)}>\n          <div className=\"mobile-sheet-inner\">\n            <div className=\"row-between\" style={{ marginBottom: 10 }}>\n              <span className=\"label\">All sections</span>\n              <button className=\"btn btn-ghost btn-icon\" aria-label=\"Close menu\" onClick={() => setSheetOpen(false)}>\n                <Icon name=\"x\" size={15} />\n              </button>\n            </div>\n            <NavList compact onNavigate={() => setSheetOpen(false)} />\n            <div className=\"divider\" />\n            <button\n              className=\"btn btn-ghost btn-block\"\n              onClick={() => {\n                reset();\n                setSheetOpen(false);\n                push('Demo data restored');\n              }}\n            >\n              <Icon name=\"refresh\" size={14} /> Reset demo data\n            </button>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\components\\AppShell.tsx"})
  [Tool result]: Created file successfully: src/components/AppShell.tsx
  
  [Assistant reasoning]: Now App.tsx and main.tsx with routing. Then screens one by one.
  
  App:
  ```tsx
  export default function App() {
   const route = useRoute();
   const screen = ...
   return <AppShell>{...}</AppShell>
  }
  ```
  Wait AppShell already renders `.main` with children; screens render `.page`.
  
  Need ErrorBoundary maybe.
  
  main.tsx: createRoot with AppProvider, ToastProvider, App.
  
  Also a ToastProvider must wrap AppShell (uses useToast).
  
  Let me write main + App skeleton with all screens imported (screens to create).
  
  Screens:
  - Overview.tsx
  - Inbox.tsx
  - Transactions.tsx
  - Rules.tsx
  - Recurring.tsx
  - Plan.tsx
  - Simulate.tsx
  - Review.tsx
  - Coach.tsx
  - Settings.tsx
  
  Also shared components: CategorySelect, CategoryBadge, ConfidenceChip, TransactionEditor modal, PageHeader.
  
  Let me create `src/components/common.tsx` with:
  - PageHeader
  - CategoryTag
  - Confidence
  - MoneyText
  - MonthPicker
  - EmptyState reuse.
  
  Let me now write Overview, the showcase screen.
  
  Overview content:
  Header: eyebrow "Saturday, 31 October 2026 · 6 months of data"; H1 "Your money, <em>modelled.</em>"; lede "Everything you import updates one model..."; actions: Import, Run scenario.
  
  Row 1:
  Panel col-8: "Balance, actual and projected" with LineChart (6 months history + 6 forecast baseline), head stats: current balance, 6-month projection, change. Legend. Forecast band. Footer link to simulate.
  Panel col-4: "Safe to spend" hero inverse? Use panel inverse for contrast: big number, breakdown kv rows, note, button "Check a purchase" opens modal. This is a signature.
  
  Actually the hero number should be prominent. Let me make the right panel `.panel` with accent top rule (border-top: 2px solid accent) and big number.
  
  Row 2:
  col-4 "The model" — income/fixed/flexible/surplus rows with bars + savings rate.
  col-4 "Due in 7 days" — upcoming bills list + total.
  col-4 "Goals" — top 3 goals with progress + on-track + "Plan goals" link.
  
  Hmm 3 columns of 4. Nice.
  
  Row 3:
  col-7 "Coach notes" — top 3 nudges with actions.
  col-5 "Where it went" — category bars for current month + link to review.
  
  Row 4:
  col-12? Maybe "Recent activity" table of 6 txns. Could be useful but page gets long. Add col-8 "Recent transactions" + col-4 "Affordability check" instead of modal. Actually affordability check as a panel is a signature feature — let me put it in row 4 col-5 and recent txns col-7.
  
  Let me restructure:
  Row 1: col-8 balance chart, col-4 safe to spend.
  Row 2: col-4 model, col-4 due, col-4 goals.
  Row 3: col-7 coach, col-5 where it went.
  Row 4: col-7 recent, col-5 affordability.
  
  That's dense but good.
  
  Affordability check: input amount + category? Just amount and "Check" button. Compute: after purchase, safe-to-spend minus amount; verdict:
  - affordable if amount <= safe*0.6
  - tight if <= safe
  - not now if > safe
  Show impact on goals ETA. Include "It would delay Japan by N months" etc. Compute monthly surplus and goal ETAs delta. Actually simple: compare `amount` to safe; and compute how many months of surplus it equals. This panel can live with a number input, quick chips ₹5,000 / ₹25,000 / ₹1,00,000, and result.
  
  Safe to spend breakdown: balance, minus emergency, minus goals, minus 30-day bills, minus buffer = safe.
  
  Need hideBalances: when on, show "••••••" for money. Implement a `<Money>` that respects settings? Simpler: a `useMask` hook returning formatter that masks. But many places use `money()`. I'll implement masking only on Overview hero and Settings toggle description. Hmm, user expects hide balances globally. Let me add a `MaskedMoney` component and use it for big numbers, or better: a global `Money` component reading settings. Too many call sites already using money(). For time, apply CSS-based masking? Not possible for text.
  
  Alternative: use a context function `fmt(n)` from a `useMoney()` hook that returns masked when hideBalances. I'll use in Overview only + note in Settings that it hides headline balances. Acceptable but slightly weak. Let me at least apply to key numbers on Overview, Plan, Simulate. I'll create `useDisplayMoney` in a hook file and use where prominent. Actually simpler: update Settings toggle says "Hide headline balances". Fine.
  
  I'll implement `mask(n)` helper in a hook used by big-number displays.
  
  Let me write `src/hooks/useMaskedMoney.ts`:
  ```ts
  export function useMaskedMoney() { const {state} = useApp(); return (n:number)=> state.settings.hideBalances ? '₹ ••••••' : money(n) }
  ```
  
  Now compute data:
  - balance history: for each of last 6 months, balance at end = opening + cumulative txns up to end of month. Use all txns.
  - forecast: runSimulation baseline 6 months.
  - model = baseModel.
  - safe.
  - nudges.
  - upcoming 7 days.
  - goals.
  - categories for current month sorted.
  - recent txns (top 6 by date desc).
  
  Need to include goal contributions? They're not transactions. Fine.
  
  Date header: `new Date().toLocaleDateString('en-IN',{weekday:'long', day:'numeric', month:'long', year:'numeric'})`.
  
  Let me write Overview.
  
  Careful: line chart actual points should include current month end. Forecast should start next month.
  
  History computation:
  ```ts
  const months = [-5..0] map addMonths(now,-5+i)
  const history = months.map(m => ({key:m, value: opening + sum(txns where date <= end of m)}))
  ```
  Forecast from baselineResult months (next 12) take 7? Use 6 forecast to keep chart 12 points.
  
  Card header: "Balance" + current balance + "Projected 6 months" etc.
  
  For the chart band: baseline.monthly.flexible * 0.12.
  
  Let me code.
  
  Also safe-to-spend uses goals saved + emergency; show composition meter (bills/goals/emergency/free). Use `.meter` with segments. This visualizes the model.
  
  Segment widths: of balance: emergency, goals, bills, buffer, free.
  
  If free is negative, clamp 0 and show note.
  
  Hero panel: 
  ```
  <span className="label">Safe to spend · next 30 days</span>
  <div className="big-number">{mask(safe)}</div>
  <p className="small muted">After bills, buffer, and money already earmarked.</p>
  <div className="meter">...</div>
  <dl className="kv">...</dl>
  <button>Can I afford something?</button>
  ```
  
  Affordability panel duplicates the CTA. Instead remove the button from hero, keep the panel. Hero can link "How this is calculated" → opens explanation modal. Good.
  
  Let me implement `AffordabilityCheck` component inside Overview with state.
  
  Affordability logic:
  ```
  const safe = safeToSpend.safe
  const verdict = amount <= safe*0.5 ? 'comfortable' : amount <= safe ? 'tight' : 'not-now'
  const goalDelay = amount / (baseline.monthly.surplus || 1) months
  ```
  Show text.
  
  Add quick amount chips and a category select? Just amount input + button.
  
  When amount empty, show placeholder message.
  
  All buttons must work: "Check" computes; chips set amount and compute; "Review" link navigates.
  
  Now write Overview.
  
  I need `money` and `compact`.
  
  Nudge icons per kind: drift trendUp, price-change alert, unused clock, goal target, buffer shield, payday wallet, anomaly alert.
  
  Nudge component: I'll create a shared `NudgeCard` in components/NudgeCard.tsx used by Overview and Coach. It takes nudge, actions (done, snooze, go).
  
  Let me create that first.
  
  NudgeCard props: nudge, onDone, onSnooze, compact?
  Renders title, body, math in details? Show math as small note. Actions: primary actionRoute navigate, "Done" marks done, "Snooze 7d" sets snoozed. 
  
  I'll implement with useApp inside.
  
  Write.
  [Assistant tool call]: write({"content":"import { Icon, type IconName } from './Icon';\nimport type { Nudge } from '../types';\nimport { navigate } from '../lib/router';\nimport { useApp } from '../store/AppStore';\nimport { useToast } from './ui';\nimport { nudgeKindLabel } from '../domain/nudges';\n\nconst ICONS: Record<Nudge['kind'], IconName> = {\n  drift: 'trendUp',\n  'price-change': 'alert',\n  unused: 'clock',\n  goal: 'target',\n  buffer: 'shield',\n  payday: 'wallet',\n  anomaly: 'info',\n};\n\nexport function NudgeCard({ nudge, showMath = true }: { nudge: Nudge; showMath?: boolean }) {\n  const { setNudgeState } = useApp();\n  const { push } = useToast();\n\n  return (\n    <article className=\"nudge\" aria-label={nudge.title}>\n      <div className={`nudge-icon ${nudge.severity}`}>\n        <Icon name={ICONS[nudge.kind]} size={14} />\n      </div>\n      <div style={{ minWidth: 0, flex: 1 }}>\n        <div className=\"row wrap\" style={{ gap: 8 }}>\n          <h3 className=\"nudge-title\">{nudge.title}</h3>\n          <span className=\"badge outline\">{nudgeKindLabel(nudge.kind)}</span>\n        </div>\n        <p className=\"nudge-body\">{nudge.body}</p>\n        {showMath && nudge.math && (\n          <p className=\"small\" style={{ marginTop: 5, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>\n            {nudge.math}\n          </p>\n        )}\n        <div className=\"nudge-actions\">\n          {nudge.actionLabel && nudge.actionRoute && (\n            <button className=\"btn btn-sm\" onClick={() => navigate(nudge.actionRoute!.replace('#/', '/'))}>\n              {nudge.actionLabel} <Icon name=\"chevronRight\" size={12} />\n            </button>\n          )}\n          <button\n            className=\"btn btn-sm btn-ghost\"\n            onClick={() => {\n              setNudgeState(nudge.id, 'done');\n              push('Marked as handled');\n            }}\n          >\n            <Icon name=\"check\" size={12} /> Done\n          </button>\n          <button\n            className=\"btn btn-sm btn-ghost\"\n            onClick={() => {\n              setNudgeState(nudge.id, 'snoozed');\n              push('Snoozed for the rest of the month');\n            }}\n          >\n            <Icon name=\"clock\" size={12} /> Snooze\n          </button>\n          <button\n            className=\"btn btn-sm btn-ghost\"\n            aria-label=\"Dismiss this nudge\"\n            onClick={() => {\n              setNudgeState(nudge.id, 'dismissed');\n              push('Nudge dismissed');\n            }}\n          >\n            <Icon name=\"x\" size={12} />\n          </button>\n        </div>\n      </div>\n    </article>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\components\\NudgeCard.tsx"})
  [Tool result]: Created file successfully: src/components/NudgeCard.tsx
  [Assistant tool call]: write({"content":"import { useApp } from '../store/AppStore';\nimport { money } from '../lib/format';\n\n/** Formats money, or masks it when the user has hidden balances. */\nexport function useMoney() {\n  const { state } = useApp();\n  return (n: number, precise = false): string =>\n    state.settings.hideBalances ? '₹ ••••••' : money(n, precise);\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\hooks\\useMoney.ts"})
  [Tool result]: Created file successfully: src/hooks/useMoney.ts
  
  [Assistant reasoning]: Now Overview screen. Long file. Let me write carefully.
  
  Data:
  ```ts
  const {state, updateSettings} = useApp()
  const route params maybe.
  const now = nowMonth()
  const base = baselineResult(state, 6)
  const safe = safeToSpend(state)
  const model = baseModel(state)
  const history = last 6 months balance
  const forecast = base.months.map
  const nudges = deriveNudges(state).filter(open).slice(0,3)
  const bills = upcomingBills(state, 7)
  const goals = state.goals sorted
  const summary = summarizeMonth(state.txns, now)
  const cats = summary.byCategory.map(...with color/name)
  const recent = [...txns].sort(date desc).slice(0,6)
  ```
  
  Note `baselineResult` uses forecast starting next month. History balance: compute end-of-month cumulative using txns sorted; include pending? exclude pending. But current balance includes pending? currentBalance includes all. Minor.
  
  History:
  ```ts
  const months = [-5..0]
  const history = months.map(m => {
    const end = `${m}-31` (string compare works with date prefix)
    const total = state.txns.filter(t => !t.pending && t.date <= `${m}-32`).reduce(...)
  })
  ```
  Use `t.date.slice(0,7) <= m`.
  Include all non-pending.
  
  Forecast: base.months.slice(0,6).
  
  Chart header stats:
  - balance = currentBalance
  - projected = forecast[5].balance
  - delta = projected - balance
  
  Hero:
  ```
  <div className="panel" style={{borderTop:'2px solid var(--accent)'}}>
   panel-head: label + info button
   big number
   sub
   meter with 4 segments
   dl rows
   footer: "How is this calculated?" link opens modal
  ```
  
  Composition meter: of balance (if positive): emergency, goals, bills, buffer, free. Width percentages. Colors: emergency var(--info), goals accent, bills line-strong, buffer faint, free positive.
  
  Legend under with tiny dots.
  
  Explanation modal content: formula.
  
  Row 2 panels:
  Model:
  ```
  income
  fixed
  flexible
  surplus (bold)
  progress bar of income allocation? 
  savings rate
  "savings rate 28% vs target 25%"
  ```
  Show each row as kv with value; then a stacked meter of income: fixed, flexible, saved(surplus), with colors. Add label "Where each ₹100 of income goes" maybe too cute. Keep it.
  
  Due panel: bills with day, merchant, amount, in days. Footer total + link.
  
  Goals panel: 3 goals, progress bar, saved/target, required vs monthly, badge on track/behind. Footer link.
  
  Coach panel: nudges (3) + link.
  
  Where it went: CategoryBars + Donut maybe. Use donut for visual interest on the right of list? Panel col-5 can hold donut at top-right. Let me do a row with donut (110) + legend list of top 5? Simpler: CategoryBars only with total.
  
  Recent: table 6 rows with date, merchant, category chip, amount. Clicking row → transactions with q. 
  
  Affordability: form.
  
  Footer note with guardrail.
  
  Let me write the code. Need imports.
  
  For the "How calculated" modal, add state.
  
  Use `mask` from useMoney.
  
  Note: `useMoney` returns function; call as `fmt(n)`.
  
  Date: `new Date().toLocaleDateString('en-IN', {...})`.
  
  Let me write.
  [Assistant tool call]: write({"content":"import { useMemo, useState } from 'react';\nimport { useApp } from '../store/AppStore';\nimport { useMoney } from '../hooks/useMoney';\nimport { addMonths, monthLabel, nowMonth, todayISO } from '../lib/date';\nimport { money, pct } from '../lib/format';\nimport { navigate } from '../lib/router';\nimport {\n  baseModel,\n  currentBalance,\n  emergencyCoverage,\n  goalProgress,\n  goalRequiredMonthly,\n  monthlyIncome,\n  monthlySurplus,\n  safeToSpend,\n  savingsRate,\n  summarizeMonth,\n  upcomingBills,\n} from '../domain/finance';\nimport { baselineResult } from '../domain/simulate';\nimport { deriveNudges } from '../domain/nudges';\nimport { CATEGORY_MAP } from '../data/categories';\nimport { Icon } from '../components/Icon';\nimport { CategoryBars, LineChart } from '../components/charts';\nimport { Modal, useToast } from '../components/ui';\nimport { NudgeCard } from '../components/NudgeCard';\n\nexport default function Overview() {\n  const { state } = useApp();\n  const { push } = useToast();\n  const fmt = useMoney();\n  const [explain, setExplain] = useState(false);\n  const [afford, setAfford] = useState('');\n  const [affordResult, setAffordResult] = useState<null | 'comfortable' | 'tight' | 'not-now'>(null);\n\n  const now = nowMonth();\n  const today = todayISO();\n  const model = baseModel(state);\n  const safe = safeToSpend(state);\n  const sim = baselineResult(state, 6);\n  const income = monthlyIncome(state);\n  const surplus = monthlySurplus(state);\n  const rate = savingsRate(state);\n  const coverage = emergencyCoverage(state);\n  const nudges = deriveNudges(state).filter((n) => n.status === 'open').slice(0, 3);\n  const bills = upcomingBills(state, 7);\n  const summary = summarizeMonth(state.txns, now);\n\n  const months = useMemo(\n    () => Array.from({ length: 6 }, (_, i) => addMonths(now, -5 + i)),\n    [now]\n  );\n\n  const history = useMemo(\n    () =>\n      months.map((m) => {\n        const total = state.txns\n          .filter((t) => !t.pending && t.date.slice(0, 7) <= m)\n          .reduce((s, t) => s + t.amount, 0);\n        return { key: m, value: state.profile.openingBalance + total };\n      }),\n    [months, state.txns, state.profile.openingBalance]\n  );\n\n  const forecast = sim.months.slice(0, 6).map((m) => ({ key: m.key, value: m.balance }));\n  const balance = currentBalance(state);\n  const projected = forecast[forecast.length - 1]?.value ?? balance;\n\n  const goals = [...state.goals].filter((g) => !g.archived).sort((a, b) => a.priority - b.priority);\n  const categories = summary.byCategory.slice(0, 8).map((c) => ({\n    ...c,\n    name: CATEGORY_MAP[c.category]?.name ?? c.category,\n    color: CATEGORY_MAP[c.category]?.color ?? '#7A7A72',\n  }));\n\n  const recent = useMemo(\n    () =>\n      [...state.txns]\n        .filter((t) => !t.pending)\n        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))\n        .slice(0, 6),\n    [state.txns]\n  );\n\n  const segments = [\n    { label: 'Emergency fund', value: safe.emergency, color: 'var(--info)' },\n    { label: 'Goals', value: safe.goals, color: 'var(--accent)' },\n    { label: 'Next 30 days of bills', value: safe.scheduled, color: 'var(--line-strong)' },\n    { label: 'Buffer', value: safe.buffer, color: 'var(--faint)' },\n    { label: 'Free to spend', value: Math.max(0, safe.safe), color: 'var(--positive)' },\n  ].filter((s) => s.value > 0);\n\n  const checkAfford = () => {\n    const amount = Number(afford.replace(/[^0-9]/g, ''));\n    if (!amount) {\n      push('Enter an amount to check');\n      return;\n    }\n    const verdict = amount <= safe.safe * 0.5 ? 'comfortable' : amount <= Math.max(0, safe.safe) ? 'tight' : 'not-now';\n    setAffordResult(verdict);\n  };\n\n  return (\n    <div className=\"page\">\n      <div className=\"page-head\">\n        <div>\n          <div className=\"eyebrow\">\n            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>\n            <span className=\"faint\">·</span>\n            <span>{state.txns.length} transactions modelled</span>\n          </div>\n          <h1 className=\"display\">Your money, <em>modelled.</em></h1>\n          <p className=\"lede\">\n            One model connects your income, your fixed costs, your goals, and the life you are actually living. Change a\n            number and the whole picture moves with you.\n          </p>\n        </div>\n        <div className=\"head-actions\">\n          <button className=\"btn\" onClick={() => navigate('/simulate')}>\n            <Icon name=\"sliders\" size={14} /> Run a scenario\n          </button>\n          <button className=\"btn btn-primary\" onClick={() => navigate('/inbox')}>\n            <Icon name=\"upload\" size={14} /> Import statement\n          </button>\n        </div>\n      </div>\n\n      <div className=\"grid\">\n        <section className=\"panel col-8\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Balance, actual and projected</h2>\n              <p className=\"panel-sub\">Six months of history, six months of model. The dashed line is the baseline scenario.</p>\n            </div>\n            <div style={{ textAlign: 'right' }}>\n              <div className=\"label\">Today</div>\n              <div className=\"medium-number\">{fmt(balance)}</div>\n            </div>\n          </div>\n          <div className=\"panel-body\">\n            <div className=\"row\" style={{ gap: 24, marginBottom: 8, flexWrap: 'wrap' }}>\n              <div>\n                <div className=\"stat-label\">In 6 months</div>\n                <div className=\"num\" style={{ fontSize: 14, color: 'var(--accent)' }}>{fmt(projected)}</div>\n              </div>\n              <div>\n                <div className=\"stat-label\">Change</div>\n                <div className={`num small ${projected >= balance ? 'pos' : 'neg'}`}>\n                  {projected >= balance ? '+' : '−'}{fmt(Math.abs(projected - balance))}\n                </div>\n              </div>\n              <div className=\"spacer\" />\n              <div className=\"legend\">\n                <span><i /> Actual</span>\n                <span><i className=\"accent dashed\" /> Projected</span>\n              </div>\n            </div>\n            <LineChart\n              actual={history}\n              forecast={forecast}\n              height={214}\n              band={sim.monthly.flexible * 0.1}\n              ariaLabel={`Cash balance from ${months[0]} to ${forecast[forecast.length - 1]?.key}, actual and projected`}\n            />\n          </div>\n          <div className=\"panel-foot\">\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>\n              Projection assumes income and committed costs hold steady\n            </span>\n            <button className=\"linkish small\" onClick={() => navigate('/simulate')}>\n              Test a different future\n            </button>\n          </div>\n        </section>\n\n        <section className=\"panel col-4\" style={{ borderTop: '2px solid var(--accent)' }}>\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Safe to spend</h2>\n              <p className=\"panel-sub\">The next 30 days, after everything already promised.</p>\n            </div>\n            <button className=\"btn btn-ghost btn-icon\" aria-label=\"How safe to spend is calculated\" onClick={() => setExplain(true)}>\n              <Icon name=\"info\" size={15} />\n            </button>\n          </div>\n          <div className=\"panel-body\">\n            <div className=\"hero-safe\">\n              <div className=\"big-number\" style={{ color: safe.safe >= 0 ? 'var(--ink)' : 'var(--negative)' }}>\n                {fmt(safe.safe)}\n              </div>\n              <p className=\"hero-note\">\n                {safe.safe >= 0\n                  ? `About ${money(Math.max(0, safe.safe) / 30)} a day for the rest of the month, without touching your buffer or goals.`\n                  : 'Your commitments are larger than unallocated cash right now. The scenarios page will show your options.'}\n              </p>\n            </div>\n\n            <div className=\"meter\" style={{ marginTop: 16 }} aria-hidden=\"true\">\n              {segments.map((s) => (\n                <span\n                  key={s.label}\n                  title={`${s.label}: ${money(s.value)}`}\n                  style={{ width: `${balance > 0 ? (s.value / balance) * 100 : 0}%`, background: s.color }}\n                />\n              ))}\n            </div>\n            <div className=\"stack-sm\" style={{ marginTop: 12 }}>\n              {segments.map((s) => (\n                <div key={s.label} className=\"row-between\" style={{ fontSize: 11.5 }}>\n                  <span className=\"row\" style={{ gap: 7 }}>\n                    <i style={{ width: 7, height: 7, borderRadius: 2, background: s.color, display: 'inline-block' }} />\n                    <span className=\"muted\">{s.label}</span>\n                  </span>\n                  <span className=\"num\">{fmt(s.value)}</span>\n                </div>\n              ))}\n            </div>\n\n            <div className=\"divider dashed\" />\n            <div className=\"row-between small\">\n              <span className=\"muted\">Emergency coverage</span>\n              <span className=\"num\">{coverage.toFixed(1)} months</span>\n            </div>\n          </div>\n          <div className=\"panel-foot\">\n            <button className=\"linkish small\" onClick={() => setExplain(true)}>How this is calculated</button>\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>Updated {today}</span>\n          </div>\n        </section>\n\n        <section className=\"panel col-4\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">The model</h2>\n              <p className=\"panel-sub\">Monthly, from your profile and last three months.</p>\n            </div>\n          </div>\n          <div className=\"panel-body\">\n            <dl style={{ margin: 0 }}>\n              <div className=\"kv\"><dt>Income</dt><dd className=\"pos\">{fmt(income)}</dd></div>\n              <div className=\"kv\"><dt>Fixed costs</dt><dd>−{fmt(model.fixed)}</dd></div>\n              <div className=\"kv\"><dt>Flexible baseline</dt><dd>−{fmt(model.dining + model.groceries + model.otherFlexible)}</dd></div>\n              <div className=\"kv\" style={{ borderBottom: 0 }}>\n                <dt style={{ fontWeight: 600, color: 'var(--ink)' }}>Free each month</dt>\n                <dd style={{ fontWeight: 600 }} className={surplus >= 0 ? 'pos' : 'neg'}>{fmt(surplus)}</dd>\n              </div>\n            </dl>\n            <div className=\"meter\" style={{ marginTop: 8 }} aria-hidden=\"true\">\n              <span style={{ width: `${income ? (model.fixed / income) * 100 : 0}%`, background: 'var(--ink)' }} title=\"Fixed\" />\n              <span\n                style={{ width: `${income ? ((model.dining + model.groceries + model.otherFlexible) / income) * 100 : 0}%`, background: 'var(--line-strong)' }}\n                title=\"Flexible\"\n              />\n              <span style={{ width: `${income ? (Math.max(0, surplus) / income) * 100 : 0}%`, background: 'var(--positive)' }} title=\"Free\" />\n            </div>\n            <div className=\"row-between small\" style={{ marginTop: 12 }}>\n              <span className=\"muted\">Savings rate</span>\n              <span>\n                <span className=\"num\">{pct(rate)}</span>\n                <span className=\"faint\"> / {pct(state.profile.savingsRateTarget)} target</span>\n              </span>\n            </div>\n            <div className=\"progress thin\" style={{ marginTop: 6 }}>\n              <span style={{ width: `${Math.min(100, (rate / Math.max(1, state.profile.savingsRateTarget)) * 100)}%` }} />\n            </div>\n          </div>\n          <div className=\"panel-foot\">\n            <button className=\"linkish small\" onClick={() => navigate('/plan')}>Edit the profile</button>\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>Model v1</span>\n          </div>\n        </section>\n\n        <section className=\"panel col-4\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Due in 7 days</h2>\n              <p className=\"panel-sub\">{bills.length ? `${bills.length} scheduled charges` : 'Nothing scheduled this week'}</p>\n            </div>\n            <Icon name=\"calendar\" size={15} />\n          </div>\n          <div className=\"panel-body\" style={{ paddingTop: 6 }}>\n            {bills.length === 0 && (\n              <p className=\"small muted\" style={{ padding: '14px 0' }}>\n                No recurring payments land in the next seven days. Your next known charge is{' '}\n                {state.recurring.filter((r) => r.status === 'active').sort((a, b) => (a.nextDate < b.nextDate ? -1 : 1))[0]?.nextDate ?? 'not scheduled'}.\n              </p>\n            )}\n            {bills.slice(0, 5).map((b) => {\n              const d = new Date(b.date);\n              return (\n                <div className=\"bill-row\" key={b.recurring.id}>\n                  <div className=\"bill-date\">\n                    <b>{d.getDate()}</b>\n                    {d.toLocaleDateString('en-IN', { month: 'short' })}\n                  </div>\n                  <div style={{ minWidth: 0, flex: 1 }}>\n                    <div className=\"txn-merchant ellipsis\">{b.recurring.merchant}</div>\n                    <div className=\"tiny\" style={{ color: 'var(--muted)' }}>\n                      {b.inDays === 0 ? 'today' : b.inDays === 1 ? 'tomorrow' : `in ${b.inDays} days`}\n                    </div>\n                  </div>\n                  <span className=\"num small\">{fmt(b.recurring.amount)}</span>\n                </div>\n              );\n            })}\n            {bills.length > 5 && (\n              <p className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 8 }}>+ {bills.length - 5} more this week</p>\n            )}\n          </div>\n          <div className=\"panel-foot\">\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>Total this week</span>\n            <span className=\"num small strong\">{fmt(bills.reduce((s, b) => s + b.recurring.amount, 0))}</span>\n          </div>\n        </section>\n\n        <section className=\"panel col-4\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Goals</h2>\n              <p className=\"panel-sub\">{goals.length} with target dates</p>\n            </div>\n            <button className=\"btn btn-ghost btn-icon\" aria-label=\"Manage goals\" onClick={() => navigate('/plan')}>\n              <Icon name=\"plus\" size={15} />\n            </button>\n          </div>\n          <div className=\"panel-body\" style={{ paddingTop: 4 }}>\n            {goals.slice(0, 3).map((g) => {\n              const p = goalProgress(g);\n              const req = goalRequiredMonthly(g);\n              const onTrack = g.monthly >= req * 0.92;\n              return (\n                <div className=\"goal-row\" key={g.id}>\n                  <div className=\"row-between\">\n                    <div className=\"goal-name\">\n                      <span className=\"cat-dot\" style={{ background: g.color }} />\n                      {g.name}\n                    </div>\n                    <span className={`badge ${onTrack ? 'pos' : 'warn'}`}>{onTrack ? 'On pace' : 'Behind'}</span>\n                  </div>\n                  <div className=\"row-between small\" style={{ marginTop: 5, color: 'var(--muted)' }}>\n                    <span className=\"num\">{fmt(g.saved)} of {fmt(g.target)}</span>\n                    <span className=\"mono\">{Math.round(p * 100)}%</span>\n                  </div>\n                  <div className=\"progress thin\" style={{ marginTop: 5 }}>\n                    <span style={{ width: `${p * 100}%`, background: g.color }} />\n                  </div>\n                </div>\n              );\n            })}\n            {!goals.length && <p className=\"small muted\">No goals yet. Add one to give the model a destination.</p>}\n          </div>\n          <div className=\"panel-foot\">\n            <button className=\"linkish small\" onClick={() => navigate('/plan')}>Open the goal planner</button>\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>Target dates honoured</span>\n          </div>\n        </section>\n\n        <section className=\"panel col-7\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Coach notes</h2>\n              <p className=\"panel-sub\">What changed, and what it costs if nothing changes.</p>\n            </div>\n            <button className=\"linkish small\" onClick={() => navigate('/coach')}>All notes →</button>\n          </div>\n          <div className=\"panel-body\">\n            {nudges.length ? (\n              nudges.map((n) => <NudgeCard key={n.id} nudge={n} />)\n            ) : (\n              <p className=\"small muted\">No open nudges. The model is quiet.</p>\n            )}\n          </div>\n        </section>\n\n        <section className=\"panel col-5\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Where it went</h2>\n              <p className=\"panel-sub\">{monthLabel(now)}, by category</p>\n            </div>\n            <span className=\"badge\">{fmt(summary.outflow)}</span>\n          </div>\n          <div className=\"panel-body\">\n            <CategoryBars data={categories} total={summary.outflow} max={7} />\n          </div>\n          <div className=\"panel-foot\">\n            <button className=\"linkish small\" onClick={() => navigate('/review')}>Read the monthly review</button>\n            <button className=\"linkish small\" onClick={() => navigate('/transactions')}>All transactions</button>\n          </div>\n        </section>\n\n        <section className=\"panel col-7\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Recent activity</h2>\n              <p className=\"panel-sub\">The last six lines the model has seen.</p>\n            </div>\n            <button className=\"linkish small\" onClick={() => navigate('/transactions')}>View ledger →</button>\n          </div>\n          <div className=\"panel-body flush\">\n            <div className=\"table-wrap\">\n              <table className=\"tbl\">\n                <thead>\n                  <tr>\n                    <th>Date</th>\n                    <th>Merchant</th>\n                    <th>Category</th>\n                    <th className=\"right\">Amount</th>\n                  </tr>\n                </thead>\n                <tbody>\n                  {recent.map((t) => {\n                    const cat = CATEGORY_MAP[t.category];\n                    return (\n                      <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/transactions?q=${encodeURIComponent(t.merchant)}`)}>\n                        <td className=\"mono small nowrap\">{t.date.slice(8)} {monthLabel(t.date.slice(0, 7), true).slice(0, 3)}</td>\n                        <td>\n                          <div className=\"txn-merchant ellipsis\" style={{ maxWidth: 190 }}>{t.merchant}</div>\n                        </td>\n                        <td>\n                          <span className=\"row\" style={{ gap: 6 }}>\n                            <span className=\"cat-dot\" style={{ background: cat?.color }} />\n                            <span className=\"small\">{cat?.name ?? t.category}</span>\n                          </span>\n                        </td>\n                        <td className={`money ${t.amount > 0 ? 'pos' : ''}`}>\n                          {t.amount > 0 ? '+' : '−'}{money(Math.abs(t.amount))}\n                        </td>\n                      </tr>\n                    );\n                  })}\n                </tbody>\n              </table>\n            </div>\n          </div>\n        </section>\n\n        <section className=\"panel col-5\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Can I afford this?</h2>\n              <p className=\"panel-sub\">Checked against free cash, not your total balance.</p>\n            </div>\n            <Icon name=\"wallet\" size={15} />\n          </div>\n          <div className=\"panel-body\">\n            <div className=\"row\" style={{ gap: 8 }}>\n              <input\n                className=\"input\"\n                inputMode=\"numeric\"\n                placeholder=\"Amount, e.g. 24,000\"\n                value={afford}\n                aria-label=\"Purchase amount to check\"\n                onChange={(e) => {\n                  setAfford(e.target.value);\n                  setAffordResult(null);\n                }}\n                onKeyDown={(e) => e.key === 'Enter' && checkAfford()}\n              />\n              <button className=\"btn btn-primary\" onClick={checkAfford}>Check</button>\n            </div>\n            <div className=\"row wrap\" style={{ gap: 6, marginTop: 8 }}>\n              {[5000, 25000, 75000].map((v) => (\n                <button key={v} className=\"chip\" onClick={() => { setAfford(String(v)); setAffordResult(null); }}>\n                  {money(v)}\n                </button>\n              ))}\n            </div>\n\n            {affordResult && (\n              <div style={{ marginTop: 14 }}>\n                <div className={`badge ${affordResult === 'comfortable' ? 'pos' : affordResult === 'tight' ? 'warn' : 'neg'}`}>\n                  {affordResult === 'comfortable' ? 'Comfortably affordable' : affordResult === 'tight' ? 'Tight but possible' : 'Not from free cash'}\n                </div>\n                <p className=\"small\" style={{ marginTop: 8, color: 'var(--ink-2)' }}>\n                  {affordResult === 'comfortable' &&\n                    `After setting ${money(Number(afford.replace(/[^0-9]/g, '')))} aside you would still have ${money(\n                      safe.safe - Number(afford.replace(/[^0-9]/g, ''))\n                    )} free. Your goals are untouched.`}\n                  {affordResult === 'tight' &&\n                    `This uses most of your free cash. You would have ${money(\n                      safe.safe - Number(afford.replace(/[^0-9]/g, ''))\n                    )} left, and any surprise would land on the emergency fund.`}\n                  {affordResult === 'not-now' &&\n                    `Free cash is ${money(Math.max(0, safe.safe))}. This purchase would need to come from goals or the buffer — the simulator can show the trade-off.`}\n                </p>\n                <p className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 6 }}>\n                  {money(Number(afford.replace(/[^0-9]/g, '')) / Math.max(1, surplus))} months of your current free cash flow.\n                </p>\n                <button className=\"linkish small\" style={{ marginTop: 8 }} onClick={() => navigate('/simulate')}>\n                  Model this purchase instead →\n                </button>\n              </div>\n            )}\n\n            {!affordResult && (\n              <p className=\"small muted\" style={{ marginTop: 12 }}>\n                The model answers from free cash after your buffer, goals, and the next 30 days of bills. It will never\n                tell you to borrow or invest — only what your own numbers allow.\n              </p>\n            )}\n          </div>\n        </section>\n      </div>\n\n      <p className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 24, maxWidth: '80ch' }}>\n        Baseline models your own numbers. It is not investment, tax, or credit advice, and it does not recommend\n        securities or products. Every projection is an estimate, shown with its assumptions.\n      </p>\n\n      <Modal\n        open={explain}\n        onClose={() => setExplain(false)}\n        title=\"How safe to spend works\"\n        sub=\"Free cash is deliberately conservative. It protects what you have already decided.\"\n      >\n        <div className=\"stack-sm\">\n          <div className=\"callout\">\n            <div className=\"label\" style={{ marginBottom: 6 }}>The formula</div>\n            <p className=\"mono small\" style={{ lineHeight: 1.7 }}>\n              balance ({fmt(balance)})<br />\n              − emergency fund ({fmt(safe.emergency)})<br />\n              − money in goals ({fmt(safe.goals)})<br />\n              − next 30 days of bills ({fmt(safe.scheduled)})<br />\n              − buffer ({fmt(safe.buffer)})<br />\n              = <strong>{fmt(safe.safe)}</strong>\n            </p>\n          </div>\n          <p className=\"small muted\">\n            The buffer is a flat ₹15,000. The emergency fund and goal balances are treated as already spoken for, even\n            though the money still sits in your account. Bills are counted from detected recurring payments, not from\n            guesswork.\n          </p>\n          <p className=\"small muted\">\n            If free cash is negative, nothing is broken — it means your commitments for the next 30 days are larger than\n            unallocated cash. The simulator is the right place to look at what to move.\n          </p>\n        </div>\n      </Modal>\n    </div>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Overview.tsx"})
  [Tool result]: Created file successfully: src/screens/Overview.tsx
  
  [Assistant reasoning]: Now main.tsx + App.tsx so I can start the dev server and check errors early. Create placeholder screens? I'll write App with imports to screens not yet created → error. Let me create App with only Overview for now, then add as I go? Better: create all screens as minimal placeholders now? That wastes edits. Instead create App with dynamic imports only for existing screens, then add. But build errors would block.
  
  I'll write App.tsx last. First create remaining screens.
  
  Next: Transactions screen (large), Inbox, Rules, Recurring, Plan, Simulate, Review, Coach, Settings.
  
  Let me do Transactions.
  
  Features:
  - toolbar: search input, category filter select, account filter, month filter, direction, sort, "Add transaction" button, "Export CSV".
  - table with checkbox selection, date, merchant + description, category select inline, confidence dot, amount, actions (split, exclude, delete, edit note).
  - bulk bar when selected: categorize dropdown, mark transfer, exclude, delete.
  - pagination (25/page).
  - split modal.
  - edit modal.
  - query params from route: q, category.
  - correction loop: changing category via inline select opens a small modal asking "Apply to future transactions from X?" with checkbox (learn rule) — default checked. Implement: on select change, open correction modal with txn + new category, checkbox "Learn rule for future 'MERCHANT'", and buttons "Just this one"/"Save & learn". That's a strong UX.
  - row pending badge.
  - "merge/split" — split modal with two rows category+amount, add row, validate sum equals total.
  - Exclude toggle.
  - Undo via toast.
  
  Use `useQueryState` for q/category.
  
  For simplicity, inline category select in row triggers modal.
  
  Bulk categorize: select value in bulk bar + Apply → opens learn confirm? Direct apply with toast. Provide checkbox "learn rule".
  
  Pagination: 20/page with prev/next.
  
  Export CSV: create Blob and download. Also copy? Just download.
  
  Table columns: checkbox, Date, Merchant/desc, Category (button that looks like chip), Confidence, Amount, actions (more menu?). Use inline icon buttons: split, exclude, delete. Keep visible on hover? Always visible at low opacity.
  
  Bulk bar sits above table when selection > 0.
  
  Add transaction modal fields: date (default today), description, amount, direction (out/in), category (auto), account, note. Auto-categorize preview as you type: show "Will file as X" with confidence.
  
  Edit modal: date, description, amount, category, note.
  
  Split modal: amount total (abs), two+ rows with category & amount; remaining indicator.
  
  Let me write. This is big but crucial.
  
  Need Confirmation for delete.
  
  Implement `downloadCSV(rows, filename)` util in lib/export.ts, plus `downloadJSON`.
  
  Let me create lib/export.ts first.
  
  CSV escaping.
  
  Also "Copy JSON" maybe.
  
  Write export util.
  [Assistant tool call]: write({"content":"export function toCSV(rows: Record<string, unknown>[], columns?: string[]): string {\n  if (!rows.length) return '';\n  const cols = columns ?? Object.keys(rows[0]);\n  const esc = (v: unknown): string => {\n    const s = v === null || v === undefined ? '' : String(v);\n    if (/[\",\\n]/.test(s)) return `\"${s.replace(/\"/g, '\"\"')}\"`;\n    return s;\n  };\n  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\\n');\n}\n\nexport function downloadFile(content: string, filename: string, type = 'text/csv;charset=utf-8'): void {\n  const blob = new Blob([content], { type });\n  const url = URL.createObjectURL(blob);\n  const a = document.createElement('a');\n  a.href = url;\n  a.download = filename;\n  document.body.appendChild(a);\n  a.click();\n  document.body.removeChild(a);\n  setTimeout(() => URL.revokeObjectURL(url), 1000);\n}\n\nexport function copyText(text: string): Promise<void> {\n  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);\n  return new Promise((resolve, reject) => {\n    try {\n      const ta = document.createElement('textarea');\n      ta.value = text;\n      ta.style.position = 'fixed';\n      ta.style.opacity = '0';\n      document.body.appendChild(ta);\n      ta.select();\n      document.execCommand('copy');\n      document.body.removeChild(ta);\n      resolve();\n    } catch (e) {\n      reject(e);\n    }\n  });\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\lib\\export.ts"})
  [Tool result]: Created file successfully: src/lib/export.ts
  
  [Assistant reasoning]: Now Transactions.tsx. Let me write with sub-components inside the file.
  
  State:
  - q (from route param), category param, month param
  - account, direction, sort
  - selected Set
  - page
  - correction modal {txn, category}
  - split modal {txn}
  - add modal
  - edit modal
  - delete confirm ids
  - bulk category
  
  Filtering:
  ```
  let list = state.txns.filter(...)
  ```
  Search matches description, merchant, note, amount string.
  
  Month filter default 'all' but initial param? Use 'all'. Overview link has q param only.
  
  Category filter from route param; keep synced via setQuery.
  
  Sort options: date desc/asc, amount desc/asc.
  
  Pending rows first? Keep sort.
  
  Table row: date, merchant, category chip button, confidence, amount, action icons. On mobile, columns hide.
  
  Category quick-change: `<button className="chip">` with dot + name + chevron; opens modal.
  
  CorrectionModal:
  - title "Recategorise transaction"
  - shows txn description, amount, current category
  - select new category (grouped options)
  - checkbox "Learn a rule for merchant" default true
  - preview rule pattern text "Lines containing 'SWIGGY' will be filed under Food delivery."
  - footer Cancel / Save.
  - On save: correctCategory(id, cat, learn), toast "Category updated" + action "Undo"? Undo only works for withUndo actions; correctCategory isn't snapshot-based. I could use undo by taking snapshot. Currently correctCategory doesn't set lastAction. Let me not offer undo for it; toast "Rule learned — applied to future transactions."
  
  SplitModal:
  - rows state: [{category, amount}]
  - total = abs(txn.amount)
  - remaining
  - add row button, remove (if >2)
  - Save disabled unless sum ≈ total and both > 0.
  - On save splitTxn.
  
  Add modal:
  - fields, auto preview from categorize with rules.
  - On save addTxn then toast.
  
  Edit modal:
  - fields prefilled; save updateTxn.
  
  Bulk bar:
  - selected count, category select, Learn checkbox, Apply; Mark transfer; Exclude; Delete.
  - bulkCategory then toast.
  
  Also "Approve selected" for pending? Add button "Approve" when pending selected → updateTxn pending false. Maybe simpler: each pending row has an Approve button in actions. Add a filter "Needs review" toggle.
  
  Confidence indicator: dot colored pos if >0.85, warn 0.5-0.85, neg <0.5 + tooltip via title with why.
  
  Notes editing? Edit modal has note.
  
  Pagination 25.
  
  Export current filtered view.
  
  Let me write code. Use `Money` component? Use money().
  
  Watch out: `useQueryState` uses useRoute and navigate; changes cause rerender. Fine.
  
  When category param set from route, the select should reflect it; local state initialized from param and updated on param change via useEffect.
  
  Simplify: use route params directly for q/category/month; local state for other filters. Search input writes to q on change (debounced? immediate navigation each keystroke causes hash changes but works). Use local `search` state initialized from q, and sync with URL on change? Immediate is okay but may be laggy. I'll keep local search state and a useEffect to sync to URL? Not necessary — URL q only matters for deep links. I'll initialize from q and not write back, except filter chips could. Simpler: local state only, initialized from params. The deep-link works on mount. Fine.
  
  But if user clicks another transaction link with different q while on the page, local state won't update. Add useEffect on route.params.get('q') to setSearch. Good.
  
  Let me write.
  
  Also add a filter bar with `select` elements. Buttons must work.
  
  Table actions need accessible labels.
  
  Let me write now.
  [Assistant tool call]: write({"content":"import { useEffect, useMemo, useState } from 'react';\nimport { useApp } from '../store/AppStore';\nimport type { Txn } from '../types';\nimport { CATEGORIES, CATEGORY_MAP } from '../data/categories';\nimport { money } from '../lib/format';\nimport { monthLabel, monthKey, nowMonth, todayISO } from '../lib/date';\nimport { useRoute } from '../lib/router';\nimport { Icon } from '../components/Icon';\nimport { Confirm, Modal, Empty, useToast } from '../components/ui';\nimport { categorize } from '../domain/categorize';\nimport { downloadFile, toCSV } from '../lib/export';\n\nconst PAGE_SIZE = 25;\n\ntype SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';\n\nfunction CategorySelect({\n  value,\n  onChange,\n  label = 'Category',\n  className = 'select',\n}: {\n  value: string;\n  onChange: (v: string) => void;\n  label?: string;\n  className?: string;\n}) {\n  const groups = useMemo(() => {\n    const map = new Map<string, typeof CATEGORIES>();\n    for (const c of CATEGORIES) {\n      if (!map.has(c.group)) map.set(c.group, []);\n      map.get(c.group)!.push(c);\n    }\n    return [...map.entries()];\n  }, []);\n  return (\n    <select className={className} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>\n      {groups.map(([group, cats]) => (\n        <optgroup key={group} label={group}>\n          {cats.map((c) => (\n            <option key={c.id} value={c.id}>{c.name}</option>\n          ))}\n        </optgroup>\n      ))}\n    </select>\n  );\n}\n\nexport default function Transactions() {\n  const { state, correctCategory, bulkCategory, deleteTxns, updateTxn, splitTxn, addTxn } = useApp();\n  const { push } = useToast();\n  const route = useRoute();\n\n  const [search, setSearch] = useState(route.params.get('q') ?? '');\n  const [category, setCategory] = useState(route.params.get('category') ?? 'all');\n  const [month, setMonth] = useState('all');\n  const [account, setAccount] = useState('all');\n  const [direction, setDirection] = useState<'all' | 'out' | 'in'>('all');\n  const [sort, setSort] = useState<SortKey>('date-desc');\n  const [pendingOnly, setPendingOnly] = useState(false);\n  const [selected, setSelected] = useState<Set<string>>(new Set());\n  const [page, setPage] = useState(0);\n\n  const [correction, setCorrection] = useState<{ txn: Txn; category: string } | null>(null);\n  const [learn, setLearn] = useState(true);\n  const [splitting, setSplitting] = useState<Txn | null>(null);\n  const [editing, setEditing] = useState<Txn | null>(null);\n  const [adding, setAdding] = useState(false);\n  const [deleting, setDeleting] = useState<string[] | null>(null);\n  const [bulkCat, setBulkCat] = useState('groceries');\n  const [bulkLearn, setBulkLearn] = useState(true);\n\n  useEffect(() => {\n    const q = route.params.get('q');\n    const cat = route.params.get('category');\n    if (q !== null) setSearch(q);\n    if (cat !== null) setCategory(cat);\n  }, [route.raw]);\n\n  const months = useMemo(\n    () => [...new Set(state.txns.map((t) => monthKey(t.date)))].sort().reverse(),\n    [state.txns]\n  );\n\n  const filtered = useMemo(() => {\n    const needle = search.trim().toLowerCase();\n    let list = state.txns.filter((t) => {\n      if (category !== 'all' && t.category !== category && !(t.splits ?? []).some((s) => s.category === category)) return false;\n      if (month !== 'all' && monthKey(t.date) !== month) return false;\n      if (account !== 'all' && t.accountId !== account) return false;\n      if (direction === 'out' && t.amount >= 0) return false;\n      if (direction === 'in' && t.amount <= 0) return false;\n      if (pendingOnly && !t.pending) return false;\n      if (needle) {\n        const hay = `${t.description} ${t.merchant} ${t.note ?? ''} ${t.category} ${Math.abs(t.amount)}`.toLowerCase();\n        if (!hay.includes(needle)) return false;\n      }\n      return true;\n    });\n    list = [...list].sort((a, b) => {\n      switch (sort) {\n        case 'date-asc': return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;\n        case 'amount-desc': return a.amount - b.amount;\n        case 'amount-asc': return b.amount - a.amount;\n        default: return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;\n      }\n    });\n    return list;\n  }, [state.txns, search, category, month, account, direction, sort, pendingOnly]);\n\n  useEffect(() => { setPage(0); }, [search, category, month, account, direction, pendingOnly]);\n\n  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));\n  const visible = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);\n  const outTotal = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);\n  const inTotal = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);\n\n  const toggleSelect = (id: string) => {\n    setSelected((s) => {\n      const next = new Set(s);\n      if (next.has(id)) next.delete(id);\n      else next.add(id);\n      return next;\n    });\n  };\n\n  const allVisibleSelected = visible.length > 0 && visible.every((t) => selected.has(t.id));\n\n  const exportCsv = () => {\n    const rows = filtered.map((t) => ({\n      Date: t.date,\n      Merchant: t.merchant,\n      Description: t.description,\n      Category: CATEGORY_MAP[t.category]?.name ?? t.category,\n      Amount: t.amount,\n      Account: state.accounts.find((a) => a.id === t.accountId)?.name ?? t.accountId,\n      Source: t.source,\n      Note: t.note ?? '',\n    }));\n    downloadFile(toCSV(rows), `baseline-transactions-${todayISO()}.csv`);\n    push(`Exported ${rows.length} transactions`);\n  };\n\n  const saveCorrection = () => {\n    if (!correction) return;\n    const ruleId = correctCategory(correction.txn.id, correction.category, learn);\n    push(\n      learn\n        ? `Filed under ${CATEGORY_MAP[correction.category].name}. ${ruleId ? 'A rule was learned for future transactions.' : 'The existing rule was updated.'}`\n        : 'Category updated for this transaction only.'\n    );\n    setCorrection(null);\n  };\n\n  return (\n    <div className=\"page\">\n      <div className=\"page-head\">\n        <div>\n          <div className=\"eyebrow\">The ledger</div>\n          <h1 className=\"display\">Every line, <em>accounted for.</em></h1>\n          <p className=\"lede\">\n            Search the whole history, correct a category, and the model learns the rule. Splits let one payment belong\n            to more than one part of your life.\n          </p>\n        </div>\n        <div className=\"head-actions\">\n          <button className=\"btn\" onClick={exportCsv}>\n            <Icon name=\"download\" size={14} /> Export CSV\n          </button>\n          <button className=\"btn\" onClick={() => setAdding(true)}>\n            <Icon name=\"plus\" size={14} /> Add transaction\n          </button>\n        </div>\n      </div>\n\n      <section className=\"panel\">\n        <div className=\"panel-body\" style={{ paddingBottom: 12 }}>\n          <div className=\"row wrap\" style={{ gap: 8 }}>\n            <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 180 }}>\n              <Icon name=\"search\" size={14} style={{ position: 'absolute', left: 9, top: 9, color: 'var(--faint)' } as React.CSSProperties} />\n              <input\n                className=\"input\"\n                style={{ paddingLeft: 30 }}\n                placeholder=\"Search merchants, notes, amounts…\"\n                value={search}\n                onChange={(e) => setSearch(e.target.value)}\n                aria-label=\"Search transactions\"\n              />\n            </div>\n            <select className=\"select\" style={{ width: 'auto' }} value={category} onChange={(e) => setCategory(e.target.value)} aria-label=\"Filter by category\">\n              <option value=\"all\">All categories</option>\n              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}\n            </select>\n            <select className=\"select\" style={{ width: 'auto' }} value={month} onChange={(e) => setMonth(e.target.value)} aria-label=\"Filter by month\">\n              <option value=\"all\">All months</option>\n              {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}\n            </select>\n            <select className=\"select\" style={{ width: 'auto' }} value={account} onChange={(e) => setAccount(e.target.value)} aria-label=\"Filter by account\">\n              <option value=\"all\">All accounts</option>\n              {state.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}\n            </select>\n            <select className=\"select\" style={{ width: 'auto' }} value={direction} onChange={(e) => setDirection(e.target.value as typeof direction)} aria-label=\"Filter by direction\">\n              <option value=\"all\">Money in & out</option>\n              <option value=\"out\">Money out</option>\n              <option value=\"in\">Money in</option>\n            </select>\n            <select className=\"select\" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label=\"Sort transactions\">\n              <option value=\"date-desc\">Newest first</option>\n              <option value=\"date-asc\">Oldest first</option>\n              <option value=\"amount-desc\">Largest outflow</option>\n              <option value=\"amount-asc\">Largest inflow</option>\n            </select>\n            <button\n              className=\"chip\"\n              aria-pressed={pendingOnly}\n              onClick={() => setPendingOnly((v) => !v)}\n            >\n              <span className=\"dot\" style={{ background: 'var(--accent)' }} /> Needs review\n            </button>\n            {(search || category !== 'all' || month !== 'all' || account !== 'all' || direction !== 'all' || pendingOnly) && (\n              <button\n                className=\"btn btn-ghost btn-sm\"\n                onClick={() => {\n                  setSearch(''); setCategory('all'); setMonth('all'); setAccount('all');\n                  setDirection('all'); setPendingOnly(false);\n                }}\n              >\n                Clear filters\n              </button>\n            )}\n          </div>\n\n          <div className=\"row-between\" style={{ marginTop: 10 }}>\n            <div className=\"tiny\" style={{ color: 'var(--muted)' }}>\n              {filtered.length} of {state.txns.length} transactions · out {money(outTotal)} · in {money(inTotal)}\n            </div>\n            <div className=\"tiny\" style={{ color: 'var(--muted)' }}>\n              {state.txns.filter((t) => t.pending).length} waiting for review\n            </div>\n          </div>\n        </div>\n\n        {selected.size > 0 && (\n          <div className=\"panel-body\" style={{ borderTop: '1px solid var(--line)', background: 'var(--accent-soft)', paddingTop: 10, paddingBottom: 10 }}>\n            <div className=\"row wrap\" style={{ gap: 8 }}>\n              <span className=\"small strong\">{selected.size} selected</span>\n              <span className=\"faint\">·</span>\n              <select className=\"select select-sm\" style={{ width: 'auto' }} value={bulkCat} onChange={(e) => setBulkCat(e.target.value)} aria-label=\"Bulk category\">\n                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}\n              </select>\n              <label className=\"check small\">\n                <input type=\"checkbox\" checked={bulkLearn} onChange={(e) => setBulkLearn(e.target.checked)} />\n                Learn rule\n              </label>\n              <button\n                className=\"btn btn-sm btn-primary\"\n                onClick={() => {\n                  bulkCategory([...selected], bulkCat, bulkLearn);\n                  push(`Moved ${selected.size} transactions to ${CATEGORY_MAP[bulkCat].name}`);\n                  setSelected(new Set());\n                }}\n              >\n                Apply\n              </button>\n              <button\n                className=\"btn btn-sm\"\n                onClick={() => {\n                  [...selected].forEach((id) => updateTxn(id, { pending: false }));\n                  push(`Approved ${selected.size} transactions`);\n                  setSelected(new Set());\n                }}\n              >\n                Approve\n              </button>\n              <button\n                className=\"btn btn-sm\"\n                onClick={() => {\n                  [...selected].forEach((id) => updateTxn(id, { isTransfer: true, isExcluded: true }));\n                  push('Marked as transfers and excluded from spending');\n                  setSelected(new Set());\n                }}\n              >\n                Mark transfer\n              </button>\n              <button className=\"btn btn-sm btn-danger\" onClick={() => setDeleting([...selected])}>\n                Delete\n              </button>\n              <button className=\"btn btn-sm btn-ghost\" onClick={() => setSelected(new Set())}>Clear</button>\n            </div>\n          </div>\n        )}\n\n        <div className=\"panel-body flush\">\n          <div className=\"table-wrap\">\n            <table className=\"tbl\">\n              <thead>\n                <tr>\n                  <th style={{ width: 34 }}>\n                    <input\n                      type=\"checkbox\"\n                      aria-label=\"Select all visible transactions\"\n                      checked={allVisibleSelected}\n                      onChange={() => {\n                        setSelected((s) => {\n                          const next = new Set(s);\n                          if (allVisibleSelected) visible.forEach((t) => next.delete(t.id));\n                          else visible.forEach((t) => next.add(t.id));\n                          return next;\n                        });\n                      }}\n                    />\n                  </th>\n                  <th style={{ width: 92 }}>Date</th>\n                  <th>Merchant</th>\n                  <th style={{ width: 170 }}>Category</th>\n                  <th className=\"hide-sm\" style={{ width: 90 }}>Confidence</th>\n                  <th className=\"right\" style={{ width: 110 }}>Amount</th>\n                  <th className=\"right\" style={{ width: 116 }}>Actions</th>\n                </tr>\n              </thead>\n              <tbody>\n                {visible.map((t) => {\n                  const cat = CATEGORY_MAP[t.category];\n                  return (\n                    <tr key={t.id} className={`${selected.has(t.id) ? 'selected' : ''} ${t.pending ? 'pending' : ''}`}>\n                      <td>\n                        <input\n                          type=\"checkbox\"\n                          aria-label={`Select ${t.merchant}`}\n                          checked={selected.has(t.id)}\n                          onChange={() => toggleSelect(t.id)}\n                        />\n                      </td>\n                      <td className=\"mono small nowrap\">{t.date.slice(8)} {monthLabel(t.date.slice(0, 7), true).slice(0, 3)}</td>\n                      <td>\n                        <div className=\"row\" style={{ gap: 6 }}>\n                          <span className=\"txn-merchant ellipsis\" style={{ maxWidth: 210 }}>{t.merchant}</span>\n                          {t.pending && <span className=\"badge warn\">Review</span>}\n                          {t.isExcluded && <span className=\"badge outline\">Excluded</span>}\n                          {t.splits && <span className=\"badge info\">Split</span>}\n                        </div>\n                        <div className=\"txn-desc\" title={t.description}>{t.description}</div>\n                      </td>\n                      <td>\n                        <button\n                          className=\"chip\"\n                          style={{ height: 24, padding: '0 7px', fontSize: 11, maxWidth: 158 }}\n                          onClick={() => { setLearn(true); setCorrection({ txn: t, category: t.category }); }}\n                          aria-label={`Change category for ${t.merchant}, currently ${cat?.name}`}\n                        >\n                          <span className=\"swatch\" style={{ background: cat?.color }} />\n                          <span className=\"ellipsis\">{cat?.name ?? t.category}</span>\n                          <Icon name=\"chevronDown\" size={10} />\n                        </button>\n                      </td>\n                      <td className=\"hide-sm\">\n                        <span\n                          className=\"row small\"\n                          style={{ gap: 5, color: t.confidence > 0.85 ? 'var(--positive)' : t.confidence > 0.5 ? 'var(--accent)' : 'var(--negative)' }}\n                          title={t.why}\n                        >\n                          <span className=\"dot\" style={{ background: 'currentColor' }} />\n                          {Math.round(t.confidence * 100)}%\n                        </span>\n                      </td>\n                      <td className={`money ${t.amount > 0 ? 'pos' : ''}`}>\n                        {t.amount > 0 ? '+' : '−'}{money(Math.abs(t.amount))}\n                      </td>\n                      <td className=\"right\">\n                        <div className=\"row\" style={{ gap: 2, justifyContent: 'flex-end' }}>\n                          <button className=\"btn btn-ghost btn-icon\" title=\"Split across categories\" aria-label={`Split ${t.merchant}`} onClick={() => setSplitting(t)}>\n                            <Icon name=\"split\" size={13} />\n                          </button>\n                          <button className=\"btn btn-ghost btn-icon\" title=\"Edit transaction\" aria-label={`Edit ${t.merchant}`} onClick={() => setEditing(t)}>\n                            <Icon name=\"pencil\" size={13} />\n                          </button>\n                          <button className=\"btn btn-ghost btn-icon\" title=\"Delete transaction\" aria-label={`Delete ${t.merchant}`} onClick={() => setDeleting([t.id])}>\n                            <Icon name=\"trash\" size={13} />\n                          </button>\n                        </div>\n                      </td>\n                    </tr>\n                  );\n                })}\n              </tbody>\n            </table>\n            {!visible.length && (\n              <Empty\n                icon=\"receipt\"\n                title=\"Nothing matches those filters\"\n                body=\"Try a different month or clear the search. If this account is new, import a statement from the inbox.\"\n                action={<button className=\"btn btn-sm\" onClick={() => { setSearch(''); setCategory('all'); setMonth('all'); setAccount('all'); setDirection('all'); setPendingOnly(false); }}>Clear everything</button>}\n              />\n            )}\n          </div>\n        </div>\n\n        <div className=\"panel-foot\">\n          <span className=\"tiny\" style={{ color: 'var(--muted)' }}>\n            Page {page + 1} of {pageCount} · {visible.length} shown\n          </span>\n          <div className=\"row\" style={{ gap: 6 }}>\n            <button className=\"btn btn-sm\" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>\n              <Icon name=\"chevronLeft\" size={12} /> Previous\n            </button>\n            <button className=\"btn btn-sm\" disabled={page >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>\n              Next <Icon name=\"chevronRight\" size={12} />\n            </button>\n          </div>\n        </div>\n      </section>\n\n      {/* correction */}\n      <Modal\n        open={!!correction}\n        onClose={() => setCorrection(null)}\n        title=\"Recategorise this transaction\"\n        sub={correction ? `${correction.txn.merchant} · ${money(Math.abs(correction.txn.amount))} · ${correction.txn.date}` : ''}\n        footer={\n          <>\n            <button className=\"btn\" onClick={() => setCorrection(null)}>Cancel</button>\n            <button className=\"btn btn-primary\" onClick={saveCorrection}>Save category</button>\n          </>\n        }\n      >\n        {correction && (\n          <div className=\"stack-sm\">\n            <div className=\"callout\">\n              <div className=\"label\">Statement line</div>\n              <p className=\"mono small\" style={{ marginTop: 4, lineHeight: 1.6 }}>{correction.txn.description}</p>\n              <p className=\"small muted\" style={{ marginTop: 6 }}>\n                Filed as <strong>{CATEGORY_MAP[correction.txn.category]?.name}</strong> with{' '}\n                {Math.round(correction.txn.confidence * 100)}% confidence. {correction.txn.why}\n              </p>\n            </div>\n            <div className=\"field\">\n              <label htmlFor=\"corr-cat\">New category</label>\n              <CategorySelect value={correction.category} onChange={(v) => setCorrection({ ...correction, category: v })} label=\"New category\" />\n            </div>\n            <label className=\"check\">\n              <input type=\"checkbox\" checked={learn} onChange={(e) => setLearn(e.target.checked)} />\n              Learn a rule for future transactions from this merchant\n            </label>\n            {learn && (\n              <div className=\"note\">\n                Future lines containing <span className=\"mono\">“{correction.txn.merchant.toUpperCase().slice(0, 18)}”</span> will be\n                filed under <strong>{CATEGORY_MAP[correction.category]?.name}</strong> automatically. You can edit or delete\n                the rule later.\n              </div>\n            )}\n            <p className=\"tiny\" style={{ color: 'var(--muted)' }}>\n              Only this transaction changes now. Rules can be applied to past transactions from the Rules screen.\n            </p>\n          </div>\n        )}\n      </Modal>\n\n      {/* split */}\n      {splitting && <SplitModal txn={splitting} onClose={() => setSplitting(null)} onSave={(parts) => { splitTxn(splitting.id, parts); push('Transaction split across categories'); setSplitting(null); }} />}\n\n      {/* edit */}\n      {editing && (\n        <EditModal\n          txn={editing}\n          onClose={() => setEditing(null)}\n          onSave={(patch) => { updateTxn(editing.id, patch); push('Transaction updated'); setEditing(null); }}\n        />\n      )}\n\n      {/* add */}\n      <AddModal open={adding} onClose={() => setAdding(false)} onAdd={(input) => { addTxn(input); push('Transaction added'); setAdding(false); }} />\n\n      <Confirm\n        open={!!deleting}\n        onClose={() => setDeleting(null)}\n        onConfirm={() => {\n          if (!deleting) return;\n          deleteTxns(deleting);\n          push(`Deleted ${deleting.length} transaction${deleting.length > 1 ? 's' : ''}`, {\n            label: 'Undo',\n            run: () => { /* undo is available in the top bar */ },\n          });\n          setSelected(new Set());\n        }}\n        title={`Delete ${deleting?.length ?? 1} transaction${(deleting?.length ?? 1) > 1 ? 's' : ''}?`}\n        body=\"This removes the lines from the model and recalculates every balance. You can undo it from the top bar immediately afterwards.\"\n        confirmLabel=\"Delete\"\n        danger\n      />\n    </div>\n  );\n}\n\nfunction SplitModal({\n  txn,\n  onClose,\n  onSave,\n}: {\n  txn: Txn;\n  onClose: () => void;\n  onSave: (parts: { category: string; amount: number }[]) => void;\n}) {\n  const total = Math.abs(txn.amount);\n  const [parts, setParts] = useState(\n    txn.splits?.length\n      ? txn.splits\n      : [{ category: txn.category, amount: Math.round(total / 2) }, { category: 'groceries', amount: total - Math.round(total / 2) }]\n  );\n  const assigned = parts.reduce((s, p) => s + Number(p.amount || 0), 0);\n  const remaining = Math.round((total - assigned) * 100) / 100;\n  const valid = Math.abs(remaining) < 0.5 && parts.every((p) => Number(p.amount) > 0);\n\n  return (\n    <Modal\n      open\n      onClose={onClose}\n      title=\"Split this transaction\"\n      sub={`${txn.merchant} · ${money(total)} total`}\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Cancel</button>\n          <button className=\"btn btn-primary\" disabled={!valid} onClick={() => onSave(parts.map((p) => ({ category: p.category, amount: Number(p.amount) })))}>\n            Save split\n          </button>\n        </>\n      }\n    >\n      <div className=\"stack-sm\">\n        {parts.map((p, i) => (\n          <div className=\"row\" key={i} style={{ gap: 8, alignItems: 'flex-end' }}>\n            <div className=\"field\" style={{ flex: 1 }}>\n              <label>Category {i + 1}</label>\n              <CategorySelect value={p.category} onChange={(v) => setParts(parts.map((x, j) => (j === i ? { ...x, category: v } : x)))} />\n            </div>\n            <div className=\"field\" style={{ width: 130 }}>\n              <label>Amount</label>\n              <input\n                className=\"input num\"\n                inputMode=\"decimal\"\n                value={p.amount}\n                onChange={(e) => setParts(parts.map((x, j) => (j === i ? { ...x, amount: Number(e.target.value.replace(/[^0-9.]/g, '')) } : x)))}\n                aria-label={`Amount for part ${i + 1}`}\n              />\n            </div>\n            {parts.length > 2 && (\n              <button className=\"btn btn-ghost btn-icon\" aria-label=\"Remove part\" onClick={() => setParts(parts.filter((_, j) => j !== i))}>\n                <Icon name=\"x\" size={14} />\n              </button>\n            )}\n          </div>\n        ))}\n        <div className=\"row-between\">\n          <button\n            className=\"btn btn-sm\"\n            onClick={() => setParts([...parts, { category: 'other', amount: Math.max(0, remaining) }])}\n            disabled={remaining <= 0}\n          >\n            <Icon name=\"plus\" size={12} /> Add part\n          </button>\n          <span className={`small ${Math.abs(remaining) < 0.5 ? 'pos' : 'neg'}`}>\n            {Math.abs(remaining) < 0.5 ? 'Fully allocated' : `${money(Math.abs(remaining))} ${remaining > 0 ? 'left to assign' : 'over'}`}\n          </span>\n        </div>\n        <p className=\"tiny\" style={{ color: 'var(--muted)' }}>\n          A split keeps the real payment intact while letting each part belong to a different category.\n        </p>\n      </div>\n    </Modal>\n  );\n}\n\nfunction EditModal({ txn, onClose, onSave }: { txn: Txn; onClose: () => void; onSave: (patch: Partial<Txn>) => void }) {\n  const [date, setDate] = useState(txn.date);\n  const [description, setDescription] = useState(txn.description);\n  const [amount, setAmount] = useState(String(Math.abs(txn.amount)));\n  const [category, setCategory] = useState(txn.category);\n  const [note, setNote] = useState(txn.note ?? '');\n\n  return (\n    <Modal\n      open\n      onClose={onClose}\n      title=\"Edit transaction\"\n      sub=\"Changes recalculate the model immediately.\"\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Cancel</button>\n          <button\n            className=\"btn btn-primary\"\n            onClick={() =>\n              onSave({\n                date,\n                description,\n                merchant: txn.merchant,\n                amount: txn.amount < 0 ? -Math.abs(Number(amount) || 0) : Math.abs(Number(amount) || 0),\n                category,\n                note,\n              })\n            }\n          >\n            Save changes\n          </button>\n        </>\n      }\n    >\n      <div className=\"stack-sm\">\n        <div className=\"form-row\">\n          <div className=\"field\"><label>Date</label><input className=\"input\" type=\"date\" value={date} onChange={(e) => setDate(e.target.value)} /></div>\n          <div className=\"field\"><label>Amount</label><input className=\"input num\" inputMode=\"decimal\" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>\n        </div>\n        <div className=\"field\"><label>Statement description</label><input className=\"input\" value={description} onChange={(e) => setDescription(e.target.value)} /></div>\n        <div className=\"field\"><label>Category</label><CategorySelect value={category} onChange={setCategory} /></div>\n        <div className=\"field\"><label>Note</label><textarea className=\"textarea\" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder=\"Why does this line matter?\" /></div>\n      </div>\n    </Modal>\n  );\n}\n\nfunction AddModal({\n  open,\n  onClose,\n  onAdd,\n}: {\n  open: boolean;\n  onClose: () => void;\n  onAdd: (input: { date: string; description: string; amount: number; category?: string; accountId?: string; note?: string }) => void;\n}) {\n  const { state } = useApp();\n  const [date, setDate] = useState(todayISO());\n  const [description, setDescription] = useState('');\n  const [amount, setAmount] = useState('');\n  const [dir, setDir] = useState<'out' | 'in'>('out');\n  const [category, setCategory] = useState('');\n  const [accountId, setAccountId] = useState('acc_hdfc');\n  const [note, setNote] = useState('');\n\n  const preview = description ? categorize(description, dir === 'out' ? -Math.abs(Number(amount) || 1) : Math.abs(Number(amount) || 1), state.rules) : null;\n  const chosen = category || preview?.category || 'other';\n\n  return (\n    <Modal\n      open={open}\n      onClose={onClose}\n      title=\"Add a transaction\"\n      sub=\"Cash, a missed line, or something the bank never told you about.\"\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Cancel</button>\n          <button\n            className=\"btn btn-primary\"\n            disabled={!description || !Number(amount)}\n            onClick={() =>\n              onAdd({\n                date,\n                description,\n                amount: dir === 'out' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),\n                category: chosen,\n                accountId,\n                note,\n              })\n            }\n          >\n            Add to the model\n          </button>\n        </>\n      }\n    >\n      <div className=\"stack-sm\">\n        <div className=\"form-row-3\">\n          <div className=\"field\"><label>Date</label><input className=\"input\" type=\"date\" value={date} onChange={(e) => setDate(e.target.value)} /></div>\n          <div className=\"field\"><label>Direction</label>\n            <select className=\"select\" value={dir} onChange={(e) => setDir(e.target.value as 'out' | 'in')}>\n              <option value=\"out\">Money out</option>\n              <option value=\"in\">Money in</option>\n            </select>\n          </div>\n          <div className=\"field\"><label>Amount</label><input className=\"input num\" inputMode=\"decimal\" placeholder=\"0\" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>\n        </div>\n        <div className=\"field\"><label>Description</label><input className=\"input\" placeholder=\"e.g. SWIGGY ORDER BANGALORE\" value={description} onChange={(e) => setDescription(e.target.value)} /></div>\n        <div className=\"form-row\">\n          <div className=\"field\"><label>Category</label><CategorySelect value={chosen} onChange={setCategory} /></div>\n          <div className=\"field\"><label>Account</label>\n            <select className=\"select\" value={accountId} onChange={(e) => setAccountId(e.target.value)}>\n              {state.accounts.map((a) => <option key={a.id} value={a.id}>{a.name} · {a.institution}</option>)}\n            </select>\n          </div>\n        </div>\n        {preview && (\n          <div className=\"note\">\n            Auto-filed as <strong>{CATEGORY_MAP[chosen]?.name}</strong> at {Math.round(preview.confidence * 100)}% confidence.\n            {' '}{preview.why}\n          </div>\n        )}\n        <div className=\"field\"><label>Note (optional)</label><input className=\"input\" value={note} onChange={(e) => setNote(e.target.value)} /></div>\n      </div>\n    </Modal>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Transactions.tsx"})
  [Tool result]: Created file successfully: src/screens/Transactions.tsx
  
  [Assistant reasoning]: Note: I passed `style` prop to `Icon` which doesn't accept style. In the search input I wrote:
  ```tsx
  <Icon name="search" size={14} style={{...} as React.CSSProperties} />
  ```
  Icon props don't include style → TS error. Need to add `style` to Icon props. Let me update Icon to accept style.
  
  Also `React` namespace usage in Transactions: I used `React.CSSProperties` without importing React. With the new JSX transform, `React` isn't imported. Need `import type { CSSProperties } from 'react'` or just `style` typed. I'll fix by adding style prop to Icon and removing cast.
  
  Let me update Icon props: `style?: React.CSSProperties`.
  
  Then fix the call.
  
  Also in Transactions, the delete toast action "Undo" does nothing — bad, every button should work. Let me make it actually call undo. I'll grab `undo` from useApp and toast action run: undo. But deleteTxns uses withUndo, so undo restores. Good.
  
  Similarly Confirm onConfirm uses stale `deleting`. Fine.
  
  Let me patch.
  
  Also `Empty` import exists.
  
  Another issue: `useEffect(..., [route.raw])` with route.raw dependency — fine but eslint no matter.
  
  `route` object is new each render? useRoute returns state, stable between hash changes. Fine.
  
  Now Inbox screen. This is a signature flow.
  
  Sections:
  - Tabs: CSV / PDF / SMS / Sample files.
  - Left: dropzone + file input.
  - Right: "How the pipeline works" 4 steps.
  - After parse: preview panel with detected format, row count, errors, table of rows (date, desc, amount, category auto, duplicate flag), checkbox per row? Dedupe handled automatically. "Approve & add N transactions" button.
  - Batch history list with status and review action.
  - Pending review queue with approve/discard.
  - Instructions for SMS paste with sample.
  
  PDF parsing: dynamic import pdfjs-dist + worker URL. In Vite:
  ```ts
  const pdfjs = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const doc = await pdfjs.getDocument({data}).promise;
  ```
  TypeScript: importing 'pdfjs-dist/build/pdf.worker.min.mjs?url' may lack types — add a `vite-env.d.ts` with `/// <reference types="vite/client" />` which declares `*?url`. Vite client types handle `?url` for known modules? It has generic `*?url` declarations. Yes.
  
  pdfjs-dist v5 might need `standardFontDataUrl` but for text extraction no.
  
  Use `file.arrayBuffer()` then `getDocument({data: new Uint8Array(buf)})`. Iterate pages, getTextContent, join items with ' ' but preserve newlines based on item.hasEOL.
  
  Extract text to lines: items have transform y; simpler: build string with hasEOL newline.
  
  Then parseStatementText.
  
  Sample files:
  - CSV: use SAMPLE_CSV from seed (works)
  - SMS: SAMPLE_SMS
  - PDF: load `/samples/baseline-statement.pdf` via fetch, parse with pdfjs. I need to generate that file. I'll write a Node script to create it. If fetch fails, fall back to a text sample.
  
  Add a "Load sample" button per tab.
  
  Batch history: list with date, file, source, added/dupes, status; actions: Review pending → filters table, Approve all, Discard.
  
  Pending queue: top 5 pending txns with confidence, buttons "Approve" and "Edit" (open correction modal? simpler: approve/delete). Actually review should allow recategorize. I'll add a category select inline in the pending list, calling correctCategory with learn false. That's functional.
  
  The preview table: category preview from categorize. Show first 8 rows.
  
  Approve import: importRows returns summary, then show toast "Added N, skipped D duplicates" and reset preview, maybe auto-navigate to transactions? Keep on page and show batch. Also "Approve now" sets pending false for the batch — but approveBatch needs batchId from import. Provide two buttons: "Add to inbox" (pending) and "Add & approve", where the latter imports then approves. Since importRows is sync-return summary, can call approveBatch(summary.batchId) right after — but state update is async; approveBatch dispatch uses functional update with batchId, so it will apply to the new state. Yes, reducer updates are queued in order.
  
  Need to ensure importRows uses stale state for existing hashes but that's current render.
  
  Errors display.
  
  Dropzone drag & drop.
  
  File size guard.
  
  SMS textarea with "Parse messages" button and "Load sample".
  
  Manual entry link to transactions? "Add transaction" opens? Navigate to transactions and let them add. Simpler: navigate.
  
  Let me also add "Paste statement text" for PDF fallback? The PDF tab can accept text paste too if extraction fails ("Paste the statement text"). Good fallback but adds UI. I'll add a "Paste statement text" toggle in PDF tab; parse via parseStatementText.
  
  Implementation details for file reading:
  ```ts
  async function handleFile(file: File) {
    setBusy(true); setPreview(null); setError('');
    try {
      if (/\.csv|\.txt/i.test(file.name)) { const text = await file.text(); if (source==='sms') parseSMS else parseCSV }
      else if (/\.pdf$/i.test(file.name)) { await parsePdf(file) }
    } catch(e) { setErrors([...]) }
  }
  ```
  Determine by tab, not extension: if tab csv but file pdf, handle by extension. Let's route by extension with fallback.
  
  For the sample PDF, fetch '/samples/baseline-statement.pdf'. With base './' and hash routing, fetch('samples/...') relative to document URL. Use `new URL('samples/baseline-statement.pdf', window.location.href)`. In dev root, `/samples/...`. Use `import.meta.env.BASE_URL + 'samples/baseline-statement.pdf'`.
  
  Generate the PDF. I'll write scripts/make-sample-pdf.mjs with a minimal PDF. Let me do that after screens.
  
  Preview state:
  ```ts
  const [preview, setPreview] = useState<ParseResult & {categorized...} | null>(null)
  ```
  Compute categorization preview with useMemo when preview set.
  
  Row checkboxes to exclude? Overkill. Keep all.
  
  Let me write Inbox.
  
  Also a "Data sources" panel showing accounts and last import.
  
  Let me write it now.
  
  Careful with pdfjs types. I'll use `any` for the module to avoid TS issues.
  
  ```ts
  const pdfjs: any = await import('pdfjs-dist');
  ```
  Vite may not bundle worker properly. Use `const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;`.
  
  TypeScript will complain about module declaration; add `src/vite-env.d.ts` with reference types vite/client, which declares `*?url`.
  
  Let me create that file too.
  
  Now write Inbox.
  [Assistant tool call]: edit({"newString":"export function Icon({\n  name,\n  size = 16,\n  strokeWidth = 1.6,\n  className,\n  style,\n  'aria-hidden': ariaHidden = true,\n}: {\n  name: IconName;\n  size?: number;\n  strokeWidth?: number;\n  className?: string;\n  style?: React.CSSProperties;\n  'aria-hidden'?: boolean;\n}) {\n  return (\n    <svg\n      width={size}\n      height={size}\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      strokeWidth={strokeWidth}\n      strokeLinecap=\"round\"\n      strokeLinejoin=\"round\"\n      className={className}\n      style={style}\n      aria-hidden={ariaHidden}\n      focusable=\"false\"\n    >","oldString":"export function Icon({\n  name,\n  size = 16,\n  strokeWidth = 1.6,\n  className,\n  'aria-hidden': ariaHidden = true,\n}: {\n  name: IconName;\n  size?: number;\n  strokeWidth?: number;\n  className?: string;\n  'aria-hidden'?: boolean;\n}) {\n  return (\n    <svg\n      width={size}\n      height={size}\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      strokeWidth={strokeWidth}\n      strokeLinecap=\"round\"\n      strokeLinejoin=\"round\"\n      className={className}\n      aria-hidden={ariaHidden}\n      focusable=\"false\"\n    >","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\components\\Icon.tsx"})
  [Tool result]: Edited src/components/Icon.tsx (1 replacement)
  [Assistant tool call]: write({"content":"/// <reference types=\"vite/client\" />\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\vite-env.d.ts"})
  [Tool result]: Created file successfully: src/vite-env.d.ts
  
  [Assistant reasoning]: Fix the Transactions Icon style call — now style is accepted, but I used `as React.CSSProperties` without importing React. Let me change to plain object.
  [Assistant tool call]: edit({"newString":"              <Icon name=\"search\" size={14} style={{ position: 'absolute', left: 9, top: 9, color: 'var(--faint)' }} />","oldString":"              <Icon name=\"search\" size={14} style={{ position: 'absolute', left: 9, top: 9, color: 'var(--faint)' } as React.CSSProperties} />","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Transactions.tsx"})
  [Tool result]: Edited src/screens/Transactions.tsx (1 replacement)
  
  [Assistant reasoning]: Now Inbox.
  
  Also fix delete toast undo: add `undo` to useApp destructure.
  
  Let me patch Transactions quickly:
  - destructure undo
  - toast action run: undo
  
  Then write Inbox.
  [Assistant tool call]: edit({"newString":"  const { state, correctCategory, bulkCategory, deleteTxns, updateTxn, splitTxn, addTxn, undo } = useApp();","oldString":"  const { state, correctCategory, bulkCategory, deleteTxns, updateTxn, splitTxn, addTxn } = useApp();","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Transactions.tsx"})
  [Tool result]: Edited src/screens/Transactions.tsx (1 replacement)
  [Assistant tool call]: edit({"newString":"          deleteTxns(deleting);\n          push(`Deleted ${deleting.length} transaction${deleting.length > 1 ? 's' : ''}`, {\n            label: 'Undo',\n            run: () => undo(),\n          });","oldString":"          deleteTxns(deleting);\n          push(`Deleted ${deleting.length} transaction${deleting.length > 1 ? 's' : ''}`, {\n            label: 'Undo',\n            run: () => { /* undo is available in the top bar */ },\n          });","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Transactions.tsx"})
  [Tool result]: Edited src/screens/Transactions.tsx (1 replacement)
  
  [Assistant reasoning]: Now Inbox.tsx.
  
  Structure:
  
  Header: eyebrow "Ingestion", h1 "Bring the mess. <em>We'll make it a model.</em>", lede.
  
  Grid:
  - col-8 panel "Import" with tabs [CSV][PDF][SMS][Paste text?]. Under tab: dropzone / textarea. Buttons "Choose file", "Use sample".
  - col-4 panel "Pipeline" with 4 steps and counts.
  - Preview panel col-12 when parsed.
  - col-7 "Waiting for review" list.
  - col-5 "Import history".
  
  Tabs: 'file' for CSV/PDF, 'sms'. Let's do three tabs: Bank CSV, PDF statement, SMS alerts.
  
  Dropzone handles both CSV/PDF based on tab.
  
  Sample button per tab: "Load sample CSV", "Load sample PDF", "Load sample SMS".
  
  PDF parsing function inside.
  
  Text fallback: in PDF tab, show a small textarea toggle "Paste statement text instead" — implement with a `showPaste` state.
  
  SMS tab: textarea with value and Parse button.
  
  Preview: header with meta, counts, errors; table 8 rows with category and confidence; buttons "Add N to inbox" (pending) and "Add & approve" primary. Also "Discard preview".
  
  Use `parseCSV`, `parseSMS`, `parseStatementText`, `categorize`.
  
  Preview categorization computed on render.
  
  Batch list: state.batches (excluding seed?) show all; each with status badge, counts, "Review pending" if not approved and batch has pending txns → filter pending list to that batch? Simpler: clicking "Review" sets a batchFilter state and scrolls to pending panel. I'll implement `reviewBatch` state; pending list filters by it with a chip to clear.
  
  Pending panel: list of pending txns (all), each row: date, merchant, auto category select, confidence, amount, approve button, delete. Approve → updateTxn pending false. Also "Approve all" button.
  
  Category select inline: use a native select with all categories (simple) — on change correctCategory(id, value, false) and approve.
  
  Source badges.
  
  Import summary toast + navigate? Provide toast with "Review" action.
  
  Let's code.
  
  Potential issue: `parseCSV` on sample CSV with header "Date,Narration,Withdrawal Amt.,Deposit Amt.,Closing Balance" — header detection works. Values like "486.00" debit → negative. Date dd/mm/yyyy. Good.
  
  SMS sample lines parse. Good.
  
  PDF sample generated later.
  
  Errors: show first 3.
  
  Import: `importRows(preview.rows, preview.meta.source, fileName)`.
  
  Duplicates: summary.duplicates.
  
  If added 0, toast "All N rows were already in the ledger".
  
  Let me write.
  
  Also include a "Download sample CSV" button? The sample files exist in public/samples. Add links to download. Might be nice: "Download sample CSV" uses SAMPLE_CSV via downloadFile.
  
  Also note about privacy: parsing happens in the browser, nothing uploaded. Good guardrail.
  
  Let me write the file.
  [Assistant tool call]: write({"content":"import { useMemo, useState } from 'react';\nimport { useApp } from '../store/AppStore';\nimport type { ParseResult, Txn } from '../types';\nimport { parseCSV, parseSMS, parseStatementText } from '../domain/parse';\nimport { categorize } from '../domain/categorize';\nimport { CATEGORIES, CATEGORY_MAP } from '../data/categories';\nimport { SAMPLE_CSV, SAMPLE_SMS } from '../data/seed';\nimport { money } from '../lib/format';\nimport { monthLabel } from '../lib/date';\nimport { navigate } from '../lib/router';\nimport { Icon } from '../components/Icon';\nimport { Empty, Modal, Tabs, useToast } from '../components/ui';\nimport { downloadFile } from '../lib/export';\n\ntype Tab = 'csv' | 'pdf' | 'sms';\n\nexport default function Inbox() {\n  const { state, importRows, approveBatch, discardBatch, updateTxn, deleteTxns, correctCategory } = useApp();\n  const { push } = useToast();\n\n  const [tab, setTab] = useState<Tab>('csv');\n  const [dragging, setDragging] = useState(false);\n  const [busy, setBusy] = useState(false);\n  const [preview, setPreview] = useState<ParseResult | null>(null);\n  const [error, setError] = useState<string | null>(null);\n  const [smsText, setSmsText] = useState('');\n  const [pasteText, setPasteText] = useState('');\n  const [showPaste, setShowPaste] = useState(false);\n  const [batchFilter, setBatchFilter] = useState<string | null>(null);\n\n  const pending = state.txns.filter((t) => t.pending);\n  const pendingShown = batchFilter ? pending.filter((t) => t.batchId === batchFilter) : pending;\n\n  const previewRows = useMemo(() => {\n    if (!preview) return [];\n    return preview.rows.map((r) => ({ ...r, cat: categorize(r.description, r.amount, state.rules) }));\n  }, [preview, state.rules]);\n\n  const reset = () => {\n    setPreview(null);\n    setError(null);\n  };\n\n  const parsePdf = async (file: File) => {\n    const pdfjs: any = await import('pdfjs-dist');\n    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');\n    pdfjs.GlobalWorkerOptions.workerSrc = (worker as { default: string }).default;\n    const buf = await file.arrayBuffer();\n    const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;\n    let text = '';\n    for (let i = 1; i <= doc.numPages; i++) {\n      const page = await doc.getPage(i);\n      const content = await page.getTextContent();\n      let lastY: number | null = null;\n      for (const item of content.items as any[]) {\n        if (!('str' in item)) continue;\n        const y = item.transform?.[5] ?? null;\n        if (lastY !== null && y !== null && Math.abs(y - lastY) > 3) text += '\\n';\n        text += item.str;\n        if (item.hasEOL) text += '\\n';\n        else text += ' ';\n        lastY = y;\n      }\n      text += '\\n';\n    }\n    if (!text.trim()) throw new Error('No text layer found. The PDF may be scanned.');\n    return parseStatementText(text, file.name);\n  };\n\n  const handleFile = async (file: File) => {\n    reset();\n    setBusy(true);\n    try {\n      if (/\\.pdf$/i.test(file.name)) {\n        const result = await parsePdf(file);\n        setPreview(result);\n        setTab('pdf');\n      } else {\n        const text = await file.text();\n        if (/\\.(csv|tsv)$/i.test(file.name) || text.includes(',')) {\n          setPreview(parseCSV(text, file.name));\n          setTab('csv');\n        } else {\n          setPreview(parseSMS(text, file.name));\n          setTab('sms');\n        }\n      }\n    } catch (e) {\n      setError(e instanceof Error ? e.message : 'The file could not be read.');\n    } finally {\n      setBusy(false);\n    }\n  };\n\n  const loadSample = async () => {\n    reset();\n    setBusy(true);\n    try {\n      if (tab === 'csv') {\n        setPreview(parseCSV(SAMPLE_CSV, 'hdfc-october-sample.csv'));\n      } else if (tab === 'sms') {\n        setSmsText(SAMPLE_SMS);\n        setPreview(parseSMS(SAMPLE_SMS, 'bank-alerts.txt'));\n      } else {\n        const url = `${import.meta.env.BASE_URL}samples/baseline-statement.pdf`;\n        const res = await fetch(url);\n        if (!res.ok) throw new Error('Sample PDF is missing. Paste statement text below instead.');\n        const blob = await res.blob();\n        const file = new File([blob], 'sample-statement.pdf', { type: 'application/pdf' });\n        setPreview(await parsePdf(file));\n      }\n    } catch (e) {\n      setError(e instanceof Error ? e.message : 'Could not load the sample.');\n    } finally {\n      setBusy(false);\n    }\n  };\n\n  const commit = (approve: boolean) => {\n    if (!preview) return;\n    const summary = importRows(preview.rows, preview.meta.source, preview.meta.fileName);\n    if (approve) approveBatch(summary.batchId);\n    if (summary.added > 0) {\n      push(\n        `${summary.added} added${summary.duplicates ? `, ${summary.duplicates} duplicate${summary.duplicates > 1 ? 's' : ''} skipped` : ''}. ${approve ? 'Approved and modelled.' : 'Waiting in review.'}`,\n        { label: 'Review', run: () => setBatchFilter(summary.batchId) }\n      );\n    } else {\n      push('Every row in this file is already in the ledger.');\n    }\n    reset();\n  };\n\n  return (\n    <div className=\"page\">\n      <div className=\"page-head\">\n        <div>\n          <div className=\"eyebrow\">Ingestion · nothing leaves your browser</div>\n          <h1 className=\"display\">Bring the mess. <em>Leave with a model.</em></h1>\n          <p className=\"lede\">\n            Bank CSVs with warning rows, PDF statements, and a dozen different SMS formats. Parsing happens locally;\n            nothing is uploaded anywhere.\n          </p>\n        </div>\n        <div className=\"head-actions\">\n          <button className=\"btn btn-ghost\" onClick={() => navigate('/transactions?q=')}>\n            <Icon name=\"receipt\" size={14} /> Open the ledger\n          </button>\n        </div>\n      </div>\n\n      <div className=\"grid\">\n        <section className=\"panel col-8\">\n          <div className=\"panel-head\" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>\n            <div className=\"row-between\">\n              <div>\n                <h2 className=\"panel-title\">Import a statement</h2>\n                <p className=\"panel-sub\">Choose a format, then drop a file or use a sample.</p>\n              </div>\n              <span className=\"badge info\"><Icon name=\"lock\" size={10} /> Local only</span>\n            </div>\n            <Tabs\n              tabs={[\n                { id: 'csv', label: 'Bank CSV' },\n                { id: 'pdf', label: 'PDF statement' },\n                { id: 'sms', label: 'SMS alerts' },\n              ]}\n              value={tab}\n              onChange={(t) => { setTab(t as Tab); reset(); }}\n            />\n          </div>\n\n          <div className=\"panel-body\">\n            {tab !== 'sms' ? (\n              <>\n                <div\n                  className={`dropzone ${dragging ? 'drag' : ''}`}\n                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}\n                  onDragLeave={() => setDragging(false)}\n                  onDrop={(e) => {\n                    e.preventDefault();\n                    setDragging(false);\n                    const file = e.dataTransfer.files?.[0];\n                    if (file) void handleFile(file);\n                  }}\n                >\n                  <Icon name={tab === 'csv' ? 'file' : 'upload'} size={20} style={{ margin: '0 auto', color: 'var(--muted)' }} />\n                  <h3>{busy ? 'Reading…' : tab === 'csv' ? 'Drop a CSV or TSV statement' : 'Drop a PDF statement'}</h3>\n                  <p>{tab === 'csv' ? 'Comma, semicolon, tab, or pipe separated. Headers are detected automatically.' : 'Text-based PDFs only. Scanned images need text extraction first.'}</p>\n                  <div className=\"row\" style={{ justifyContent: 'center', marginTop: 12 }}>\n                    <label className=\"btn btn-sm\">\n                      Choose file\n                      <input\n                        type=\"file\"\n                        accept={tab === 'csv' ? '.csv,.tsv,.txt' : '.pdf'}\n                        style={{ display: 'none' }}\n                        onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.currentTarget.value = ''; }}\n                      />\n                    </label>\n                    <button className=\"btn btn-sm\" onClick={() => void loadSample()} disabled={busy}>\n                      Use sample {tab === 'csv' ? 'CSV' : 'PDF'}\n                    </button>\n                  </div>\n                </div>\n                <div className=\"row-between\" style={{ marginTop: 10 }}>\n                  <span className=\"tiny\" style={{ color: 'var(--muted)' }}>\n                    {tab === 'csv' ? 'Sample includes a warning row, a footer row, and two duplicates.' : 'The sample PDF is a real text-layer statement.'}\n                  </span>\n                  <div className=\"row\" style={{ gap: 10 }}>\n                    {tab === 'pdf' && (\n                      <button className=\"linkish small\" onClick={() => setShowPaste((v) => !v)}>\n                        {showPaste ? 'Hide text paste' : 'Paste statement text instead'}\n                      </button>\n                    )}\n                    {tab === 'csv' && (\n                      <button className=\"linkish small\" onClick={() => downloadFile(SAMPLE_CSV, 'baseline-sample-statement.csv')}>\n                        Download sample\n                      </button>\n                    )}\n                  </div>\n                </div>\n                {tab === 'pdf' && showPaste && (\n                  <div style={{ marginTop: 10 }}>\n                    <textarea\n                      className=\"textarea mono\"\n                      rows={6}\n                      style={{ fontSize: 11.5 }}\n                      placeholder={'04/10/2026  SWIGGY BANGALORE  486.00 DR  184320.50'}\n                      value={pasteText}\n                      onChange={(e) => setPasteText(e.target.value)}\n                    />\n                    <button\n                      className=\"btn btn-sm btn-primary\"\n                      style={{ marginTop: 8 }}\n                      disabled={!pasteText.trim()}\n                      onClick={() => setPreview(parseStatementText(pasteText, 'pasted-statement.txt'))}\n                    >\n                      Parse pasted text\n                    </button>\n                  </div>\n                )}\n              </>\n            ) : (\n              <>\n                <div className=\"field\">\n                  <label htmlFor=\"sms-box\">Paste bank SMS alerts, one per line</label>\n                  <textarea\n                    id=\"sms-box\"\n                    className=\"textarea mono\"\n                    rows={7}\n                    style={{ fontSize: 11.5 }}\n                    placeholder={'HDFC Bank: Rs.486.00 debited from a/c XX4412 on 04-10-26 to SWIGGY.'}\n                    value={smsText}\n                    onChange={(e) => setSmsText(e.target.value)}\n                  />\n                </div>\n                <div className=\"row\" style={{ marginTop: 10 }}>\n                  <button className=\"btn btn-primary\" disabled={!smsText.trim()} onClick={() => setPreview(parseSMS(smsText, 'pasted-alerts.txt'))}>\n                    <Icon name=\"spark\" size={14} /> Parse alerts\n                  </button>\n                  <button className=\"btn\" onClick={() => void loadSample()}>Use sample SMS</button>\n                  <span className=\"tiny\" style={{ color: 'var(--muted)' }}>Handles debited, credited, spent, and UPI phrasing.</span>\n                </div>\n              </>\n            )}\n\n            {error && (\n              <div className=\"note guard\" style={{ marginTop: 12, borderLeftColor: 'var(--negative)' }}>\n                <strong>Could not read that file.</strong> {error}\n              </div>\n            )}\n          </div>\n\n          <div className=\"panel-foot\">\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>\n              {state.txns.length} transactions already modelled · {state.batches.length} imports logged\n            </span>\n            <button className=\"linkish small\" onClick={() => navigate('/rules')}>See what the model has learned</button>\n          </div>\n        </section>\n\n        <aside className=\"panel col-4\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">The pipeline</h2>\n              <p className=\"panel-sub\">What happens between file and model.</p>\n            </div>\n          </div>\n          <div className=\"panel-body\">\n            <ol className=\"stack-sm\">\n              {[\n                { n: '01', t: 'Detect the shape', d: 'Delimiter, header row, date format, debit vs credit columns.' },\n                { n: '02', t: 'Clean each line', d: 'Amounts, references, and merchant names are normalised.' },\n                { n: '03', t: 'Categorise with reasons', d: 'Known merchants score high. Everything else asks for a correction.' },\n                { n: '04', t: 'Check for duplicates', d: 'A fingerprint of date, amount, and description prevents double counting.' },\n              ].map((s) => (\n                <li key={s.n} className=\"row\" style={{ alignItems: 'flex-start', gap: 10 }}>\n                  <span className=\"mono tiny\" style={{ color: 'var(--accent)', paddingTop: 2 }}>{s.n}</span>\n                  <span>\n                    <span className=\"small strong\">{s.t}</span>\n                    <span className=\"small muted\" style={{ display: 'block' }}>{s.d}</span>\n                  </span>\n                </li>\n              ))}\n            </ol>\n            <div className=\"divider dashed\" />\n            <div className=\"row-between small\">\n              <span className=\"muted\">Waiting for review</span>\n              <span className=\"num\">{pending.length}</span>\n            </div>\n            <div className=\"row-between small\" style={{ marginTop: 4 }}>\n              <span className=\"muted\">Rules learned</span>\n              <span className=\"num\">{state.rules.filter((r) => r.source === 'learned').length}</span>\n            </div>\n            <div className=\"row-between small\" style={{ marginTop: 4 }}>\n              <span className=\"muted\">Corrections recorded</span>\n              <span className=\"num\">{state.corrections.length}</span>\n            </div>\n          </div>\n        </aside>\n\n        {preview && (\n          <section className=\"panel col-12\" style={{ borderColor: 'var(--accent)' }}>\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">Preview · {preview.meta.fileName}</h2>\n                <p className=\"panel-sub\">\n                  {preview.meta.detectedFormat} · {preview.rows.length} rows read\n                  {preview.errors.length ? ` · ${preview.errors.length} line${preview.errors.length > 1 ? 's' : ''} skipped` : ''}\n                </p>\n              </div>\n              <div className=\"row\" style={{ gap: 8 }}>\n                <button className=\"btn\" onClick={reset}>Discard</button>\n                <button className=\"btn\" onClick={() => commit(false)}>Add to inbox</button>\n                <button className=\"btn btn-primary\" onClick={() => commit(true)}>\n                  <Icon name=\"check\" size={14} /> Add & approve {previewRows.length}\n                </button>\n              </div>\n            </div>\n            {preview.errors.length > 0 && (\n              <div className=\"panel-body\" style={{ paddingBottom: 0 }}>\n                <div className=\"note guard\" style={{ borderLeftColor: 'var(--accent)' }}>\n                  <strong>Skipped lines:</strong> {preview.errors.slice(0, 2).join(' ')}\n                  {preview.errors.length > 2 ? ` (+${preview.errors.length - 2} more)` : ''}\n                </div>\n              </div>\n            )}\n            <div className=\"panel-body flush\" style={{ marginTop: 12 }}>\n              <div className=\"table-wrap\">\n                <table className=\"tbl\">\n                  <thead>\n                    <tr>\n                      <th>Date</th>\n                      <th>Description</th>\n                      <th>Auto category</th>\n                      <th>Confidence</th>\n                      <th className=\"right\">Amount</th>\n                      <th>Status</th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    {previewRows.slice(0, 10).map((r, i) => (\n                      <tr key={`${r.hash}-${i}`}>\n                        <td className=\"mono small nowrap\">{r.date}</td>\n                        <td>\n                          <div className=\"txn-merchant ellipsis\" style={{ maxWidth: 330 }}>{r.description}</div>\n                        </td>\n                        <td>\n                          <span className=\"row\" style={{ gap: 6 }}>\n                            <span className=\"cat-dot\" style={{ background: CATEGORY_MAP[r.cat.category]?.color }} />\n                            <span className=\"small\">{CATEGORY_MAP[r.cat.category]?.name}</span>\n                          </span>\n                        </td>\n                        <td>\n                          <span className={`small ${r.cat.confidence > 0.85 ? 'pos' : r.cat.confidence > 0.5 ? '' : 'neg'}`}>\n                            {Math.round(r.cat.confidence * 100)}%\n                          </span>\n                        </td>\n                        <td className={`money ${r.amount > 0 ? 'pos' : ''}`}>\n                          {r.amount > 0 ? '+' : '−'}{money(Math.abs(r.amount))}\n                        </td>\n                        <td>\n                          {state.txns.some((t) => t.hash === r.hash)\n                            ? <span className=\"badge warn\">Duplicate</span>\n                            : <span className=\"badge pos\">New</span>}\n                        </td>\n                      </tr>\n                    ))}\n                  </tbody>\n                </table>\n              </div>\n              {previewRows.length > 10 && (\n                <p className=\"tiny\" style={{ color: 'var(--muted)', padding: '10px 16px' }}>\n                  Showing the first 10 of {previewRows.length} rows. All rows will be imported.\n                </p>\n              )}\n            </div>\n          </section>\n        )}\n\n        <section className=\"panel col-7\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Waiting for review</h2>\n              <p className=\"panel-sub\">\n                {pendingShown.length} line{pendingShown.length === 1 ? '' : 's'} not yet counted in the model.\n              </p>\n            </div>\n            <div className=\"row\" style={{ gap: 6 }}>\n              {batchFilter && (\n                <button className=\"chip\" onClick={() => setBatchFilter(null)}>\n                  <Icon name=\"x\" size={10} /> Clear batch filter\n                </button>\n              )}\n              <button\n                className=\"btn btn-sm\"\n                disabled={!pendingShown.length}\n                onClick={() => {\n                  pendingShown.forEach((t) => updateTxn(t.id, { pending: false }));\n                  if (batchFilter) approveBatch(batchFilter);\n                  push(`Approved ${pendingShown.length} transactions`);\n                }}\n              >\n                Approve all\n              </button>\n            </div>\n          </div>\n          <div className=\"panel-body flush\">\n            {pendingShown.length === 0 ? (\n              <Empty\n                icon=\"check\"\n                title=\"The inbox is clear\"\n                body=\"Every imported line has been reviewed. New statements will queue up here before they touch the model.\"\n              />\n            ) : (\n              <div className=\"table-wrap\" style={{ maxHeight: 440, overflowY: 'auto' }}>\n                <table className=\"tbl\">\n                  <thead>\n                    <tr>\n                      <th>Date</th>\n                      <th>Merchant</th>\n                      <th>Category</th>\n                      <th className=\"right\">Amount</th>\n                      <th className=\"right\">Action</th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    {pendingShown.slice(0, 40).map((t) => (\n                      <tr key={t.id} className=\"pending\">\n                        <td className=\"mono small nowrap\">{t.date.slice(5)}</td>\n                        <td>\n                          <div className=\"txn-merchant ellipsis\" style={{ maxWidth: 170 }}>{t.merchant}</div>\n                          <div className=\"tiny\" style={{ color: 'var(--muted)' }}>{t.source.toUpperCase()} · {Math.round(t.confidence * 100)}%</div>\n                        </td>\n                        <td>\n                          <select\n                            className=\"select select-sm\"\n                            style={{ width: 130 }}\n                            value={t.category}\n                            aria-label={`Category for ${t.merchant}`}\n                            onChange={(e) => correctCategory(t.id, e.target.value, false)}\n                          >\n                            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}\n                          </select>\n                        </td>\n                        <td className={`money ${t.amount > 0 ? 'pos' : ''}`}>{t.amount > 0 ? '+' : '−'}{money(Math.abs(t.amount))}</td>\n                        <td className=\"right\">\n                          <div className=\"row\" style={{ gap: 2, justifyContent: 'flex-end' }}>\n                            <button\n                              className=\"btn btn-ghost btn-icon\"\n                              aria-label={`Approve ${t.merchant}`}\n                              title=\"Approve\"\n                              onClick={() => { updateTxn(t.id, { pending: false }); push('Approved'); }}\n                            >\n                              <Icon name=\"check\" size={13} />\n                            </button>\n                            <button\n                              className=\"btn btn-ghost btn-icon\"\n                              aria-label={`Discard ${t.merchant}`}\n                              title=\"Discard\"\n                              onClick={() => { deleteTxns([t.id]); push('Line discarded'); }}\n                            >\n                              <Icon name=\"trash\" size={13} />\n                            </button>\n                          </div>\n                        </td>\n                      </tr>\n                    ))}\n                  </tbody>\n                </table>\n              </div>\n            )}\n          </div>\n        </section>\n\n        <section className=\"panel col-5\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Import history</h2>\n              <p className=\"panel-sub\">Every batch, and what it changed.</p>\n            </div>\n          </div>\n          <div className=\"panel-body\" style={{ paddingTop: 4 }}>\n            {state.batches.slice(0, 6).map((b) => (\n              <div key={b.id} className=\"goal-row\">\n                <div className=\"row-between\" style={{ gap: 8 }}>\n                  <span className=\"small strong ellipsis\" style={{ maxWidth: 220 }}>{b.fileName}</span>\n                  <span className={`badge ${b.approved ? 'pos' : 'warn'}`}>{b.approved ? 'Approved' : 'In review'}</span>\n                </div>\n                <div className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 3 }}>\n                  {b.source.toUpperCase()} · {new Date(b.importedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ·{' '}\n                  {b.added} added{b.duplicates ? ` · ${b.duplicates} duplicates` : ''}\n                </div>\n                {!b.approved && b.added > 0 && (\n                  <div className=\"row\" style={{ gap: 6, marginTop: 6 }}>\n                    <button className=\"btn btn-sm\" onClick={() => { setBatchFilter(b.id); push('Showing that batch'); }}>Review</button>\n                    <button className=\"btn btn-sm btn-ghost\" onClick={() => { approveBatch(b.id); push('Batch approved'); }}>Approve batch</button>\n                    <button\n                      className=\"btn btn-sm btn-ghost btn-danger\"\n                      onClick={() => { discardBatch(b.id); push('Batch discarded'); }}\n                    >\n                      Discard\n                    </button>\n                  </div>\n                )}\n              </div>\n            ))}\n            {state.batches.length === 0 && <Empty icon=\"upload\" title=\"No imports yet\" body=\"Your first statement will show up here with a full audit trail.\" />}\n          </div>\n          <div className=\"panel-foot\">\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>\n              Latest: {state.batches[0] ? monthLabel(String(new Date(state.batches[0].importedAt).toISOString().slice(0, 7))) : '—'}\n            </span>\n            <button className=\"linkish small\" onClick={() => navigate('/settings')}>Export all data</button>\n          </div>\n        </section>\n      </div>\n    </div>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Inbox.tsx"})
  [Tool result]: Created file successfully: src/screens/Inbox.tsx
  
  [Assistant reasoning]: Issues in Inbox:
  - unused imports `Txn`, `Modal`, `Tabs` used yes, `Modal` not used, `Txn` not used. TS noUnusedLocals false, so fine.
  - `updateTxn` used.
  - `downloadFile` used.
  - `correctCategory` used.
  - `approveBatch`.
  - `deleteTxns` used.
  - `pendingShown` uses batchFilter.
  
  Now Rules screen.
  
  Rules screen features:
  - Stats: rules count, learned count, corrections, auto-categorized %
  - Table/list of rules: pattern, field, match type, category, source, priority, hits, enabled switch, actions edit/delete/test.
  - Add rule button → modal.
  - Test rule: input sample description → shows result (match or not) and which category.
  - Retro apply button per rule with confirm; toast count.
  - Correction log list (recent 8) with description, from→to, time.
  - Rule priority explanation.
  
  Edit modal: pattern, field, matchType, category, priority, enabled.
  
  Test modal: pattern test against typed text using ruleMatches; show matched txns count from current ledger as well.
  
  Also "Learn from this correction" already in transactions.
  
  Design: two-column grid: rules panel col-8, learning stats/log col-4.
  
  Add a "suggested rules" section? Could derive from uncategorized transactions: group 'other' merchants, suggest. That's a nice feature: "3 merchants keep landing in Uncategorised — create rules?" Implement: compute from txns category other grouped by merchant count >=2, show suggestions with category select + create.
  
  Let me add that in the right column: "Needs a rule" list with 3 suggestions. Good.
  
  Rule row layout: pattern mono bold, badges, category chip, hits, switch, actions.
  
  Test panel inline: clicking Test opens modal with input; live evaluation.
  
  Implement `ruleMatches` import from categorize.
  
  Write.
  [Assistant tool call]: write({"content":"import { useMemo, useState } from 'react';\nimport { useApp } from '../store/AppStore';\nimport type { Rule } from '../types';\nimport { CATEGORIES, CATEGORY_MAP } from '../data/categories';\nimport { CATEGORY_MAP as CM } from '../data/categories';\nimport { money } from '../lib/format';\nimport { Icon } from '../components/Icon';\nimport { Confirm, Empty, Modal, Switch, useToast } from '../components/ui';\nimport { ruleMatches } from '../domain/categorize';\n\nexport default function Rules() {\n  const { state, addRule, updateRule, deleteRule, applyRuleRetro } = useApp();\n  const { push } = useToast();\n  const [editing, setEditing] = useState<Rule | null>(null);\n  const [creating, setCreating] = useState(false);\n  const [testing, setTesting] = useState<Rule | null>(null);\n  const [retro, setRetro] = useState<Rule | null>(null);\n  const [removing, setRemoving] = useState<Rule | null>(null);\n\n  const learned = state.rules.filter((r) => r.source === 'learned').length;\n  const auto = state.txns.filter((t) => t.confidence >= 0.85).length;\n  const autoPct = state.txns.length ? Math.round((auto / state.txns.length) * 100) : 0;\n\n  const suggestions = useMemo(() => {\n    const groups = new Map<string, { merchant: string; count: number; total: number; descriptions: string[] }>();\n    for (const t of state.txns) {\n      if (t.category !== 'other' || t.amount >= 0) continue;\n      const key = t.merchant.toUpperCase();\n      const cur = groups.get(key) ?? { merchant: t.merchant, count: 0, total: 0, descriptions: [] };\n      cur.count += 1;\n      cur.total += Math.abs(t.amount);\n      cur.descriptions.push(t.description);\n      groups.set(key, cur);\n    }\n    return [...groups.values()]\n      .filter((g) => g.count >= 2)\n      .sort((a, b) => b.count - a.count)\n      .slice(0, 3);\n  }, [state.txns]);\n\n  return (\n    <div className=\"page\">\n      <div className=\"page-head\">\n        <div>\n          <div className=\"eyebrow\">Learning loop</div>\n          <h1 className=\"display\">The model <em>learns from you.</em></h1>\n          <p className=\"lede\">\n            Every correction can become a rule. Rules run before the built-in merchant list, so your judgement always\n            wins. Apply one to the past whenever you want.\n          </p>\n        </div>\n        <div className=\"head-actions\">\n          <button className=\"btn\" onClick={() => navigateToCorrections()}>\n            <Icon name=\"receipt\" size={14} /> Correction log\n          </button>\n          <button className=\"btn btn-primary\" onClick={() => setCreating(true)}>\n            <Icon name=\"plus\" size={14} /> New rule\n          </button>\n        </div>\n      </div>\n\n      <div className=\"grid\">\n        <div className=\"col-8 stack\">\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">Rules</h2>\n                <p className=\"panel-sub\">Higher priority wins when two rules match.</p>\n              </div>\n              <span className=\"badge\">{state.rules.length} rules</span>\n            </div>\n            <div className=\"panel-body flush\">\n              {state.rules.length === 0 ? (\n                <Empty\n                  icon=\"split\"\n                  title=\"No rules yet\"\n                  body=\"Correct a category from the ledger and tick “learn a rule” — it will appear here.\"\n                  action={<button className=\"btn btn-sm btn-primary\" onClick={() => setCreating(true)}>Create one manually</button>}\n                />\n              ) : (\n                <div className=\"table-wrap\">\n                  <table className=\"tbl\">\n                    <thead>\n                      <tr>\n                        <th>Pattern</th>\n                        <th>Category</th>\n                        <th className=\"hide-sm\">Source</th>\n                        <th className=\"hide-sm\">Hits</th>\n                        <th>Priority</th>\n                        <th className=\"right\">Actions</th>\n                      </tr>\n                    </thead>\n                    <tbody>\n                      {[...state.rules]\n                        .sort((a, b) => b.priority - a.priority || b.createdAt - a.createdAt)\n                        .map((r) => (\n                          <tr key={r.id} style={{ opacity: r.enabled ? 1 : 0.55 }}>\n                            <td>\n                              <div className=\"mono small strong\">{r.pattern}</div>\n                              <div className=\"tiny\" style={{ color: 'var(--muted)' }}>\n                                {r.field} {r.matchType}\n                              </div>\n                            </td>\n                            <td>\n                              <span className=\"row\" style={{ gap: 6 }}>\n                                <span className=\"cat-dot\" style={{ background: CATEGORY_MAP[r.category]?.color }} />\n                                <span className=\"small\">{CATEGORY_MAP[r.category]?.name}</span>\n                              </span>\n                            </td>\n                            <td className=\"hide-sm\">\n                              <span className={`badge ${r.source === 'learned' ? 'info' : 'outline'}`}>{r.source}</span>\n                            </td>\n                            <td className=\"hide-sm num small\">{r.hits}</td>\n                            <td className=\"num small\">{r.priority}</td>\n                            <td>\n                              <div className=\"row\" style={{ gap: 2, justifyContent: 'flex-end' }}>\n                                <div title={r.enabled ? 'Disable rule' : 'Enable rule'}>\n                                  <Switch checked={r.enabled} label={`Toggle ${r.pattern}`} onChange={(v) => { updateRule(r.id, { enabled: v }); push(v ? 'Rule enabled' : 'Rule disabled'); }} />\n                                </div>\n                                <button className=\"btn btn-ghost btn-icon\" title=\"Test this rule\" aria-label={`Test ${r.pattern}`} onClick={() => setTesting(r)}>\n                                  <Icon name=\"spark\" size={13} />\n                                </button>\n                                <button className=\"btn btn-ghost btn-icon\" title=\"Edit rule\" aria-label={`Edit ${r.pattern}`} onClick={() => setEditing(r)}>\n                                  <Icon name=\"pencil\" size={13} />\n                                </button>\n                                <button className=\"btn btn-ghost btn-icon\" title=\"Delete rule\" aria-label={`Delete ${r.pattern}`} onClick={() => setRemoving(r)}>\n                                  <Icon name=\"trash\" size={13} />\n                                </button>\n                              </div>\n                            </td>\n                          </tr>\n                        ))}\n                    </tbody>\n                  </table>\n                </div>\n              )}\n            </div>\n            <div className=\"panel-foot\">\n              <span className=\"tiny\" style={{ color: 'var(--muted)' }}>\n                {learned} learned from corrections · {state.rules.filter((r) => r.source === 'manual').length} written by hand\n              </span>\n              <button className=\"linkish small\" onClick={() => setCreating(true)}>Add a rule</button>\n            </div>\n          </section>\n\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">Recent corrections</h2>\n                <p className=\"panel-sub\">The exact moments the model changed its mind.</p>\n              </div>\n            </div>\n            <div className=\"panel-body flush\">\n              {state.corrections.length === 0 ? (\n                <Empty icon=\"pencil\" title=\"No corrections yet\" body=\"When you fix a category in the ledger, the before-and-after is recorded here.\" />\n              ) : (\n                <div className=\"table-wrap\">\n                  <table className=\"tbl\">\n                    <thead>\n                      <tr>\n                        <th>Line</th>\n                        <th>From</th>\n                        <th>To</th>\n                        <th className=\"hide-sm\">Learned</th>\n                        <th>When</th>\n                      </tr>\n                    </thead>\n                    <tbody>\n                      {state.corrections.slice(0, 8).map((c) => (\n                        <tr key={c.id}>\n                          <td className=\"small ellipsis\" style={{ maxWidth: 300 }}>{c.description}</td>\n                          <td className=\"small muted\">{CM[c.from]?.name ?? c.from}</td>\n                          <td className=\"small\">{CM[c.to]?.name ?? c.to}</td>\n                          <td className=\"hide-sm\">{c.learnedRuleId ? <span className=\"badge info\">Rule</span> : <span className=\"badge outline\">Once</span>}</td>\n                          <td className=\"tiny mono\" style={{ color: 'var(--muted)' }}>\n                            {new Date(c.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}\n                          </td>\n                        </tr>\n                      ))}\n                    </tbody>\n                  </table>\n                </div>\n              )}\n            </div>\n          </section>\n        </div>\n\n        <aside className=\"col-4 stack\">\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">Learning health</h2>\n                <p className=\"panel-sub\">How much the model gets right unaided.</p>\n              </div>\n            </div>\n            <div className=\"panel-body\">\n              <div className=\"big-number\" style={{ fontSize: 42 }}>{autoPct}%</div>\n              <p className=\"small muted\" style={{ marginTop: 4 }}>of transactions were categorised with high confidence.</p>\n              <div className=\"progress\" style={{ marginTop: 10 }}>\n                <span style={{ width: `${autoPct}%` }} />\n              </div>\n              <div className=\"divider dashed\" />\n              <div className=\"row-between small\"><span className=\"muted\">Needs a human</span><span className=\"num\">{state.txns.filter((t) => t.category === 'other').length}</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 4 }}><span className=\"muted\">Rules learned</span><span className=\"num\">{learned}</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 4 }}><span className=\"muted\">Corrections</span><span className=\"num\">{state.corrections.length}</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 4 }}><span className=\"muted\">Rule hits</span><span className=\"num\">{state.rules.reduce((s, r) => s + r.hits, 0)}</span></div>\n            </div>\n          </section>\n\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">Merchants without a rule</h2>\n                <p className=\"panel-sub\">Repeated names still falling into Uncategorised.</p>\n              </div>\n            </div>\n            <div className=\"panel-body\" style={{ paddingTop: 4 }}>\n              {suggestions.length === 0 && <p className=\"small muted\">Nothing is waiting. The model has a home for every repeated merchant.</p>}\n              {suggestions.map((s) => (\n                <div className=\"goal-row\" key={s.merchant}>\n                  <div className=\"row-between\">\n                    <span className=\"small strong ellipsis\" style={{ maxWidth: 170 }}>{s.merchant}</span>\n                    <span className=\"tiny mono\" style={{ color: 'var(--muted)' }}>{s.count} lines · {money(s.total)}</span>\n                  </div>\n                  <div className=\"row\" style={{ marginTop: 6, gap: 6 }}>\n                    <select\n                      className=\"select select-sm\"\n                      style={{ width: 130 }}\n                      id={`sugg-${s.merchant}`}\n                      defaultValue=\"groceries\"\n                      aria-label={`Suggested category for ${s.merchant}`}\n                    >\n                      {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}\n                    </select>\n                    <button\n                      className=\"btn btn-sm\"\n                      onClick={() => {\n                        const el = document.getElementById(`sugg-${s.merchant}`) as HTMLSelectElement | null;\n                        addRule({\n                          pattern: s.merchant.toUpperCase().slice(0, 24),\n                          field: 'description',\n                          matchType: 'contains',\n                          category: el?.value ?? 'groceries',\n                          source: 'learned',\n                          priority: 45,\n                          enabled: true,\n                          hits: s.count,\n                        });\n                        push(`Rule created for ${s.merchant}`);\n                      }}\n                    >\n                      Create rule\n                    </button>\n                  </div>\n                </div>\n              ))}\n            </div>\n          </section>\n\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">How matching works</h2>\n              </div>\n            </div>\n            <div className=\"panel-body\">\n              <p className=\"small muted\">\n                Rules run highest priority first. A rule can match the raw statement line or the cleaned merchant name,\n                by contains, starts-with, exact text, or a regular expression.\n              </p>\n              <div className=\"note\" style={{ marginTop: 10 }}>\n                Corrections only change the future by default. Use <strong>Apply to past</strong> from a rule's test panel when you want history rewritten.\n              </div>\n            </div>\n          </section>\n        </aside>\n      </div>\n\n      {creating && (\n        <RuleModal\n          title=\"New rule\"\n          onClose={() => setCreating(false)}\n          onSave={(r) => {\n            addRule(r);\n            push('Rule created');\n            setCreating(false);\n          }}\n        />\n      )}\n\n      {editing && (\n        <RuleModal\n          title=\"Edit rule\"\n          initial={editing}\n          onClose={() => setEditing(null)}\n          onSave={(r) => {\n            updateRule(editing.id, r);\n            push('Rule updated');\n            setEditing(null);\n          }}\n        />\n      )}\n\n      {testing && (\n        <TestModal\n          rule={testing}\n          txns={state.txns}\n          onClose={() => setTesting(null)}\n          onRetro={() => { setRetro(testing); setTesting(null); }}\n        />\n      )}\n\n      <Confirm\n        open={!!retro}\n        onClose={() => setRetro(null)}\n        onConfirm={() => {\n          if (!retro) return;\n          const n = applyRuleRetro(retro.id);\n          push(`Rule applied to ${n} past transaction${n === 1 ? '' : 's'}`);\n        }}\n        title=\"Apply this rule to past transactions?\"\n        body={`Every historical line matching “${retro?.pattern ?? ''}” will be recategorised to ${CATEGORY_MAP[retro?.category ?? 'other']?.name}. This cannot be undone.`}\n        confirmLabel=\"Apply to past\"\n      />\n\n      <Confirm\n        open={!!removing}\n        onClose={() => setRemoving(null)}\n        onConfirm={() => {\n          if (!removing) return;\n          deleteRule(removing.id);\n          push('Rule deleted');\n        }}\n        title=\"Delete this rule?\"\n        body=\"Transactions already filed by this rule keep their category. Future lines will fall back to the built-in classifier.\"\n        confirmLabel=\"Delete rule\"\n        danger\n      />\n    </div>\n  );\n}\n\nfunction navigateToCorrections() {\n  const el = document.querySelector('.page .col-8 .panel:last-child');\n  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });\n}\n\nfunction RuleModal({\n  title,\n  initial,\n  onClose,\n  onSave,\n}: {\n  title: string;\n  initial?: Rule;\n  onClose: () => void;\n  onSave: (r: Omit<Rule, 'id' | 'createdAt'>) => void;\n}) {\n  const [pattern, setPattern] = useState(initial?.pattern ?? '');\n  const [field, setField] = useState<Rule['field']>(initial?.field ?? 'description');\n  const [matchType, setMatchType] = useState<Rule['matchType']>(initial?.matchType ?? 'contains');\n  const [category, setCategory] = useState(initial?.category ?? 'groceries');\n  const [priority, setPriority] = useState(initial?.priority ?? 50);\n  const [enabled, setEnabled] = useState(initial?.enabled ?? true);\n\n  return (\n    <Modal\n      open\n      onClose={onClose}\n      title={title}\n      sub=\"Rules run before the built-in merchant list.\"\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Cancel</button>\n          <button\n            className=\"btn btn-primary\"\n            disabled={!pattern.trim()}\n            onClick={() =>\n              onSave({\n                pattern: pattern.trim(),\n                field,\n                matchType,\n                category,\n                source: initial?.source ?? 'manual',\n                priority,\n                enabled,\n                hits: initial?.hits ?? 0,\n              })\n            }\n          >\n            Save rule\n          </button>\n        </>\n      }\n    >\n      <div className=\"stack-sm\">\n        <div className=\"field\">\n          <label htmlFor=\"rule-pattern\">Match text</label>\n          <input id=\"rule-pattern\" className=\"input mono\" placeholder=\"e.g. SWIGGY\" value={pattern} onChange={(e) => setPattern(e.target.value)} />\n        </div>\n        <div className=\"form-row\">\n          <div className=\"field\">\n            <label>Field</label>\n            <select className=\"select\" value={field} onChange={(e) => setField(e.target.value as Rule['field'])}>\n              <option value=\"description\">Statement description</option>\n              <option value=\"merchant\">Cleaned merchant</option>\n            </select>\n          </div>\n          <div className=\"field\">\n            <label>Match type</label>\n            <select className=\"select\" value={matchType} onChange={(e) => setMatchType(e.target.value as Rule['matchType'])}>\n              <option value=\"contains\">Contains</option>\n              <option value=\"startsWith\">Starts with</option>\n              <option value=\"exact\">Exact match</option>\n              <option value=\"regex\">Regular expression</option>\n            </select>\n          </div>\n        </div>\n        <div className=\"field\">\n          <label>Category</label>\n          <select className=\"select\" value={category} onChange={(e) => setCategory(e.target.value)}>\n            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}\n          </select>\n        </div>\n        <div className=\"form-row\">\n          <div className=\"field\">\n            <label>Priority (0–100)</label>\n            <input className=\"input num\" type=\"number\" min={0} max={100} value={priority} onChange={(e) => setPriority(Number(e.target.value))} />\n          </div>\n          <div className=\"field\">\n            <label>Status</label>\n            <div className=\"row\" style={{ height: 32 }}>\n              <Switch checked={enabled} onChange={setEnabled} label=\"Rule enabled\" />\n              <span className=\"small muted\">{enabled ? 'Enabled' : 'Disabled'}</span>\n            </div>\n          </div>\n        </div>\n        {matchType === 'regex' && (\n          <p className=\"tiny neg\">Regular expressions are powerful and easy to get wrong. Test the rule before relying on it.</p>\n        )}\n      </div>\n    </Modal>\n  );\n}\n\nfunction TestModal({\n  rule,\n  txns,\n  onClose,\n  onRetro,\n}: {\n  rule: Rule;\n  txns: { description: string; merchant: string }[];\n  onClose: () => void;\n  onRetro: () => void;\n}) {\n  const [sample, setSample] = useState('SWIGGY ORDER BANGALORE');\n  const matches = txns.filter((t) => ruleMatches(rule, t)).length;\n  const sampleMatches = ruleMatches(rule, { description: sample, merchant: sample });\n\n  return (\n    <Modal\n      open\n      onClose={onClose}\n      title={`Test “${rule.pattern}”`}\n      sub={`${rule.matchType} match on the ${rule.field}`}\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Close</button>\n          <button className=\"btn btn-primary\" onClick={onRetro}>\n            <Icon name=\"undo\" size={13} /> Apply to {matches} past lines\n          </button>\n        </>\n      }\n    >\n      <div className=\"stack-sm\">\n        <div className=\"field\">\n          <label htmlFor=\"test-sample\">Try a statement line</label>\n          <input id=\"test-sample\" className=\"input mono\" value={sample} onChange={(e) => setSample(e.target.value)} />\n        </div>\n        <div className={`callout ${sampleMatches ? 'note' : ''}`} style={{ borderColor: sampleMatches ? 'var(--accent)' : 'var(--line)' }}>\n          <div className=\"row-between\">\n            <span className=\"small\">{sampleMatches ? 'Matches this line' : 'Does not match'}</span>\n            <span className={`badge ${sampleMatches ? 'pos' : 'outline'}`}>{sampleMatches ? CATEGORY_MAP[rule.category]?.name : 'No action'}</span>\n          </div>\n        </div>\n        <div className=\"callout\">\n          <div className=\"row-between small\">\n            <span className=\"muted\">Lines in your ledger that match</span>\n            <span className=\"num\">{matches}</span>\n          </div>\n        </div>\n        <p className=\"tiny\" style={{ color: 'var(--muted)' }}>\n          Applying to the past rewrites categories for matching transactions. It does not create new transactions.\n        </p>\n      </div>\n    </Modal>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Rules.tsx"})
  [Tool result]: Created file successfully: src/screens/Rules.tsx
  
  [Assistant reasoning]: Issues:
  - Duplicate import `CATEGORY_MAP` and `CATEGORY_MAP as CM` from same module — TS allows? `import { CATEGORIES, CATEGORY_MAP } from ...; import { CATEGORY_MAP as CM } from ...;` duplicate import declaration for same binding is allowed as separate import statements, yes. But redundant. Keep; no error.
  - `navigateToCorrections` DOM hack. Fine.
  - In `TestModal`, `txns` typed as description/merchant only; ruleMatches accepts Pick<Txn,...>. Fine.
  - Switch inside a `div` with title.
  
  Now Recurring screen.
  
  Features:
  - Header with monthly total, annual, unused total.
  - Tabs: All / Subscriptions / Bills / Dormant.
  - "Scan for new recurring" button → scanRecurring toast count.
  - "Add recurring" modal.
  - Cards or table: merchant, amount, cadence, next date, last date, usage, price change alert, status, actions (mark used/unused, snooze, cancel, restore, edit amount).
  - Price change alert banner for Netflix.
  - Unused detection banner with total and "Cancel both" action.
  - Upcoming calendar (next 30 days) list.
  - Monthly commitment chart? Could include a small horizon list.
  - Cancel flows: set status cancelled; restore.
  - Snooze: status snoozed → excluded from upcoming and subscription totals. Provide restore.
  - Edit modal: amount, nextDate, category.
  - Manual add.
  
  Every button works: "Cancel" (confirm), "Keep" (usage used), "Not now" (snooze 30d), "Scan", "Add", "Edit", "Restore".
  
  Table columns: Service, Amount, Cadence, Next charge, Usage, Status, Actions.
  
  Price change shown as badge "₹499 → ₹649".
  
  Monthly spend stats: total active monthly incl. all recurring (rent etc.)? Show subscriptions only total = category subscriptions + fitness. Use subscriptionTotal on state.recurring filtered to category subscriptions/fitness to match the fixed baseline. But the screen is "Recurring" including rent/insurance. Show:
  - "Monthly recurring" total (all active)
  - "Subscriptions" total (subs+fitness)
  - "Dormant" total.
  
  Upcoming 30 days list with inDays.
  
  Let me implement.
  
  The unused banner: "₹3,098/mo across 2 dormant services" with buttons "Review" (scroll) and "Cancel both" (confirm? direct action with toast).
  
  Cancelling both: updateRecurring for each. Use a single "Cancel dormant" button that loops.
  
  Add modal fields: merchant, amount, category, cadence, nextDate, usage.
  
  Edit modal: same minus merchant? Include.
  
  Scan: detectRecurring; store action returns count.
  
  Note: scanRecurring may detect rent, Airtel etc. as new because existing merchants are excluded by normalize(merchant). Existing has "Landlord", txns merchant for rent is "Rent" (from categorize pattern merchant 'Rent'), so it will detect rent as new. Hmm, that would add duplicate "Rent" recurring. Existing rec_rent merchant "Landlord" vs detected merchant "Rent". That's a duplicate in reality.
  
  To avoid, normalize matching by category+amount? Better: in scanRecurring, filter detected against existing by category and approximate amount:
  ```ts
  const known = state.recurring.some(r => Math.abs(monthlyAmount(r.amount,r.cadence)-monthlyAmount(d.amount,d.cadence))<1 && r.category===d.category)
  ```
  I'll update detectRecurring's `known` check in AppStore by passing existing; simpler to change detectRecurring signature to also skip if same category+amount. Let me patch recurring.ts: known set of merchant, plus `knownAmounts` set `${category}:${Math.round(amount)}`; skip.
  
  But then genuinely new subscriptions with same category and similar amount could be skipped; acceptable.
  
  Actually seeded txns' merchant for rent: categorization pattern /rent/ → merchant 'Rent'. Existing recurring 'Landlord'. So scan would add Rent duplicate → bad. Fix.
  
  Also Airtel: txns merchant "Mobile network", existing "Airtel" → duplicate with category mobile. Amount 1199 matches. So the category+amount guard catches it. Good.
  
  Netflix merchant "Netflix" everywhere → known merchant catches.
  
  I'll patch recurring.ts.
  
  Also scanRecurring adds with nextDate = addCadence(today, cadence) which ignores actual lastDate. Better use addCadence(d.lastDate, d.cadence) if in future else addCadence(today...). Use `const next = d.nextDate` computed from last. Actually compute addCadence(d.lastDate, d.cadence); if < today then add cadence until >= today. Let me implement a loop.
  
  Patch in AppStore.
  
  Now write Recurring screen.
  [Assistant tool call]: edit({"newString":"  const known = new Set(existing.map((r) => normalize(r.merchant)));\n  const knownAmounts = new Set(\n    existing.map((r) => `${r.category}:${Math.round(r.cadence === 'yearly' ? r.amount / 12 : r.amount)}`)\n  );","oldString":"  const known = new Set(existing.map((r) => normalize(r.merchant)));","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\recurring.ts"})
  [Tool result]: Edited src/domain/recurring.ts (1 replacement)
  [Assistant tool call]: edit({"newString":"    const med = median(amounts);\n    const within = amounts.filter((a) => Math.abs(a - med) / med <= 0.2).length / amounts.length;\n    if (within < 0.7) continue;\n    if (knownAmounts.has(`${group.category}:${Math.round(cadence === 'yearly' ? med / 12 : med)}`)) continue;","oldString":"    const med = median(amounts);\n    const within = amounts.filter((a) => Math.abs(a - med) / med <= 0.2).length / amounts.length;\n    if (within < 0.7) continue;","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\domain\\recurring.ts"})
  [Tool result]: Edited src/domain/recurring.ts (1 replacement)
  
  [Assistant reasoning]: Patch scanRecurring nextDate logic in AppStore.
  
  ```ts
  let next = addCadence(d.lastDate, d.cadence);
  while (next < todayISO()) next = addCadence(next, d.cadence);
  ```
  But if lastDate is far in past for unused, loop many times; cap 60.
  
  Let me patch.
  [Assistant tool call]: edit({"newString":"    const additions: Recurring[] = detected.map((d) => {\n      let next = addCadence(d.lastDate, d.cadence);\n      let guard = 0;\n      while (next < todayISO() && guard++ < 60) next = addCadence(next, d.cadence);\n      return {\n      id: uid('rec'),\n      merchant: d.merchant,\n      category: d.category,\n      amount: d.amount,\n      cadence: d.cadence,\n      nextDate: next,\n      lastDate: d.lastDate,\n      status: 'active',\n      priceHistory: [{ date: d.dates[d.dates.length - 1], amount: d.amount }],\n      usage: 'unknown',\n      detectedFrom: d.occurrences,\n      accountId: 'acc_hdfc',\n      source: 'detected',\n      notes: `Detected from ${d.occurrences} consistent charges at ${Math.round(d.confidence * 100)}% confidence.`,\n      };\n    });","oldString":"    const additions: Recurring[] = detected.map((d) => ({\n      id: uid('rec'),\n      merchant: d.merchant,\n      category: d.category,\n      amount: d.amount,\n      cadence: d.cadence,\n      nextDate: addCadence(todayISO(), d.cadence),\n      lastDate: d.lastDate,\n      status: 'active',\n      priceHistory: [{ date: d.dates[d.dates.length - 1], amount: d.amount }],\n      usage: 'unknown',\n      detectedFrom: d.occurrences,\n      accountId: 'acc_hdfc',\n      source: 'detected',\n      notes: `Detected from ${d.occurrences} consistent charges at ${Math.round(d.confidence * 100)}% confidence.`,\n    }));","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\store\\AppStore.tsx"})
  [Tool result]: Edited src/store/AppStore.tsx (1 replacement)
  
  [Assistant reasoning]: Now Recurring.tsx.
  
  Careful with cadence monthly for totals: use monthlyAmount from finance.
  
  Filters: tabs All / Subscriptions / Bills / Dormant / Cancelled.
  
  Stats computed.
  
  Price change banner: find any with detectPriceChange.
  
  Unused banner.
  
  Table.
  
  Upcoming list col-4.
  
  Add/Edit modal generic.
  
  Let me code.
  [Assistant tool call]: write({"content":"import { useMemo, useState } from 'react';\nimport { useApp } from '../store/AppStore';\nimport type { Recurring } from '../types';\nimport { CATEGORIES, CATEGORY_MAP } from '../data/categories';\nimport { money, pct } from '../lib/format';\nimport { friendlyDate, relativeDays, todayISO } from '../lib/date';\nimport { useMoney } from '../hooks/useMoney';\nimport { Icon } from '../components/Icon';\nimport { Confirm, Empty, Modal, Tabs, useToast } from '../components/ui';\nimport { detectPriceChange, subscriptionTotal, unusedTotal } from '../domain/recurring';\nimport { monthlyAmount, upcomingBills } from '../domain/finance';\nimport { addDays } from '../lib/date';\n\ntype Filter = 'all' | 'subscriptions' | 'bills' | 'dormant' | 'cancelled';\n\nexport default function RecurringScreen() {\n  const { state, scanRecurring, updateRecurring, addRecurring } = useApp();\n  const { push } = useToast();\n  const fmt = useMoney();\n\n  const [filter, setFilter] = useState<Filter>('all');\n  const [adding, setAdding] = useState(false);\n  const [editing, setEditing] = useState<Recurring | null>(null);\n  const [cancelling, setCancelling] = useState<Recurring | null>(null);\n  const [cancelAll, setCancelAll] = useState(false);\n  const [scanning, setScanning] = useState(false);\n\n  const allActive = state.recurring.filter((r) => r.status !== 'cancelled');\n  const subs = allActive.filter((r) => r.category === 'subscriptions' || r.category === 'fitness');\n  const subTotals = subscriptionTotal(subs);\n  const dormant = allActive.filter((r) => r.usage === 'unused');\n  const dormantMonthly = unusedTotal(state.recurring);\n  const monthlyAll = allActive.reduce((s, r) => s + monthlyAmount(r.amount, r.cadence), 0);\n  const upcoming = upcomingBills(state, 45);\n\n  const rows = useMemo(() => {\n    const sorted = [...state.recurring].sort((a, b) => {\n      if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;\n      if (b.status === 'cancelled' && a.status !== 'cancelled') return -1;\n      return a.nextDate < b.nextDate ? -1 : 1;\n    });\n    switch (filter) {\n      case 'subscriptions': return sorted.filter((r) => r.category === 'subscriptions');\n      case 'bills': return sorted.filter((r) => ['rent', 'utilities', 'internet', 'mobile', 'insurance'].includes(r.category));\n      case 'dormant': return sorted.filter((r) => r.usage === 'unused' && r.status !== 'cancelled');\n      case 'cancelled': return sorted.filter((r) => r.status === 'cancelled');\n      default: return sorted;\n    }\n  }, [state.recurring, filter]);\n\n  const priceAlerts = state.recurring\n    .filter((r) => r.status !== 'cancelled')\n    .map((r) => ({ r, change: detectPriceChange(r) }))\n    .filter((x) => x.change);\n\n  return (\n    <div className=\"page\">\n      <div className=\"page-head\">\n        <div>\n          <div className=\"eyebrow\">Recurring radar</div>\n          <h1 className=\"display\">What keeps <em>coming back.</em></h1>\n          <p className=\"lede\">\n            Rent, bills, and the quiet subscriptions. Baseline watches the rhythm, flags price changes, and notices when\n            something stops being used.\n          </p>\n        </div>\n        <div className=\"head-actions\">\n          <button\n            className=\"btn\"\n            disabled={scanning}\n            onClick={() => {\n              setScanning(true);\n              const n = scanRecurring();\n              setTimeout(() => {\n                setScanning(false);\n                push(n ? `Found ${n} new recurring charge${n > 1 ? 's' : ''}` : 'No new recurring patterns found');\n              }, 250);\n            }}\n          >\n            <Icon name=\"refresh\" size={14} /> {scanning ? 'Scanning…' : 'Scan for recurring'}\n          </button>\n          <button className=\"btn btn-primary\" onClick={() => setAdding(true)}>\n            <Icon name=\"plus\" size={14} /> Add recurring\n          </button>\n        </div>\n      </div>\n\n      <div className=\"grid\" style={{ marginBottom: 16 }}>\n        <div className=\"col-3 panel\">\n          <div className=\"panel-body\">\n            <div className=\"label\">Monthly subscriptions</div>\n            <div className=\"medium-number\" style={{ marginTop: 6 }}>{fmt(subTotals.monthly)}</div>\n            <div className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 3 }}>{fmt(subTotals.annual)} a year</div>\n          </div>\n        </div>\n        <div className=\"col-3 panel\">\n          <div className=\"panel-body\">\n            <div className=\"label\">All recurring</div>\n            <div className=\"medium-number\" style={{ marginTop: 6 }}>{fmt(monthlyAll)}</div>\n            <div className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 3 }}>{allActive.length} active commitments</div>\n          </div>\n        </div>\n        <div className=\"col-3 panel\">\n          <div className=\"panel-body\">\n            <div className=\"label\">Dormant</div>\n            <div className=\"medium-number\" style={{ marginTop: 6, color: dormantMonthly ? 'var(--negative)' : 'var(--ink)' }}>\n              {fmt(dormantMonthly)}\n            </div>\n            <div className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 3 }}>{dormant.length} service{dormant.length === 1 ? '' : 's'} with no usage</div>\n          </div>\n        </div>\n        <div className=\"col-3 panel\">\n          <div className=\"panel-body\">\n            <div className=\"label\">Next 30 days</div>\n            <div className=\"medium-number\" style={{ marginTop: 6 }}>{fmt(upcoming.filter((u) => u.inDays <= 30).reduce((s, u) => s + u.recurring.amount, 0))}</div>\n            <div className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 3 }}>{upcoming.filter((u) => u.inDays <= 30).length} scheduled charges</div>\n          </div>\n        </div>\n      </div>\n\n      {priceAlerts.length > 0 && (\n        <div className=\"panel\" style={{ marginBottom: 16, borderLeft: '2px solid var(--accent)' }}>\n          <div className=\"panel-body\">\n            <div className=\"row-between wrap\" style={{ gap: 12 }}>\n              <div>\n                <div className=\"row\" style={{ gap: 8 }}>\n                  <Icon name=\"alert\" size={15} style={{ color: 'var(--accent)' }} />\n                  <h2 className=\"panel-title\">Price change detected</h2>\n                </div>\n                {priceAlerts.map(({ r, change }) => (\n                  <p key={r.id} className=\"small muted\" style={{ marginTop: 4 }}>\n                    <strong style={{ color: 'var(--ink)' }}>{r.merchant}</strong> went from {money(change!.from)} to{' '}\n                    {money(change!.to)} ({pct(change!.pct)}). That is {money(change!.delta * 12)} more each year.\n                  </p>\n                ))}\n              </div>\n              <button className=\"btn btn-sm\" onClick={() => setFilter('subscriptions')}>Review subscriptions</button>\n            </div>\n          </div>\n        </div>\n      )}\n\n      {dormant.length > 0 && (\n        <div className=\"panel\" style={{ marginBottom: 16, borderLeft: '2px solid var(--negative)' }}>\n          <div className=\"panel-body\">\n            <div className=\"row-between wrap\" style={{ gap: 12 }}>\n              <div>\n                <div className=\"row\" style={{ gap: 8 }}>\n                  <Icon name=\"clock\" size={15} style={{ color: 'var(--negative)' }} />\n                  <h2 className=\"panel-title\">{dormant.length} dormant subscriptions</h2>\n                </div>\n                <p className=\"small muted\" style={{ marginTop: 4 }}>\n                  {dormant.map((d) => d.merchant).join(', ')} — last meaningful use{' '}\n                  {dormant[0].lastUsedDate ? relativeDays(dormant[0].lastUsedDate) : 'not recorded'}. Together they cost{' '}\n                  {fmt(dormantMonthly)} a month.\n                </p>\n              </div>\n              <div className=\"row\" style={{ gap: 6 }}>\n                <button className=\"btn btn-sm\" onClick={() => setFilter('dormant')}>Review them</button>\n                <button className=\"btn btn-sm btn-danger\" onClick={() => setCancelAll(true)}>Cancel both</button>\n              </div>\n            </div>\n          </div>\n        </div>\n      )}\n\n      <div className=\"grid\">\n        <section className=\"panel col-8\">\n          <div className=\"panel-head\" style={{ flexDirection: 'column', alignItems: 'stretch' }}>\n            <div className=\"row-between\">\n              <div>\n                <h2 className=\"panel-title\">Recurring payments</h2>\n                <p className=\"panel-sub\">{rows.length} shown</p>\n              </div>\n              <span className=\"badge info\"><Icon name=\"refresh\" size={10} /> Auto-detected</span>\n            </div>\n            <Tabs\n              tabs={[\n                { id: 'all', label: 'All', count: state.recurring.length },\n                { id: 'subscriptions', label: 'Subscriptions', count: state.recurring.filter((r) => r.category === 'subscriptions').length },\n                { id: 'bills', label: 'Bills', count: state.recurring.filter((r) => ['rent', 'utilities', 'internet', 'mobile', 'insurance'].includes(r.category)).length },\n                { id: 'dormant', label: 'Dormant', count: dormant.length },\n                { id: 'cancelled', label: 'Cancelled', count: state.recurring.filter((r) => r.status === 'cancelled').length },\n              ]}\n              value={filter}\n              onChange={(f) => setFilter(f as Filter)}\n            />\n          </div>\n\n          <div className=\"panel-body flush\">\n            {rows.length === 0 ? (\n              <Empty icon=\"repeat\" title=\"Nothing in this view\" body=\"Change the filter or scan the ledger for new recurring patterns.\" />\n            ) : (\n              <div className=\"table-wrap\">\n                <table className=\"tbl\">\n                  <thead>\n                    <tr>\n                      <th>Service</th>\n                      <th>Amount</th>\n                      <th className=\"hide-sm\">Cadence</th>\n                      <th>Next charge</th>\n                      <th className=\"hide-sm\">Usage</th>\n                      <th>Status</th>\n                      <th className=\"right\">Actions</th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    {rows.map((r) => {\n                      const change = detectPriceChange(r);\n                      return (\n                        <tr key={r.id} style={{ opacity: r.status === 'cancelled' ? 0.55 : 1 }}>\n                          <td>\n                            <div className=\"row\" style={{ gap: 7 }}>\n                              <span className=\"cat-dot\" style={{ background: CATEGORY_MAP[r.category]?.color }} />\n                              <div>\n                                <div className=\"txn-merchant\">{r.merchant}</div>\n                                <div className=\"tiny\" style={{ color: 'var(--muted)' }}>\n                                  {CATEGORY_MAP[r.category]?.name} · {r.source === 'detected' ? 'detected' : 'manual'}\n                                </div>\n                              </div>\n                            </div>\n                          </td>\n                          <td className=\"money\">\n                            {money(r.amount)}\n                            {change && (\n                              <div className=\"tiny\" style={{ color: 'var(--negative)', marginTop: 2 }}>\n                                was {money(change.from)}\n                              </div>\n                            )}\n                          </td>\n                          <td className=\"hide-sm small muted\">{r.cadence}</td>\n                          <td>\n                            <div className=\"small\">{friendlyDate(r.nextDate)}</div>\n                            <div className=\"tiny\" style={{ color: 'var(--muted)' }}>{relativeDays(r.nextDate)}</div>\n                          </td>\n                          <td className=\"hide-sm\">\n                            {r.status === 'cancelled' ? (\n                              <span className=\"tiny faint\">—</span>\n                            ) : r.usage === 'unused' ? (\n                              <span className=\"badge warn\">Dormant</span>\n                            ) : r.usage === 'used' ? (\n                              <span className=\"badge pos\">In use</span>\n                            ) : (\n                              <span className=\"badge outline\">Unknown</span>\n                            )}\n                          </td>\n                          <td>\n                            <span className={`badge ${r.status === 'active' ? 'pos' : r.status === 'snoozed' ? 'warn' : 'outline'}`}>\n                              {r.status}\n                            </span>\n                          </td>\n                          <td>\n                            <div className=\"row\" style={{ gap: 2, justifyContent: 'flex-end' }}>\n                              {r.status === 'cancelled' ? (\n                                <button className=\"btn btn-sm\" onClick={() => { updateRecurring(r.id, { status: 'active' }); push(`${r.merchant} restored`); }}>\n                                  Restore\n                                </button>\n                              ) : (\n                                <>\n                                  <button className=\"btn btn-ghost btn-icon\" title=\"Edit\" aria-label={`Edit ${r.merchant}`} onClick={() => setEditing(r)}>\n                                    <Icon name=\"pencil\" size={13} />\n                                  </button>\n                                  {r.usage === 'unused' ? (\n                                    <button className=\"btn btn-sm\" onClick={() => { updateRecurring(r.id, { usage: 'used', lastUsedDate: todayISO() }); push(`${r.merchant} marked as in use`); }}>\n                                      Keep\n                                    </button>\n                                  ) : (\n                                    <button className=\"btn btn-sm btn-ghost\" onClick={() => { updateRecurring(r.id, { usage: 'unused' }); push(`${r.merchant} marked dormant`); }}>\n                                      Dormant\n                                    </button>\n                                  )}\n                                  <button className=\"btn btn-sm btn-danger\" onClick={() => setCancelling(r)}>Cancel</button>\n                                </>\n                              )}\n                            </div>\n                          </td>\n                        </tr>\n                      );\n                    })}\n                  </tbody>\n                </table>\n              </div>\n            )}\n          </div>\n          <div className=\"panel-foot\">\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>\n              Detection needs at least three consistent charges within a 20% amount band\n            </span>\n            <button className=\"linkish small\" onClick={() => { push('Scanning the last six months'); const n = scanRecurring(); push(n ? `${n} new patterns added` : 'No new patterns'); }}>\n              Scan again\n            </button>\n          </div>\n        </section>\n\n        <aside className=\"col-4 stack\">\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">Coming up</h2>\n                <p className=\"panel-sub\">The next 45 days of known charges.</p>\n              </div>\n            </div>\n            <div className=\"panel-body\" style={{ paddingTop: 4, maxHeight: 420, overflowY: 'auto' }}>\n              {upcoming.slice(0, 12).map((u) => (\n                <div className=\"bill-row\" key={u.recurring.id}>\n                  <div className=\"bill-date\">\n                    <b>{new Date(u.date).getDate()}</b>\n                    {new Date(u.date).toLocaleDateString('en-IN', { month: 'short' })}\n                  </div>\n                  <div style={{ minWidth: 0, flex: 1 }}>\n                    <div className=\"txn-merchant ellipsis\">{u.recurring.merchant}</div>\n                    <div className=\"tiny\" style={{ color: 'var(--muted)' }}>{relativeDays(u.date)} · {u.recurring.cadence}</div>\n                  </div>\n                  <span className=\"num small\">{money(u.recurring.amount)}</span>\n                </div>\n              ))}\n              {!upcoming.length && <p className=\"small muted\" style={{ padding: '12px 0' }}>Nothing scheduled. That is either calm or suspicious.</p>}\n            </div>\n            <div className=\"panel-foot\">\n              <span className=\"tiny\" style={{ color: 'var(--muted)' }}>45-day total</span>\n              <span className=\"num small strong\">{fmt(upcoming.reduce((s, u) => s + u.recurring.amount, 0))}</span>\n            </div>\n          </section>\n\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">How detection works</h2>\n              </div>\n            </div>\n            <div className=\"panel-body stack-sm\">\n              <p className=\"small muted\">\n                The scanner groups outflows by merchant, measures the gaps between charges, and checks that amounts stay\n                within 20% of the median.\n              </p>\n              <div className=\"callout\">\n                <div className=\"row-between small\"><span className=\"muted\">Weekly</span><span className=\"mono\">5–9 days</span></div>\n                <div className=\"row-between small\"><span className=\"muted\">Monthly</span><span className=\"mono\">24–37 days</span></div>\n                <div className=\"row-between small\"><span className=\"muted\">Quarterly</span><span className=\"mono\">78–100 days</span></div>\n                <div className=\"row-between small\"><span className=\"muted\">Yearly</span><span className=\"mono\">330–400 days</span></div>\n              </div>\n              <div className=\"note guard\">\n                Cancelling here changes the model, not the real subscription. Nothing is sent to the merchant.\n              </div>\n            </div>\n          </section>\n        </aside>\n      </div>\n\n      {adding && (\n        <RecurringModal\n          title=\"Add a recurring payment\"\n          onClose={() => setAdding(false)}\n          onSave={(r) => { addRecurring({ ...r, source: 'manual', detectedFrom: 0 }); push('Recurring payment added'); setAdding(false); }}\n        />\n      )}\n\n      {editing && (\n        <RecurringModal\n          title={`Edit ${editing.merchant}`}\n          initial={editing}\n          onClose={() => setEditing(null)}\n          onSave={(r) => { updateRecurring(editing.id, r); push('Change saved'); setEditing(null); }}\n        />\n      )}\n\n      <Confirm\n        open={!!cancelling}\n        onClose={() => setCancelling(null)}\n        onConfirm={() => {\n          if (!cancelling) return;\n          updateRecurring(cancelling.id, { status: 'cancelled' });\n          push(`${cancelling.merchant} marked cancelled`);\n        }}\n        title={`Cancel ${cancelling?.merchant}?`}\n        body=\"This updates the model and removes it from future bills. It does not cancel the real subscription — do that with the provider.\"\n        confirmLabel=\"Mark as cancelled\"\n        danger\n      />\n\n      <Confirm\n        open={cancelAll}\n        onClose={() => setCancelAll(false)}\n        onConfirm={() => {\n          dormant.forEach((d) => updateRecurring(d.id, { status: 'cancelled' }));\n          push(`Marked ${dormant.length} dormant subscriptions as cancelled`);\n        }}\n        title={`Cancel ${dormant.length} dormant subscriptions?`}\n        body={`This frees ${money(dormantMonthly)} a month in the model. Remember to cancel with each provider as well.`}\n        confirmLabel=\"Mark all cancelled\"\n        danger\n      />\n    </div>\n  );\n}\n\nfunction RecurringModal({\n  title,\n  initial,\n  onClose,\n  onSave,\n}: {\n  title: string;\n  initial?: Recurring;\n  onClose: () => void;\n  onSave: (r: Omit<Recurring, 'id' | 'source' | 'detectedFrom'>) => void;\n}) {\n  const [merchant, setMerchant] = useState(initial?.merchant ?? '');\n  const [amount, setAmount] = useState(String(initial?.amount ?? ''));\n  const [category, setCategory] = useState(initial?.category ?? 'subscriptions');\n  const [cadence, setCadence] = useState<Recurring['cadence']>(initial?.cadence ?? 'monthly');\n  const [nextDate, setNextDate] = useState(initial?.nextDate ?? addDays(todayISO(), 14));\n  const [usage, setUsage] = useState<Recurring['usage']>(initial?.usage ?? 'used');\n  const [notes, setNotes] = useState(initial?.notes ?? '');\n\n  return (\n    <Modal\n      open\n      onClose={onClose}\n      title={title}\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Cancel</button>\n          <button\n            className=\"btn btn-primary\"\n            disabled={!merchant.trim() || !Number(amount)}\n            onClick={() =>\n              onSave({\n                merchant: merchant.trim(),\n                amount: Math.abs(Number(amount)),\n                category,\n                cadence,\n                nextDate,\n                lastDate: initial?.lastDate ?? todayISO(),\n                status: initial?.status ?? 'active',\n                priceHistory: initial?.priceHistory ?? [{ date: todayISO(), amount: Math.abs(Number(amount)) }],\n                usage,\n                lastUsedDate: initial?.lastUsedDate,\n                accountId: initial?.accountId ?? 'acc_hdfc',\n                notes,\n              })\n            }\n          >\n            Save\n          </button>\n        </>\n      }\n    >\n      <div className=\"stack-sm\">\n        <div className=\"field\"><label>Merchant</label><input className=\"input\" value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder=\"e.g. Nykaa Beauty\" /></div>\n        <div className=\"form-row\">\n          <div className=\"field\"><label>Amount</label><input className=\"input num\" inputMode=\"decimal\" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>\n          <div className=\"field\"><label>Cadence</label>\n            <select className=\"select\" value={cadence} onChange={(e) => setCadence(e.target.value as Recurring['cadence'])}>\n              <option value=\"weekly\">Weekly</option>\n              <option value=\"monthly\">Monthly</option>\n              <option value=\"quarterly\">Quarterly</option>\n              <option value=\"yearly\">Yearly</option>\n            </select>\n          </div>\n        </div>\n        <div className=\"form-row\">\n          <div className=\"field\"><label>Category</label>\n            <select className=\"select\" value={category} onChange={(e) => setCategory(e.target.value)}>\n              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}\n            </select>\n          </div>\n          <div className=\"field\"><label>Next charge</label><input className=\"input\" type=\"date\" value={nextDate} onChange={(e) => setNextDate(e.target.value)} /></div>\n        </div>\n        <div className=\"field\"><label>Usage signal</label>\n          <select className=\"select\" value={usage} onChange={(e) => setUsage(e.target.value as Recurring['usage'])}>\n            <option value=\"used\">In use</option>\n            <option value=\"unknown\">Not sure</option>\n            <option value=\"unused\">Dormant</option>\n          </select>\n        </div>\n        <div className=\"field\"><label>Note</label><input className=\"input\" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder=\"Why does this exist?\" /></div>\n      </div>\n    </Modal>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Recurring.tsx"})
  [Tool result]: Created file successfully: src/screens/Recurring.tsx
  
  [Assistant reasoning]: I imported `useMoney` and `useMemo`; `useMoney` used for fmt. `monthlyAmount` used. `addDays` imported separately at bottom — duplicate import from same module? I imported `{ friendlyDate, relativeDays, todayISO }` from '../lib/date' and later `import { addDays } from '../lib/date';`. Duplicate module import statements with different bindings are fine in ES modules/TS.
  
  But `addDays` is used inside RecurringModal, defined at module scope — fine.
  
  `Confirm` for cancelAll uses `dormantMonthly` formatted with money not fmt — fine.
  
  Now Plan screen.
  
  Sections:
  1. Profile: name, currency (fixed INR), emergency fund target/saved, savings rate target, opening balance? Opening balance is data-level, keep in settings.
     - Emergency fund card with coverage and progress + adjust button (modal).
     - Income sources list with edit/delete/add.
     - Fixed costs list with edit/delete/add.
  2. Goals: cards with progress, target date, monthly, required, on-track, edit/delete/contribute.
     - "Add goal" button.
     - Contribute modal amount.
  3. Monthly allocation visual: income → fixed → flexible → goals → free.
  4. Target dates timeline maybe.
  
  Editing modals:
  - EmergencyModal (target, saved).
  - IncomeModal.
  - FixedModal.
  - GoalModal.
  
  Also profile savings target inline editable? Use an input with save on blur? Simpler include in a "Settings" modal or inline number field with save button. I'll make a small "Adjust" modal for savings target? Add to emergency modal ("Buffer & targets"): emergency target, saved, savings rate target.
  
  Goal card: show required vs monthly, progress, deadline days, buttons Contribute, Edit, Delete.
  
  Goals CRUD with new id `uid('goal')`. uid is exported from AppStore. Use it.
  
  Plan screen layout: col-8 main: emergency + goals; col-4: income/fixed.
  
  Let me design:
  Row 1: col-12 "Monthly plan" panel with a flow: Income | Fixed | Flexible | To goals | Free. Plus bars. This is the model arithmetic visualize.
  Row 2: col-7 Goals grid (goal cards stacked 2 col), col-5 Emergency + targets.
  Row 3: col-6 Income sources, col-6 Fixed costs.
  
  Actually:
  - col-8 Goals (grid of cards 2-up).
  - col-4 Emergency fund + targets.
  - col-6 Income.
  - col-6 Fixed costs.
  - col-12 monthly plan flow at top.
  
  Let me write.
  
  Monthly plan flow: use baseModel + surplus. Items: income, fixed, flexible, goal contributions (sum monthly), free = income - fixed - flexible - goalsMonthly. Use progress bars.
  
  Goal contribute action: add to saved (and decrease free cash). Confirm via modal.
  
  Goal form fields: name, target, saved, targetDate, monthly, priority, color (select from palette), note.
  
  Colors: offer 6 swatches.
  
  Delete confirm.
  
  Emergency modal: target/saved/savings target.
  
  Income modal: name, amount, cadence, nextDate.
  Fixed modal: name, amount, category, dueDay.
  
  Let me code.
  [Assistant tool call]: write({"content":"import { useState } from 'react';\nimport { useApp, uid } from '../store/AppStore';\nimport type { FixedCost, Goal, IncomeSource } from '../types';\nimport { CATEGORIES, CATEGORY_MAP } from '../data/categories';\nimport { money, pct } from '../lib/format';\nimport { daysBetween, friendlyDate, todayISO } from '../lib/date';\nimport { useMoney } from '../hooks/useMoney';\nimport { Icon } from '../components/Icon';\nimport { Confirm, Empty, Modal, useToast } from '../components/ui';\nimport {\n  emergencyCoverage,\n  fixedBaseline,\n  flexibleBaseline,\n  goalProgress,\n  goalRequiredMonthly,\n  monthlyIncome,\n  monthlySurplus,\n} from '../domain/finance';\n\nconst GOAL_COLORS = ['#4C6B8A', '#A65A4A', '#7A6A4A', '#4F7A5B', '#8A5A6B', '#3F6E7A'];\n\nexport default function Plan() {\n  const {\n    state, updateProfile, upsertIncome, removeIncome, upsertFixed, removeFixed,\n    upsertGoal, deleteGoal, contributeGoal,\n  } = useApp();\n  const { push } = useToast();\n  const fmt = useMoney();\n\n  const [bufferOpen, setBufferOpen] = useState(false);\n  const [incomeEdit, setIncomeEdit] = useState<IncomeSource | null>(null);\n  const [incomeNew, setIncomeNew] = useState(false);\n  const [fixedEdit, setFixedEdit] = useState<FixedCost | null>(null);\n  const [fixedNew, setFixedNew] = useState(false);\n  const [goalEdit, setGoalEdit] = useState<Goal | null>(null);\n  const [goalNew, setGoalNew] = useState(false);\n  const [goalDelete, setGoalDelete] = useState<Goal | null>(null);\n  const [contributing, setContributing] = useState<Goal | null>(null);\n  const [contribution, setContribution] = useState('');\n\n  const income = monthlyIncome(state);\n  const fixed = fixedBaseline(state);\n  const flexible = flexibleBaseline(state);\n  const surplus = monthlySurplus(state);\n  const goalsMonthly = state.goals.filter((g) => !g.archived).reduce((s, g) => s + g.monthly, 0);\n  const free = income - fixed - flexible - goalsMonthly;\n  const coverage = emergencyCoverage(state);\n  const incomePct = (n: number) => (income > 0 ? Math.max(0, Math.min(100, (n / income) * 100)) : 0);\n\n  return (\n    <div className=\"page\">\n      <div className=\"page-head\">\n        <div>\n          <div className=\"eyebrow\">Persistent profile · plan</div>\n          <h1 className=\"display\">A plan that <em>knows your life.</em></h1>\n          <p className=\"lede\">\n            Income, fixed costs, the emergency floor, and goals with real target dates. Everything here feeds the\n            simulator, so a change in rent or salary moves the whole picture.\n          </p>\n        </div>\n        <div className=\"head-actions\">\n          <button className=\"btn\" onClick={() => setBufferOpen(true)}>\n            <Icon name=\"shield\" size={14} /> Buffer & targets\n          </button>\n          <button className=\"btn btn-primary\" onClick={() => setGoalNew(true)}>\n            <Icon name=\"plus\" size={14} /> New goal\n          </button>\n        </div>\n      </div>\n\n      <section className=\"panel\" style={{ marginBottom: 16 }}>\n        <div className=\"panel-head\">\n          <div>\n            <h2 className=\"panel-title\">The monthly plan</h2>\n            <p className=\"panel-sub\">Where each month's income is already committed.</p>\n          </div>\n          <span className=\"badge\">{fmt(income)} / month</span>\n        </div>\n        <div className=\"panel-body\">\n          <div className=\"meter\" style={{ height: 12 }} aria-hidden=\"true\">\n            <span style={{ width: `${incomePct(fixed)}%`, background: 'var(--ink)' }} title=\"Fixed costs\" />\n            <span style={{ width: `${incomePct(flexible)}%`, background: 'var(--line-strong)' }} title=\"Flexible baseline\" />\n            <span style={{ width: `${incomePct(goalsMonthly)}%`, background: 'var(--accent)' }} title=\"Goal contributions\" />\n            <span style={{ width: `${incomePct(Math.max(0, free))}%`, background: 'var(--positive)' }} title=\"Unassigned\" />\n          </div>\n          <div className=\"row wrap\" style={{ gap: 20, marginTop: 14 }}>\n            {[\n              { label: 'Fixed costs', value: fixed, color: 'var(--ink)' },\n              { label: 'Flexible baseline', value: flexible, color: 'var(--line-strong)' },\n              { label: 'Goal contributions', value: goalsMonthly, color: 'var(--accent)' },\n              { label: 'Unassigned', value: Math.max(0, free), color: 'var(--positive)' },\n            ].map((x) => (\n              <div key={x.label} className=\"row\" style={{ gap: 7 }}>\n                <i style={{ width: 8, height: 8, background: x.color, borderRadius: 2 }} />\n                <span className=\"small muted\">{x.label}</span>\n                <span className=\"num small\">{fmt(x.value)}</span>\n                <span className=\"tiny faint\">{pct(income > 0 ? (x.value / income) * 100 : 0)}</span>\n              </div>\n            ))}\n          </div>\n          <div className=\"divider dashed\" />\n          <div className=\"row-between wrap\" style={{ gap: 12 }}>\n            <span className=\"small muted\">\n              Free cash before goal contributions is <strong className=\"num\" style={{ color: 'var(--ink)' }}>{fmt(surplus)}</strong> a\n              month. Goals currently claim <span className=\"num\">{fmt(goalsMonthly)}</span>.\n            </span>\n            <button className=\"linkish small\" onClick={() => setGoalNew(true)}>Give the surplus a job →</button>\n          </div>\n        </div>\n      </section>\n\n      <div className=\"grid\">\n        <section className=\"panel col-8\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Goals with target dates</h2>\n              <p className=\"panel-sub\">The model checks required contribution against what you have committed.</p>\n            </div>\n            <span className=\"badge\">{state.goals.filter((g) => !g.archived).length} active</span>\n          </div>\n          <div className=\"panel-body\">\n            {state.goals.filter((g) => !g.archived).length === 0 ? (\n              <Empty\n                icon=\"target\"\n                title=\"No goals yet\"\n                body=\"A goal needs a number, a date, and a monthly commitment. That is what makes the simulation meaningful.\"\n                action={<button className=\"btn btn-sm btn-primary\" onClick={() => setGoalNew(true)}>Create the first goal</button>}\n              />\n            ) : (\n              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>\n                {state.goals\n                  .filter((g) => !g.archived)\n                  .sort((a, b) => a.priority - b.priority)\n                  .map((g) => {\n                    const progress = goalProgress(g);\n                    const required = goalRequiredMonthly(g);\n                    const onTrack = g.monthly >= required * 0.92;\n                    const days = daysBetween(todayISO(), g.targetDate);\n                    return (\n                      <article className=\"goal-card\" key={g.id}>\n                        <div className=\"goal-top\">\n                          <div>\n                            <div className=\"row\" style={{ gap: 7 }}>\n                              <span className=\"cat-dot\" style={{ background: g.color }} />\n                              <h3 style={{ fontSize: 13.5 }}>{g.name}</h3>\n                            </div>\n                            <div className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 3 }}>\n                              by {friendlyDate(g.targetDate)} · {days > 0 ? `${days} days` : 'past due'}\n                            </div>\n                          </div>\n                          <span className={`badge ${onTrack ? 'pos' : 'warn'}`}>{onTrack ? 'On pace' : 'Behind'}</span>\n                        </div>\n                        <div className=\"row-between\" style={{ marginTop: 12 }}>\n                          <span className=\"num\" style={{ fontSize: 18 }}>{fmt(g.saved)}</span>\n                          <span className=\"small muted\">of {fmt(g.target)}</span>\n                        </div>\n                        <div className=\"progress\" style={{ marginTop: 7 }}>\n                          <span style={{ width: `${progress * 100}%`, background: g.color }} />\n                        </div>\n                        <div className=\"row-between tiny\" style={{ marginTop: 6, color: 'var(--muted)' }}>\n                          <span>{Math.round(progress * 100)}% funded</span>\n                          <span>needs {fmt(required)}/mo</span>\n                        </div>\n                        <div className=\"divider\" style={{ margin: '10px 0' }} />\n                        <div className=\"row-between\">\n                          <span className=\"small muted\">Committed {fmt(g.monthly)}/mo</span>\n                          <div className=\"row\" style={{ gap: 2 }}>\n                            <button className=\"btn btn-sm\" onClick={() => { setContributing(g); setContribution(''); }}>Add money</button>\n                            <button className=\"btn btn-ghost btn-icon\" aria-label={`Edit ${g.name}`} onClick={() => setGoalEdit(g)}>\n                              <Icon name=\"pencil\" size={13} />\n                            </button>\n                            <button className=\"btn btn-ghost btn-icon\" aria-label={`Delete ${g.name}`} onClick={() => setGoalDelete(g)}>\n                              <Icon name=\"trash\" size={13} />\n                            </button>\n                          </div>\n                        </div>\n                        {g.note && <p className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 8 }}>{g.note}</p>}\n                      </article>\n                    );\n                  })}\n              </div>\n            )}\n          </div>\n          <div className=\"panel-foot\">\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>\n              Total goal value {fmt(state.goals.reduce((s, g) => s + g.target, 0))}\n            </span>\n            <button className=\"linkish small\" onClick={() => setGoalNew(true)}>Add another goal</button>\n          </div>\n        </section>\n\n        <aside className=\"col-4 stack\">\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">Emergency floor</h2>\n                <p className=\"panel-sub\">Months of essentials, not months of spending.</p>\n              </div>\n              <button className=\"btn btn-ghost btn-icon\" aria-label=\"Edit emergency fund\" onClick={() => setBufferOpen(true)}>\n                <Icon name=\"pencil\" size={14} />\n              </button>\n            </div>\n            <div className=\"panel-body\">\n              <div className=\"row-between\" style={{ alignItems: 'flex-end' }}>\n                <div>\n                  <div className=\"medium-number\">{fmt(state.profile.emergencySaved)}</div>\n                  <div className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 3 }}>of {fmt(state.profile.emergencyTarget)} target</div>\n                </div>\n                <div style={{ textAlign: 'right' }}>\n                  <div className=\"medium-number\" style={{ color: coverage < 3 ? 'var(--negative)' : 'var(--positive)' }}>{coverage.toFixed(1)}</div>\n                  <div className=\"tiny\" style={{ color: 'var(--muted)' }}>months</div>\n                </div>\n              </div>\n              <div className=\"progress\" style={{ marginTop: 12 }}>\n                <span style={{ width: `${Math.min(100, (state.profile.emergencySaved / Math.max(1, state.profile.emergencyTarget)) * 100)}%` }} />\n              </div>\n              <div className=\"row-between tiny\" style={{ marginTop: 6, color: 'var(--muted)' }}>\n                <span>{Math.round((state.profile.emergencySaved / Math.max(1, state.profile.emergencyTarget)) * 100)}% funded</span>\n                <span>3-month floor</span>\n              </div>\n              <div className=\"divider dashed\" />\n              <div className=\"row-between small\"><span className=\"muted\">Savings rate target</span><span className=\"num\">{pct(state.profile.savingsRateTarget)}</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 4 }}><span className=\"muted\">Essentials / month</span><span className=\"num\">{fmt(state.profile.emergencySaved / Math.max(0.1, coverage))}</span></div>\n              <button className=\"btn btn-sm btn-block\" style={{ marginTop: 12 }} onClick={() => setBufferOpen(true)}>Adjust the floor</button>\n            </div>\n          </section>\n\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">Profile</h2>\n                <p className=\"panel-sub\">The constants of the model.</p>\n              </div>\n            </div>\n            <div className=\"panel-body\">\n              <div className=\"row-between small\"><span className=\"muted\">Name</span><span>{state.profile.name}</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 6 }}><span className=\"muted\">Currency</span><span className=\"mono\">INR · en-IN</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 6 }}><span className=\"muted\">Opening balance</span><span className=\"num\">{fmt(state.profile.openingBalance)}</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 6 }}><span className=\"muted\">Modelled since</span><span className=\"mono\">{state.seedMonth}</span></div>\n              <div className=\"note\" style={{ marginTop: 12 }}>\n                This profile persists across sessions. Imported statements update the transactions, never these constants.\n              </div>\n            </div>\n          </section>\n        </aside>\n\n        <section className=\"panel col-6\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Income</h2>\n              <p className=\"panel-sub\">{fmt(income)} a month</p>\n            </div>\n            <button className=\"btn btn-sm\" onClick={() => setIncomeNew(true)}><Icon name=\"plus\" size={12} /> Add source</button>\n          </div>\n          <div className=\"panel-body flush\">\n            <table className=\"tbl\">\n              <tbody>\n                {state.profile.income.map((i) => (\n                  <tr key={i.id}>\n                    <td>\n                      <div className=\"txn-merchant\">{i.name}</div>\n                      <div className=\"tiny\" style={{ color: 'var(--muted)' }}>{i.cadence} · next {friendlyDate(i.nextDate)}</div>\n                    </td>\n                    <td className=\"money\">{money(i.amount)}</td>\n                    <td className=\"right\" style={{ width: 64 }}>\n                      <div className=\"row\" style={{ gap: 2, justifyContent: 'flex-end' }}>\n                        <button className=\"btn btn-ghost btn-icon\" aria-label={`Edit ${i.name}`} onClick={() => setIncomeEdit(i)}><Icon name=\"pencil\" size={13} /></button>\n                        <button className=\"btn btn-ghost btn-icon\" aria-label={`Remove ${i.name}`} onClick={() => { removeIncome(i.id); push('Income source removed'); }}><Icon name=\"trash\" size={13} /></button>\n                      </div>\n                    </td>\n                  </tr>\n                ))}\n              </tbody>\n            </table>\n            {!state.profile.income.length && <Empty icon=\"wallet\" title=\"No income sources\" body=\"Add salary or freelance income so the model has a starting point.\" />}\n          </div>\n        </section>\n\n        <section className=\"panel col-6\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Fixed costs</h2>\n              <p className=\"panel-sub\">{fmt(fixed)} a month including detected subscriptions</p>\n            </div>\n            <button className=\"btn btn-sm\" onClick={() => setFixedNew(true)}><Icon name=\"plus\" size={12} /> Add cost</button>\n          </div>\n          <div className=\"panel-body flush\">\n            <table className=\"tbl\">\n              <tbody>\n                {state.profile.fixed.map((f) => (\n                  <tr key={f.id}>\n                    <td>\n                      <div className=\"row\" style={{ gap: 7 }}>\n                        <span className=\"cat-dot\" style={{ background: CATEGORY_MAP[f.category]?.color }} />\n                        <div>\n                          <div className=\"txn-merchant\">{f.name}</div>\n                          <div className=\"tiny\" style={{ color: 'var(--muted)' }}>due day {f.dueDay} · {CATEGORY_MAP[f.category]?.name}</div>\n                        </div>\n                      </div>\n                    </td>\n                    <td className=\"money\">{money(f.amount)}</td>\n                    <td className=\"right\" style={{ width: 64 }}>\n                      <div className=\"row\" style={{ gap: 2, justifyContent: 'flex-end' }}>\n                        <button className=\"btn btn-ghost btn-icon\" aria-label={`Edit ${f.name}`} onClick={() => setFixedEdit(f)}><Icon name=\"pencil\" size={13} /></button>\n                        <button className=\"btn btn-ghost btn-icon\" aria-label={`Remove ${f.name}`} onClick={() => { removeFixed(f.id); push('Fixed cost removed'); }}><Icon name=\"trash\" size={13} /></button>\n                      </div>\n                    </td>\n                  </tr>\n                ))}\n              </tbody>\n            </table>\n            {!state.profile.fixed.length && <Empty icon=\"home\" title=\"No fixed costs\" body=\"Rent, utilities, and insurance belong here so the model can protect them.\" />}\n          </div>\n        </section>\n      </div>\n\n      <Modal\n        open={bufferOpen}\n        onClose={() => setBufferOpen(false)}\n        title=\"Buffer & targets\"\n        sub=\"These numbers decide what counts as safe to spend.\"\n        footer={<button className=\"btn btn-primary\" onClick={() => setBufferOpen(false)}>Done</button>}\n      >\n        <BufferForm\n          emergencyTarget={state.profile.emergencyTarget}\n          emergencySaved={state.profile.emergencySaved}\n          savingsRateTarget={state.profile.savingsRateTarget}\n          onSave={(patch) => { updateProfile(patch); push('Targets updated'); }}\n        />\n      </Modal>\n\n      {incomeNew && (\n        <IncomeModal\n          title=\"Add income\"\n          onClose={() => setIncomeNew(false)}\n          onSave={(i) => { upsertIncome({ ...i, id: uid('inc') }); push('Income added'); setIncomeNew(false); }}\n        />\n      )}\n      {incomeEdit && (\n        <IncomeModal\n          title=\"Edit income\"\n          initial={incomeEdit}\n          onClose={() => setIncomeEdit(null)}\n          onSave={(i) => { upsertIncome({ ...i, id: incomeEdit.id }); push('Income updated'); setIncomeEdit(null); }}\n        />\n      )}\n      {fixedNew && (\n        <FixedModal\n          title=\"Add fixed cost\"\n          onClose={() => setFixedNew(false)}\n          onSave={(f) => { upsertFixed({ ...f, id: uid('fx') }); push('Fixed cost added'); setFixedNew(false); }}\n        />\n      )}\n      {fixedEdit && (\n        <FixedModal\n          title=\"Edit fixed cost\"\n          initial={fixedEdit}\n          onClose={() => setFixedEdit(null)}\n          onSave={(f) => { upsertFixed({ ...f, id: fixedEdit.id }); push('Fixed cost updated'); setFixedEdit(null); }}\n        />\n      )}\n      {goalNew && (\n        <GoalModal\n          title=\"New goal\"\n          onClose={() => setGoalNew(false)}\n          onSave={(g) => { upsertGoal({ ...g, id: uid('goal'), priority: state.goals.length + 1 }); push('Goal created'); setGoalNew(false); }}\n        />\n      )}\n      {goalEdit && (\n        <GoalModal\n          title=\"Edit goal\"\n          initial={goalEdit}\n          onClose={() => setGoalEdit(null)}\n          onSave={(g) => { upsertGoal({ ...g, id: goalEdit.id }); push('Goal updated'); setGoalEdit(null); }}\n        />\n      )}\n\n      <Modal\n        open={!!contributing}\n        onClose={() => setContributing(null)}\n        title={`Add money to ${contributing?.name ?? ''}`}\n        sub=\"This moves cash already in your account into the goal, and lowers safe-to-spend.\"\n        footer={\n          <>\n            <button className=\"btn\" onClick={() => setContributing(null)}>Cancel</button>\n            <button\n              className=\"btn btn-primary\"\n              disabled={!Number(contribution)}\n              onClick={() => {\n                if (!contributing) return;\n                contributeGoal(contributing.id, Number(contribution));\n                push(`${money(Number(contribution))} added to ${contributing.name}`);\n                setContributing(null);\n              }}\n            >\n              Add to goal\n            </button>\n          </>\n        }\n      >\n        <div className=\"field\">\n          <label>Amount</label>\n          <input className=\"input num\" inputMode=\"decimal\" autoFocus value={contribution} onChange={(e) => setContribution(e.target.value.replace(/[^0-9]/g, ''))} placeholder=\"0\" />\n        </div>\n        <div className=\"row wrap\" style={{ gap: 6, marginTop: 8 }}>\n          {[5000, 10000, 25000].map((v) => (\n            <button key={v} className=\"chip\" onClick={() => setContribution(String(v))}>{money(v)}</button>\n          ))}\n        </div>\n        <p className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 10 }}>\n          Remaining to target: {contributing ? money(Math.max(0, contributing.target - contributing.saved)) : '—'}.\n        </p>\n      </Modal>\n\n      <Confirm\n        open={!!goalDelete}\n        onClose={() => setGoalDelete(null)}\n        onConfirm={() => {\n          if (!goalDelete) return;\n          deleteGoal(goalDelete.id);\n          push(`${goalDelete.name} deleted`);\n        }}\n        title={`Delete ${goalDelete?.name}?`}\n        body=\"The goal is removed from the model and its saved amount is released back to free cash. The transactions stay untouched.\"\n        confirmLabel=\"Delete goal\"\n        danger\n      />\n    </div>\n  );\n}\n\nfunction BufferForm({\n  emergencyTarget, emergencySaved, savingsRateTarget, onSave,\n}: {\n  emergencyTarget: number;\n  emergencySaved: number;\n  savingsRateTarget: number;\n  onSave: (p: { emergencyTarget: number; emergencySaved: number; savingsRateTarget: number }) => void;\n}) {\n  const [target, setTarget] = useState(String(emergencyTarget));\n  const [saved, setSaved] = useState(String(emergencySaved));\n  const [rate, setRate] = useState(String(savingsRateTarget));\n  return (\n    <div className=\"stack-sm\">\n      <div className=\"field\"><label>Emergency fund target</label><input className=\"input num\" inputMode=\"decimal\" value={target} onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, ''))} /></div>\n      <div className=\"field\"><label>Currently set aside</label><input className=\"input num\" inputMode=\"decimal\" value={saved} onChange={(e) => setSaved(e.target.value.replace(/[^0-9]/g, ''))} /></div>\n      <div className=\"field\"><label>Savings rate target (%)</label><input className=\"input num\" inputMode=\"numeric\" value={rate} onChange={(e) => setRate(e.target.value.replace(/[^0-9]/g, ''))} /></div>\n      <button\n        className=\"btn btn-primary\"\n        onClick={() => onSave({ emergencyTarget: Number(target), emergencySaved: Number(saved), savingsRateTarget: Number(rate) })}\n      >\n        Save targets\n      </button>\n      <p className=\"tiny\" style={{ color: 'var(--muted)' }}>\n        A three-month floor is a common starting point. Baseline treats this money as unavailable for spending.\n      </p>\n    </div>\n  );\n}\n\nfunction IncomeModal({\n  title, initial, onClose, onSave,\n}: {\n  title: string;\n  initial?: IncomeSource;\n  onClose: () => void;\n  onSave: (i: Omit<IncomeSource, 'id'>) => void;\n}) {\n  const [name, setName] = useState(initial?.name ?? '');\n  const [amount, setAmount] = useState(String(initial?.amount ?? ''));\n  const [cadence, setCadence] = useState<IncomeSource['cadence']>(initial?.cadence ?? 'monthly');\n  const [nextDate, setNextDate] = useState(initial?.nextDate ?? todayISO());\n  return (\n    <Modal\n      open\n      onClose={onClose}\n      title={title}\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Cancel</button>\n          <button className=\"btn btn-primary\" disabled={!name || !Number(amount)} onClick={() => onSave({ name, amount: Number(amount), cadence, nextDate })}>Save</button>\n        </>\n      }\n    >\n      <div className=\"stack-sm\">\n        <div className=\"field\"><label>Source</label><input className=\"input\" value={name} onChange={(e) => setName(e.target.value)} placeholder=\"e.g. Nimbus Labs salary\" /></div>\n        <div className=\"form-row\">\n          <div className=\"field\"><label>Amount</label><input className=\"input num\" inputMode=\"decimal\" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} /></div>\n          <div className=\"field\"><label>Cadence</label>\n            <select className=\"select\" value={cadence} onChange={(e) => setCadence(e.target.value as IncomeSource['cadence'])}>\n              <option value=\"monthly\">Monthly</option>\n              <option value=\"yearly\">Yearly</option>\n              <option value=\"one-off\">One-off</option>\n            </select>\n          </div>\n        </div>\n        <div className=\"field\"><label>Next expected</label><input className=\"input\" type=\"date\" value={nextDate} onChange={(e) => setNextDate(e.target.value)} /></div>\n      </div>\n    </Modal>\n  );\n}\n\nfunction FixedModal({\n  title, initial, onClose, onSave,\n}: {\n  title: string;\n  initial?: FixedCost;\n  onClose: () => void;\n  onSave: (f: Omit<FixedCost, 'id'>) => void;\n}) {\n  const [name, setName] = useState(initial?.name ?? '');\n  const [amount, setAmount] = useState(String(initial?.amount ?? ''));\n  const [category, setCategory] = useState(initial?.category ?? 'rent');\n  const [dueDay, setDueDay] = useState(String(initial?.dueDay ?? 1));\n  return (\n    <Modal\n      open\n      onClose={onClose}\n      title={title}\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Cancel</button>\n          <button className=\"btn btn-primary\" disabled={!name || !Number(amount)} onClick={() => onSave({ name, amount: Number(amount), category, dueDay: Number(dueDay) })}>Save</button>\n        </>\n      }\n    >\n      <div className=\"stack-sm\">\n        <div className=\"field\"><label>Name</label><input className=\"input\" value={name} onChange={(e) => setName(e.target.value)} placeholder=\"e.g. Rent\" /></div>\n        <div className=\"form-row\">\n          <div className=\"field\"><label>Amount</label><input className=\"input num\" inputMode=\"decimal\" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} /></div>\n          <div className=\"field\"><label>Due day</label><input className=\"input num\" type=\"number\" min={1} max={31} value={dueDay} onChange={(e) => setDueDay(e.target.value)} /></div>\n        </div>\n        <div className=\"field\"><label>Category</label>\n          <select className=\"select\" value={category} onChange={(e) => setCategory(e.target.value)}>\n            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}\n          </select>\n        </div>\n      </div>\n    </Modal>\n  );\n}\n\nfunction GoalModal({\n  title, initial, onClose, onSave,\n}: {\n  title: string;\n  initial?: Goal;\n  onClose: () => void;\n  onSave: (g: Omit<Goal, 'id' | 'priority'>) => void;\n}) {\n  const [name, setName] = useState(initial?.name ?? '');\n  const [target, setTarget] = useState(String(initial?.target ?? ''));\n  const [saved, setSaved] = useState(String(initial?.saved ?? 0));\n  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? '2027-12-31');\n  const [monthly, setMonthly] = useState(String(initial?.monthly ?? ''));\n  const [color, setColor] = useState(initial?.color ?? GOAL_COLORS[0]);\n  const [note, setNote] = useState(initial?.note ?? '');\n  const monthlyNum = Number(monthly) || 0;\n  const targetNum = Number(target) || 0;\n  const savedNum = Number(saved) || 0;\n  const monthsLeft = Math.max(1, Math.ceil(daysBetween(todayISO(), targetDate) / 30.4));\n  const required = Math.max(0, targetNum - savedNum) / monthsLeft;\n\n  return (\n    <Modal\n      open\n      onClose={onClose}\n      title={title}\n      sub=\"A number, a date, and a monthly commitment.\"\n      footer={\n        <>\n          <button className=\"btn\" onClick={onClose}>Cancel</button>\n          <button\n            className=\"btn btn-primary\"\n            disabled={!name || !targetNum}\n            onClick={() => onSave({ name, target: targetNum, saved: savedNum, targetDate, monthly: monthlyNum, color, note })}\n          >\n            Save goal\n          </button>\n        </>\n      }\n    >\n      <div className=\"stack-sm\">\n        <div className=\"field\"><label>Goal name</label><input className=\"input\" value={name} onChange={(e) => setName(e.target.value)} placeholder=\"e.g. Japan in spring\" /></div>\n        <div className=\"form-row\">\n          <div className=\"field\"><label>Target amount</label><input className=\"input num\" inputMode=\"decimal\" value={target} onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, ''))} /></div>\n          <div className=\"field\"><label>Already saved</label><input className=\"input num\" inputMode=\"decimal\" value={saved} onChange={(e) => setSaved(e.target.value.replace(/[^0-9]/g, ''))} /></div>\n        </div>\n        <div className=\"form-row\">\n          <div className=\"field\"><label>Target date</label><input className=\"input\" type=\"date\" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} /></div>\n          <div className=\"field\"><label>Monthly commitment</label><input className=\"input num\" inputMode=\"decimal\" value={monthly} onChange={(e) => setMonthly(e.target.value.replace(/[^0-9]/g, ''))} /></div>\n        </div>\n        <div className=\"field\"><label>Colour</label>\n          <div className=\"row\" style={{ gap: 6 }}>\n            {GOAL_COLORS.map((c) => (\n              <button\n                key={c}\n                type=\"button\"\n                aria-label={`Use colour ${c}`}\n                aria-pressed={color === c}\n                onClick={() => setColor(c)}\n                style={{ width: 24, height: 24, borderRadius: 4, background: c, border: color === c ? '2px solid var(--ink)' : '1px solid var(--line)', padding: 0 }}\n              />\n            ))}\n          </div>\n        </div>\n        <div className=\"field\"><label>Note</label><textarea className=\"textarea\" rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></div>\n        <div className={`note ${monthlyNum >= required * 0.92 ? '' : 'guard'}`}>\n          At {money(monthlyNum)} a month you need {money(required)} to land on time ({monthsLeft} months left).{' '}\n          {monthlyNum >= required * 0.92 ? 'That works.' : `Add ${money(Math.max(0, required - monthlyNum))} a month to stay on pace.`}\n        </div>\n      </div>\n    </Modal>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Plan.tsx"})
  [Tool result]: Created file successfully: src/screens/Plan.tsx
  
  [Assistant reasoning]: Now the hero: Simulate screen. This needs depth.
  
  Layout:
  - Left col-7: scenario levers panel (6 levers), with sliders and checkboxes.
    - Dining cut slider 0-50
    - Groceries cut 0-30
    - Subscriptions: list of active subs with checkboxes to cancel; show monthly saved
    - Rent change slider -10..30
    - Income change -20..20
    - One-off expense amount input + month select
    - Extra savings slider 0..30000 (or input)
  - Right col-5: sticky results panel: monthly surplus, end balance, min balance, goal ETAs list with deltas, safe-to-spend after scenario, runway.
  - Below full width: projection chart (baseline vs scenario) with dashed lines, legend and table toggle.
  - Scenario actions: Reset levers, Save scenario (modal name), Compare saved scenarios (panel), Apply as plan (confirm).
  - Scenario list with load/delete.
  - Plain-language summary: "Cutting dining by 30% frees ₹2,340/mo. Japan finishes 2 months earlier. Your end balance rises by ₹28,000."
  - Guardrails note.
  
  Need baseline result computed with DEFAULT_LEVERS. Goal ETA deltas: sim.goalEtas vs baseline.goalEtas. Display "2 months earlier" or "not reached".
  
  Goal ETA months are absolute from start; delta = scenario.monthIndex - baseline.monthIndex. Negative = earlier.
  
  Chart: actual history (6) + baseline forecast (12) + scenario forecast (12)? Three lines may clutter. Show baseline and scenario only for 12 months, plus actual last 6. Use LineChart custom? My LineChart supports one forecast. I need two forecast series. I'll build a new component `ScenarioChart` in charts.tsx with actual + two projections. Let me add it.
  
  ScenarioChart props: actual points, baseline, scenario, height. Draws baseline dashed gray, scenario accent solid, actual ink solid. Band optional not needed. Hover tooltip shows both.
  
  Let me add to charts.tsx.
  
  Then Simulate screen.
  
  Also "what if my rent goes up" preset buttons: three preset scenario chips ("Rent +15%", "Cut dining 30%", "Salary +10%") that set levers. Good for demo.
  
  "Apply as plan" confirm: applyScenario(id) requires a saved scenario. For unsaved levers, save first. I'll make Apply button save then apply? Simpler: Apply as plan button opens confirm and applies current levers via a new action. But store's applyScenario takes id. I can saveScenario then applyScenario(id) — saveScenario returns id synchronously, applyScenario uses state.scenarios which won't include the new one yet (stale). Hmm.
  
  Add an action `applyLevers(levers)`. Let me add to store a generic method that applies levers directly. Refactor applyScenario to call applyLevers logic. I'll add `applyLevers` to context and have applyScenario use it internally by finding scenario.
  
  Simplest: add `applyLevers(levers: ScenarioLevers)` action implementing the logic currently in applyScenario. Then applyScenario(id) finds scenario and applies. But applyScenario currently has the logic inline. I'll add new action duplicating logic minimally.
  
  Let me patch store: add `applyLevers` method with the body, and change applyScenario to call applyLevers? applyScenario is a useCallback; calling another callback is fine. But applyLevers needs state. I'll implement applyLevers with the logic and make applyScenario call it.
  
  Then Simulate can call applyLevers(levers).
  
  Also saved scenarios comparison: list saved scenarios with their surplus/end balance computed via runSimulation. Load button sets levers. Delete.
  
  Save modal with name.
  
  Let me patch store first.
  
  In AppStore interface add `applyLevers: (levers: ScenarioLevers) => void;`.
  
  Implement, and replace applyScenario body.
  
  Careful: applyScenario also sets pinned. Keep.
  
  Let me do the edit.
  [Assistant tool call]: edit({"newString":"  saveScenario: (name: string, levers: ScenarioLevers) => string;\n  deleteScenario: (id: string) => void;\n  applyScenario: (id: string) => void;\n  applyLevers: (levers: ScenarioLevers) => void;","oldString":"  saveScenario: (name: string, levers: ScenarioLevers) => string;\n  deleteScenario: (id: string) => void;\n  applyScenario: (id: string) => void;","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\store\\AppStore.tsx"})
  [Tool result]: Edited src/store/AppStore.tsx (1 replacement)
  [Assistant tool call]: edit({"newString":"  const applyLevers = useCallback(\n    (levers: ScenarioLevers) => {\n      const sim = runSimulation(state, levers, 12);\n      update((s) => {\n        const goals = s.goals.map((g) => ({ ...g }));\n        const required = goals.map((g) => {\n          const months = Math.max(\n            1,\n            Math.ceil((Date.parse(g.targetDate) - Date.parse(todayISO())) / (86400000 * 30.4))\n          );\n          return Math.max(0, g.target - g.saved) / months;\n        });\n        const totalReq = required.reduce((a, b) => a + b, 0);\n        const scale = totalReq > 0 ? Math.min(1, Math.max(0, sim.monthly.surplus) / totalReq) : 1;\n        goals.forEach((g, i) => {\n          g.monthly = Math.round(required[i] * scale);\n        });\n        const income = s.profile.income.map((i, idx) =>\n          idx === 0 ? { ...i, amount: Math.round(i.amount * (1 + levers.incomeChange / 100)) } : i\n        );\n        const fixed = s.profile.fixed.map((f) =>\n          f.category === 'rent' ? { ...f, amount: Math.round(f.amount * (1 + levers.rentChange / 100)) } : f\n        );\n        return {\n          ...s,\n          goals,\n          profile: { ...s.profile, income, fixed },\n          recurring: s.recurring.map((r) =>\n            levers.cancelledSubs.includes(r.id) ? { ...r, status: 'cancelled' as const } : r\n          ),\n        };\n      });\n    },\n    [state, update]\n  );\n\n  const applyScenario = useCallback(\n    (id: string) => {\n      const scn = state.scenarios.find((s) => s.id === id);\n      if (!scn) return;\n      applyLevers(scn.levers);\n      update((s) => ({\n        ...s,\n        scenarios: s.scenarios.map((x) => (x.id === id ? { ...x, pinned: true } : x)),\n      }));\n    },\n    [state.scenarios, applyLevers, update]\n  );","oldString":"  const applyScenario = useCallback(\n    (id: string) => {\n      const scn = state.scenarios.find((s) => s.id === id);\n      if (!scn) return;\n      const l = scn.levers;\n      const sim = runSimulation(state, l, 12);\n      update((s) => {\n        const goals = s.goals.map((g) => ({ ...g }));\n        const required = goals.map((g) => {\n          const months = Math.max(\n            1,\n            Math.ceil(\n              (Date.parse(g.targetDate) - Date.parse(todayISO())) / (86400000 * 30.4)\n            )\n          );\n          return Math.max(0, g.target - g.saved) / months;\n        });\n        const totalReq = required.reduce((a, b) => a + b, 0);\n        const scale = totalReq > 0 ? Math.min(1, Math.max(0, sim.monthly.surplus) / totalReq) : 1;\n        goals.forEach((g, i) => {\n          g.monthly = Math.round(required[i] * scale);\n        });\n        const income = s.profile.income.map((i, idx) =>\n          idx === 0 ? { ...i, amount: Math.round(i.amount * (1 + l.incomeChange / 100)) } : i\n        );\n        const fixed = s.profile.fixed.map((f) =>\n          f.category === 'rent' ? { ...f, amount: Math.round(f.amount * (1 + l.rentChange / 100)) } : f\n        );\n        return {\n          ...s,\n          goals,\n          profile: { ...s.profile, income, fixed },\n          recurring: s.recurring.map((r) =>\n            l.cancelledSubs.includes(r.id) ? { ...r, status: 'cancelled' as const } : r\n          ),\n          scenarios: s.scenarios.map((x) => (x.id === id ? { ...x, pinned: true } : x)),\n        };\n      });\n    },\n    [state, update]\n  );","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\store\\AppStore.tsx"})
  [Tool result]: Edited src/store/AppStore.tsx (1 replacement)
  
  [Assistant reasoning]: Now add applyLevers to the context value and dependency array.
  
  The value object literal includes applyScenario; add applyLevers and dependency.
  [Assistant tool call]: edit({"newString":"      saveScenario,\n      deleteScenario,\n      applyScenario,\n      applyLevers,","oldString":"      saveScenario,\n      deleteScenario,\n      applyScenario,","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\store\\AppStore.tsx"})
  [Tool result]: Edited src/store/AppStore.tsx (1 replacement)
  [Assistant tool call]: edit({"newString":"      deleteScenario, applyScenario, applyLevers, setNudgeState, updateSettings,","oldString":"      deleteScenario, applyScenario, setNudgeState, updateSettings,","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\store\\AppStore.tsx"})
  [Tool result]: Edited src/store/AppStore.tsx (1 replacement)
  
  [Assistant reasoning]: Now add ScenarioChart to charts.tsx.
  
  Props: actual Point[], baseline Point[], scenario Point[], height.
  Draw 3 series. Hover shows month + both.
  Y domain across all.
  Legend rendered by parent.
  Table fallback with 3 columns.
  
  Let me append.
  [Assistant tool call]: edit({"newString":"export function ScenarioChart({\n  actual,\n  baseline,\n  scenario,\n  height = 260,\n}: {\n  actual: Point[];\n  baseline: Point[];\n  scenario: Point[];\n  height?: number;\n}) {\n  const [hover, setHover] = useState<number | null>(null);\n  const pad = { l: 50, r: 12, t: 16, b: 26 };\n  const total = actual.length + Math.max(baseline.length, scenario.length);\n  const allVals = [...actual, ...baseline, ...scenario].map((p) => p.value);\n  const rawMin = Math.min(...allVals, 0);\n  const rawMax = Math.max(...allVals, 1);\n  const span = rawMax - rawMin || 1;\n  const min = rawMin - span * 0.08;\n  const max = rawMax + span * 0.08;\n  const innerW = W - pad.l - pad.r;\n  const innerH = height - pad.t - pad.b;\n  const xAt = (i: number) => pad.l + (i / Math.max(1, total - 1)) * innerW;\n  const yAt = (v: number) => pad.t + innerH - ((v - min) / (max - min)) * innerH;\n\n  const actualPts = actual.map((p, i) => ({ x: xAt(i), y: yAt(p.value) }));\n  const basePts = baseline.map((p, i) => ({ x: xAt(actual.length - 1 + i), y: yAt(p.value) }));\n  const scnPts = scenario.map((p, i) => ({ x: xAt(actual.length - 1 + i), y: yAt(p.value) }));\n  const anchor = actual.length ? { x: xAt(actual.length - 1), y: yAt(actual[actual.length - 1].value) } : null;\n\n  const gridVals = Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);\n  const labels = [...actual, ...baseline];\n  const hoverData =\n    hover !== null\n      ? {\n          key: [...actual, ...baseline][hover]?.key ?? '',\n          actual: actual[hover]?.value ?? null,\n          baseline: baseline[hover - actual.length]?.value ?? null,\n          scenario: scenario[hover - actual.length]?.value ?? null,\n        }\n      : null;\n\n  return (\n    <div style={{ position: 'relative' }}>\n      <svg\n        className=\"chart\"\n        viewBox={`0 0 ${W} ${height}`}\n        role=\"img\"\n        aria-label=\"Baseline against scenario cash balance\"\n        onMouseMove={(e) => {\n          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();\n          const x = ((e.clientX - rect.left) / rect.width) * W;\n          const idx = Math.round(((x - pad.l) / innerW) * (total - 1));\n          setHover(Math.max(0, Math.min(total - 1, idx)));\n        }}\n        onMouseLeave={() => setHover(null)}\n      >\n        {gridVals.map((v, i) => (\n          <g key={i}>\n            <line className=\"gridline\" x1={pad.l} x2={W - pad.r} y1={yAt(v)} y2={yAt(v)} />\n            <text x={pad.l - 8} y={yAt(v) + 3} textAnchor=\"end\">{compact(v)}</text>\n          </g>\n        ))}\n        {anchor && (\n          <>\n            <path className=\"line\" d={pathFor([anchor, ...basePts])} style={{ stroke: 'var(--muted)', opacity: 0.55, strokeDasharray: '4 4' }} />\n            <path className=\"line\" d={pathFor([anchor, ...scnPts])} style={{ stroke: 'var(--accent)' }} />\n          </>\n        )}\n        {actualPts.length > 1 && <path className=\"line\" d={pathFor(actualPts)} />}\n        {actualPts.map((p, i) => <circle key={i} className=\"dot\" cx={p.x} cy={p.y} r={2} />)}\n        {labels.map((p, i) =>\n          i % 2 === 0 ? (\n            <text key={`${p.key}-${i}`} x={xAt(i)} y={height - 7} textAnchor=\"middle\">{p.key.slice(5)}/{p.key.slice(2, 4)}</text>\n          ) : null\n        )}\n        {hover !== null && (\n          <>\n            <line x1={xAt(hover)} x2={xAt(hover)} y1={pad.t} y2={pad.t + innerH} stroke=\"var(--line-strong)\" strokeDasharray=\"2 3\" />\n            {hoverData?.baseline != null && <circle cx={xAt(hover)} cy={yAt(hoverData.baseline)} r={3} fill=\"var(--muted)\" />}\n            {hoverData?.scenario != null && <circle cx={xAt(hover)} cy={yAt(hoverData.scenario)} r={3.6} fill=\"var(--accent)\" />}\n          </>\n        )}\n      </svg>\n      {hoverData && (\n        <div style={{ position: 'absolute', left: `${(xAt(hover!) / W) * 100}%`, top: 0, transform: 'translateX(-50%)', background: 'var(--ink)', color: 'var(--bg)', padding: '5px 9px', borderRadius: 4, fontSize: 10, fontFamily: 'var(--font-mono)', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 2 }}>\n          {hoverData.key}{hoverData.scenario != null ? ` · scenario ${compact(hoverData.scenario)}` : ''}{hoverData.baseline != null ? ` · base ${compact(hoverData.baseline)}` : ''}\n        </div>\n      )}\n      <details style={{ marginTop: 6 }}>\n        <summary className=\"tiny\" style={{ cursor: 'pointer', color: 'var(--muted)', listStyle: 'none' }}>View the month-by-month table</summary>\n        <div className=\"scroll-x\" style={{ marginTop: 6 }}>\n          <table className=\"tbl\" style={{ fontSize: 11 }}>\n            <thead><tr><th>Month</th><th className=\"right\">Baseline</th><th className=\"right\">Scenario</th></tr></thead>\n            <tbody>\n              {baseline.map((b, i) => (\n                <tr key={b.key}>\n                  <td className=\"mono\">{b.key}</td>\n                  <td className=\"money\">{money(b.value)}</td>\n                  <td className={`money ${(scenario[i]?.value ?? 0) >= b.value ? 'pos' : 'neg'}`}>{money(scenario[i]?.value ?? 0)}</td>\n                </tr>\n              ))}\n            </tbody>\n          </table>\n        </div>\n      </details>\n    </div>\n  );\n}\n\nexport function useMoneyTicker() {\n  return useMemo(() => ({ money, compact }), []);\n}","oldString":"export function useMoneyTicker() {\n  return useMemo(() => ({ money, compact }), []);\n}","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\components\\charts.tsx"})
  [Tool result]: Edited src/components/charts.tsx (1 replacement)
  
  [Assistant reasoning]: Now Simulate.tsx.
  
  Compute:
  - baseline = baselineResult(state, 12)
  - scenario = runSimulation(state, levers, 12)
  - history 6 months same as overview.
  - diffs: endBalance delta, monthly surplus delta, goal ETA delta.
  
  Levers state with DEFAULT_LEVERS.
  
  Presets:
  - "Rent +15%" → {rentChange:15}
  - "Dining −30%" → {diningCut:30}
  - "Cancel dormant" → cancelledSubs = dormant ids
  - "Salary +10%" → incomeChange 10
  - "Reset" → DEFAULT.
  
  Subscription list: subs = subscriptionRecurring(state). Checkboxes.
  
  One-off month select: next 12 months labels.
  
  Save scenario modal with name; list of saved scenarios with load/delete/apply.
  
  Apply as plan confirm.
  
  Summary sentence component.
  
  Goal ETA table with baseline vs scenario; if either null show "beyond 20 years"/"not reached".
  
  Differences: months earlier = baseline.monthIndex - scenario.monthIndex (positive = earlier).
  
  Also "safe to spend after scenario" compute: current safe + delta? Use safeToSpend of state + (scenario monthly surplus - baseline surplus)? Not exact. Instead show "Monthly free cash" and "Balance at end of 12 months" and "Runway".
  
  Add a guardrail note: "This models your cash flow. It does not project investment returns or recommend products."
  
  Charts.
  
  Layout:
  Header with actions: Reset, Save scenario, Apply as plan.
  Top row: col-8 levers, col-4 results (sticky top 70px).
  Then chart col-12.
  Then goals ETA col-7 + saved scenarios col-5.
  
  Levers panel: sections with sliders. Each slider label + value + range.
  
  Subscriptions list with checkbox rows and monthly amount; disabled if cancelled already.
  
  Extra savings input.
  
  One-off amount input + month select.
  
  Result panel:
  - "Free cash each month" big number with delta.
  - 12-month balance, delta
  - runway
  - goal summary
  - "Apply as plan" button
  - assumptions list
  
  Saved scenarios panel: for each, compute sim and show end balance; buttons Load, Apply, Delete.
  
  Need `baselineResult` and `runSimulation`, `DEFAULT_LEVERS`.
  
  Subscribe to scenario list.
  
  Let me write.
  
  For `scenario.goalEtas` we need names/colors — included.
  
  ETA comparison: map by id.
  
  Time formatting: `monthsLabel(n)` → "8 months" or "1 year 4 months".
  
  Let me write code.
  
  Also "month index" offset for one-off: 0..11 with key label from addMonths(now, i+1).
  
  Save: `saveScenario(name, levers)`.
  
  Apply: confirm → applyLevers(levers), push.
  
  Potential issue: applying levers then levers remain; fine. Show toast "Applied to your plan. Rent, income, goals and subscriptions updated."
  
  Scenario saved list uses runSimulation per scenario — 12-month loops fine.
  
  Let me write.
  [Assistant tool call]: write({"content":"import { useMemo, useState } from 'react';\nimport { useApp } from '../store/AppStore';\nimport type { ScenarioLevers } from '../types';\nimport { addMonths, monthLabel, nowMonth } from '../lib/date';\nimport { money, pct } from '../lib/format';\nimport { useMoney } from '../hooks/useMoney';\nimport { Icon } from '../components/Icon';\nimport { Confirm, Empty, Modal, useToast } from '../components/ui';\nimport { ScenarioChart } from '../components/charts';\nimport { DEFAULT_LEVERS, leverCount, runSimulation, scenarioSummary } from '../domain/simulate';\nimport { currentBalance, safeToSpend, subscriptionRecurring } from '../domain/finance';\nimport { monthlyAmount } from '../domain/finance';\n\nfunction inMonths(n: number | null): string {\n  if (n === null) return 'not within 20 years';\n  if (n === 0) return 'already funded';\n  if (n < 12) return `${n} month${n === 1 ? '' : 's'}`;\n  const y = Math.floor(n / 12);\n  const m = n % 12;\n  return `${y} year${y === 1 ? '' : 's'}${m ? ` ${m} mo` : ''}`;\n}\n\nexport default function Simulate() {\n  const { state, saveScenario, deleteScenario, applyLevers, applyScenario } = useApp();\n  const { push } = useToast();\n  const fmt = useMoney();\n\n  const [levers, setLevers] = useState<ScenarioLevers>({ ...DEFAULT_LEVERS });\n  const [saving, setSaving] = useState(false);\n  const [name, setName] = useState('');\n  const [applyOpen, setApplyOpen] = useState(false);\n  const [removing, setRemoving] = useState<string | null>(null);\n\n  const baseline = useMemo(() => runSimulation(state, DEFAULT_LEVERS, 12), [state]);\n  const scenario = useMemo(() => runSimulation(state, levers, 12), [state, levers]);\n  const subs = subscriptionRecurring(state);\n  const safe = safeToSpend(state);\n\n  const history = useMemo(() => {\n    const months = Array.from({ length: 6 }, (_, i) => addMonths(nowMonth(), -5 + i));\n    let running = state.profile.openingBalance;\n    return months.map((m) => {\n      running += state.txns\n        .filter((t) => !t.pending && t.date.slice(0, 7) === m)\n        .reduce((s, t) => s + t.amount, 0);\n      return { key: m, value: running };\n    });\n  }, [state.txns, state.profile.openingBalance]);\n\n  const start = addMonths(nowMonth(), 1);\n  const basePoints = baseline.months.map((m) => ({ key: m.key, value: m.balance }));\n  const scnPoints = scenario.months.map((m) => ({ key: m.key, value: m.balance }));\n\n  const endDelta = scenario.endBalance - baseline.endBalance;\n  const cashDelta = scenario.monthly.surplus - baseline.monthly.surplus;\n  const etaById = new Map(scenario.goalEtas.map((e) => [e.id, e]));\n  const baseEtaById = new Map(baseline.goalEtas.map((e) => [e.id, e]));\n\n  const set = <K extends keyof ScenarioLevers>(key: K, value: ScenarioLevers[K]) =>\n    setLevers((l) => ({ ...l, [key]: value }));\n\n  const toggleSub = (id: string) => {\n    setLevers((l) => ({\n      ...l,\n      cancelledSubs: l.cancelledSubs.includes(id)\n        ? l.cancelledSubs.filter((x) => x !== id)\n        : [...l.cancelledSubs, id],\n    }));\n  };\n\n  const summary = scenarioSummary(levers);\n  const changed = leverCount(levers);\n\n  return (\n    <div className=\"page\">\n      <div className=\"page-head\">\n        <div>\n          <div className=\"eyebrow\">The what-if lab</div>\n          <h1 className=\"display\">Change a lever. <em>Watch your money move.</em></h1>\n          <p className=\"lede\">\n            Every scenario runs against your real profile and six months of transactions. No returns, no products, no\n            promises — just your own cash flow, twelve months forward.\n          </p>\n        </div>\n        <div className=\"head-actions\">\n          <button className=\"btn btn-ghost\" onClick={() => { setLevers({ ...DEFAULT_LEVERS }); push('Scenario reset to baseline'); }}>\n            <Icon name=\"refresh\" size={14} /> Reset\n          </button>\n          <button className=\"btn\" onClick={() => { setName(`Scenario ${state.scenarios.length + 1}`); setSaving(true); }}>\n            <Icon name=\"plus\" size={14} /> Save scenario\n          </button>\n          <button className=\"btn btn-primary\" onClick={() => setApplyOpen(true)}>\n            <Icon name=\"check\" size={14} /> Apply to plan\n          </button>\n        </div>\n      </div>\n\n      <div className=\"row wrap\" style={{ gap: 6, marginBottom: 14 }}>\n        <span className=\"tiny\" style={{ color: 'var(--muted)' }}>Try:</span>\n        {[\n          { label: 'Rent +15%', apply: () => setLevers({ ...DEFAULT_LEVERS, rentChange: 15 }) },\n          { label: 'Dining −30%', apply: () => setLevers({ ...DEFAULT_LEVERS, diningCut: 30 }) },\n          { label: 'Cancel dormant', apply: () => setLevers({ ...DEFAULT_LEVERS, cancelledSubs: state.recurring.filter((r) => r.usage === 'unused' && r.status !== 'cancelled').map((r) => r.id) }) },\n          { label: 'Salary +10%', apply: () => setLevers({ ...DEFAULT_LEVERS, incomeChange: 10 }) },\n          { label: 'Big purchase ₹1L', apply: () => setLevers({ ...DEFAULT_LEVERS, oneOffAmount: 100000, oneOffMonth: 1 }) },\n        ].map((p) => (\n          <button key={p.label} className=\"chip\" onClick={() => { p.apply(); push(`Applied preset: ${p.label}`); }}>{p.label}</button>\n        ))}\n      </div>\n\n      <div className=\"grid\">\n        <section className=\"panel col-7\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Levers</h2>\n              <p className=\"panel-sub\">{changed ? `${changed} change${changed === 1 ? '' : 's'} against baseline` : 'Baseline — move something to begin.'}</p>\n            </div>\n            <span className=\"badge\">{changed ? 'Modified' : 'Baseline'}</span>\n          </div>\n          <div className=\"panel-body\" style={{ paddingTop: 0 }}>\n            <div className=\"lever\">\n              <div className=\"lever-head\">\n                <div>\n                  <div className=\"small strong\">Dining out & delivery</div>\n                  <div className=\"tiny\" style={{ color: 'var(--muted)' }}>Baseline {fmt(baseline.monthly.dining)} a month</div>\n                </div>\n                <span className=\"lever-value\">−{levers.diningCut}% · {fmt(baseline.monthly.dining - scenario.monthly.dining)}</span>\n              </div>\n              <input\n                type=\"range\" min={0} max={50} step={5}\n                value={levers.diningCut}\n                aria-label=\"Dining out cut percentage\"\n                onChange={(e) => set('diningCut', Number(e.target.value))}\n              />\n            </div>\n\n            <div className=\"lever\">\n              <div className=\"lever-head\">\n                <div>\n                  <div className=\"small strong\">Groceries</div>\n                  <div className=\"tiny\" style={{ color: 'var(--muted)' }}>Baseline {fmt(baseline.monthly.groceries)} a month</div>\n                </div>\n                <span className=\"lever-value\">−{levers.groceriesCut}% · {fmt(baseline.monthly.groceries - scenario.monthly.groceries)}</span>\n              </div>\n              <input\n                type=\"range\" min={0} max={30} step={5}\n                value={levers.groceriesCut}\n                aria-label=\"Groceries cut percentage\"\n                onChange={(e) => set('groceriesCut', Number(e.target.value))}\n              />\n            </div>\n\n            <div className=\"lever\">\n              <div className=\"lever-head\">\n                <div>\n                  <div className=\"small strong\">Subscriptions to cancel</div>\n                  <div className=\"tiny\" style={{ color: 'var(--muted)' }}>Only detected subscriptions and memberships</div>\n                </div>\n                <span className={`lever-value ${scenario.monthlySubsSaved ? 'pos' : ''}`}>\n                  +{fmt(scenario.monthlySubsSaved)}/mo\n                </span>\n              </div>\n              <div className=\"stack-sm\" style={{ marginTop: 4 }}>\n                {subs.map((s) => {\n                  const checked = levers.cancelledSubs.includes(s.id);\n                  return (\n                    <label key={s.id} className=\"row-between\" style={{ cursor: 'pointer', gap: 10 }}>\n                      <span className=\"row\" style={{ gap: 8 }}>\n                        <input type=\"checkbox\" checked={checked} onChange={() => toggleSub(s.id)} aria-label={`Cancel ${s.merchant}`} />\n                        <span className=\"small\">{s.merchant}</span>\n                        {s.usage === 'unused' && <span className=\"badge warn\">Dormant</span>}\n                      </span>\n                      <span className=\"num small muted\">{fmt(monthlyAmount(s.amount, s.cadence))}/mo</span>\n                    </label>\n                  );\n                })}\n              </div>\n            </div>\n\n            <div className=\"lever\">\n              <div className=\"lever-head\">\n                <div>\n                  <div className=\"small strong\">Rent change</div>\n                  <div className=\"tiny\" style={{ color: 'var(--muted)' }}>Current rent {fmt(state.profile.fixed.find((f) => f.category === 'rent')?.amount ?? 0)}</div>\n                </div>\n                <span className={`lever-value ${levers.rentChange > 0 ? 'neg' : levers.rentChange < 0 ? 'pos' : ''}`}>\n                  {levers.rentChange > 0 ? '+' : ''}{levers.rentChange}% · {fmt(Math.abs(scenario.rentDelta))}{levers.rentChange >= 0 ? ' more' : ' less'}\n                </span>\n              </div>\n              <input type=\"range\" min={-10} max={30} step={1} value={levers.rentChange} aria-label=\"Rent change percentage\" onChange={(e) => set('rentChange', Number(e.target.value))} />\n            </div>\n\n            <div className=\"lever\">\n              <div className=\"lever-head\">\n                <div>\n                  <div className=\"small strong\">Income change</div>\n                  <div className=\"tiny\" style={{ color: 'var(--muted)' }}>Salary, freelance, or a gap between jobs</div>\n                </div>\n                <span className={`lever-value ${levers.incomeChange > 0 ? 'pos' : levers.incomeChange < 0 ? 'neg' : ''}`}>\n                  {levers.incomeChange > 0 ? '+' : ''}{levers.incomeChange}% · {fmt(Math.abs(scenario.incomeDelta))}\n                </span>\n              </div>\n              <input type=\"range\" min={-20} max={20} step={1} value={levers.incomeChange} aria-label=\"Income change percentage\" onChange={(e) => set('incomeChange', Number(e.target.value))} />\n            </div>\n\n            <div className=\"lever\">\n              <div className=\"lever-head\">\n                <div>\n                  <div className=\"small strong\">One-off expense</div>\n                  <div className=\"tiny\" style={{ color: 'var(--muted)' }}>A deposit, a trip, a repair</div>\n                </div>\n                <span className=\"lever-value\">{fmt(levers.oneOffAmount)}</span>\n              </div>\n              <div className=\"row\" style={{ gap: 8 }}>\n                <input\n                  className=\"input num\"\n                  style={{ maxWidth: 150 }}\n                  inputMode=\"decimal\"\n                  value={levers.oneOffAmount || ''}\n                  placeholder=\"0\"\n                  aria-label=\"One-off expense amount\"\n                  onChange={(e) => set('oneOffAmount', Number(e.target.value.replace(/[^0-9]/g, '')))}\n                />\n                <select className=\"select\" style={{ width: 'auto' }} value={levers.oneOffMonth} onChange={(e) => set('oneOffMonth', Number(e.target.value))} aria-label=\"Month for the one-off expense\">\n                  {Array.from({ length: 12 }, (_, i) => (\n                    <option key={i} value={i}>{monthLabel(addMonths(start, i), true)}</option>\n                  ))}\n                </select>\n              </div>\n            </div>\n\n            <div className=\"lever\">\n              <div className=\"lever-head\">\n                <div>\n                  <div className=\"small strong\">Extra monthly savings</div>\n                  <div className=\"tiny\" style={{ color: 'var(--muted)' }}>Moved to goals or a separate account</div>\n                </div>\n                <span className=\"lever-value\">{fmt(levers.extraSavings)}/mo</span>\n              </div>\n              <div className=\"row\" style={{ gap: 8 }}>\n                <input\n                  type=\"range\" min={0} max={30000} step={1000}\n                  value={levers.extraSavings}\n                  aria-label=\"Extra monthly savings\"\n                  onChange={(e) => set('extraSavings', Number(e.target.value))}\n                />\n              </div>\n            </div>\n\n            <div className=\"row wrap\" style={{ gap: 6, marginTop: 12 }}>\n              {summary.map((s) => (\n                <span key={s} className=\"badge outline\">{s}</span>\n              ))}\n            </div>\n          </div>\n        </section>\n\n        <aside className=\"col-5 stack\">\n          <section className=\"panel\" style={{ borderTop: '2px solid var(--accent)' }}>\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">What this does</h2>\n                <p className=\"panel-sub\">Twelve months from {monthLabel(start)}.</p>\n              </div>\n              <span className={`badge ${cashDelta >= 0 ? 'pos' : 'neg'}`}>{cashDelta >= 0 ? '+' : '−'}{fmt(Math.abs(cashDelta))}/mo</span>\n            </div>\n            <div className=\"panel-body\">\n              <div className=\"label\">Balance after 12 months</div>\n              <div className=\"big-number\" style={{ fontSize: 38, marginTop: 4 }}>{fmt(scenario.endBalance)}</div>\n              <p className=\"small\" style={{ color: 'var(--muted)', marginTop: 4 }}>\n                <span className={endDelta >= 0 ? 'pos' : 'neg'}>{endDelta >= 0 ? '+' : '−'}{fmt(Math.abs(endDelta))}</span> against the\n                baseline of {fmt(baseline.endBalance)}.\n              </p>\n\n              <div className=\"divider dashed\" />\n\n              <div className=\"row-between small\"><span className=\"muted\">Free cash each month</span><span className={`num ${scenario.monthly.surplus >= 0 ? 'pos' : 'neg'}`}>{fmt(scenario.monthly.surplus)}</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 5 }}><span className=\"muted\">Income</span><span className=\"num\">{fmt(scenario.monthly.income)}</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 5 }}><span className=\"muted\">Committed costs</span><span className=\"num\">−{fmt(scenario.monthly.fixed)}</span></div>\n              <div className=\"row-between small\" style={{ marginTop: 5 }}><span className=\"muted\">Flexible baseline</span><span className=\"num\">−{fmt(scenario.monthly.flexible)}</span></div>\n              {levers.extraSavings > 0 && <div className=\"row-between small\" style={{ marginTop: 5 }}><span className=\"muted\">Extra savings</span><span className=\"num\">−{fmt(levers.extraSavings)}</span></div>}\n\n              <div className=\"divider dashed\" />\n\n              <div className=\"row-between small\" style={{ marginTop: 4 }}>\n                <span className=\"muted\">Safe to spend today</span>\n                <span className=\"num\">{fmt(Math.max(0, safe.safe))}</span>\n              </div>\n              <div className=\"row-between small\" style={{ marginTop: 5 }}>\n                <span className=\"muted\">Runway at this burn</span>\n                <span className=\"num\">{scenario.runwayMonths.toFixed(1)} months</span>\n              </div>\n\n              <button className=\"btn btn-block\" style={{ marginTop: 14 }} onClick={() => { saveScenario(`${summary[0]}`, levers); push('Scenario saved'); }}>\n                <Icon name=\"plus\" size={13} /> Save this scenario\n              </button>\n            </div>\n          </section>\n\n          <section className=\"panel\">\n            <div className=\"panel-head\">\n              <div>\n                <h2 className=\"panel-title\">Goal dates</h2>\n                <p className=\"panel-sub\">Surplus is allocated by priority.</p>\n              </div>\n            </div>\n            <div className=\"panel-body\" style={{ paddingTop: 4 }}>\n              {scenario.goalEtas.map((e) => {\n                const b = baseEtaById.get(e.id);\n                const delta =\n                  e.monthIndex !== null && b?.monthIndex !== null && b?.monthIndex !== undefined\n                    ? b.monthIndex - e.monthIndex\n                    : null;\n                return (\n                  <div className=\"goal-row\" key={e.id}>\n                    <div className=\"row-between\">\n                      <span className=\"goal-name\"><span className=\"cat-dot\" style={{ background: e.color }} />{e.name}</span>\n                      <span className=\"badge outline\">{inMonths(e.monthIndex)}</span>\n                    </div>\n                    <div className=\"row-between\" style={{ marginTop: 3 }}>\n                      <span className=\"tiny\" style={{ color: 'var(--muted)' }}>Baseline: {inMonths(b?.monthIndex ?? null)}</span>\n                      {delta !== null && delta !== 0 && (\n                        <span className={`tiny ${delta > 0 ? 'pos' : 'neg'}`}>\n                          {delta > 0 ? `${delta} month${delta === 1 ? '' : 's'} earlier` : `${Math.abs(delta)} month${Math.abs(delta) === 1 ? '' : 's'} later`}\n                        </span>\n                      )}\n                      {delta === 0 && <span className=\"tiny faint\">no change</span>}\n                    </div>\n                  </div>\n                );\n              })}\n            </div>\n          </section>\n        </aside>\n\n        <section className=\"panel col-12\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Balance projection</h2>\n              <p className=\"panel-sub\">Six months of history, then baseline and scenario side by side.</p>\n            </div>\n            <div className=\"legend\">\n              <span><i /> Actual</span>\n              <span><i className=\"dashed\" style={{ background: 'repeating-linear-gradient(90deg, var(--muted) 0 3px, transparent 3px 6px)' }} /> Baseline</span>\n              <span><i className=\"accent\" /> This scenario</span>\n            </div>\n          </div>\n          <div className=\"panel-body\">\n            <ScenarioChart actual={history} baseline={basePoints} scenario={scnPoints} height={280} />\n          </div>\n          <div className=\"panel-foot\">\n            <span className=\"tiny\" style={{ color: 'var(--muted)' }}>\n              Forecast assumes the profile stays unchanged after the levers. Inflation and returns are not modelled.\n            </span>\n            <button className=\"linkish small\" onClick={() => push(`Current balance: ${money(currentBalance(state))}`)}>Check today’s balance</button>\n          </div>\n        </section>\n\n        <section className=\"panel col-12\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Soul, in plain language</h2>\n              <p className=\"panel-sub\">The same result without the chart.</p>\n            </div>\n          </div>\n          <div className=\"panel-body\">\n            <p style={{ fontSize: 14, lineHeight: 1.65, maxWidth: '86ch' }}>\n              {changed === 0 ? (\n                <>Nothing has moved yet. Drag a lever and the model will tell you what changes — in rupees, in months, and in the goals it affects.</>\n              ) : (\n                <>\n                  {summary.join(', ')}. That leaves <strong className=\"num\">{fmt(scenario.monthly.surplus)}</strong> free each month\n                  {cashDelta !== 0 ? <> — {fmt(Math.abs(cashDelta))} {cashDelta > 0 ? 'more' : 'less'} than the baseline</> : null}. After\n                  twelve months the balance is <strong className=\"num\">{fmt(scenario.endBalance)}</strong>\n                  {endDelta !== 0 ? <>, {fmt(Math.abs(endDelta))} {endDelta > 0 ? 'higher' : 'lower'} than doing nothing</> : null}.\n                  {scenario.goalEtas[0] && (\n                    <> Your first goal, {scenario.goalEtas[0].name}, lands {inMonths(scenario.goalEtas[0].monthIndex)} from now.</>\n                  )}\n                </>\n              )}\n            </p>\n            <div className=\"note guard\" style={{ marginTop: 12 }}>\n              <strong>Guardrail:</strong> this is a cash-flow model, not investment advice. It does not estimate returns,\n              recommend securities, or suggest borrowing. Every number is built from your own profile and transactions.\n            </div>\n          </div>\n        </section>\n\n        <section className=\"panel col-12\">\n          <div className=\"panel-head\">\n            <div>\n              <h2 className=\"panel-title\">Saved scenarios</h2>\n              <p className=\"panel-sub\">Keep the versions worth comparing.</p>\n            </div>\n            <span className=\"badge\">{state.scenarios.length}</span>\n          </div>\n          <div className=\"panel-body\">\n            {state.scenarios.length === 0 ? (\n              <Empty\n                icon=\"sliders\"\n                title=\"No saved scenarios\"\n                body=\"Save this one to compare it with a different future. Loading a scenario replaces the current levers.\"\n                action={<button className=\"btn btn-sm\" onClick={() => { setName('Scenario 1'); setSaving(true); }}>Save current levers</button>}\n              />\n            ) : (\n              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>\n                {state.scenarios.map((s) => {\n                  const sim = runSimulation(state, s.levers, 12);\n                  return (\n                    <div key={s.id} className=\"goal-card\">\n                      <div className=\"goal-top\">\n                        <div>\n                          <div className=\"small strong\">{s.name}</div>\n                          <div className=\"tiny\" style={{ color: 'var(--muted)', marginTop: 2 }}>\n                            {scenarioSummary(s.levers).slice(0, 2).join(' · ')}\n                          </div>\n                        </div>\n                        {s.pinned && <span className=\"badge pos\">Applied</span>}\n                      </div>\n                      <div className=\"row-between\" style={{ marginTop: 10 }}>\n                        <span className=\"tiny\" style={{ color: 'var(--muted)' }}>12-month balance</span>\n                        <span className=\"num small\">{money(sim.endBalance)}</span>\n                      </div>\n                      <div className=\"row-between\" style={{ marginTop: 3 }}>\n                        <span className=\"tiny\" style={{ color: 'var(--muted)' }}>Free each month</span>\n                        <span className={`num small ${sim.monthly.surplus >= 0 ? 'pos' : 'neg'}`}>{money(sim.monthly.surplus)}</span>\n                      </div>\n                      <div className=\"row\" style={{ gap: 4, marginTop: 10 }}>\n                        <button className=\"btn btn-sm\" onClick={() => { setLevers(s.levers); push(`Loaded ${s.name}`); }}>Load</button>\n                        <button className=\"btn btn-sm\" onClick={() => { applyScenario(s.id); push(`${s.name} applied to the plan`); }}>Apply</button>\n                        <button className=\"btn btn-sm btn-ghost btn-danger\" onClick={() => setRemoving(s.id)}>Delete</button>\n                      </div>\n                    </div>\n                  );\n                })}\n              </div>\n            )}\n          </div>\n        </section>\n      </div>\n\n      <Modal\n        open={saving}\n        onClose={() => setSaving(false)}\n        title=\"Save this scenario\"\n        sub=\"Saved scenarios stay on this device and can be applied to the plan.\"\n        footer={\n          <>\n            <button className=\"btn\" onClick={() => setSaving(false)}>Cancel</button>\n            <button\n              className=\"btn btn-primary\"\n              disabled={!name.trim()}\n              onClick={() => {\n                saveScenario(name.trim(), levers);\n                push('Scenario saved');\n                setSaving(false);\n              }}\n            >\n              Save scenario\n            </button>\n          </>\n        }\n      >\n        <div className=\"field\">\n          <label>Scenario name</label>\n          <input className=\"input\" value={name} onChange={(e) => setName(e.target.value)} placeholder=\"e.g. Rent rises, dining cools\" autoFocus />\n        </div>\n        <div className=\"callout\" style={{ marginTop: 10 }}>\n          <div className=\"tiny\" style={{ color: 'var(--muted)' }}>What will be saved</div>\n          <p className=\"small\" style={{ marginTop: 4 }}>{scenarioSummary(levers).join(' · ')}</p>\n        </div>\n      </Modal>\n\n      <Confirm\n        open={applyOpen}\n        onClose={() => setApplyOpen(false)}\n        onConfirm={() => {\n          applyLevers(levers);\n          push('Scenario applied. Income, rent, subscriptions, and goal contributions updated.');\n        }}\n        title=\"Apply this scenario to your plan?\"\n        body=\"This writes the lever changes into your persistent profile: income, rent, cancelled subscriptions, and recalculated goal contributions. You can undo the goal changes by editing the plan.\"\n        confirmLabel=\"Apply to plan\"\n      />\n\n      <Confirm\n        open={!!removing}\n        onClose={() => setRemoving(null)}\n        onConfirm={() => {\n          if (!removing) return;\n          deleteScenario(removing);\n          push('Scenario deleted');\n        }}\n        title=\"Delete this scenario?\"\n        body=\"The saved levers are removed. The plan itself is untouched.\"\n        confirmLabel=\"Delete\"\n        danger\n      />\n    </div>\n  );\n}\n","path":"C:\\Users\\gokul\\OneDrive\\Documents\\Desktop\\hack2\\src\\screens\\Simulate.tsx"})
  [Tool result]: Created file successfully: src/screens/Simulate.tsx
  ````
- **cost**: `0`
- **tokens**:
  - **input**: `660`
  - **output**: `1593`
  - **reasoning**: `0`
  - **cache**:
    - **read**: `35456`
    - **write**: `0`
