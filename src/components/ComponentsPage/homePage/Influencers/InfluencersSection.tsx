"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FadeIn } from "@/components/animations/FadeIn";
import { InfluencerCard } from "./InfluencerCard";
import styles from "./Influencers.module.scss";

const INFLUENCERS = [
  {
    id: "jb-efootball",
    name: "JB EFOOTBALL",
    image: "/Influencers/JB-INFLUENCER.jpg",
    platforms: {
      youtube: "https://youtube.com/@jotabeesports?si=xdppB5CQTjImjnXa",
      tiktok: "https://www.tiktok.com/@jotabeesports?is_from_webapp=1&sender_device=pc",
      instagram: "https://www.instagram.com/jbefootballbrasil?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==",
    },
  },
  {
    id: "kadu",
    name: "KADU",
    image: "/Influencers/KADU-INFLUENCER.jpg",
    platforms: {
      tiktok: "https://www.tiktok.com/@kadu_goat?is_from_webapp=1&sender_device=pc",
      instagram: "https://www.instagram.com/kadu_goat?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==",
    },
  },
  {
    id: "jotavxzz",
    name: "JOTAVXZZ",
    image: "/Influencers/JV-INFLUENCER.jpg",
    platforms: {
      youtube: "https://youtube.com/@jotav_xzz?si=W5YtPThxcBim4nWF",
      tiktok: "https://www.tiktok.com/@jotav.xzz?is_from_webapp=1&sender_device=pc",
      instagram: "https://www.instagram.com/jotav.xzz?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==",
    },
  },
  {
    id: "thg",
    name: "THG",
    image: "/Influencers/THG-INFLUENCER.jpg",
    platforms: {
      youtube: "https://youtube.com/@thg_efootball5?si=xck1zKF_VHWreTj0",
      instagram: "https://www.instagram.com/thg_efootball?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==",
      tiktok: "https://www.tiktok.com/@thg_efootball?is_from_webapp=1&sender_device=pc",
    },
  },
  {
    id: "el-mysterio",
    name: "EL MYSTERIO",
    image: "/Influencers/ELMYSTERIO-INFLUENCER.JPEG",
    platforms: {
      youtube: "https://youtube.com/@el_mysterioo?si=YkmPysSMBY1VOhxV",
      tiktok: "https://www.tiktok.com/@el_mysterioo?is_from_webapp=1&sender_device=pc",
      instagram: "https://www.instagram.com/el_mysterioo?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==",
    },
  },
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
