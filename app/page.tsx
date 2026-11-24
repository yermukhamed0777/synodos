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
