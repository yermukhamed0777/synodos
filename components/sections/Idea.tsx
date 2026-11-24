import { PILLARS } from '@/lib/site';

export function Idea() {
  return (
    <section className="section" id="idea">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="tag">The idea</span>
            <h2 className="section-title">
              Less planning.
              <br />
              More going.
            </h2>
          </div>
          <span className="sec-index">[ 01 / 04 ]</span>
        </div>
      </div>

      <div className="statement wrap">
        <p>
          Travel has too many small decisions and too many apps asking for your
          attention. <em>Synodos</em> takes the useful part and leaves the rest
          out.
        </p>
      </div>

      <div className="grid-3">
        {PILLARS.map((pillar) => (
          <article
            key={pillar.num}
            className={`card ${
              pillar.tone === 'red'
                ? 'card--red'
                : pillar.tone === 'purple'
                  ? 'card--purple'
                  : ''
            }`}
          >
            <div className="card-num">{pillar.num}</div>
            <div className="card-icon" aria-hidden="true">
              {pillar.icon}
            </div>
            <h3>{pillar.title}</h3>
            <p>{pillar.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
