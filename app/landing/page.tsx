'use client';

import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import SecuritySection from '@/components/landing/SecuritySection';
import Footer from '@/components/landing/Footer';
import { GridBackground } from '@/components/ui/grid-background';

export default function LandingPage() {
  return (
    <GridBackground>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SecuritySection />
      <Footer />
    </GridBackground>
  );
}
