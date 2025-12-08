import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const baseClasses = "fixed bottom-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in max-w-md";
  const typeClasses = {
    success: "bg-green-600 text-white border border-green-500",
    error: "bg-red-600 text-white border border-red-500",
    info: "bg-blue-600 text-white border border-blue-500",
    warning: "bg-yellow-600 text-white border border-yellow-500",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <span className="text-xl font-bold">{icons[type]}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:opacity-80 transition-opacity text-lg"
      >
        ×
      </button>
    </div>
  );
}
