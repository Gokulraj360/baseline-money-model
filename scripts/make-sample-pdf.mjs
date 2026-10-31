// Generates a small, real text-layer PDF used by the "Use sample PDF" button.
// Usage: node scripts/make-sample-pdf.mjs
import fs from 'node:fs';
import path from 'node:path';

const lines = [
  'HDFC BANK LIMITED',
  'Statement of account - Savings XX4412',
  'Period 01/10/2026 to 31/10/2026',
  '',
  'Date       Narration                                  Amount     Dr/Cr   Balance',
  '04/10/2026 SWIGGY BANGALORE                          486.00     DR      184320.50',
  '05/10/2026 BIGBASKET GROCERY                         2140.00    DR      182180.50',
  '07/10/2026 UBER RIDE BANGALORE                       318.00     DR      181862.50',
  '09/10/2026 NETFLIX SUBSCRIPTION                      649.00     DR      181213.50',
  '11/10/2026 BLINKIT GROCERY DELIVERY                  812.00     DR      180401.50',
  '12/10/2026 Airtel Postpaid                           1199.00    DR      179202.50',
  '15/10/2026 CULTFIT INDIA                             1799.00    DR      177403.50',
  '17/10/2026 LANDLORD RENT                             42000.00   DR      135403.50',
  '18/10/2026 LINKEDIN PREMIUM                          1299.00    DR      134104.50',
  '20/10/2026 THIRD WAVE COFFEE JAYANAGAR               380.00     DR      133724.50',
  '21/10/2026 DECATHLON WHITEFIELD                      2350.00    DR      131374.50',
  '23/10/2026 APOLLO PHARMACY                           412.00     DR      130962.50',
  '24/10/2026 TRUFFLES ST MARKS ROAD                    860.00     DR      130102.50',
  '26/10/2026 NAMMA METRO CARD TOPUP                    500.00     DR      129602.50',
  '28/10/2026 AMAZON SHOPPING                           1899.00    DR      127703.50',
  '29/10/2026 ACT FIBERNET                              1349.00    DR      126354.50',
  '30/10/2026 SALARY NIMBUS LABS                         142000.00  CR      268354.50',
  '',
  'Closing balance 268354.50',
  'This is a computer generated statement. For queries call 1800 202 6161.',
];

const escape = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const content = [
  'BT',
  '/F1 10 Tf',
  '50 800 Td',
  '14 TL',
  ...lines.map((l) => `(${escape(l)}) Tj T*`),
  'ET',
].join('\n');

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
  `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
];

const parts = ['%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'];
const offsets = [0];
let cursor = parts[0].length;

objects.forEach((body, i) => {
  const chunk = `${i + 1} 0 obj\n${body}\nendobj\n`;
  offsets.push(cursor);
  parts.push(chunk);
  cursor += Buffer.byteLength(chunk, 'latin1');
});

const xrefStart = cursor;
let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i++) {
  xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
}
const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

const outDir = path.join(process.cwd(), 'public', 'samples');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'baseline-statement.pdf');
fs.writeFileSync(outFile, parts.join('') + xref + trailer, 'latin1');
console.log(`Wrote ${outFile} (${fs.statSync(outFile).size} bytes)`);
