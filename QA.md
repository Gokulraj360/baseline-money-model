# Baseline — Quality Assurance & Verification Matrix

**Product:** Baseline — Personal Finance Coach with Living Money Model  
**Stack:** React 19 + Vite 8 + TypeScript + Vitest  
**Currency & Locale:** INR (₹, Lakh/Crore)  
**Date Verified:** 2026-10-31  
**Build Status:** Clean (`tsc -b && vite build`) — 0 errors, 0 warnings  
**Test Suite:** 27 / 27 unit tests passed (`vitest run`)  
**Design System Integrity:** Source of truth `src/styles.css` strictly maintained (warm paper `#f3f1eb`, amber accent `#a9621a`, hairlines, mono numerals, no AI slop gradients/emojis).

---

## Comprehensive Feature Verification Matrix (28 Features)

| # | Feature | Screen / Component | Trigger / User Action | Expected Result | Status |
|---|---|---|---|---|---|
| 1 | **Messy CSV Ingestion** | `/inbox` | Drop or load sample bank CSV with header warnings and footer noise | Correctly parses transactions, dates (`DD/MM/YYYY`), debits/credits, skips junk lines | **PASS** |
| 2 | **PDF Statement Parsing** | `/inbox` | Drop or load PDF statement | `pdfjs-dist` extracts text layer; extracts dates, narration, signed amount, balances | **PASS** |
| 3 | **SMS Bank Alerts** | `/inbox` | Paste SMS alerts or click sample SMS | Regex parser recognizes Indian bank formats (HDFC, SBI, ICICI, Axis), signs credits/debits | **PASS** |
| 4 | **Hash Deduplication** | `/inbox`, `domain/parse.ts` | Import duplicate rows or re-import sample | SHA-like row hashing (`rowHash`) identifies identical lines; skips duplicates with counter | **PASS** |
| 5 | **Batch Review & Approve** | `/inbox` | Click "Approve & add to model" or "Discard batch" | Batch is either committed to active ledger or safely discarded; updates model immediately | **PASS** |
| 6 | **Manual Entry** | `/transactions` | Click "Add transaction", enter date, merchant, amount | Adds transaction into ledger, auto-categorizes with heuristic, updates balances | **PASS** |
| 7 | **Dense Ledger Table** | `/transactions` | Navigate ledger, resize between 375px and 1440px | High-density 25-row paginated table with mono tabular numerals, badges, and responsive overflow | **PASS** |
| 8 | **Full-Text Ledger Search** | `/transactions` | Type merchant or narration into search box | Real-time debounce-free instant filtering across description, merchant, and notes | **PASS** |
| 9 | **Multi-Facet Filtering** | `/transactions` | Filter by category, month, account, direction, pending | Combinatorial filtering instantly reflects count and subtotal | **PASS** |
| 10 | **Ledger Sorting** | `/transactions` | Toggle date desc/asc, amount desc/asc | Table correctly re-orders rows by absolute date or signed amount | **PASS** |
| 11 | **Inline Recategorization** | `/transactions` | Click category pill on transaction row | Opens recategorize modal with confidence explanation and category dropdown | **PASS** |
| 12 | **Learning Rule Engine** | `/transactions`, `store/AppStore.tsx` | Recategorize with "Learn a rule" checked | Derives pattern (e.g. `TRUFFLES ST MARKS ROAD`), creates or updates learned rule, accurate toast | **PASS** |
| 13 | **Retroactive Rule Application** | `/transactions`, `screens/Rules.tsx` | Check "Also apply to X matching past transactions" | Updates the current transaction AND all matching past transactions in one batch | **PASS** |
| 14 | **Rule Priority & Source** | `/rules` | View rules list | Priority ordering (higher priority evaluated first); badges show "Learned" vs "Manual" | **PASS** |
| 15 | **Custom Rule Authoring** | `/rules` | Click "New rule", choose contains/startsWith/exact/regex | Creates new rule with field selector (description vs merchant) and custom priority | **PASS** |
| 16 | **Rule Tester** | `/rules` | Click "Test rule" on any rule card | Runs pattern against all ledger transactions and shows matching count + sample matches | **PASS** |
| 17 | **On-Demand Retro-Apply** | `/rules` | Click "Apply to past" on any rule card | Re-evaluates entire transaction history and assigns category; reports updated count | **PASS** |
| 18 | **Subscription Radar** | `/recurring` | Scan recurring charges | Identifies recurring cadences (weekly, monthly, quarterly, yearly) with variance tolerance | **PASS** |
| 19 | **Price Change Alerts** | `/recurring` | View recurring list | Flags subscriptions with price increases and displays annualized rupee impact | **PASS** |
| 20 | **Dormant Subscription Detector** | `/recurring` | Filter by "Dormant" | Flags recurring commitments with no recent usage and shows monthly savings potential | **PASS** |
| 21 | **Subscription Status Management** | `/recurring` | Click "Cancel", "Keep", or "Snooze" | Updates subscription state; cancelled items are excluded from future cashflow projections | **PASS** |
| 22 | **Persistent Profile & Baseline** | `/plan` | Edit income sources, fixed costs (rent, EMI, etc.) | Updates living baseline; changes cascade to surplus and safe-to-spend | **PASS** |
| 23 | **Goal CRUD & On-Track Math** | `/plan` | Add goal with target date, edit contribution | Calculates required monthly savings vs actual; shows on-track / behind status chip | **PASS** |
| 24 | **Emergency Floor & Buffer** | `/plan` | Configure emergency months & safety buffer | Safe-to-spend formula enforces `balance − emergency − goals − bills − buffer` | **PASS** |
| 25 | **What-If Levers (Hero Feature)** | `/simulate` | Move sliders (dining cut, groceries cut, rent change, etc.) | Live reactive recalculation of 12-month trajectory without full-page re-renders | **PASS** |
| 26 | **Scenario Projections & Apply** | `/simulate` | Compare scenario curve against baseline; click "Apply to plan" | Updates profile and recurring plan to reflect selected scenario parameters | **PASS** |
| 27 | **Monthly Narrative Review & Print** | `/review` | Select month, export CSV or click Print / PDF | Deterministic narrative report, category delta breakdown, dedicated clean `@media print` layout | **PASS** |
| 28 | **Coach & Guardrails** | `/coach` | Ask queries ("Can I afford ₹25,000?", "Which mutual fund?") | Answers math with step-by-step breakdown; strictly refuses securities/stock picking per guardrails | **PASS** |

---

## Automated Test Results

```
 RUN  v5.0.5 C:/Users/gokul/OneDrive/Documents/Desktop/hack2

 ✓ src/domain/__tests__/domain.test.ts (27 tests) 71ms

 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  17:31:06
   Duration  658ms
```

## Defects Resolved During Handover

1. **Rule Learning Toast Timing Bug**: Resolved asynchronous state closure where `correctCategory` returned `null` instead of rule metadata, which falsely displayed `"The existing rule was updated"` for newly created rules.
2. **Missing In-Modal Retroactive Application**: Added inline past matching count indicator and checkbox to immediately apply learned rules to past transactions directly upon correction.
3. **Dead Code & Duplicate Import Cleanup**: Removed unused `useMoneyTicker` from `charts.tsx`, removed unused `Txn` import from `Inbox.tsx`, removed duplicate `CATEGORY_MAP as CM` from `Rules.tsx`, and removed unused `buildSeedTxns` import from `Review.tsx`.
