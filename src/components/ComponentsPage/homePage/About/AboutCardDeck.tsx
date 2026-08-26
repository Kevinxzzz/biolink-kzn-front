"use client";

import { useState } from "react";
import styles from "./About.module.scss";

export interface AboutPillar {
  id: string;
  number: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface AboutCardDeckProps {
  pillars: AboutPillar[];
}

export function AboutCardDeck({ pillars }: AboutCardDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 40) {
      // Swipe left -> next
      setActiveIndex((prev) => (prev + 1) % pillars.length);
    } else if (diff < -40) {
      // Swipe right -> prev
      setActiveIndex((prev) => (prev - 1 + pillars.length) % pillars.length);
    }
    setTouchStartX(null);
  };

  return (
    <div className={styles.wrapper}>
      {/* Mobile & iPad: Segmented Pill Controller */}
      <div className={styles.segmentedControl} role="tablist">
        {pillars.map((pillar, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={pillar.id}
              className={`${styles.segmentButton} ${isActive ? styles.activeSegment : ""}`}
              onClick={() => setActiveIndex(index)}
              role="tab"
              aria-selected={isActive}
              type="button"
            >
              <span className={styles.segmentNumber}>{pillar.number}</span>
              <span className={styles.segmentTitle}>{pillar.title}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Deck (Swipeable on Mobile/iPad, Grid on Desktop) */}
      <div
        className={styles.deckContainer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {pillars.map((pillar, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={pillar.id}
              className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
              data-index={index}
            >
              {/* Background ambient glow */}
              <div className={styles.cardGlow} aria-hidden="true" />

              {/* Top metadata row */}
              <div className={styles.cardHeader}>
                <div className={styles.tagWrapper}>
                  <span className={styles.numberBadge}>{pillar.number}</span>
                  <span className={styles.pillarTag}>{pillar.tag}</span>
                </div>
                <div className={styles.iconWrapper}>{pillar.icon}</div>
              </div>

              {/* Card content */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                <p className={styles.cardDescription}>{pillar.description}</p>
              </div>

              {/* Watermark in background */}
              <div className={styles.watermarkIcon} aria-hidden="true">
                {pillar.icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile & iPad Navigation Dots & Arrows */}
      <div className={styles.deckPagination}>
        <button
          type="button"
          aria-label="Item anterior"
          className={styles.navArrow}
          onClick={() => setActiveIndex((prev) => (prev - 1 + pillars.length) % pillars.length)}
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className={styles.dotsGroup}>
          {pillars.map((pillar, index) => (
            <button
              key={pillar.id}
              type="button"
              aria-label={`Ver ${pillar.title}`}
              className={`${styles.dot} ${activeIndex === index ? styles.activeDot : ""}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Próximo item"
          className={styles.navArrow}
          onClick={() => setActiveIndex((prev) => (prev + 1) % pillars.length)}
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
