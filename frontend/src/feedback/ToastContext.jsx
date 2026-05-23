import { AnimatePresence } from "framer-motion";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ToastViewport } from "./ToastViewport";

const ToastContext = createContext(null);

let toastSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, opts = {}) => {
      const id = opts.id || `toast-${++toastSeq}`;
      const duration = opts.duration ?? 4200;
      const entry = {
        id,
        message,
        title: opts.title,
        type: opts.type || "info",
      };
      setToasts((prev) => [...prev.slice(-4), entry]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      toast: push,
      dismiss,
      success: (message, opts) => push(message, { ...opts, type: "success" }),
      error: (message, opts) => push(message, { ...opts, type: "error" }),
      info: (message, opts) => push(message, { ...opts, type: "info" }),
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence mode="popLayout">
        <ToastViewport toasts={toasts} onDismiss={dismiss} />
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
