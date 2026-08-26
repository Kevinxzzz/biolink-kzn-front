"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ToastPosition, ToastItemData } from "./Toast.types";
import { toastStore } from "./toastStore";
import { ToastItem } from "./ToastItem";
import styles from "./Toast.module.scss";

interface ToastContainerProps {
  position?: ToastPosition;
}

export function ToastContainer({ position = "top-right" }: ToastContainerProps) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = toastStore.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });

    return () => unsubscribe();
  }, []);

  if (!mounted || toasts.length === 0) {
    return null;
  }

  const containerContent = (
    <div
      className={`${styles.toastContainer} ${styles[position]}`}
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((item) => (
        <ToastItem key={item.id} toast={item} />
      ))}
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(containerContent, document.body);
  }

  return null;
}
