"use client";

import { useIntersection } from "@/hooks/useIntersection";
import styles from "./FadeIn.module.scss";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function FadeIn({
  children,
  delay = 0,
  className,
  as = "div",
}: FadeInProps) {
  const [ref, isInView] = useIntersection<HTMLDivElement>({ threshold: 0.1 });

  const classes = [
    styles.fadeIn,
    isInView && styles.visible,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
