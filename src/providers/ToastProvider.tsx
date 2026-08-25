"use client";

import React from "react";
import { ToastContainer, ToastPosition } from "@/components/ui/Toast";

interface ToastProviderProps {
  children?: React.ReactNode;
  position?: ToastPosition;
}

export function ToastProvider({ children, position = "top-right" }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer position={position} />
    </>
  );
}
