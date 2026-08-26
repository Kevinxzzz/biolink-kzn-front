import { ToastItemData, ToastOptions, ToastPromiseOptions, ToastType } from "./Toast.types";

type Listener = (toasts: ToastItemData[]) => void;

class ToastStore {
  private toasts: ToastItemData[] = [];
  private listeners: Set<Listener> = new Set();
  private maxToasts: number = 5;

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getToasts(): ToastItemData[] {
    return [...this.toasts];
  }

  public add(options: ToastOptions | string, type: ToastType = "info"): string {
    const defaultDuration = type === "loading" ? 0 : 4500;
    const opts: ToastOptions = typeof options === "string" ? { description: options } : options;
    const id = opts.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const existingIndex = this.toasts.findIndex((t) => t.id === id);

    const toastItem: ToastItemData = {
      id,
      type: opts.type || type,
      title: opts.title || "",
      description: opts.description,
      duration: opts.duration !== undefined ? opts.duration : defaultDuration,
      dismissible: opts.dismissible !== undefined ? opts.dismissible : true,
      action: opts.action,
      icon: opts.icon,
      onDismiss: opts.onDismiss,
      createdAt: Date.now(),
      isLeaving: false,
    };

    if (existingIndex > -1) {
      this.toasts[existingIndex] = toastItem;
    } else {
      this.toasts = [toastItem, ...this.toasts].slice(0, this.maxToasts);
    }

    this.notify();
    return id;
  }

  public remove(id: string) {
    const toast = this.toasts.find((t) => t.id === id);
    if (!toast) return;

    if (toast.onDismiss) {
      toast.onDismiss(id);
    }

    this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, isLeaving: true } : t));
    this.notify();

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.notify();
    }, 250);
  }

  public clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastStore = new ToastStore();

export const toast = {
  success: (message: string, options?: Omit<ToastOptions, "type" | "description">) => {
    return toastStore.add({ ...options, description: message, type: "success" }, "success");
  },
  error: (message: string, options?: Omit<ToastOptions, "type" | "description">) => {
    return toastStore.add({ ...options, description: message, type: "error" }, "error");
  },
  warning: (message: string, options?: Omit<ToastOptions, "type" | "description">) => {
    return toastStore.add({ ...options, description: message, type: "warning" }, "warning");
  },
  info: (message: string, options?: Omit<ToastOptions, "type" | "description">) => {
    return toastStore.add({ ...options, description: message, type: "info" }, "info");
  },
  loading: (message: string, options?: Omit<ToastOptions, "type" | "description">) => {
    return toastStore.add({ ...options, description: message, type: "loading", duration: 0 }, "loading");
  },
  custom: (options: ToastOptions) => {
    return toastStore.add(options, options.type || "info");
  },
  dismiss: (id: string) => {
    toastStore.remove(id);
  },
  clear: () => {
    toastStore.clear();
  },
  promise: async <T>(
    promise: Promise<T> | (() => Promise<T>),
    options: ToastPromiseOptions<T>
  ): Promise<T> => {
    const loadingText = typeof options.loading === "string" ? options.loading : options.loading.description;
    const loadingTitle = typeof options.loading === "object" ? options.loading.title : undefined;

    const id = toast.loading(loadingText || "Carregando...", { title: loadingTitle });

    try {
      const result = typeof promise === "function" ? await promise() : await promise;

      const successConfig =
        typeof options.success === "function" ? options.success(result) : options.success;
      const successText = typeof successConfig === "string" ? successConfig : successConfig.description;
      const successTitle = typeof successConfig === "object" ? successConfig.title : undefined;

      toastStore.add({
        id,
        type: "success",
        title: successTitle,
        description: successText,
        duration: 4000,
      });

      return result;
    } catch (err) {
      const errorConfig = typeof options.error === "function" ? options.error(err) : options.error;
      const errorText = typeof errorConfig === "string" ? errorConfig : errorConfig.description;
      const errorTitle = typeof errorConfig === "object" ? errorConfig.title : undefined;

      toastStore.add({
        id,
        type: "error",
        title: errorTitle,
        description: errorText,
        duration: 5000,
      });

      throw err;
    }
  },
};
