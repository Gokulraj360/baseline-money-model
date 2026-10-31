import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function setCaption(page, { step, section, title, description, highlightSelector, duration = 3600 }) {
  await page.evaluate(({ step, section, title, description, highlightSelector }) => {
    let captionEl = document.getElementById('demo-caption-overlay');
    if (!captionEl) {
      captionEl = document.createElement('div');
      captionEl.id = 'demo-caption-overlay';
      captionEl.style.position = 'fixed';
      captionEl.style.bottom = '18px';
      captionEl.style.left = '50%';
      captionEl.style.transform = 'translateX(-50%)';
      captionEl.style.zIndex = '9999999';
      captionEl.style.background = '#181816';
      captionEl.style.color = '#F6F4EF';
      captionEl.style.padding = '12px 22px';
      captionEl.style.borderRadius = '8px';
      captionEl.style.boxShadow = '0 12px 36px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.12)';
      captionEl.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      captionEl.style.maxWidth = '780px';
      captionEl.style.width = '90%';
      captionEl.style.pointerEvents = 'none';
      captionEl.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      document.body.appendChild(captionEl);

      const style = document.createElement('style');
      style.innerHTML = `
        .demo-highlight-box {
          outline: 2px solid #D97706 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 18px rgba(217, 119, 6, 0.35) !important;
          transition: all 0.25s ease !important;
        }
      `;
      document.head.appendChild(style);
    }

    captionEl.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #D97706; background: rgba(217,119,6,0.18); padding: 2px 7px; border-radius: 4px;">${section}</span>
        <span style="font-size: 11px; font-family: monospace; color: rgba(246,244,239,0.55);">${step}</span>
      </div>
      <div style="font-size: 15px; font-weight: 600; line-height: 1.35; color: #FFFFFF; margin-bottom: 3px;">${title}</div>
      <div style="font-size: 12.5px; line-height: 1.45; color: rgba(246,244,239,0.78);">${description}</div>
    `;

    document.querySelectorAll('.demo-highlight-box').forEach(el => el.classList.remove('demo-highlight-box'));
    if (highlightSelector) {
      let target = null;
      const hasTextMatch = highlightSelector.match(/^(.*?):has-text\("([^"]+)"\)$/);
      if (hasTextMatch) {
        const baseSel = hasTextMatch[1] || '*';
        const text = hasTextMatch[2];
        const elements = Array.from(document.querySelectorAll(baseSel));
        target = elements.find(el => el.textContent && el.textContent.includes(text)) || null;
      } else {
        try {
          target = document.querySelector(highlightSelector);
        } catch {}
      }

      if (target) {
        target.classList.add('demo-highlight-box');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, { step, section, title, description, highlightSelector });

  await page.waitForTimeout(duration);
}

async function goTo(page, pathName, label) {
  try {
    const btn = await page.$(`.nav-item:has-text("${label}")`);
    if (btn) {
      await btn.click();
      await page.waitForTimeout(500);
      return;
    }
  } catch {}
  await page.goto(`http://localhost:4173/#/${pathName}`);
  await page.waitForTimeout(500);
}

async function recordWalkthrough() {
  console.log('Starting full feature video recording with English captions...');
  const outputDir = path.resolve('videos/walkthrough');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Clear previous files
  fs.readdirSync(outputDir).forEach(f => {
    try { fs.unlinkSync(path.join(outputDir, f)); } catch {}
  });

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // 1. OVERVIEW & LIVING MONEY MODEL
  console.log('Recording 1: Overview & Living Money Model...');
  await page.goto('http://localhost:4173/#/overview');
  await page.waitForLoadState('networkidle');

  await setCaption(page, {
    step: '01 / 18',
    section: 'Overview · Living Money Model',
    title: 'Baseline: A Personal Finance Coach That Knows Your Life',
    description: 'Deterministic money model connecting accounts, income, and spending with zero guesswork.',
    duration: 3800,
  });

  await setCaption(page, {
    step: '02 / 18',
    section: 'Overview · Safe-to-Spend & Net Worth',
    title: 'Real-Time Liquidity & Safety Floors',
    description: 'Computes exact Safe-to-Spend after deducting emergency reserves, target-dated goals, and upcoming bills.',
    highlightSelector: '.hero-card',
    duration: 3800,
  });

  // Financial Health Modal
  console.log('Recording: Financial Health Index Modal...');
  try {
    const healthPill = await page.$('button[title*="Financial Health"]');
    if (healthPill) {
      await healthPill.click();
      await page.waitForTimeout(600);
      await setCaption(page, {
        step: '03 / 18',
        section: 'Overview · Financial Health Index',
        title: '100-Point Composite Health Index',
        description: 'Scores Emergency Floor (25), Savings Rate (25), Fixed Costs (25), and Subscription Radar (25) with diagnostic tips.',
        duration: 4200,
      });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  } catch (err) {
    console.warn('Health pill click skipped:', err.message);
  }

  // Category Pacing & Weekend Impulse
  await setCaption(page, {
    step: '04 / 18',
    section: 'Overview · Burn Rate & Impulses',
    title: 'Day-of-Month Pacing & Weekend Impulse Breakdown',
    description: 'Tracks month-to-date spending vs day-of-month budget pace and isolates discretionary weekend spending spikes.',
    highlightSelector: '.panel:has-text("Category pacing")',
    duration: 4000,
  });

  // 2. INGESTION & INBOX
  console.log('Recording 2: Inbox & Ingestion...');
  await goTo(page, 'inbox', 'Inbox');

  await setCaption(page, {
    step: '05 / 18',
    section: 'Inbox · Multi-Format Statement Ingestion',
    title: 'Messy CSV, PDF Statement & Bank SMS Parser',
    description: 'Normalizes varied Indian date formats (DD/MM/YYYY), signed debits/credits, and strips bank statement noise.',
    duration: 3800,
  });

  // Click Sample SMS
  try {
    const sampleSmsBtn = await page.$('button:has-text("sample SMS"), button:has-text("Sample SMS")');
    if (sampleSmsBtn) {
      await sampleSmsBtn.click();
      await page.waitForTimeout(600);
      await setCaption(page, {
        step: '06 / 18',
        section: 'Inbox · Cryptographic Deduplication',
        title: 'Row Hash Deduplication Engine',
        description: 'Generates collision-resistant transaction fingerprints (rowHash) to automatically skip duplicate statement imports.',
        duration: 3800,
      });
    }
  } catch (err) {
    console.warn('Sample SMS skipped:', err.message);
  }

  // 3. THE LEDGER & TRANSACTIONS
  console.log('Recording 3: Ledger & Deep Dive...');
  await goTo(page, 'transactions', 'Transactions');

  await setCaption(page, {
    step: '07 / 18',
    section: 'Transactions · High-Density Ledger',
    title: 'Instant Search, Tags & Multi-Facet Filtering',
    description: 'Dense 25-row paginated table with real-time text search, tags (#work, #tax), and custom date ranges.',
    duration: 3800,
  });

  // Type search
  try {
    const searchInput = await page.$('input[placeholder*="Search"]');
    if (searchInput) {
      await searchInput.fill('Swiggy');
      await page.waitForTimeout(700);

      // Click merchant for deep dive
      const merchantBtn = await page.$('button.linkish:has-text("Swiggy")');
      if (merchantBtn) {
        await merchantBtn.click();
        await page.waitForTimeout(600);
        await setCaption(page, {
          step: '08 / 18',
          section: 'Transactions · Merchant Deep-Dive',
          title: 'Lifetime Merchant Spend & Order Analytics',
          description: 'Displays lifetime spend, order count, average ticket size, first/last seen dates, and full historical ledger.',
          duration: 4200,
        });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
      await searchInput.fill('');
      await page.waitForTimeout(400);
    }
  } catch (err) {
    console.warn('Search deep-dive skipped:', err.message);
  }

  // 4. RULES
  console.log('Recording 4: Rules Engine...');
  await goTo(page, 'rules', 'Rules');

  await setCaption(page, {
    step: '09 / 18',
    section: 'Rules · Rule Learning & Priority Engine',
    title: 'Adaptive Categorisation & Retroactive Matching',
    description: 'Learns rules automatically upon recategorisation with priority ordering, pattern testing, and on-demand retro-application.',
    duration: 3800,
  });

  // 5. RECURRING RADAR
  console.log('Recording 5: Recurring Radar...');
  await goTo(page, 'recurring', 'Recurring');

  await setCaption(page, {
    step: '10 / 18',
    section: 'Recurring · Subscription Radar',
    title: 'Cadence Detection & Price Change Alerts',
    description: 'Identifies weekly, monthly, and yearly recurring commitments; flags price hikes and dormant unused subscriptions.',
    duration: 3800,
  });

  // Scroll to 31-day renewal rhythm
  await setCaption(page, {
    step: '11 / 18',
    section: 'Recurring · 31-Day Renewal Calendar',
    title: 'Visual Monthly Renewal Timeline',
    description: 'Maps scheduled renewals across the 31-day cycle to help anticipate liquidity drawdowns and prevent overdrafts.',
    highlightSelector: '.panel:has-text("Renewal rhythm")',
    duration: 4000,
  });

  // Click Script modal
  try {
    const scriptBtn = await page.$('button:has-text("Script")');
    if (scriptBtn) {
      await scriptBtn.click();
      await page.waitForTimeout(600);
      await setCaption(page, {
        step: '12 / 18',
        section: 'Recurring · Regulatory Support Scripts',
        title: 'RBI E-Mandate Cancellation & Negotiation Script Generator',
        description: 'Generates statutory mandate revocation notices citing RBI Circular RBI/2019-20/47 and retention discount scripts with 1-click copying.',
        duration: 4200,
      });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  } catch (err) {
    console.warn('Script modal skipped:', err.message);
  }

  // 6. PLAN & DEBT ACCELERATOR & TAXES
  console.log('Recording 6: Living Plan, Debt & Taxes...');
  await goTo(page, 'plan', 'Plan');

  await setCaption(page, {
    step: '13 / 18',
    section: 'Plan · Living Model & Targets',
    title: 'Income, Target-Dated Goals & Emergency Floor',
    description: 'Defines persistent baseline income, committed fixed costs, and calculates exact monthly savings needed to hit goal deadlines.',
    duration: 3800,
  });

  // Scroll to Debt Accelerator
  await setCaption(page, {
    step: '14 / 18',
    section: 'Plan · Debt Payoff Accelerator',
    title: 'Avalanche vs Snowball Debt Acceleration',
    description: 'Models car loans and credit card liabilities; tests extra monthly payments to project exact interest and months saved.',
    highlightSelector: '.panel:has-text("Debt payoff accelerator")',
    duration: 4200,
  });

  // Scroll to Tax Tracker
  await setCaption(page, {
    step: '15 / 18',
    section: 'Plan · Indian Income Tax Tracker',
    title: 'Chapter VI-A Deductions Tracker (80C, 80D, HRA)',
    description: 'Tracks Section 80C investments (₹1.5L cap), 80D health insurance (₹25k cap), and HRA rent exemptions with projected tax savings.',
    highlightSelector: '.panel:has-text("Tax deductions tracker")',
    duration: 4200,
  });

  // 7. WHAT-IF SIMULATION & COMPARISON
  console.log('Recording 7: What-If Simulator & Matrix...');
  await goTo(page, 'simulate', 'Simulate');

  await setCaption(page, {
    step: '16 / 18',
    section: 'Simulate · 12-Month Projections',
    title: 'Macro Inflation & Income Shock Stress Testing',
    description: 'Simulate compounding inflation on lifestyle expenses and zero-salary job loss months to test emergency runway.',
    highlightSelector: '.panel:has-text("What if")',
    duration: 4200,
  });

  // Scroll to comparison matrix
  await setCaption(page, {
    step: '17 / 18',
    section: 'Simulate · Multi-Scenario Matrix',
    title: 'Side-by-Side Multi-Scenario Comparison Matrix',
    description: 'Compares ending cash balances, monthly surplus, and goal ETAs across Baseline vs Austerity vs Inflation vs Job Loss.',
    highlightSelector: '.panel:has-text("Multi-scenario comparison matrix")',
    duration: 4200,
  });

  // 8. REVIEW & WATERFALL & COACH
  console.log('Recording 8: Monthly Review & Cashflow Waterfall...');
  await goTo(page, 'review', 'Monthly review');

  await setCaption(page, {
    step: '18 / 18',
    section: 'Review · Transparency & Guardrails',
    title: 'Hand-Rolled SVG Cashflow Waterfall & SEBI Guardrails',
    description: 'Step-by-step bridge from Opening to Closing balance. Zero AI hallucination, strict advisory guardrails, and pure mathematics.',
    highlightSelector: '.panel:has-text("cashflow waterfall")',
    duration: 4800,
  });

  console.log('Closing browser and finalizing video stream...');
  await page.waitForTimeout(1000);
  await context.close();
  await browser.close();

  // Find generated video
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latestVideo = path.join(outputDir, files[0]);
    const finalName = path.join(outputDir, 'baseline-full-feature-walkthrough.webm');
    if (latestVideo !== finalName) {
      fs.renameSync(latestVideo, finalName);
    }
    console.log(`Video successfully recorded to: ${finalName}`);
    return finalName;
  }
}

recordWalkthrough().catch(err => {
  console.error('Walkthrough recording error:', err);
  process.exit(1);
});
