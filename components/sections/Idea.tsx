import { asset, BASE_PATH, JOURNEY_ALERTS } from '@/lib/site';

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
              Synodos is your AI travel companion that plans, guides and supports you before,
              during and after every trip. From the first idea to the moment you return home.
            </p>
            <div className="hero-actions" style={{ marginTop: 28 }}>
              <a href={`${BASE_PATH}/planner/`} className="btn btn--primary">Start the Journey <span aria-hidden="true">→</span></a>
            </div>
          </div>

          <div className="mini-stack" aria-label="Journey signals preview">
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
