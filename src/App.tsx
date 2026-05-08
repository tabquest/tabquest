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
import QuickCapture from './components/QuickCapture';

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
      setNotification({
        title: `Task Reminder!`,
        body: task.title,
      });

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
  if (isMobile) {
    return <MobileView />;
  }

  const isChrome = import.meta.env.VITE_BROWSER === 'chrome';

  return (
    <ThemeProvider>
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

      <ErrorBoundary componentName="Header">
        <div
          className={`flex mt-2 justify-between shrink-0 relative ${isSearchActive ? 'z-10' : 'z-30'}`}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Clock />
          </motion.div>
          {!focusMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <SocialPopover />
            </motion.div>
          )}
        </div>
      </ErrorBoundary>

      {!focusMode && (
        <ErrorBoundary componentName="Progress Bars">
          <div className="w-full px-2 relative z-10">
            <ProgressBars />
          </div>
        </ErrorBoundary>
      )}

      <ErrorBoundary componentName="Search & Bookmarks">
        <motion.div
          className={`flex-1 flex flex-col justify-center gap-4 md:gap-6 relative ${isSearchActive ? 'z-50' : 'z-10'} max-w-4xl mx-auto w-full`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {CHRISTMAS_MODE && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
              className="text-center py-2"
            >
              <h2
                className="text-3xl md:text-5xl font-bold tracking-wide leading-tight"
                style={{ fontFamily: "'Mountains of Christmas', cursive" }}
              >
                <span className="text-red-500 drop-shadow-[0_2px_4px_rgba(220,38,38,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-red-400 to-red-600">
                  Merry
                </span>{' '}
                <span className="text-white drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]">
                  Christmas
                </span>{' '}
                <span className="text-green-500 drop-shadow-[0_2px_4px_rgba(34,197,94,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-green-400 to-green-600">
                  !
                </span>{' '}
                🎄
              </h2>
              <p
                className="text-sm font-light mt-1 tracking-widest uppercase text-[10px]"
                style={{ color: 'var(--tq-text-muted)' }}
              >
                Wishing you joy & peace
              </p>
            </motion.div>
          )}

          <div className="text-center mb-2">
            <GreetingWidget />
          </div>

          <div className="space-y-4">
            {isChrome ? (
              <ChromeSearchBar onFocusChange={setIsSearchActive} />
            ) : (
              <SearchBar onFocusChange={setIsSearchActive} />
            )}
            {!focusMode && <BookmarkBar />}
          </div>
        </motion.div>
      </ErrorBoundary>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className={`mt-auto shrink-0 relative ${isSearchActive ? 'z-10' : 'z-40'}`}
      />

      {!focusMode && (
        <ErrorBoundary componentName="Settings Panel">
          <SettingsPanel />
        </ErrorBoundary>
      )}
      {!focusMode && (
        <ErrorBoundary componentName="Pro Tools">
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
