import { BUSINESS_POINTS } from '@/lib/site';

export function Business() {
  return (
    <section className="section block-red" id="business">
      <div className="wrap business">
        <div className="sec-head">
          <div>
            <span className="tag tag--purple">For teams</span>
            <h2 className="section-title text-reverse">
              Business travel,
              <br />
              without the overhead.
            </h2>
          </div>
          <span className="sec-index">[ 04 / 04 ]</span>
        </div>

        <div className="business-grid">
          <p className="lead text-reverse">
            One companion for every person on the move — clear updates, simple
            policy, and a record of what happened. No helpdesk theatre.
          </p>
          <div className="business-points">
            {BUSINESS_POINTS.map((point) => (
              <div key={point}>
                <b aria-hidden="true">→</b>
                {point}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 44 }}>
          <a href="#access" className="btn btn--light">
            Talk to us <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
