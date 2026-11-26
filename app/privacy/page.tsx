import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: 'What the Synodos prototype collects, stores and does not collect.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="section-block about">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <span className="eyebrow eyebrow--purple">Privacy</span>
            <h2 className="display" style={{ margin: '16px 0 22px' }}>Privacy notice</h2>
            <p className="lead">
              This notice describes the current Synodos prototype. It will be reviewed before any
              real-user pilot begins.
            </p>

            <h3 style={{ marginTop: 36 }}>What we collect</h3>
            <p>
              Only an email address, and only if you type it into the waitlist form and submit it.
              The form is disabled in builds where no submission endpoint is configured, and it
              requires you to agree to this notice before it can send anything. No other personal
              data is collected by this site.
            </p>

            <h3 style={{ marginTop: 28 }}>What we do not do</h3>
            <p>
              There are no accounts, no payments, no analytics, no advertising tags, no cookies and
              no third-party tracking scripts. Display fonts are self-hosted. Plans are generated in
              your browser from a curated dataset; no live inventory, weather or routing provider
              receives your input.
            </p>

            <h3 style={{ marginTop: 28 }}>Where a saved plan lives</h3>
            <p>
              If you press “Save plan”, the plan is stored in this browser&apos;s local storage under
              a versioned key. It is never uploaded. Clearing site data removes it. The Download and
              Copy actions also run entirely on your device.
            </p>

            <h3 style={{ marginTop: 28 }}>Retention and deletion</h3>
            <p>
              Waitlist addresses are retained only for the purpose of contacting you about early
              access. There is no automated export or delete flow yet. To ask for deletion, use the
              contact channel provided with your invitation; requests are handled manually.
            </p>

            <h3 style={{ marginTop: 28 }}>Changes</h3>
            <p>
              This page is part of the source repository and changes with it. Material changes will
              be recorded in the repository changelog before a pilot starts.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
