import { asset, BASE_PATH } from '@/lib/site';

export function Idea() {
  return (
    <section className="band" id="journey">
      <img className="band-bg" src={asset('hero-globe.webp')} alt="" aria-hidden="true" />
      <div className="wrap band-inner">
        <div className="band-grid">
          <div>
            <span className="eyebrow">Journey</span>
            <h2 className="display">Every journey begins with <span className="accent-purple">one decision.</span></h2>
            <p className="lead">
              Synodos is a travel-planner concept: give it a city and a few preferences and it
              assembles a day-by-day draft you can check and reshape. The in-trip companion shown
              here is a preview of the intended direction, not a shipped feature.
            </p>
            <div className="hero-actions" style={{ marginTop: 28 }}>
              <a href={`${BASE_PATH}/planner/`} className="btn btn--primary">Start the Journey <span aria-hidden="true">→</span></a>
            </div>
          </div>

          <div className="mini-stack" aria-label="Journey signals preview">
            <span className="preview-label">Concept preview — not live data</span>
            <div className="glass-card mini-card"><strong>Visa Approved</strong><span>Japan eVisa</span><em>APPROVED</em></div>
            <div className="glass-card mini-card"><strong>Heavy rain tomorrow</strong><span>Don’t forget your umbrella</span><em>18° / RAIN</em></div>
            <div className="glass-card mini-card"><strong>Local restaurant found</strong><span>Sushi Kai · 4.8 · 500m from you</span><em>NEARBY</em></div>
            <div className="glass-card mini-card"><strong>Metro is faster than taxi</strong><span>Save 18 min · View route</span><em>ROUTE</em></div>
          </div>
        </div>

        <div className="scroll-cue"><i aria-hidden="true" />Scroll to explore</div>
      </div>
    </section>
  );
}
