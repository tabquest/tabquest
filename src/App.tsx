import { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { EyeOff } from 'lucide-react';
import Clock from './components/Clock';
import SocialPopover from './components/SocialPopover';
import ProgressBars from './components/ProgressBars';
import SearchBar from './components/SearchBar';
import BookmarkBar from './components/BookmarkBar';
import SettingsPanel from './components/SettingsPanel';
import ToolsPanel from './components/ToolsPanel';
import ErrorBoundary from './components/ErrorBoundary';
import UINotification from './components/UINotification';
import GreetingWidget from './components/GreetingWidget';
import QuickCapture, { QuickCaptureHint } from './components/QuickCapture';

import { MobileView, VersionChecker } from './features';

import { store, type RootState } from './utils/redux/store';
import ChromeSearchBar from './components/ChromeSearchBar';
import { checkDueReminders } from './services/reminderService';
import { setTasks } from './utils/redux/taskSlice';
import { toggleFocusMode, setFocusMode } from './utils/redux/settingsSlice';
import ChristmasSnowfall from './components/ChristmasSnowfall';
import { CHRISTMAS_MODE } from './utils/constants';
import ThemeProvider from './utils/ThemeProvider';
import {
  handleKeyEvent,
  registerShortcut,
  unregisterShortcut,
} from './utils/keyboard/shortcuts';

interface Notification {
  title: string;
  body: string;
}

/* ─── Stagger spring shared config ───────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.23, 1, 0.32, 1] as const },
});

const AppContent = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const focusMode =
    useSelector((state: RootState) => state.settings.focusMode) ?? false;
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  useEffect(() => {
    const dueReminders = checkDueReminders(tasks);
    if (dueReminders.length > 0) {
      const task = dueReminders[0];
      setNotification({ title: 'Task Reminder!', body: task.title });

      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});

      const updatedTasks = tasks.map((t) =>
        t.id === task.id ? { ...t, reminderSent: true } : t,
      );
      dispatch(setTasks(updatedTasks));
    }
  }, [tasks, dispatch]);

  useEffect(() => {
    registerShortcut('f', () => dispatch(toggleFocusMode()));
    registerShortcut('escape', () => {
      if (focusMode) dispatch(setFocusMode(false));
    });
    const listener = (e: KeyboardEvent) => handleKeyEvent(e);
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
      unregisterShortcut('f');
      unregisterShortcut('escape');
    };
  }, [focusMode, dispatch]);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) return <MobileView />;

  const isChrome = import.meta.env.VITE_BROWSER === 'chrome';

  return (
    <ThemeProvider>
      {/* Fixed overlays — outside grid flow */}
      <VersionChecker />
      {CHRISTMAS_MODE && <ChristmasSnowfall />}

      {focusMode && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => dispatch(toggleFocusMode())}
          className="fixed top-4 right-4 z-[999] flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border backdrop-blur-md cursor-pointer transition-all hover:opacity-80"
          style={{
            borderColor: 'var(--tq-accent)',
            color: 'var(--tq-accent)',
            background: 'rgba(var(--tq-accent-rgb), 0.1)',
          }}
          title="Exit Focus Mode (F)"
        >
          <EyeOff size={13} /> Focus Mode
        </motion.button>
      )}

      {/* ── Row 1: Header ─────────────────────────────────── */}
      <ErrorBoundary componentName="Header">
        <header
          className={`tq-header relative ${isSearchActive ? 'z-10' : 'z-30'}`}
        >
          {/* Left: Clock + Progress stacked */}
          <div className="flex flex-col gap-2 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            >
              <ErrorBoundary componentName="Clock">
                <Clock />
              </ErrorBoundary>
            </motion.div>

            {!focusMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <ErrorBoundary componentName="Progress Bars">
                  <ProgressBars />
                </ErrorBoundary>
              </motion.div>
            )}
          </div>

          {/* Right: Social */}
          {!focusMode && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.55,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="shrink-0 self-start"
            >
              <ErrorBoundary componentName="Social">
                <SocialPopover />
              </ErrorBoundary>
            </motion.div>
          )}
        </header>
      </ErrorBoundary>

      {/* ── Row 2: Center Stage ───────────────────────────── */}
      <ErrorBoundary componentName="Center Stage">
        <main
          className={`tq-center relative ${isSearchActive ? 'z-50' : 'z-10'}`}
        >
          {/* Christmas seasonal header */}
          {CHRISTMAS_MODE && (
            <motion.div {...fadeUp(0.3)} className="text-center mb-1">
              <h2
                className="font-bold tracking-wide leading-tight"
                style={{
                  fontFamily: "'Mountains of Christmas', cursive",
                  fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                }}
              >
                <span className="text-red-500 drop-shadow-[0_2px_4px_rgba(220,38,38,0.5)]">
                  Merry
                </span>{' '}
                <span className="text-white drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
                  Christmas
                </span>{' '}
                <span className="text-green-500 drop-shadow-[0_2px_4px_rgba(34,197,94,0.5)]">
                  !
                </span>{' '}
                🎄
              </h2>
              <p
                className="mt-1 text-[10px] font-light tracking-widest uppercase"
                style={{ color: 'var(--tq-text-muted)' }}
              >
                Wishing you joy &amp; peace
              </p>
            </motion.div>
          )}

          {/* Greeting */}
          {!focusMode && (
            <motion.div {...fadeUp(0.25)} className="w-full text-center">
              <ErrorBoundary componentName="Greeting">
                <GreetingWidget />
              </ErrorBoundary>
            </motion.div>
          )}

          {/* Search bar — fills available width, constrained by inner max-width */}
          <motion.div
            {...fadeUp(0.35)}
            className="w-full"
            style={{ maxWidth: 'clamp(440px, 55vw, 720px)' }}
          >
            <ErrorBoundary componentName="Search">
              {isChrome ? (
                <ChromeSearchBar onFocusChange={setIsSearchActive} />
              ) : (
                <SearchBar onFocusChange={setIsSearchActive} />
              )}
            </ErrorBoundary>
          </motion.div>

          {/* Quick bookmarks */}
          {!focusMode && (
            <motion.div {...fadeUp(0.45)}>
              <ErrorBoundary componentName="Bookmark Bar">
                <BookmarkBar />
              </ErrorBoundary>
            </motion.div>
          )}

          {/* QuickCapture hint */}
          {!focusMode && (
            <motion.div {...fadeUp(0.5)}>
              <QuickCaptureHint />
            </motion.div>
          )}
        </main>
      </ErrorBoundary>

      {/* Fixed panels */}
      {!focusMode && (
        <ErrorBoundary componentName="Settings Panel">
          <SettingsPanel />
        </ErrorBoundary>
      )}
      {!focusMode && (
        <ErrorBoundary componentName="Tools Panel">
          <ToolsPanel />
        </ErrorBoundary>
      )}

      <UINotification
        notification={notification}
        onClose={() => setNotification(null)}
      />
      <QuickCapture />
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary componentName="TabQuest">
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
