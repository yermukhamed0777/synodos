import { WaitlistForm } from '@/components/ui/WaitlistForm';

export function FinalCTA() {
  return (
    <section className="section-block about" id="waitlist">
      <div className="wrap about-grid">
        <div>
          <span className="eyebrow">About Synodos</span>
          <h2 className="display" style={{ margin: '16px 0 22px', fontSize: 'clamp(2.4rem, 4.6vw, 4.4rem)' }}>
            Built for the whole journey.
          </h2>
          <p className="lead">
            Synodos is a private beta. We’re opening it to a small group of travellers who want
            less planning noise and more of the moments that make a trip worth taking.
          </p>
          <p style={{ fontSize: 14, marginTop: 18 }}>
            No feed. No streaks. Just the right thing, at the right moment.
          </p>
        </div>

        <div className="glass-card waitlist-box">
          <span className="eyebrow eyebrow--purple">Private beta</span>
          <h3 style={{ marginTop: 14 }}>Get early access</h3>
          <p>Leave your email and we’ll reach out when your spot is ready.</p>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
