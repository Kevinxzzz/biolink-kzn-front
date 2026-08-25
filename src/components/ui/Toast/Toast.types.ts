import { ReactNode } from "react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export interface ToastAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  description?: string | ReactNode;
  duration?: number; // duration in ms, defaults to 4500 (0 for persistent)
  action?: ToastAction;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: (id: string) => void;
}

export interface ToastItemData extends Required<Omit<ToastOptions, "action" | "icon" | "onDismiss" | "description">> {
  description?: string | ReactNode;
  action?: ToastAction;
  icon?: ReactNode;
  onDismiss?: (id: string) => void;
  createdAt: number;
  isLeaving?: boolean;
}

export interface ToastPromiseOptions<T> {
  loading: string | { title?: string; description?: string };
  success: string | ((data: T) => string | { title?: string; description?: string });
  error: string | ((error: unknown) => string | { title?: string; description?: string });
}
