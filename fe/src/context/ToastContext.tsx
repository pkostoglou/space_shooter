import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import Toast from "../components/basics/Toast";

export type ToastType = 'info' | 'warning' | 'error';
export interface ToastItem { id: string; message: string; type: ToastType; }
interface ToastContextValue { pushToast: (message: string, type: ToastType) => void; }

const MAX_TOASTS = 5;
const AUTO_DISMISS_MS = 4000;
const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) { clearTimeout(timer); timers.current.delete(id); }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev) => {
      let next = [...prev];
      if (next.length >= MAX_TOASTS) {
        const evicted = next.shift()!;
        const t = timers.current.get(evicted.id);
        if (t !== undefined) { clearTimeout(t); timers.current.delete(evicted.id); }
      }
      return [...next, { id, message, type }];
    });
    const timer = setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
    timers.current.set(id, timer);
  }, [removeToast]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-[2000] pointer-events-none" aria-live="polite">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
