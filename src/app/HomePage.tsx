import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/Hero";
import { InfluencersSection } from "@/components/sections/Influencers";
import { BenefitsSection } from "@/components/sections/Benefits";
import { AboutSection } from "@/components/sections/About";
import { FaqSection } from "@/components/sections/FAQ";

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <InfluencersSection />
        <BenefitsSection />
        <AboutSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
