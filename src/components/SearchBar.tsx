import { useState, useRef, useEffect } from 'react';
import Weather from './Weather';
import ErrorBoundary from './ErrorBoundary';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { FaGoogle, FaYoutube } from 'react-icons/fa';
import { BiLogoBing } from 'react-icons/bi';
import { SiDuckduckgo } from 'react-icons/si';
import type { RootState } from '../utils/redux/store';

interface SearchBarProps {
  onFocusChange: (_focused: boolean) => void;
}

type EngineKey = 'webSearch' | 'youtube';

const PILL_H = 'h-[56px]';

const SearchBar = ({ onFocusChange }: SearchBarProps) => {
  const SearchEngineName = useSelector(
    (state: RootState) => state.settings.searchEngine,
  );
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState<EngineKey>('webSearch');
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleFocus = () => {
    setFocused(true);
    onFocusChange(true);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false);
      onFocusChange(false);
    }, 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const q = encodeURIComponent(query);
    const url =
      engine === 'youtube'
        ? `https://www.youtube.com/results?search_query=${q}`
        : SearchEngineName === 'Google'
          ? `https://www.google.com/search?q=${q}`
          : SearchEngineName === 'DuckDuckGo'
            ? `https://duckduckgo.com/?q=${q}`
            : `https://www.bing.com/search?q=${q}`;
    window.location.href = url;
  };

  /* Engine icon helpers — icon only, no label */
  const webIcon =
    SearchEngineName === 'Google' ? (
      <FaGoogle size={15} />
    ) : SearchEngineName === 'DuckDuckGo' ? (
      <SiDuckduckgo size={15} />
    ) : (
      <BiLogoBing size={17} />
    );

  const activeIcon = engine === 'webSearch' ? webIcon : <FaYoutube size={15} />;

  const altEngine: { key: EngineKey; label: string; icon: React.ReactNode } =
    engine === 'webSearch'
      ? { key: 'youtube', label: 'YouTube', icon: <FaYoutube size={15} /> }
      : { key: 'webSearch', label: SearchEngineName, icon: webIcon };

  return (
    <div className="relative w-full">
      {/* ── Backdrop blur overlay when focused ── */}
      <AnimatePresence>
        {focused && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[65]"
            style={{
              backdropFilter: 'blur(32px) saturate(140%)',
              WebkitBackdropFilter: 'blur(32px) saturate(140%)',
              background: 'rgba(0,0,0,.4)',
            }}
            onClick={() => inputRef.current?.blur()}
          />
        )}
      </AnimatePresence>

      {/* ── Search panel ── */}
      <div
        className="relative z-[70] w-full"
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {/* Glass pill */}
        <motion.div
          className={`relative w-full rounded-[18px] overflow-hidden`}
          animate={{
            boxShadow: focused
              ? `inset 0 1px 0 rgba(255,255,255,.10), 0 0 0 1px var(--tq-accent), 0 0 32px var(--tq-accent-glow), 0 16px 48px rgba(0,0,0,.65)`
              : `inset 0 1px 0 rgba(255,255,255,.07), 0 8px 32px rgba(0,0,0,.5)`,
          }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'var(--tq-search-bg)',
            border: '1px solid var(--tq-search-border)',
            backdropFilter: 'blur(48px) saturate(180%)',
            WebkitBackdropFilter: 'blur(48px) saturate(180%)',
          }}
        >
          <form
            onSubmit={handleSearch}
            className={`flex items-stretch ${PILL_H}`}
          >
            {/* Engine selector — icon + chevron only */}
            <div ref={dropdownRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className={`${PILL_H} flex items-center gap-1.5 pl-4 pr-3 cursor-pointer transition-colors`}
                style={{
                  borderRight: '1px solid var(--tq-border-1)',
                  color: focused
                    ? 'var(--tq-text-secondary)'
                    : 'var(--tq-text-muted)',
                  background: 'transparent',
                }}
              >
                <span>{activeIcon}</span>
                <motion.span
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ color: 'var(--tq-text-muted)', display: 'flex' }}
                >
                  <ChevronDown size={11} strokeWidth={2} />
                </motion.span>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 mt-1.5 w-40 rounded-xl overflow-hidden z-50"
                    style={{
                      background: 'var(--tq-surface-overlay)',
                      border: '1px solid var(--tq-border-2)',
                      boxShadow: '0 20px 48px rgba(0,0,0,.7)',
                      backdropFilter: 'blur(48px)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEngine(altEngine.key);
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm cursor-pointer"
                      style={{
                        color: 'var(--tq-text-primary)',
                        background: 'transparent',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          'var(--tq-hover-bg)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      {altEngine.icon}
                      <span className="font-medium">{altEngine.label}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search anything..."
              className="flex-1 min-w-0 px-5 bg-transparent focus:outline-none"
              style={{
                color: 'var(--tq-text-primary)',
                fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                fontWeight: 300,
              }}
              autoComplete="off"
              data-no-theme-transition="true"
            />

            {/* Submit */}
            <motion.button
              type="submit"
              className="px-5 flex items-center cursor-pointer"
              style={{
                borderLeft: '1px solid var(--tq-border-1)',
                color: focused ? 'var(--tq-accent)' : 'var(--tq-text-muted)',
                background: 'transparent',
                transition: 'color 0.2s ease',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Search"
            >
              <Search size={17} strokeWidth={2} />
            </motion.button>
          </form>
        </motion.div>

        {/* Weather — compact row below pill */}
        <ErrorBoundary componentName="Weather">
          <Weather />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default SearchBar;
