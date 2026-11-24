import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/sections/Footer';
import { Planner } from '@/components/planner/Planner';
import { asset } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Plan a trip',
  description: 'Build a day-by-day draft itinerary with the Synodos planner prototype.',
};

export default function PlannerPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="planner-hero">
          <img className="band-bg" src={asset('hero-globe.webp')} alt="" aria-hidden="true" />
          <div className="wrap planner-hero-inner">
            <span className="eyebrow eyebrow--purple">Synodos planner · prototype</span>
            <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', margin: '18px 0 18px' }}>
              Plan the shape<br />of a trip.
            </h1>
            <p className="lead">
              Choose a city, a length and what you care about. Synodos assembles a grounded draft
              from a curated dataset — save it, copy it or download it.
            </p>
          </div>
        </section>

        <section className="section-block planner-section">
          <div className="wrap">
            <Planner />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
