import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2 } from 'lucide-react';
import { useAppDispatch } from '../../utils/redux/hooks';
import { addNote } from '../../utils/redux/notesSlice';

const PRINTABLE_KEY_RE = /^.$/;

const isPrintableKey = (e: KeyboardEvent): boolean =>
  PRINTABLE_KEY_RE.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey;

const isInputFocused = (): boolean => {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || el.isContentEditable;
};

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isOpen || isInputFocused()) return;
      if (isPrintableKey(e)) {
        e.preventDefault();
        setText(e.key);
        setIsOpen(true);
        setSaved(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
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
                <Edit2 size={18} style={{ color: 'var(--tq-accent)' }} />
                <span
                  className="font-medium text-base"
                  style={{ color: 'var(--tq-text-primary)' }}
                >
                  Quick Capture
                </span>
              </div>
              <div
                className="flex items-center gap-2 text-xs"
                style={{ color: 'var(--tq-text-muted)' }}
              >
                <kbd className="px-2 py-0.5 rounded-md font-mono bg-[var(--tq-glass-bg)] border border-[var(--tq-glass-border)]">
                  Ctrl+Enter
                </kbd>
                <span>save</span>
                <kbd className="px-2 py-0.5 rounded-md font-mono bg-[var(--tq-glass-bg)] border border-[var(--tq-glass-border)]">
                  Esc
                </kbd>
                <span>discard</span>
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

export default QuickCapture;
