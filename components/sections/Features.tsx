import { TECHNOLOGY_STEPS } from '@/lib/site';

export function Features() {
  return (
    <section className="section-block" id="technology">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Technology</span>
            <h2 className="display">From the first idea to the moment you return home.</h2>
          </div>
          <p className="muted" style={{ maxWidth: 320, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            A grounded planner: curated stops, checked hours and transfer estimates, computed locally.
          </p>
        </div>

        <div className="steps-grid">
          {TECHNOLOGY_STEPS.map((step) => (
            <article className="step-cell" key={step.num}>
              <span className="step-no">{step.num} / 04</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
