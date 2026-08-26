import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingBackground } from "@/components/animations/FloatingBackground";
import { HeroSection } from "@/components/ComponentsPage/homePage/Hero";
import { InfluencersSection } from "@/components/ComponentsPage/homePage/Influencers";
import { BenefitsSection } from "@/components/ComponentsPage/homePage/Benefits";
import { AboutSection } from "@/components/ComponentsPage/homePage/About";
import { FaqSection } from "@/components/ComponentsPage/homePage/FAQ";

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <FloatingBackground />
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
