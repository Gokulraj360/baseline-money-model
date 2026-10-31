import type { Rule, Txn } from '../types';

export interface Categorization {
  category: string;
  merchant: string;
  confidence: number;
  why: string;
}

type Pattern = {
  re: RegExp;
  category: string;
  merchant: string;
  confidence: number;
  label: string;
};

/** Ordered most-specific first. First hit wins. */
const PATTERNS: Pattern[] = [
  { re: /instamart/i, category: 'groceries', merchant: 'Swiggy Instamart', confidence: 0.96, label: 'Instamart is a grocery service' },
  { re: /swiggy/i, category: 'delivery', merchant: 'Swiggy', confidence: 0.97, label: 'Swiggy is a food delivery platform' },
  { re: /zomato/i, category: 'delivery', merchant: 'Zomato', confidence: 0.97, label: 'Zomato is a food delivery platform' },
  { re: /eatfit|faasos|behrouz|dominos|pizza hut|kfc|mcdonald|burger king|subway/i, category: 'delivery', merchant: 'Quick service', confidence: 0.9, label: 'a quick-service restaurant chain' },
  { re: /starbucks|third wave|blue tokai|toit|social|brew|bakery|patisserie|cafe|coffee/i, category: 'dining', merchant: 'Cafe', confidence: 0.86, label: 'a cafe or coffee shop' },
  { re: /restaurant|biryani|dhaba|kitchen|eatery|grill|barbeque|bar &|pub|dining/i, category: 'dining', merchant: 'Restaurant', confidence: 0.84, label: 'a restaurant' },
  { re: /bigbasket|blinkit|zepto|dmart|reliance fresh|more supermarket|supermarket|kirana|grofers|licious|freshtohome|spencer/i, category: 'groceries', merchant: 'Groceries', confidence: 0.92, label: 'a grocery merchant' },
  { re: /uber(?!.*\beat\b)|ola(?!.*\bemea\b)|rapido|namma metro|bmtc|ksrtc|metro card|parking|fastag|toll/i, category: 'transport', merchant: 'Transport', confidence: 0.9, label: 'a transport or commute service' },
  { re: /indian oil|iocl|hp petrol|bharat petroleum|bpcl|shell|petrol|diesel|fuel/i, category: 'fuel', merchant: 'Fuel station', confidence: 0.93, label: 'a fuel station' },
  { re: /netflix/i, category: 'subscriptions', merchant: 'Netflix', confidence: 0.99, label: 'Netflix is a streaming subscription' },
  { re: /spotify/i, category: 'subscriptions', merchant: 'Spotify', confidence: 0.99, label: 'Spotify is a music subscription' },
  { re: /hotstar|disney|sonyliv|zee5|jiocinema|prime video|amazon prime|youtube premium|apple music|audible|kindle/i, category: 'subscriptions', merchant: 'Streaming', confidence: 0.94, label: 'a streaming or media subscription' },
  { re: /icloud|google one|dropbox|adobe|microsoft 365|canva|notion|linkedin premium|chatgpt|openai|figma/i, category: 'subscriptions', merchant: 'Software subscription', confidence: 0.94, label: 'a software subscription' },
  { re: /\bairtel\b|\bjio\b|vodafone|\bvi postpaid|bsnl|postpaid|prepaid recharge/i, category: 'mobile', merchant: 'Mobile network', confidence: 0.93, label: 'a mobile network operator' },
  { re: /bescom|bwssb|electricity|water bill|gas bill|indane|hp gas|tata power|adani electricity/i, category: 'utilities', merchant: 'Utilities', confidence: 0.94, label: 'a utility bill' },
  { re: /act fibernet|hathway|jiofiber|airtel fiber|broadband|wifi|internet bill/i, category: 'internet', merchant: 'Broadband', confidence: 0.93, label: 'a broadband provider' },
  { re: /lic |hdfc life|icici pru|star health|niva bupa|insurance|policy premium|renewal premium/i, category: 'insurance', merchant: 'Insurance', confidence: 0.92, label: 'an insurance premium' },
  { re: /cult\.?fit|cultfit|gym|fitness|healthifyme|yoga/i, category: 'fitness', merchant: 'Cult.fit', confidence: 0.93, label: 'a fitness membership' },
  { re: /apollo|pharmeasy|1mg|netmeds|hospital|clinic|dental|doctor|medical|diagnostic|lab test/i, category: 'health', merchant: 'Health', confidence: 0.9, label: 'a health or medical merchant' },
  { re: /amazon(?!.*prime)|flipkart|myntra|ajio|nykaa(?!.*salon)|meesho|decathlon|ikea|croma|reliance digital|tata cliq|firstcry/i, category: 'shopping', merchant: 'Shopping', confidence: 0.9, label: 'an online or retail shopping merchant' },
  { re: /bookmyshow|pvr|inox|cinepolis|concert|event ticket|ticketmaster/i, category: 'entertainment', merchant: 'Entertainment', confidence: 0.9, label: 'an entertainment venue or ticketing service' },
  { re: /irctc|makemytrip|goibibo|cleartrip|indigo|air india|vistara|spicejet|oyo|airbnb|hotel|flight|railway/i, category: 'travel', merchant: 'Travel', confidence: 0.9, label: 'a travel booking' },
  { re: /udemy|coursera|upgrad|byju|unacademy|school fee|tuition|college|course fee/i, category: 'education', merchant: 'Education', confidence: 0.9, label: 'an education provider' },
  { re: /salon|barber|spa|grooming|beauty parlour/i, category: 'personal_care', merchant: 'Personal care', confidence: 0.88, label: 'a personal care merchant' },
  { re: /nobroker|landlord|house rent|\brent\b|maintenance charge|society/i, category: 'rent', merchant: 'Rent', confidence: 0.9, label: 'a rent or housing payment' },
  { re: /zerodha|groww|upstox|kuvera|smallcase|\bsip\b|mutual fund|\bppf\b|\bnps\b|recurring deposit|\brd installment|\bfd\b/i, category: 'investments', merchant: 'Investment transfer', confidence: 0.88, label: 'a savings or investment transfer' },
  { re: /salary|payroll|stipend|wages|employer/i, category: 'income', merchant: 'Salary', confidence: 0.98, label: 'a salary credit' },
  { re: /credit card payment|cc payment|card bill|bill pay/i, category: 'transfer', merchant: 'Card payment', confidence: 0.92, label: 'a credit card payment' },
  { re: /neft|imps|rtgs|self transfer|to self|own account/i, category: 'transfer', merchant: 'Transfer', confidence: 0.8, label: 'a bank transfer between accounts' },
  { re: /bank charge|sms charge|gst|penalty|processing fee|annual fee|late fee/i, category: 'fees', merchant: 'Bank fee', confidence: 0.9, label: 'a bank fee or charge' },
  { re: /gift|birthday|anniversary/i, category: 'gifts', merchant: 'Gifts', confidence: 0.82, label: 'a gift purchase' },
  { re: /atm|withdrawal|cash/i, category: 'other', merchant: 'Cash withdrawal', confidence: 0.7, label: 'a cash withdrawal' },
];

