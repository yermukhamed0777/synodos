import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Idea } from '@/components/sections/Idea';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Features } from '@/components/sections/Features';
import { Business } from '@/components/sections/Business';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>Before</span>
          <span>During</span>
          <span>After</span>
          <span>Repeat</span>
          <span>Before</span>
          <span>During</span>
          <span>After</span>
          <span>Repeat</span>
        </div>
      </div>
      <main>
        <Hero />
        <Idea />
        <HowItWorks />
        <Features />
        <Business />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
