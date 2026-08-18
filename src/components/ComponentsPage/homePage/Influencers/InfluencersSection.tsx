"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeIn } from "@/components/animations/FadeIn";
import { InfluencerCard } from "./InfluencerCard";
import styles from "./Influencers.module.scss";

// Mock data
const INFLUENCERS = [
  { id: "1", name: "Gabriel", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800", platforms: { instagram: "#", tiktok: "#" } },
  { id: "2", name: "Lucas", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800", platforms: { youtube: "#", instagram: "#" } },
  { id: "3", name: "Matheus", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", platforms: { tiktok: "#" } },
  { id: "4", name: "Pedro", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800", platforms: { instagram: "#", youtube: "#", tiktok: "#" } },
  { id: "5", name: "João", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800", platforms: { instagram: "#" } },
  { id: "6", name: "Thiago", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800", platforms: { youtube: "#", tiktok: "#" } },
  { id: "7", name: "Felipe", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=800", platforms: { instagram: "#", tiktok: "#" } },
  { id: "8", name: "Rafael", image: "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&q=80&w=800", platforms: { youtube: "#" } },
];

export function InfluencersSection() {
  const [isDesktop, setIsDesktop] = useState(true);
  
  // Only initialize embla if we're not on desktop
  const [emblaRef] = useEmblaCarousel(
    { 
      align: "start",
      containScroll: "trimSnaps",
      active: !isDesktop 
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  return (
    <SectionWrapper id="influencers">
      <div className={styles.header}>
        <FadeIn>
          <h2 className={styles.title}>Quem já faz parte</h2>
          <p className={styles.subtitle}>
            Junte-se aos maiores influenciadores de eFootball do Brasil que já confiam 
            na KZN para elevar o nível de suas gameplays.
          </p>
        </FadeIn>
      </div>

      <div className={styles.carousel} ref={emblaRef}>
        <div className={styles.carouselContainer}>
          {INFLUENCERS.map((influencer, index) => (
            <FadeIn 
              key={influencer.id} 
              delay={isDesktop ? index * 100 : 0} 
              className={styles.carouselSlide}
            >
              <InfluencerCard 
                name={influencer.name} 
                image={influencer.image} 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                platforms={influencer.platforms as any} 
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
