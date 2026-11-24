import { asset, HERO_ALERTS, TRIP_ROWS } from '@/lib/site';

const ICONS: Record<string, string> = { flight: '✈', hotel: '▦', weather: '◍' };

export function HowItWorks() {
  return (
    <section className="band band--center" id="experience">
      <img className="band-bg" src={asset('hero-terminal.webp')} alt="" aria-hidden="true" />
      <div className="wrap band-inner">
        <div style={{ maxWidth: 720 }}>
          <span className="eyebrow eyebrow--purple">Experience</span>
          <h2 className="display">Every journey deserves clarity. <span className="accent-red">We bring it.</span></h2>
          <p className="lead">
            Synodos is your AI travel companion that plans, guides and supports you at every step
            of your journey — one calm place for the things that actually matter.
          </p>
          <div className="hero-actions" style={{ marginTop: 28 }}>
            <a href="#technology" className="btn btn--primary">See how it works <span aria-hidden="true">→</span></a>
          </div>
        </div>

        <div className="band-grid" style={{ marginTop: 56, gridTemplateColumns: 'minmax(0, 1fr) 360px' }}>
          <div style={{ display: 'grid', gap: 12, maxWidth: 460 }}>
            <span className="preview-label">Concept preview — not live data</span>
            {HERO_ALERTS.map((a) => (
              <div className="glass-card alert" key={a.id}>
                <span className={`alert-icon ${a.tone === 'purple' ? 'alert-icon--purple' : a.tone === 'neutral' ? 'alert-icon--neutral' : ''}`} aria-hidden="true">{ICONS[a.icon]}</span>
                <div className="alert-body"><strong>{a.title}</strong><span>{a.detail}</span></div>
                <span className="alert-status">{a.status}</span>
              </div>
            ))}
          </div>
          <div className="glass-card trip-card" style={{ margin: 0 }}>
            <div className="trip-card-head">Trip Overview <span>•••</span></div>
            <div className="trip-card-body">
              <div className="ring"><div><strong>12</strong><small>Days left</small></div></div>
              <div className="trip-rows">
                {TRIP_ROWS.map((row) => (
                  <div className="trip-row" key={row.label}>
                    <i className={`dot ${row.tone === 'red' ? 'dot--red' : row.tone === 'purple' ? 'dot--purple' : ''}`} aria-hidden="true" />
                    <span>{row.label}</span><b className={row.tone === 'red' ? 'red' : row.tone === 'purple' ? 'purple' : ''}>{row.value}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
