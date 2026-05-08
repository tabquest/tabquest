import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2 } from 'lucide-react';
import { useAppDispatch } from '../../utils/redux/hooks';
import { addNote } from '../../utils/redux/notesSlice';
import {
  registerShortcut,
  unregisterShortcut,
} from '../../utils/keyboard/shortcuts';

const getHeading = (text: string): string => {
  const firstLine = text
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!firstLine) return 'Quick Note';
  return firstLine.length > 50 ? firstLine.slice(0, 50) : firstLine;
};

const QuickCapture = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const closeOverlay = useCallback(() => {
    setIsOpen(false);
    setText('');
    setSaved(false);
  }, []);

  const saveNote = useCallback(() => {
    const content = text.trim();
    if (!content) {
      closeOverlay();
      return;
    }
    dispatch(
      addNote({
        id: Date.now().toString(),
        heading: getHeading(content),
        content,
        tags: ['quick-capture'],
        timestamp: new Date().toISOString(),
        starred: false,
        type: 'note',
      }),
    );
    setSaved(true);
    setTimeout(closeOverlay, 800);
  }, [text, dispatch, closeOverlay]);

  // Register Q as the quick capture shortcut via the shared registry
  useEffect(() => {
    registerShortcut('q', () => {
      if (!isOpen) {
        setText('');
        setIsOpen(true);
        setSaved(false);
      }
    });
    return () => unregisterShortcut('q');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      textareaRef.current?.focus();
      const len = textareaRef.current?.value?.length ?? 0;
      textareaRef.current?.setSelectionRange(len, len);
    }, 50);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeOverlay();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveNote();
      }
    },
    [closeOverlay, saveNote],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="qc-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[500] flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeOverlay();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-[var(--tq-glass-bg)] border border-[var(--tq-glass-border)] backdrop-blur-xl rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit2 size={16} style={{ color: 'var(--tq-accent)' }} />
                <span
                  className="font-medium text-sm"
                  style={{ color: 'var(--tq-text-primary)' }}
                >
                  Quick Capture
                </span>
              </div>
              <div
                className="flex items-center gap-3 text-[10px]"
                style={{ color: 'var(--tq-text-muted)' }}
              >
                <span className="flex items-center gap-1">
                  <kbd
                    className="px-1.5 py-0.5 rounded font-mono text-[9px]"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    Ctrl+Enter
                  </kbd>
                  save
                </span>
                <span className="flex items-center gap-1">
                  <kbd
                    className="px-1.5 py-0.5 rounded font-mono text-[9px]"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    Esc
                  </kbd>
                  close
                </span>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Capture a thought… (Ctrl+Enter to save, Esc to discard)"
              className="w-full h-40 bg-transparent resize-none focus:outline-none text-base leading-relaxed placeholder:opacity-40"
              style={{
                color: 'var(--tq-text-primary)',
                caretColor: 'var(--tq-accent)',
              }}
            />

            <AnimatePresence>
              {saved && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-sm"
                  style={{ color: 'var(--tq-accent)' }}
                >
                  Note saved!
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const QuickCaptureHint = () => (
  <motion.div
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.5 }}
    className="flex items-center justify-center gap-1.5 mt-2"
  >
    <kbd
      className="px-1.5 py-0.5 text-[10px] rounded font-mono"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'var(--tq-text-muted)',
      }}
    >
      Q
    </kbd>
    <span
      className="text-[10px]"
      style={{ color: 'var(--tq-text-muted)', opacity: 0.6 }}
    >
      quick capture
    </span>
  </motion.div>
);

export default QuickCapture;
