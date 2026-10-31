import type { ParsedRow, ParseResult, TxnSource } from '../types';

export function normalizeText(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

export function rowHash(date: string, amount: number, description: string): string {
  const base = `${date}|${amount.toFixed(2)}|${normalizeText(description).slice(0, 48)}`;
  let h = 2166136261;
  for (let i = 0; i < base.length; i++) {
    h ^= base.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

export function parseDateLoose(input: string): string | null {
  const s = input.trim().replace(/^["']|["']$/g, '');
  if (!s) return null;

  let m = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/.exec(s);
  if (m) {
    let [, a, b, c] = m;
    let year = Number(c);
    if (year < 100) year += 2000;
    let day = Number(a);
    let month = Number(b);
    // If the first number cannot be a day but could be a month, swap.
    if (day > 12 && month > 12) return null;
    if (month > 12 && day <= 12) {
      [day, month] = [month, day];
    }
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  m = /^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/.exec(s);
  if (m) {
    const [, y, mo, d] = m;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  m = /^(\d{1,2})[\s\-]([A-Za-z]{3,9})[\s\-,]*(\d{2,4})?$/.exec(s);
  if (m) {
    const day = Number(m[1]);
    const mon = MONTHS[m[2].toLowerCase().slice(0, 4)] ?? MONTHS[m[2].toLowerCase().slice(0, 3)];
    let year = m[3] ? Number(m[3]) : new Date().getFullYear();
    if (year < 100) year += 2000;
    if (mon === undefined) return null;
    return `${year}-${String(mon + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  m = /^([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})$/.exec(s);
  if (m) {
    const mon = MONTHS[m[1].toLowerCase().slice(0, 3)];
    if (mon === undefined) return null;
    return `${m[3]}-${String(mon + 1).padStart(2, '0')}-${String(Number(m[2])).padStart(2, '0')}`;
  }

  return null;
}

export function parseAmountLoose(input: string): number | null {
  if (!input) return null;
  let s = String(input).trim();
  if (!s) return null;
  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1);
  }
  if (/\b(dr|debit|withdrawal)\b/i.test(s)) negative = true;
  s = s.replace(/(rs\.?|inr|₹|\$)/gi, '').replace(/\b(dr|cr|debit|credit)\b/gi, '');
  s = s.replace(/[,\s]/g, '');
  if (s.startsWith('-')) {
    negative = true;
    s = s.slice(1);
  }
  if (!/^\d*\.?\d+$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n === 0) return null;
  return negative ? -n : n;
}

function splitCSVLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else quoted = !quoted;
    } else if (ch === delimiter && !quoted) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function detectDelimiter(lines: string[]): string {
  const sample = lines.slice(0, 25).join('\n');
  const candidates = [',', ';', '\t', '|'];
  let best = ',';
  let bestCount = 0;
  for (const d of candidates) {
    const count = sample.split(d).length;
    if (count > bestCount) {
      bestCount = count;
      best = d;
    }
  }
  return best;
}

const HEADER_KEYS = {
  date: /^(date|txn date|transaction date|value date|posting date|tran date)$/i,
  description: /^(description|narration|particulars|details|transaction details|remarks|merchant|transaction)$/i,
  amount: /^(amount|txn amount|transaction amount|value)$/i,
  debit: /^(debit|withdrawal|withdrawals|debit amount|dr)$/i,
  credit: /^(credit|deposit|deposits|credit amount|cr)$/i,
  balance: /^(balance|closing balance|running balance|avl balance)$/i,
  type: /^(type|dr\/cr|debit\/credit)$/i,
};

function findHeaderIndex(lines: string[]): number {
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const low = lines[i].toLowerCase();
    if (/date/.test(low) && /(amount|debit|credit|withdrawal|deposit)/.test(low)) return i;
  }
  return -1;
}

export function parseCSV(text: string, fileName = 'statement.csv'): ParseResult {
  const errors: string[] = [];
  const cleaned = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const rawLines = cleaned.split('\n').filter((l) => l.trim().length > 0);
  if (rawLines.length < 2) {
    return { rows: [], errors: ['The file looks empty.'], meta: { source: 'csv', fileName } };
  }
  const delimiter = detectDelimiter(rawLines);
  const headerIdx = findHeaderIndex(rawLines);
  if (headerIdx === -1) {
    return {
      rows: [],
      errors: ['Could not find a header row with a date and an amount column.'],
      meta: { source: 'csv', fileName },
    };
  }
  const header = splitCSVLine(rawLines[headerIdx], delimiter).map((h) =>
    h.replace(/["']/g, '').trim()
  );
  const idx: Record<string, number> = {};
  header.forEach((h, i) => {
    for (const [key, re] of Object.entries(HEADER_KEYS)) {
      if (idx[key] === undefined && re.test(h)) idx[key] = i;
    }
    if (idx.date === undefined && /date/i.test(h)) idx.date = i;
    if (idx.description === undefined && /(desc|narr|particular|detail|remark)/i.test(h))
      idx.description = i;
    if (idx.amount === undefined && /amount/i.test(h)) idx.amount = i;
    if (idx.debit === undefined && /debit|withdraw|^dr$/i.test(h)) idx.debit = i;
    if (idx.credit === undefined && /credit|deposit|^cr$/i.test(h)) idx.credit = i;
    if (idx.balance === undefined && /balance/i.test(h)) idx.balance = i;
  });

  if (idx.date === undefined) {
    return { rows: [], errors: ['No date column recognised.'], meta: { source: 'csv', fileName } };
  }
  if (idx.amount === undefined && idx.debit === undefined && idx.credit === undefined) {
    return { rows: [], errors: ['No amount, debit, or credit column recognised.'], meta: { source: 'csv', fileName } };
  }

  const rows: ParsedRow[] = [];
  for (let i = headerIdx + 1; i < rawLines.length; i++) {
    const cells = splitCSVLine(rawLines[i], delimiter);
    const date = parseDateLoose(cells[idx.date] ?? '');
    if (!date) {
      if (/(opening|closing|total|balance b\/f|statement)/i.test(rawLines[i])) continue;
      errors.push(`Line ${i + 1}: no usable date — skipped.`);
      continue;
    }
    const desc =
      (idx.description !== undefined ? cells[idx.description] : '') ||
      cells.filter((_, ci) => ci !== idx.date).join(' ').slice(0, 90);
    if (!desc || /^(opening balance|closing balance)$/i.test(desc)) continue;

    let amount: number | null = null;
    if (idx.debit !== undefined && parseAmountLoose(cells[idx.debit] ?? '') !== null) {
      amount = -Math.abs(parseAmountLoose(cells[idx.debit]) as number);
    } else if (idx.credit !== undefined && parseAmountLoose(cells[idx.credit] ?? '') !== null) {
      amount = Math.abs(parseAmountLoose(cells[idx.credit]) as number);
    } else if (idx.amount !== undefined) {
      amount = parseAmountLoose(cells[idx.amount] ?? '');
      if (amount !== null && idx.type !== undefined && /credit|cr/i.test(cells[idx.type] ?? '')) {
        amount = Math.abs(amount);
      }
    }
    if (amount === null) {
      errors.push(`Line ${i + 1}: no usable amount — skipped.`);
      continue;
    }
    const balance =
      idx.balance !== undefined ? parseAmountLoose(cells[idx.balance] ?? '') ?? undefined : undefined;
    rows.push({
      date,
      description: desc.replace(/\s+/g, ' ').trim(),
      amount,
      balance: balance ?? undefined,
      raw: rawLines[i],
      hash: rowHash(date, Math.abs(amount), desc),
    });
  }
  if (!rows.length) errors.push('No transaction rows could be read from this file.');
  return {
    rows,
    errors,
    meta: {
      source: 'csv',
      fileName,
      detectedFormat: `CSV · ${delimiter === '\t' ? 'tab' : delimiter} separated`,
      columns: header,
    },
  };
}

const SMS_DATE =
  /(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{1,2}[\s\-](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\-,]*\d{2,4})/i;

export function parseSMS(text: string, fileName = 'Messages'): ParseResult {
  const errors: string[] = [];
  const rows: ParsedRow[] = [];
  const lines = text
    .replace(/\r/g, '')
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const isTxn =
      /(debited|credited|spent|paid|withdrawn|received|purchase|payment of|txn of)/i.test(line) &&
      /(rs\.?|inr|₹)\s*[\d,]+/i.test(line);
    if (!isTxn) continue;

    const amountMatch = /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i.exec(line);
    if (!amountMatch) continue;
    const amount = parseAmountLoose(amountMatch[1]);
    if (!amount) continue;
    const isCredit = /(credited|received|refund|reversal|cashback)/i.test(line);
    const signed = isCredit ? Math.abs(amount) : -Math.abs(amount);

    const dateMatch = SMS_DATE.exec(line);
    const date = (dateMatch && parseDateLoose(dateMatch[1])) || new Date().toISOString().slice(0, 10);

    let merchant = '';
    const at = /\b(?:at|to|towards|from)\s+([A-Za-z0-9&._*\- ]{2,42}?)(?=\s+(?:on|ref|via|using|for|\.|,|$))/i.exec(line);
    if (at) merchant = at[1].trim();
    if (!merchant) {
      const txn = /\b(?:txn|transaction)\s+(?:of|at)\s+([A-Za-z0-9&._*\- ]{2,32})/i.exec(line);
      if (txn) merchant = txn[1].trim();
    }
    if (!merchant) {
      const acct = /a\/c\s*(?:xx|XX|\*+)?(\d{2,6})/i.exec(line);
      merchant = acct ? `Account ${acct[1].slice(-4)}` : 'Bank alert';
    }

    const desc = `${merchant} — ${line.replace(/\s+/g, ' ').slice(0, 88)}`;
    rows.push({
      date,
      description: desc,
      amount: signed,
      raw: line,
      hash: rowHash(date, Math.abs(signed), merchant),
    });
  }

  if (!rows.length) {
    errors.push('No transaction alerts found. Paste one bank SMS per line.');
  }
  return {
    rows,
    errors,
    meta: { source: 'sms', fileName, detectedFormat: 'SMS alerts' },
  };
}

/**
 * Parses plain text extracted from a PDF statement. Handles the common
 * "date description amount DR balance" shape and degrades gracefully.
 */
export function parseStatementText(text: string, fileName = 'statement.pdf'): ParseResult {
  const errors: string[] = [];
  const rows: ParsedRow[] = [];
  const lines = text
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  for (const line of lines) {
    const dateMatch = new RegExp(
      `^(\\d{1,2}[\\/\\-.]\\d{1,2}[\\/\\-.]\\d{2,4}|\\d{1,2} [A-Za-z]{3,9} \\d{2,4})\\s+(.+)$`
    ).exec(line);
    if (!dateMatch) continue;
    const date = parseDateLoose(dateMatch[1]);
    if (!date) continue;
    const rest = dateMatch[2];

    // Prefer "amount [DR|CR] balance" at the end of the line.
    const tail = /(.+?)\s+([\d,]+\.\d{1,2})\s*(DR|CR)?\s*([\d,]+\.\d{1,2})?$/i.exec(rest);
    if (!tail) continue;
    const descRaw = tail[1].trim();
    const amount = parseAmountLoose(tail[2]);
    if (!amount || !descRaw) continue;
    const drcr = (tail[3] ?? '').toUpperCase();
    const signed = drcr === 'CR' ? Math.abs(amount) : drcr === 'DR' ? -Math.abs(amount) : amount;
    const balance = tail[4] ? parseAmountLoose(tail[4]) ?? undefined : undefined;

    rows.push({
      date,
      description: descRaw.replace(/\s+/g, ' '),
      amount: signed,
      balance: balance ?? undefined,
      raw: line,
      hash: rowHash(date, Math.abs(signed), descRaw),
    });
  }

  if (!rows.length) {
    errors.push(
      'No transaction lines were found in this PDF. It may be a scanned image — try the CSV export from your bank instead.'
    );
  }
  return {
    rows,
    errors,
    meta: { source: 'pdf', fileName, detectedFormat: 'PDF statement text' },
  };
}

export function guessSourceFromName(name: string): TxnSource {
  if (/\.pdf$/i.test(name)) return 'pdf';
  if (/\.(csv|tsv|txt)$/i.test(name)) return 'csv';
  return 'csv';
}
