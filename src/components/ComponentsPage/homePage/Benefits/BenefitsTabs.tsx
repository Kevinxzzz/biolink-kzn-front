"use client";

import { useState } from "react";
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
}

export function BenefitsTabs({ benefits }: BenefitsTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.tabs} role="tablist">
        {benefits.map((benefit, index) => (
          <BenefitItem
            key={benefit.id}
            title={benefit.title}
            subtitle={benefit.subtitle}
            icon={benefit.icon}
            isActive={activeIndex === index}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <div className={styles.contentArea}>
        {benefits.map((benefit, index) => (
          <BenefitContent
            key={benefit.id}
            title={benefit.title}
            description={benefit.description}
            isActive={activeIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
