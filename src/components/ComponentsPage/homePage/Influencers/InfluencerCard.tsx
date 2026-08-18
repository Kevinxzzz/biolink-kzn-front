"use client";

import { useState } from "react";
import { ProfileImage } from "./ProfileImage";
import { SocialLinks } from "./SocialLinks";
import styles from "./Influencers.module.scss";

type SocialPlatform = "instagram" | "tiktok" | "youtube";

interface InfluencerCardProps {
  name: string;
  image: string;
  platforms: Partial<Record<SocialPlatform, string>>;
}

export function InfluencerCard({ name, image, platforms }: InfluencerCardProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div 
      className={`${styles.card} ${isActive ? styles.isActive : ""}`}
      onClick={() => setIsActive(!isActive)}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsActive(!isActive);
        }
      }}
    >
      <ProfileImage src={image} alt={`Foto de ${name}`} />
      
      <div className={styles.overlay}>
        <h3 className={styles.name}>{name}</h3>
        <SocialLinks platforms={platforms} />
      </div>
    </div>
  );
}
