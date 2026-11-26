'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  { n: '01', title: 'Tell us where', body: 'A destination, a date and what you care about — Synodos builds a day-by-day draft.' },
  { n: '02', title: 'See it take shape', body: 'Curated stops, a timing check and a USD-equivalent budget estimate arrive together.' },
  { n: '03', title: 'Change one day', body: 'Rebuild a single day without losing the rest of the trip.' },
] as const;

export function ConceptModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button type="button" className="btn btn--ghost" onClick={() => setOpen(true)}>
        <span aria-hidden="true">▸</span> See the concept
      </button>

      {open && (
        <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="concept-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <span className="eyebrow eyebrow--purple">The concept</span>
                <h3 id="concept-title" style={{ marginTop: 12 }}>One journey. One companion.</h3>
              </div>
              <button type="button" className="icon-btn" aria-label="Close concept" onClick={() => setOpen(false)}>×</button>
            </div>
            <div className="modal-steps">
              {STEPS.map((s) => (
                <div className="modal-step" key={s.n}>
                  <b>{s.n}</b>
                  <div><strong>{s.title}</strong><span>{s.body}</span></div>
                </div>
              ))}
            </div>
            <p className="form-note">This is a product concept preview — not a video. Press Escape or click outside to close.</p>
          </div>
        </div>
      )}
    </>
  );
}
