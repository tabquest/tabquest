import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const sizeMap = {
  sm: '22rem',
  md: '32rem',
  lg: '44rem',
};

export const Modal = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
}: ModalProps) => {
  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[300]"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal
            aria-labelledby={title ? 'modal-title' : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{
                maxWidth: sizeMap[size],
                background: 'var(--tq-surface-overlay)',
                border: '1px solid var(--tq-border-2)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                maxHeight: 'calc(100dvh - 2rem)',
              }}
            >
              {/* Header */}
              {(title || description) && (
                <div
                  className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 shrink-0"
                  style={{ borderBottom: '1px solid var(--tq-border-1)' }}
                >
                  <div>
                    {title && (
                      <h2
                        id="modal-title"
                        className="text-base font-semibold leading-tight"
                        style={{ color: 'var(--tq-text-primary)' }}
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: 'var(--tq-text-muted)' }}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="tq-icon-btn p-1.5 shrink-0"
                    style={{ color: 'var(--tq-text-muted)' }}
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div
                  className="px-6 py-4 flex items-center justify-end gap-3 shrink-0"
                  style={{ borderTop: '1px solid var(--tq-border-1)' }}
                >
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};
