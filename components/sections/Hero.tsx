import { ConceptModal } from '@/components/ui/ConceptModal';
import { asset, HERO_ALERTS, TRIP_ROWS, TRUST, FEATURE_BAR } from '@/lib/site';

const ICONS: Record<string, string> = { flight: '✈', hotel: '▦', weather: '◍' };

export function Hero() {
  return (
    <>
      <section className="hero" id="top">
        <img className="hero-bg" src={asset('hero-aurora.webp')} alt="" aria-hidden="true" />
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">AI travel companion</span>
            <h1 className="display display--hero">
              See the world.<br />
              Synodos handles <span className="accent-purple">the rest.</span>
            </h1>
            <p className="lead">
              Your AI companion that plans, guides and supports you at every step of the journey.
              Before you go, while you’re there, and when you return.
            </p>
            <div className="hero-actions">
              <a href="#journey" className="btn btn--primary">Start Your Journey <span aria-hidden="true">→</span></a>
              <ConceptModal />
            </div>

            <div className="hero-note">
              <span className="eyebrow eyebrow--purple">Trusted by travellers worldwide</span>
              <div className="trust-row">
                {TRUST.map((name) => <span key={name}>{name}</span>)}
              </div>
            </div>
          </div>

          <div className="alert-stack" aria-label="Live travel updates preview">
            {HERO_ALERTS.map((a) => (
              <div className="glass-card alert" key={a.id}>
                <span className={`alert-icon ${a.tone === 'purple' ? 'alert-icon--purple' : a.tone === 'neutral' ? 'alert-icon--neutral' : ''}`} aria-hidden="true">{ICONS[a.icon]}</span>
                <div className="alert-body"><strong>{a.title}</strong><span>{a.detail}</span></div>
                <span className={`alert-status ${a.status === 'Heads up' ? 'alert-status--warn' : ''}`}>{a.status}</span>
              </div>
            ))}

            <div className="glass-card trip-card">
              <div className="trip-card-head">Trip Overview <span>•••</span></div>
              <div className="trip-card-body">
                <div className="ring"><div><strong>12</strong><small>Days left</small></div></div>
                <div className="trip-rows">
                  {TRIP_ROWS.map((row) => (
                    <div className="trip-row" key={row.label}>
                      <i className={`dot ${row.tone === 'red' ? 'dot--red' : row.tone === 'purple' ? 'dot--purple' : ''}`} aria-hidden="true" />
                      <span>{row.label}</span>
                      <b className={row.tone === 'red' ? 'red' : row.tone === 'purple' ? 'purple' : ''}>{row.value}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ position: 'relative', zIndex: 3, marginTop: -32, marginBottom: 56 }}>
        <div className="feature-strip">
          {FEATURE_BAR.map((f) => (
            <div className="feature-cell" key={f.title}>
              <span className="fi" aria-hidden="true">{f.icon === 'spark' ? '✦' : f.icon === 'clock' ? '◷' : f.icon === 'globe' ? '◎' : f.icon === 'shield' ? '◇' : '⌘'}</span>
              <h4>{f.title}</h4>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
