"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingBackground } from "@/components/animations/FloatingBackground";
import { HeroSection } from "@/components/ComponentsPage/homePage/Hero";
import { InfluencersSection } from "@/components/ComponentsPage/homePage/Influencers";
import { BenefitsSection } from "@/components/ComponentsPage/homePage/Benefits";
import { AboutSection } from "@/components/ComponentsPage/homePage/About";
import { FaqSection } from "@/components/ComponentsPage/homePage/FAQ";
import { CategorySelectionModal } from "@/components/ComponentsPage/homePage/CategorySelectionModal";

interface HomePageProps {
  influencerSlug?: string;
}

export function HomePage({ influencerSlug }: HomePageProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  return (
    <>
      <Header onOpenCategoryModal={() => setIsCategoryModalOpen(true)} />
      <main>
        <FloatingBackground />
        <HeroSection onOpenCategoryModal={() => setIsCategoryModalOpen(true)} />
        <InfluencersSection />
        <BenefitsSection />
        <AboutSection />
        <FaqSection />
      </main>
      <Footer />
      <CategorySelectionModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        influencerSlug={influencerSlug}
      />
    </>
  );
}
