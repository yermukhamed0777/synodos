'use client';

import { useMemo, useState } from 'react';
import { BASE_PATH } from '@/lib/site';
import {
  budgetBreakdown,
  buildItinerary,
  CITIES,
  estimateBudget,
  handoffLinks,
  INTERESTS,
  itineraryToMarkdown,
  mapLink,
  rebuildDay,
  type City,
  type Interest,
  type PlannedDay,
} from '@/lib/itineraries';

type Result = { city: City; days: PlannedDay[]; travellers: number } | null;

export function Planner() {
  const [mode, setMode] = useState<'know' | 'choose'>('know');
  const [cityId, setCityId] = useState(CITIES[0].id);
  const [nights, setNights] = useState(3);
  const [travellers, setTravellers] = useState(2);
  const [dailyBudget, setDailyBudget] = useState(150);
  const [recommendation, setRecommendation] = useState('');
  const [interests, setInterests] = useState<Interest[]>(['food', 'culture']);
  const [result, setResult] = useState<Result>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const city = useMemo(() => CITIES.find((c) => c.id === cityId) ?? CITIES[0], [cityId]);

  const toggleInterest = (id: Interest) =>
    setInterests((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const recommendCity = () => {
    const scored = CITIES.map((c) => {
      const overlap = c.items.filter((i) => i.tags.some((t) => interests.includes(t))).length;
      const fit = c.dailyBudget <= dailyBudget ? 4 : -3;
      return { city: c, score: overlap + fit };
    }).sort((a, b) => b.score - a.score);
    const best = scored[0].city;
    setCityId(best.id);
    setRecommendation(
      `${best.name} fits a ${dailyBudget} ${best.currency}/day budget and your ${interests.length ? interests.join(', ') : 'open'} preferences.`
    );
  };

  const generate = () => {
    const days = buildItinerary(city, nights, interests);
    setResult({ city, days, travellers });
    setSaved(false);
    setCopied(false);
    window.setTimeout(() => {
      document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  };

  const rebuild = (index: number) => {
    if (!result) return;
    const days = rebuildDay(result.city, result.days, index, interests);
    setResult({ ...result, days });
    setSaved(false);
  };

  const save = () => {
    if (!result) return;
    try {
      window.localStorage.setItem('synodos_saved_plan', JSON.stringify(result));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  };

  const download = () => {
    if (!result) return;
    const md = itineraryToMarkdown(result.city, result.days, result.travellers);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synodos-${result.city.id}-plan.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(itineraryToMarkdown(result.city, result.days, result.travellers));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const budget = result ? estimateBudget(result.city, result.days.length, result.travellers) : null;
  const breakdown = result ? budgetBreakdown(result.city, result.days.length, result.travellers) : [];
  const handoffs = result ? handoffLinks(result.city) : [];

  return (
    <div className="planner">
      <div className="planner-form">
        <div className="planner-step">
          <span className="step-no">01 / Destination</span>
          <div className="mode-toggle" role="tablist" aria-label="Destination mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'know'}
              className={mode === 'know' ? 'is-active' : ''}
              onClick={() => setMode('know')}
            >
              I know where
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'choose'}
              className={mode === 'choose' ? 'is-active' : ''}
              onClick={() => setMode('choose')}
            >
              Help me choose
            </button>
          </div>

          {mode === 'know' ? (
            <>
              <div className="city-grid" role="radiogroup" aria-label="Destination">
                {CITIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={cityId === c.id}
                    className={`city-option ${cityId === c.id ? 'is-active' : ''}`}
                    onClick={() => setCityId(c.id)}
                  >
                    <strong>{c.name}</strong>
                    <span>{c.country}</span>
                  </button>
                ))}
              </div>
              <p className="planner-hint">{city.tagline}</p>
            </>
          ) : (
            <div className="choose-box">
              <label className="planner-field">
                <span>Budget per day</span>
                <select value={dailyBudget} onChange={(e) => setDailyBudget(Number(e.target.value))}>
                  {[80, 120, 180, 250].map((b) => <option key={b} value={b}>{b} per day</option>)}
                </select>
              </label>
              <button type="button" className="btn btn--ghost btn--small" onClick={recommendCity}>
                Find my city
              </button>
              {recommendation && (
                <p className="recommendation" role="status">{recommendation}</p>
              )}
              <p className="planner-hint">Recommendation uses the curated dataset and your budget band. It is a starting point, not a verdict.</p>
            </div>
          )}
        </div>

        <div className="planner-step">
          <span className="step-no">02 / Trip shape</span>
          <div className="planner-row">
            <label className="planner-field">
              <span>Days</span>
              <select value={nights} onChange={(e) => setNights(Number(e.target.value))}>
                {[2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n} days</option>)}
              </select>
            </label>
            <label className="planner-field">
              <span>Travellers</span>
              <select value={travellers} onChange={(e) => setTravellers(Number(e.target.value))}>
                {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="planner-step">
          <span className="step-no">03 / What you care about</span>
          <div className="chip-row">
            {INTERESTS.map((interest) => (
              <button
                key={interest.id}
                type="button"
                aria-pressed={interests.includes(interest.id)}
                className={`chip ${interests.includes(interest.id) ? 'is-active' : ''}`}
                onClick={() => toggleInterest(interest.id)}
              >
                {interest.label}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="btn btn--primary" style={{ width: '100%', marginTop: 8 }} onClick={generate}>
          Build my plan <span aria-hidden="true">→</span>
        </button>
        <p className="form-note">
          Prototype planner: plans are assembled from a curated city dataset. No booking is made and
          no live prices are shown.
        </p>
      </div>

      <div id="plan-result" className="planner-result" aria-live="polite">
        {!result && (
          <div className="planner-empty">
            <span className="eyebrow eyebrow--purple">Ready when you are</span>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', margin: '18px 0 14px' }}>
              Your plan appears here.
            </h2>
            <p className="lead" style={{ fontSize: 15 }}>
              Pick a city, a length and what you care about. Synodos assembles a day-by-day draft you
              can save, copy or download.
            </p>
          </div>
        )}

        {result && (
          <>
            <div className="plan-head">
              <div>
                <span className="eyebrow">Draft itinerary</span>
                <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '14px 0 8px' }}>
                  {result.city.name}, {result.days.length} days
                </h2>
                <p className="muted" style={{ fontSize: 13, margin: 0 }}>
                  {result.travellers} traveller{result.travellers > 1 ? 's' : ''} · {result.city.country}
                </p>
                <span className="verified">Checked {result.city.verifiedAt} · curated dataset</span>
              </div>
              {budget && (
                <div className="budget">
                  <span>Est. on-ground</span>
                  <strong>{budget.low}–{budget.high}</strong>
                  <small>{budget.currency} · excludes flights</small>
                </div>
              )}
            </div>

            <div className="budget-breakdown" aria-label="Estimated budget by category">
              {breakdown.map((line) => (
                <div className="budget-line" key={line.label}>
                  <span className="budget-label">{line.label}</span>
                  <div className="budget-bar" aria-hidden="true"><i style={{ width: `${line.share * 100}%` }} /></div>
                  <span className="budget-value">{line.low}–{line.high} {result.city.currency}</span>
                </div>
              ))}
            </div>

            <div className="plan-days">
              {result.days.map((day) => (
                <article className="plan-day" key={day.day}>
                  <div className="plan-day-head">
                    <span className="plan-day-no">Day {day.day}</span>
                    <button type="button" className="plan-rebuild" onClick={() => rebuild(day.day - 1)}>
                      Rebuild this day
                    </button>
                  </div>
                  {(['morning', 'afternoon', 'evening'] as const).map((slot) => {
                    const item = day[slot];
                    return (
                      <div className="plan-slot" key={slot}>
                        <span className="plan-slot-label">{slot}</span>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.detail}</p>
                          <div className="plan-tags">
                            {item.tags.map((t) => <span key={t}>{t}</span>)}
                            <a className="plan-map" href={mapLink(result.city, item)} target="_blank" rel="noreferrer">Map ↗</a>
                            <em>~{item.price} {result.city.currency}</em>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </article>
              ))}
            </div>

            <div className="plan-actions">
              <button type="button" className="btn btn--primary btn--small" onClick={save}>{saved ? 'Saved ✓' : 'Save plan'}</button>
              <button type="button" className="btn btn--ghost btn--small" onClick={download}>Download .md</button>
              <button type="button" className="btn btn--ghost btn--small" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
              <a href={`${BASE_PATH}/#waitlist`} className="btn btn--outline-red btn--small">Get early access</a>
            </div>

            <div className="handoff">
              <div className="handoff-copy">
                <span className="eyebrow">Verify and book</span>
                <p>These open real search pages for this city. Nothing is booked here, and no commission is earned.</p>
              </div>
              <div className="handoff-links">
                {handoffs.map((h) => (
                  <a key={h.label} href={h.href} target="_blank" rel="noreferrer">
                    <strong>{h.label}</strong>
                    <span>{h.note} ↗</span>
                  </a>
                ))}
              </div>
            </div>

            <p className="form-note">
              Saved plans stay in this browser. Verify opening hours, prices and travel times before
              booking — this is a prototype, not a booking engine.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
