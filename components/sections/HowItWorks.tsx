import { STEPS } from '@/lib/site';

export function HowItWorks() {
  return (
    <section className="section block-purple text-reverse" id="how">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="tag tag--red">How it works</span>
            <h2 className="section-title">
              Three moments.
              <br />
              One companion.
            </h2>
          </div>
          <span className="sec-index">[ 02 / 04 ]</span>
        </div>

        <div className="steps">
          {STEPS.map((step) => (
            <article key={step.num} className="step">
              <div className="step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
