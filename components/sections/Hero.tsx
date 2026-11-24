import { SITE } from '@/lib/site';

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-main wrap">
        <div className="hero-meta">
          <span className="tag tag--red">Private beta</span>
          <span className="tag">AI travel companion</span>
          <span className="tag tag--purple">One journey at a time</span>
        </div>

        <h1 className="hero-type">
          <span className="hero-word">Travel</span>
          <span className="hero-word hero-word--stroke">without</span>
          <span className="hero-word hero-word--purple">friction.</span>
        </h1>

        <div className="hero-bottom">
          <p className="lead">
            {SITE.name} is the companion that shows up when you start planning,
            stays useful while you move, and keeps what matters afterwards.
          </p>
          <div className="hero-actions">
            <a href="#access" className="btn btn--red">
              Get early access <span aria-hidden="true">↗</span>
            </a>
            <a href="#idea" className="btn btn--outline">
              See the idea
            </a>
          </div>
        </div>
      </div>

      <aside className="hero-side wrap" aria-label="At a glance">
        <div className="hero-side-cell">
          <div className="hero-side-num">01</div>
          <div className="hero-side-label">
            Before
            <br />
            The decisions
          </div>
        </div>
        <div className="hero-side-cell">
          <div className="hero-side-num">02</div>
          <div className="hero-side-label">
            During
            <br />
            The moments
          </div>
        </div>
        <div className="hero-side-cell">
          <div className="hero-side-num">03</div>
          <div className="hero-side-label">
            After
            <br />
            The memory
          </div>
        </div>
      </aside>
    </section>
  );
}
