import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);
    
    // Auto remove after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(toast.id), 300); // Wait for animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border shadow-lg
        min-w-[320px] max-w-[420px]
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        ${colors[toast.type]}
      `}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-sm font-medium">{toast.message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(toast.id), 300);
        }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Extend Window interface for custom event
declare global {
  interface WindowEventMap {
    showToast: CustomEvent<Omit<Toast, 'id'>>;
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event: CustomEvent<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...event.detail,
      };
      setToasts((prev) => [...prev, toast]);
    };

    window.addEventListener('showToast', handleToast);
    return () => {
      window.removeEventListener('showToast', handleToast);
    };
  }, []);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={handleClose} />
        </div>
      ))}
    </div>
  );
}

// Helper function to show toast
export function showToast(message: string, type: ToastType = 'info') {
  const event = new CustomEvent('showToast', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}

