"use client";

import { useState, useEffect, useRef } from "react";

interface ScrollState {
  scrollY: number;
  isScrolled: boolean;
  direction: "up" | "down" | null;
  progress: number;
}

export function useScroll(threshold = 60): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    isScrolled: false,
    direction: null,
    progress: 0,
  });

  const previousScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? currentScrollY / documentHeight : 0;

      const direction: "up" | "down" | null =
        currentScrollY > previousScrollY.current
          ? "down"
          : currentScrollY < previousScrollY.current
            ? "up"
            : null;

      previousScrollY.current = currentScrollY;

      setState({
        scrollY: currentScrollY,
        isScrolled: currentScrollY > threshold,
        direction,
        progress: Math.min(progress, 1),
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return state;
}