const NOISE = /^(upi|dr|cr|pos|neft|imps|rtgs|ach|ecs|txn|ref|payment|purchase|paid|to|from|by|via|on|at)\b/i;

export function cleanMerchant(description: string): string {
  let s = description
    .replace(/\b(upi|pos|neft|imps|rtgs|ach|ecs|deb|cred|dr|cr)\b[\/\-:]?/gi, ' ')
    .replace(/\b\d{6,}\b/g, ' ')
    .replace(/[\/|]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const words = s.split(' ').filter((w) => w && !NOISE.test(w));
  if (words.length > 4) s = words.slice(0, 4).join(' ');
  return s || description.slice(0, 48);
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
    .trim();
}

export function heuristicCategorize(description: string, amount: number): Categorization {
  const text = description.replace(/\s+/g, ' ');
  for (const p of PATTERNS) {
    if (p.re.test(text)) {
      return {
        category: p.category,
        merchant: p.merchant,
        confidence: p.confidence,
        why: `Matched “${p.label}” in the statement line.`,
      };
    }
  }
  if (amount > 0) {
    return {
      category: 'income',
      merchant: titleCase(cleanMerchant(text)) || 'Credit',
      confidence: 0.55,
      why: 'This is a credit, so it was filed as income — confirm if it was a transfer.',
    };
  }
  const merchant = titleCase(cleanMerchant(text));
  return {
    category: 'other',
    merchant: merchant || 'Unknown merchant',
    confidence: 0.18,
    why: 'No known merchant signal found. A correction here will teach the model.',
  };
}

export function ruleMatches(rule: Rule, txn: Pick<Txn, 'description' | 'merchant'>): boolean {
  const hay = rule.field === 'merchant' ? txn.merchant : txn.description;
  const needle = rule.pattern;
  try {
    switch (rule.matchType) {
      case 'contains':
        return hay.toLowerCase().includes(needle.toLowerCase());
      case 'startsWith':
        return hay.toLowerCase().startsWith(needle.toLowerCase());
      case 'exact':
        return hay.trim().toLowerCase() === needle.trim().toLowerCase();
      case 'regex':
        return new RegExp(needle, 'i').test(hay);
      default:
        return false;
    }
  } catch {
    return false;
  }
}

export function firstMatchingRule(
  txn: Pick<Txn, 'description' | 'merchant'>,
  rules: Rule[]
): Rule | undefined {
  return rules
    .filter((r) => r.enabled)
    .sort((a, b) => b.priority - a.priority || b.createdAt - a.createdAt)
    .find((r) => ruleMatches(r, txn));
}

export function categorize(
  description: string,
  amount: number,
  rules: Rule[] = []
): Categorization {
  const base = heuristicCategorize(description, amount);
  const rule = firstMatchingRule(
    { description, merchant: base.merchant },
    rules
  );
  if (rule) {
    return {
      category: rule.category,
      merchant: base.merchant,
      confidence: 0.99,
      why: `Your rule “${rule.pattern}” maps this merchant to ${rule.category}.`,
    };
  }
  return base;
}

/** Build the pattern a correction should learn. */
export function deriveRulePattern(description: string, merchant: string): string {
  const brandMatch = /swiggy|zomato|netflix|spotify|airtel|jio|cult|apollo|amazon|flipkart|myntra|bigbasket|blinkit|zepto|uber|ola|rapido|act fibernet|bescom/i.exec(
    description
  );
  if (brandMatch) return brandMatch[0].toUpperCase();
  const cleaned = cleanMerchant(merchant || description);
  const words = cleaned
    .toUpperCase()
    .split(' ')
    .filter((w) => /^[A-Z0-9&.]+$/.test(w) && w.length >= 2);
  // A human merchant name is a better pattern than a single generic token.
  if (merchant && words.length >= 2 && words.length <= 4) return words.join(' ');
  const token = cleaned.split(' ').filter((w) => w.length >= 3)[0] ?? cleaned;
  return token.toUpperCase();
}
