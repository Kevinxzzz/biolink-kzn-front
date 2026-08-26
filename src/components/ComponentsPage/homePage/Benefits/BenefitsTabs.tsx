"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BenefitItem } from "./BenefitItem";
import { BenefitContent } from "./BenefitContent";
import styles from "./Benefits.module.scss";

interface Benefit {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

interface BenefitsTabsProps {
  benefits: Benefit[];
  autoPlayInterval?: number;
}

export function BenefitsTabs({ benefits, autoPlayInterval = 5000 }: BenefitsTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Function to smoothly scroll the active tab into center of the carousel container ONLY (never scrolling the page)
  const scrollToTab = useCallback((index: number) => {
    const container = tabsContainerRef.current;
    const tabElement = tabRefs.current[index];
    if (container && tabElement) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();

      const targetScrollLeft =
        container.scrollLeft +
        (tabRect.left - containerRect.left) -
        (container.clientWidth / 2 - tabElement.clientWidth / 2);

      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
    }
  }, []);

  // Whenever activeIndex changes, ensure the carousel slides to the active tab
  useEffect(() => {
    scrollToTab(activeIndex);
  }, [activeIndex, scrollToTab]);

  // 5-second auto-progression timer
  useEffect(() => {
    if (isPaused || benefits.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % benefits.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPaused, benefits.length, autoPlayInterval]);

  const handleSelectTab = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className={styles.tabs} role="tablist" ref={tabsContainerRef}>
        {benefits.map((benefit, index) => (
          <BenefitItem
            key={benefit.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            title={benefit.title}
            subtitle={benefit.subtitle}
            icon={benefit.icon}
            isActive={activeIndex === index}
            onClick={() => handleSelectTab(index)}
          />
        ))}
      </div>

      <div className={styles.contentArea}>
        {benefits.map((benefit, index) => (
          <BenefitContent
            key={benefit.id}
            title={benefit.title}
            subtitle={benefit.subtitle}
            description={benefit.description}
            icon={benefit.icon}
            isActive={activeIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
