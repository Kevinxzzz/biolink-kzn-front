"use client";

import { useEffect, useState } from "react";
import { ToastItemData } from "./Toast.types";
import { toast, toastStore } from "./toastStore";

export function useToast() {
  const [toasts, setToasts] = useState<ToastItemData[]>(() => toastStore.getToasts());

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });

    return () => unsubscribe();
  }, []);

  return {
    toasts,
    toast,
    dismiss: toast.dismiss,
    clear: toast.clear,
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
    loading: toast.loading,
    promise: toast.promise,
    custom: toast.custom,
  };
}
