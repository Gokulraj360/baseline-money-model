import { useMemo, useState } from 'react';
import { useApp } from '../store/AppStore';
import type { ParseResult, Txn } from '../types';
import { parseCSV, parseSMS, parseStatementText } from '../domain/parse';
import { categorize } from '../domain/categorize';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories';
import { SAMPLE_CSV, SAMPLE_SMS } from '../data/seed';
import { money } from '../lib/format';
import { monthLabel } from '../lib/date';
import { navigate } from '../lib/router';
import { Icon } from '../components/Icon';
import { Empty, Modal, Tabs, useToast } from '../components/ui';
import { downloadFile } from '../lib/export';

type Tab = 'csv' | 'pdf' | 'sms';

export default function Inbox() {
  const { state, importRows, approveBatch, discardBatch, updateTxn, deleteTxns, correctCategory } = useApp();
  const { push } = useToast();

  const [tab, setTab] = useState<Tab>('csv');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [smsText, setSmsText] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [batchFilter, setBatchFilter] = useState<string | null>(null);

  const pending = state.txns.filter((t) => t.pending);
  const pendingShown = batchFilter ? pending.filter((t) => t.batchId === batchFilter) : pending;

  const previewRows = useMemo(() => {
    if (!preview) return [];
    return preview.rows.map((r) => ({ ...r, cat: categorize(r.description, r.amount, state.rules) }));
  }, [preview, state.rules]);

  const reset = () => {
    setPreview(null);
    setError(null);
  };

  const parsePdf = async (file: File) => {
    const pdfjs: any = await import('pdfjs-dist');
    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = (worker as { default: string }).default;
    const buf = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
    let text = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      let lastY: number | null = null;
      for (const item of content.items as any[]) {
        if (!('str' in item)) continue;
        const y = item.transform?.[5] ?? null;
        if (lastY !== null && y !== null && Math.abs(y - lastY) > 3) text += '\n';
        text += item.str;
        if (item.hasEOL) text += '\n';
        else text += ' ';
        lastY = y;
      }
      text += '\n';
    }
    if (!text.trim()) throw new Error('No text layer found. The PDF may be scanned.');
    return parseStatementText(text, file.name);
  };

  const handleFile = async (file: File) => {
    reset();
    setBusy(true);
    try {
      if (/\.pdf$/i.test(file.name)) {
        const result = await parsePdf(file);
        setPreview(result);
        setTab('pdf');
      } else {
        const text = await file.text();
        if (/\.(csv|tsv)$/i.test(file.name) || text.includes(',')) {
          setPreview(parseCSV(text, file.name));
          setTab('csv');
        } else {
          setPreview(parseSMS(text, file.name));
          setTab('sms');
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The file could not be read.');
    } finally {
      setBusy(false);
    }
  };

  const loadSample = async () => {
    reset();
    setBusy(true);
    try {
      if (tab === 'csv') {
        setPreview(parseCSV(SAMPLE_CSV, 'hdfc-october-sample.csv'));
      } else if (tab === 'sms') {
        setSmsText(SAMPLE_SMS);
        setPreview(parseSMS(SAMPLE_SMS, 'bank-alerts.txt'));
      } else {
        const url = `${import.meta.env.BASE_URL}samples/baseline-statement.pdf`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Sample PDF is missing. Paste statement text below instead.');
        const blob = await res.blob();
        const file = new File([blob], 'sample-statement.pdf', { type: 'application/pdf' });
        setPreview(await parsePdf(file));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the sample.');
    } finally {
      setBusy(false);
    }
  };

  const commit = (approve: boolean) => {
    if (!preview) return;
    const summary = importRows(preview.rows, preview.meta.source, preview.meta.fileName);
    if (approve) approveBatch(summary.batchId);
    if (summary.added > 0) {
      push(
        `${summary.added} added${summary.duplicates ? `, ${summary.duplicates} duplicate${summary.duplicates > 1 ? 's' : ''} skipped` : ''}. ${approve ? 'Approved and modelled.' : 'Waiting in review.'}`,
        { label: 'Review', run: () => setBatchFilter(summary.batchId) }
      );
    } else {
      push('Every row in this file is already in the ledger.');
    }
    reset();
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Ingestion · nothing leaves your browser</div>
          <h1 className="display">Bring the mess. <em>Leave with a model.</em></h1>
          <p className="lede">
            Bank CSVs with warning rows, PDF statements, and a dozen different SMS formats. Parsing happens locally;
            nothing is uploaded anywhere.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/transactions?q=')}>
            <Icon name="receipt" size={14} /> Open the ledger
          </button>
        </div>
      </div>

      <div className="grid">
        <section className="panel col-8">
          <div className="panel-head" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
            <div className="row-between">
              <div>
                <h2 className="panel-title">Import a statement</h2>
                <p className="panel-sub">Choose a format, then drop a file or use a sample.</p>
              </div>
              <span className="badge info"><Icon name="lock" size={10} /> Local only</span>
            </div>
            <Tabs
              tabs={[
                { id: 'csv', label: 'Bank CSV' },
                { id: 'pdf', label: 'PDF statement' },
                { id: 'sms', label: 'SMS alerts' },
              ]}
              value={tab}
              onChange={(t) => { setTab(t as Tab); reset(); }}
            />
          </div>

          <div className="panel-body">
            {tab !== 'sms' ? (
              <>
                <div
                  className={`dropzone ${dragging ? 'drag' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) void handleFile(file);
                  }}
                >
                  <Icon name={tab === 'csv' ? 'file' : 'upload'} size={20} style={{ margin: '0 auto', color: 'var(--muted)' }} />
                  <h3>{busy ? 'Reading…' : tab === 'csv' ? 'Drop a CSV or TSV statement' : 'Drop a PDF statement'}</h3>
                  <p>{tab === 'csv' ? 'Comma, semicolon, tab, or pipe separated. Headers are detected automatically.' : 'Text-based PDFs only. Scanned images need text extraction first.'}</p>
                  <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
                    <label className="btn btn-sm">
                      Choose file
                      <input
                        type="file"
                        accept={tab === 'csv' ? '.csv,.tsv,.txt' : '.pdf'}
                        style={{ display: 'none' }}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.currentTarget.value = ''; }}
                      />
                    </label>
                    <button className="btn btn-sm" onClick={() => void loadSample()} disabled={busy}>
                      Use sample {tab === 'csv' ? 'CSV' : 'PDF'}
                    </button>
                  </div>
                </div>
                <div className="row-between" style={{ marginTop: 10 }}>
                  <span className="tiny" style={{ color: 'var(--muted)' }}>
                    {tab === 'csv' ? 'Sample includes a warning row, a footer row, and two duplicates.' : 'The sample PDF is a real text-layer statement.'}
                  </span>
                  <div className="row" style={{ gap: 10 }}>
                    {tab === 'pdf' && (
                      <button className="linkish small" onClick={() => setShowPaste((v) => !v)}>
                        {showPaste ? 'Hide text paste' : 'Paste statement text instead'}
                      </button>
                    )}
                    {tab === 'csv' && (
                      <button className="linkish small" onClick={() => downloadFile(SAMPLE_CSV, 'baseline-sample-statement.csv')}>
                        Download sample
                      </button>
                    )}
                  </div>
                </div>
                {tab === 'pdf' && showPaste && (
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      className="textarea mono"
                      rows={6}
                      style={{ fontSize: 11.5 }}
                      placeholder={'04/10/2026  SWIGGY BANGALORE  486.00 DR  184320.50'}
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ marginTop: 8 }}
                      disabled={!pasteText.trim()}
                      onClick={() => setPreview(parseStatementText(pasteText, 'pasted-statement.txt'))}
                    >
                      Parse pasted text
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="sms-box">Paste bank SMS alerts, one per line</label>
                  <textarea
                    id="sms-box"
                    className="textarea mono"
                    rows={7}
                    style={{ fontSize: 11.5 }}
                    placeholder={'HDFC Bank: Rs.486.00 debited from a/c XX4412 on 04-10-26 to SWIGGY.'}
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                  />
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                  <button className="btn btn-primary" disabled={!smsText.trim()} onClick={() => setPreview(parseSMS(smsText, 'pasted-alerts.txt'))}>
                    <Icon name="spark" size={14} /> Parse alerts
                  </button>
                  <button className="btn" onClick={() => void loadSample()}>Use sample SMS</button>
                  <span className="tiny" style={{ color: 'var(--muted)' }}>Handles debited, credited, spent, and UPI phrasing.</span>
                </div>
              </>
            )}

            {error && (
              <div className="note guard" style={{ marginTop: 12, borderLeftColor: 'var(--negative)' }}>
                <strong>Could not read that file.</strong> {error}
              </div>
            )}
          </div>

          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>
              {state.txns.length} transactions already modelled · {state.batches.length} imports logged
            </span>
            <button className="linkish small" onClick={() => navigate('/rules')}>See what the model has learned</button>
          </div>
        </section>

        <aside className="panel col-4">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">The pipeline</h2>
              <p className="panel-sub">What happens between file and model.</p>
            </div>
          </div>
          <div className="panel-body">
            <ol className="stack-sm">
              {[
                { n: '01', t: 'Detect the shape', d: 'Delimiter, header row, date format, debit vs credit columns.' },
                { n: '02', t: 'Clean each line', d: 'Amounts, references, and merchant names are normalised.' },
                { n: '03', t: 'Categorise with reasons', d: 'Known merchants score high. Everything else asks for a correction.' },
                { n: '04', t: 'Check for duplicates', d: 'A fingerprint of date, amount, and description prevents double counting.' },
              ].map((s) => (
                <li key={s.n} className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
                  <span className="mono tiny" style={{ color: 'var(--accent)', paddingTop: 2 }}>{s.n}</span>
                  <span>
                    <span className="small strong">{s.t}</span>
                    <span className="small muted" style={{ display: 'block' }}>{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="divider dashed" />
            <div className="row-between small">
              <span className="muted">Waiting for review</span>
              <span className="num">{pending.length}</span>
            </div>
            <div className="row-between small" style={{ marginTop: 4 }}>
              <span className="muted">Rules learned</span>
              <span className="num">{state.rules.filter((r) => r.source === 'learned').length}</span>
            </div>
            <div className="row-between small" style={{ marginTop: 4 }}>
              <span className="muted">Corrections recorded</span>
              <span className="num">{state.corrections.length}</span>
            </div>
          </div>
        </aside>

        {preview && (
          <section className="panel col-12" style={{ borderColor: 'var(--accent)' }}>
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Preview · {preview.meta.fileName}</h2>
                <p className="panel-sub">
                  {preview.meta.detectedFormat} · {preview.rows.length} rows read
                  {preview.errors.length ? ` · ${preview.errors.length} line${preview.errors.length > 1 ? 's' : ''} skipped` : ''}
                </p>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn" onClick={reset}>Discard</button>
                <button className="btn" onClick={() => commit(false)}>Add to inbox</button>
                <button className="btn btn-primary" onClick={() => commit(true)}>
                  <Icon name="check" size={14} /> Add & approve {previewRows.length}
                </button>
              </div>
            </div>
            {preview.errors.length > 0 && (
              <div className="panel-body" style={{ paddingBottom: 0 }}>
                <div className="note guard" style={{ borderLeftColor: 'var(--accent)' }}>
                  <strong>Skipped lines:</strong> {preview.errors.slice(0, 2).join(' ')}
                  {preview.errors.length > 2 ? ` (+${preview.errors.length - 2} more)` : ''}
                </div>
              </div>
            )}
            <div className="panel-body flush" style={{ marginTop: 12 }}>
              <div className="table-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Auto category</th>
                      <th>Confidence</th>
                      <th className="right">Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.slice(0, 10).map((r, i) => (
                      <tr key={`${r.hash}-${i}`}>
                        <td className="mono small nowrap">{r.date}</td>
                        <td>
                          <div className="txn-merchant ellipsis" style={{ maxWidth: 330 }}>{r.description}</div>
                        </td>
                        <td>
                          <span className="row" style={{ gap: 6 }}>
                            <span className="cat-dot" style={{ background: CATEGORY_MAP[r.cat.category]?.color }} />
                            <span className="small">{CATEGORY_MAP[r.cat.category]?.name}</span>
                          </span>
                        </td>
                        <td>
                          <span className={`small ${r.cat.confidence > 0.85 ? 'pos' : r.cat.confidence > 0.5 ? '' : 'neg'}`}>
                            {Math.round(r.cat.confidence * 100)}%
                          </span>
                        </td>
                        <td className={`money ${r.amount > 0 ? 'pos' : ''}`}>
                          {r.amount > 0 ? '+' : '−'}{money(Math.abs(r.amount))}
                        </td>
                        <td>
                          {state.txns.some((t) => t.hash === r.hash)
                            ? <span className="badge warn">Duplicate</span>
                            : <span className="badge pos">New</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewRows.length > 10 && (
                <p className="tiny" style={{ color: 'var(--muted)', padding: '10px 16px' }}>
                  Showing the first 10 of {previewRows.length} rows. All rows will be imported.
                </p>
              )}
            </div>
          </section>
        )}

        <section className="panel col-7">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Waiting for review</h2>
              <p className="panel-sub">
                {pendingShown.length} line{pendingShown.length === 1 ? '' : 's'} not yet counted in the model.
              </p>
            </div>
            <div className="row" style={{ gap: 6 }}>
              {batchFilter && (
                <button className="chip" onClick={() => setBatchFilter(null)}>
                  <Icon name="x" size={10} /> Clear batch filter
                </button>
              )}
              <button
                className="btn btn-sm"
                disabled={!pendingShown.length}
                onClick={() => {
                  pendingShown.forEach((t) => updateTxn(t.id, { pending: false }));
                  if (batchFilter) approveBatch(batchFilter);
                  push(`Approved ${pendingShown.length} transactions`);
                }}
              >
                Approve all
              </button>
            </div>
          </div>
          <div className="panel-body flush">
            {pendingShown.length === 0 ? (
              <Empty
                icon="check"
                title="The inbox is clear"
                body="Every imported line has been reviewed. New statements will queue up here before they touch the model."
              />
            ) : (
              <div className="table-wrap" style={{ maxHeight: 440, overflowY: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Merchant</th>
                      <th>Category</th>
                      <th className="right">Amount</th>
                      <th className="right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingShown.slice(0, 40).map((t) => (
                      <tr key={t.id} className="pending">
                        <td className="mono small nowrap">{t.date.slice(5)}</td>
                        <td>
                          <div className="txn-merchant ellipsis" style={{ maxWidth: 170 }}>{t.merchant}</div>
                          <div className="tiny" style={{ color: 'var(--muted)' }}>{t.source.toUpperCase()} · {Math.round(t.confidence * 100)}%</div>
                        </td>
                        <td>
                          <select
                            className="select select-sm"
                            style={{ width: 130 }}
                            value={t.category}
                            aria-label={`Category for ${t.merchant}`}
                            onChange={(e) => correctCategory(t.id, e.target.value, false)}
                          >
                            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </td>
                        <td className={`money ${t.amount > 0 ? 'pos' : ''}`}>{t.amount > 0 ? '+' : '−'}{money(Math.abs(t.amount))}</td>
                        <td className="right">
                          <div className="row" style={{ gap: 2, justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-ghost btn-icon"
                              aria-label={`Approve ${t.merchant}`}
                              title="Approve"
                              onClick={() => { updateTxn(t.id, { pending: false }); push('Approved'); }}
                            >
                              <Icon name="check" size={13} />
                            </button>
                            <button
                              className="btn btn-ghost btn-icon"
                              aria-label={`Discard ${t.merchant}`}
                              title="Discard"
                              onClick={() => { deleteTxns([t.id]); push('Line discarded'); }}
                            >
                              <Icon name="trash" size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="panel col-5">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Import history</h2>
              <p className="panel-sub">Every batch, and what it changed.</p>
            </div>
          </div>
          <div className="panel-body" style={{ paddingTop: 4 }}>
            {state.batches.slice(0, 6).map((b) => (
              <div key={b.id} className="goal-row">
                <div className="row-between" style={{ gap: 8 }}>
                  <span className="small strong ellipsis" style={{ maxWidth: 220 }}>{b.fileName}</span>
                  <span className={`badge ${b.approved ? 'pos' : 'warn'}`}>{b.approved ? 'Approved' : 'In review'}</span>
                </div>
                <div className="tiny" style={{ color: 'var(--muted)', marginTop: 3 }}>
                  {b.source.toUpperCase()} · {new Date(b.importedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ·{' '}
                  {b.added} added{b.duplicates ? ` · ${b.duplicates} duplicates` : ''}
                </div>
                {!b.approved && b.added > 0 && (
                  <div className="row" style={{ gap: 6, marginTop: 6 }}>
                    <button className="btn btn-sm" onClick={() => { setBatchFilter(b.id); push('Showing that batch'); }}>Review</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => { approveBatch(b.id); push('Batch approved'); }}>Approve batch</button>
                    <button
                      className="btn btn-sm btn-ghost btn-danger"
                      onClick={() => { discardBatch(b.id); push('Batch discarded'); }}
                    >
                      Discard
                    </button>
                  </div>
                )}
              </div>
            ))}
            {state.batches.length === 0 && <Empty icon="upload" title="No imports yet" body="Your first statement will show up here with a full audit trail." />}
          </div>
          <div className="panel-foot">
            <span className="tiny" style={{ color: 'var(--muted)' }}>
              Latest: {state.batches[0] ? monthLabel(String(new Date(state.batches[0].importedAt).toISOString().slice(0, 7))) : '—'}
            </span>
            <button className="linkish small" onClick={() => navigate('/settings')}>Export all data</button>
          </div>
        </section>
      </div>
    </div>
  );
}
