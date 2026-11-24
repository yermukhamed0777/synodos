import { FEATURES } from '@/lib/site';

function PhoneMockup() {
  return (
    <div className="phone" aria-label="Illustration of the Synodos phone companion">
      <div className="phone-bar">
        <span>SYNODOS / LIVE</span>
        <span>09:41</span>
      </div>
      <div className="phone-screen">
        <div className="phone-label">Today · Lisbon</div>
        <div className="phone-title">You’re all set.</div>
        <div className="phone-tile">
          <strong>Gate changed</strong>
          <span>Now at gate 24. Walk time: 6 min.</span>
        </div>
        <div className="phone-tile">
          <strong>Saved place</strong>
          <span>Café on Rua da Prata — you liked this one.</span>
        </div>
        <div className="phone-cta">Open trip ↗</div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="section" id="features">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="tag tag--purple">Features</span>
            <h2 className="section-title">
              What it
              <br />
              actually does.
            </h2>
          </div>
          <span className="sec-index">[ 03 / 04 ]</span>
        </div>

        <div className="split">
          <div>
            <div className="feature-list">
              {FEATURES.map((feature) => (
                <div key={feature.id} className="feature-row">
                  <span className="feature-row-id">{feature.id}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
