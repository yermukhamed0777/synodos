import { SITE } from '@/lib/site';

export function FinalCTA() {
  return (
    <section className="section block-purple final" id="access">
      <div className="wrap">
        <span className="tag tag--red">Private beta</span>
        <h2 className="huge-type" style={{ marginTop: 26 }}>
          Ready when
          <br />
          you are.
        </h2>
        <p className="lead text-reverse">
          {SITE.name} is opening to a small group. Leave your interest and we’ll
          reach out when your spot is ready.
        </p>
        <div className="final-actions">
          <a href="mailto:hello@synodos.app?subject=Synodos%20early%20access" className="btn btn--red">
            Request access <span aria-hidden="true">↗</span>
          </a>
          <a href="#top" className="btn btn--light">
            Back to top ↑
          </a>
        </div>
        <div className="final-note">No spam. No waitlist theatre.</div>
      </div>
    </section>
  );
}
