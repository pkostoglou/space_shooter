import { JSX, useEffect, useRef } from "react";
import { ToastItem } from "../../context/ToastContext";

const TYPE_STYLES: Record<ToastItem['type'], string> = {
  info:    "bg-blue-500 border-blue-600 text-white",
  warning: "bg-yellow-400 border-yellow-500 text-gray-900",
  error:   "bg-red-500 border-red-600 text-white",
};

const TYPE_ICONS: Record<ToastItem['type'], JSX.Element> = {
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-1 4a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0v-5Z" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1Zm0 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2ZM8.293 8.293a1 1 0 0 1 1.414 0L12 10.586l2.293-2.293a1 1 0 1 1 1.414 1.414L13.414 12l2.293 2.293a1 1 0 0 1-1.414 1.414L12 13.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L10.586 12 8.293 9.707a1 1 0 0 1 0-1.414Z" />
    </svg>
  ),
};

const Toast = ({ toast, onClose }: { toast: ToastItem; onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.classList.remove("opacity-0", "translate-x-full");
      el.classList.add("opacity-100", "translate-x-0");
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[260px] max-w-[360px] transition-all duration-300 ease-out opacity-0 translate-x-full ${TYPE_STYLES[toast.type]}`}
      role="alert"
    >
      {TYPE_ICONS[toast.type]}
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={onClose}
        className="shrink-0 text-lg leading-none opacity-70 hover:opacity-100 focus:outline-none cursor-pointer"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
