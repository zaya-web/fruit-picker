'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';

type ToastVariant = 'success' | 'error' | 'info';

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-[#b8d4bc] bg-[#eef6ef] text-[var(--farm-deep)]',
  error: 'border-[#efc9c9] bg-[#fdf0f0] text-[#8e2b2b]',
  info: 'border-[#d9d3c4] bg-white text-[var(--foreground)]',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  useEffect(() => {
    const toastParam = searchParams.get('toast');
    if (!toastParam) return;

    const messages: Record<string, string> = {
      saved: 'Амжилттай хадгаллаа.',
      deleted: 'Амжилттай устгалаа.',
      created: 'Амжилттай нэмэгдлээ.',
    };

    const timer = window.setTimeout(() => {
      showToast(messages[toastParam] ?? toastParam, 'success');
    }, 0);

    return () => window.clearTimeout(timer);
  }, [searchParams, showToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-24 z-[60] flex max-w-sm flex-col gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg ${variantStyles[toast.variant]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
