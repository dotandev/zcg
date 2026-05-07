'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (type !== 'loading') {
      setTimeout(() => removeToast(id), 5000);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none'
      }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                pointerEvents: 'auto',
                minWidth: '300px',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                background: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${toast.type === 'success' ? '#00ff88' :
                    toast.type === 'error' ? '#ff3366' :
                      toast.type === 'loading' ? 'var(--accent-cyan)' : 'var(--accent-purple)'
                  }`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                color: 'white'
              }}
            >
              <div style={{
                color:
                  toast.type === 'success' ? '#00ff88' :
                    toast.type === 'error' ? '#ff3366' :
                      toast.type === 'loading' ? 'var(--accent-cyan)' : 'var(--accent-purple)'
              }}>
                {toast.type === 'success' && <CheckCircle2 size={20} />}
                {toast.type === 'error' && <AlertCircle size={20} />}
                {toast.type === 'info' && <Info size={20} />}
                {toast.type === 'loading' && <Loader2 size={20} className="pulse" />}
              </div>

              <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: '500' }}>{toast.message}</div>

              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
