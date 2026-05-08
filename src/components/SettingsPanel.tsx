import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/redux/hooks';
import {
  Settings as SettingsIcon,
  X,
  Plus,
  Save,
  RotateCcw,
  Trash2,
  User,
  Briefcase,
  Globe,
  MapPin,
  Search,
  AlertCircle,
  Link,
  Layout,
  Palette,
  Clock3,
  Share2,
  Star,
  Tag,
  MousePointer2,
  Database,
  Download,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { RiRedditLine } from 'react-icons/ri';
import { FaXTwitter, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import {
  updateUserInfo,
  updateSearchPreferences,
  updateSocialProfiles,
  updateBookmarks,
  updateTheme,
  updateBackground,
} from '../utils/redux/settingsSlice';
import {
  setFolders as setBookmarkFolders,
  setBookmarks,
} from '../utils/redux/bookmarkSlice';
import {
  setFolders as setTaskFolders,
  setTasks,
} from '../utils/redux/taskSlice';
import { setNotes } from '../utils/redux/notesSlice';
import type { BackgroundConfig, BackgroundType } from '../types/domain';
import { FEEDBACK_PROMPT_INTERVAL, initialState } from '../utils/constants';

import type { Settings as SettingsType, BookmarkLink } from '../types/domain';

import { APP_VERSION } from '../utils/version';
import { FeedbackForm } from '../features';
import TabQuestLogo from '../images/TabQuest.png';
import { THEME_LIST } from '../utils/themes';

interface AlertProps {
  message: string;
}

const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const [formState, setFormState] = useState<SettingsType>(settings);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isFeedbackPopup, setIsFeedbackPopup] = useState(false);
  const [importExportMessage, setImportExportMessage] = useState<string | null>(
    null,
  );
  const fullState = useAppSelector((state) => state);
  const currentBackground = (settings.background ?? {
    type: 'theme',
  }) as BackgroundConfig;

  const GRADIENT_PRESETS = [
    {
      name: 'Aurora',
      value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    },
    {
      name: 'Ocean',
      value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    },
    {
      name: 'Sunset',
      value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    {
      name: 'Forest',
      value: 'linear-gradient(135deg, #0a0a0a 0%, #1a2f1a 50%, #0d2b0d 100%)',
    },
    {
      name: 'Ember',
      value: 'linear-gradient(135deg, #1a0a0a 0%, #2d1b1b 50%, #3d1515 100%)',
    },
    {
      name: 'Cosmic',
      value: 'linear-gradient(135deg, #0d0d1a 0%, #1a0d33 50%, #0d1a33 100%)',
    },
    {
      name: 'Mint',
      value: 'linear-gradient(135deg, #0a1a0f 0%, #0d2b1a 50%, #0a2010 100%)',
    },
    {
      name: 'Slate',
      value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a2e 100%)',
    },
  ];
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const isHighlightingFeedback = false;

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('tabquest_feedback_submitted');

    if (!hasSubmitted) {
      const lastShown = localStorage.getItem('tabquest_feedback_last_shown');
      const now = Date.now();

      if (!lastShown || now - parseInt(lastShown) > FEEDBACK_PROMPT_INTERVAL) {
        setShowFeedbackPrompt(true);
        localStorage.setItem('tabquest_feedback_last_shown', now.toString());
      } else {
        setShowFeedbackPrompt(false);
      }
    } else {
      setShowFeedbackPrompt(false);
    }
  }, [isOpen]);

  const handlePromptClick = () => {
    setIsFeedbackPopup(true);
  };

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        const hasChanges =
          formState.userName !== settings.userName ||
          formState.userRole !== settings.userRole ||
          formState.userPortfolioUrl !== settings.userPortfolioUrl ||
          formState.searchEngine !== settings.searchEngine ||
          formState.weatherLocation !== settings.weatherLocation ||
          formState.theme !== settings.theme ||
          formState.hideSeconds !== settings.hideSeconds ||
          formState.use12Hour !== settings.use12Hour ||
          JSON.stringify(formState.socialProfiles) !==
            JSON.stringify(settings.socialProfiles) ||
          JSON.stringify(formState.bookmarks) !==
            JSON.stringify(settings.bookmarks);

        if (hasChanges) {
          handleAutoSave();
        } else {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState, settings]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        const hasChanges =
          formState.userName !== settings.userName ||
          formState.userRole !== settings.userRole ||
          formState.userPortfolioUrl !== settings.userPortfolioUrl ||
          formState.searchEngine !== settings.searchEngine ||
          formState.weatherLocation !== settings.weatherLocation ||
          formState.theme !== settings.theme ||
          formState.hideSeconds !== settings.hideSeconds ||
          formState.use12Hour !== settings.use12Hour ||
          JSON.stringify(formState.socialProfiles) !==
            JSON.stringify(settings.socialProfiles) ||
          JSON.stringify(formState.bookmarks) !==
            JSON.stringify(settings.bookmarks);

        if (hasChanges) {
          handleAutoSave();
        } else {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, formState, settings]);

  const handleClockSettingToggle = (settingName: string) => {
    const currentValue = formState[settingName as keyof SettingsType];
    const newValue = !currentValue;

    setFormState({
      ...formState,
      [settingName]: newValue,
    });

    dispatch(
      updateSearchPreferences({
        ...formState,
        [settingName]: newValue,
      }),
    );
  };

  const Alert = ({ message }: AlertProps) => (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-6 right-6 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 text-sm z-[1000] shadow-2xl shadow-red-500/10"
      style={{
        background: 'rgba(239,68,68, 0.15)',
        border: '1px solid rgba(239,68,68, 0.4)',
        color: 'var(--tq-text-primary)',
        minWidth: '280px',
      }}
    >
      <div className="p-1.5 rounded-lg bg-red-500/20">
        <AlertCircle className="w-4 h-4 text-red-500" />
      </div>
      <span className="font-medium">{message}</span>
    </motion.div>
  );

  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      const pattern = new RegExp(
        '^(https?:\\/\\/)' +
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
          '((\\d{1,3}\\.){3}\\d{1,3}))' +
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+@!$&'()*,;:=]*)*" +
          '(\\?[;&a-z\\d%_.~+=-]*)?' +
          "(\\#[-a-z\\d_.~!$&'()*+,;=:@%]*)?$",
        'i',
      );
      return !!pattern.test(url);
    } catch {
      return false;
    }
  };

  const handleAutoSave = () => {
    if (
      !formState.userName.trim() ||
      !formState.userRole.trim() ||
      !formState.weatherLocation.trim()
    ) {
      setError('Please fill in all required fields');
      return;
    }

    for (const bookmark of formState.bookmarks) {
      if (!bookmark.name.trim() || !bookmark.url.trim()) {
        setError('All favourites must have a name and URL');
        return;
      }
      if (!isValidUrl(bookmark.url)) {
        setError(`Invalid URL format for "${bookmark.name}"`);
        return;
      }
    }

    for (const [platform, url] of Object.entries(formState.socialProfiles)) {
      const urlStr = url as string;
      if (urlStr.trim() && !isValidUrl(urlStr)) {
        setError(`Invalid URL format for ${platform}`);
        return;
      }
    }

    dispatch(
      updateUserInfo({
        userName: formState.userName || settings.userName || '',
        userRole: formState.userRole || settings.userRole || '',
        userPortfolioUrl:
          formState.userPortfolioUrl || settings.userPortfolioUrl || '',
      }),
    );

    dispatch(
      updateSearchPreferences({
        searchEngine: formState.searchEngine || settings.searchEngine,
        weatherLocation:
          formState.weatherLocation || settings.weatherLocation || '',
        hideSeconds: formState.hideSeconds || false,
        use12Hour: formState.use12Hour || false,
      }),
    );
    dispatch(
      updateTheme(formState.theme || settings.theme || initialState.theme),
    );

    if (formState.socialProfiles) {
      dispatch(updateSocialProfiles(formState.socialProfiles));
    }

    if (formState.bookmarks) {
      dispatch(updateBookmarks(formState.bookmarks));
    }

    setIsOpen(false);
  };

  const handleSave = () => {
    if (!formState.userName.trim()) {
      setError('Username is required');
      return;
    }
    if (!formState.userRole.trim()) {
      setError('User role is required');
      return;
    }
    if (!formState.weatherLocation.trim()) {
      setError('Weather location is required');
      return;
    }

    for (const bookmark of formState.bookmarks) {
      if (!bookmark.name.trim() || !bookmark.url.trim()) {
        setError('All favourites must have a name and URL');
        return;
      }
      if (!isValidUrl(bookmark.url)) {
        setError(`Invalid URL format for "${bookmark.name}"`);
        return;
      }
    }

    for (const [platform, url] of Object.entries(formState.socialProfiles)) {
      const urlStr = url as string;
      if (urlStr.trim() && !isValidUrl(urlStr)) {
        setError(`Invalid URL format for ${platform}`);
        return;
      }
    }

    dispatch(
      updateUserInfo({
        userName: formState.userName,
        userRole: formState.userRole,
        userPortfolioUrl: formState.userPortfolioUrl,
      }),
    );
    dispatch(
      updateSearchPreferences({
        searchEngine: formState.searchEngine,
        weatherLocation: formState.weatherLocation,
        hideSeconds: formState.hideSeconds,
        use12Hour: formState.use12Hour,
      }),
    );
    dispatch(updateTheme(formState.theme || initialState.theme));
    dispatch(updateSocialProfiles(formState.socialProfiles));
    dispatch(updateBookmarks(formState.bookmarks));
    setIsOpen(false);
  };

  const handleReset = () => {
    setFormState(initialState);
    dispatch(
      updateUserInfo({
        userName: initialState.userName,
        userRole: initialState.userRole,
        userPortfolioUrl: initialState.userPortfolioUrl,
      }),
    );
    dispatch(
      updateSearchPreferences({
        searchEngine: initialState.searchEngine,
        weatherLocation: initialState.weatherLocation,
        hideSeconds: initialState.hideSeconds,
        use12Hour: initialState.use12Hour,
      }),
    );
    dispatch(updateTheme(initialState.theme));
    dispatch(updateSocialProfiles(initialState.socialProfiles));
    dispatch(updateBookmarks(initialState.bookmarks));
  };

  const addBookmark = () => {
    if (formState.bookmarks.length < 8) {
      setFormState({
        ...formState,
        bookmarks: [...formState.bookmarks, { name: '', url: '' }],
      });
    }
  };

  const removeBookmark = (index: number) => {
    setFormState({
      ...formState,
      bookmarks: formState.bookmarks.filter((_, i) => i !== index),
    });
  };

  const handleExport = () => {
    const backup = {
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        settings: fullState.settings,
        bookmarks: fullState.bookmarks,
        tasks: fullState.tasks,
        notes: fullState.notes,
      },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tabquest-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const { data } = parsed;
        if (
          !data?.settings ||
          !data?.bookmarks ||
          !data?.tasks ||
          !data?.notes
        ) {
          alert('Invalid backup file: missing required data sections.');
          return;
        }
        dispatch(
          updateUserInfo({
            userName: data.settings.userName,
            userRole: data.settings.userRole,
            userPortfolioUrl: data.settings.userPortfolioUrl,
          }),
        );
        dispatch(updateTheme(data.settings.theme));
        dispatch(
          updateSearchPreferences({
            searchEngine: data.settings.searchEngine,
            weatherLocation: data.settings.weatherLocation,
            hideSeconds: data.settings.hideSeconds,
            use12Hour: data.settings.use12Hour,
          }),
        );
        if (data.settings.socialProfiles)
          dispatch(updateSocialProfiles(data.settings.socialProfiles));
        if (data.settings.bookmarks)
          dispatch(updateBookmarks(data.settings.bookmarks));
        if (data.bookmarks.folders)
          dispatch(setBookmarkFolders(data.bookmarks.folders));
        if (data.bookmarks.bookmarks)
          dispatch(setBookmarks(data.bookmarks.bookmarks));
        if (data.tasks.folders) dispatch(setTaskFolders(data.tasks.folders));
        if (data.tasks.tasks) dispatch(setTasks(data.tasks.tasks));
        if (data.notes.items) dispatch(setNotes(data.notes.items));
        setImportExportMessage('Data imported successfully!');
        setTimeout(() => setImportExportMessage(null), 3000);
      } catch {
        alert(
          'Failed to parse backup file. Make sure it is a valid TabQuest JSON backup.',
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isChrome = import.meta.env.VITE_BROWSER === 'chrome';

  const inputStyle = {
    background: 'var(--tq-surface-3)',
    border: '1px solid var(--tq-border-1)',
    color: 'var(--tq-text-primary)',
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-[var(--tq-accent)]/50 transition-all text-[15px] font-medium';

  return (
    <>
      <AnimatePresence>{error && <Alert message={error} />}</AnimatePresence>

      {isFeedbackPopup && (
        <FeedbackForm
          isOpen={isFeedbackPopup}
          onClose={() => setIsFeedbackPopup(false)}
        />
      )}

      {showFeedbackPrompt && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 1, type: 'spring' }}
          className="fixed bottom-20 right-6 z-40"
        >
          <motion.button
            onClick={handlePromptClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -4, 0] }}
            transition={{
              y: {
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              },
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all font-medium cursor-pointer"
            title="Submit Feedback"
            style={{
              background: 'var(--tq-glass-bg)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--tq-glass-border)',
              color: 'var(--tq-text-primary)',
            }}
          >
            <span className="text-lg">👋</span>
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--tq-accent)' }}
            >
              Feedback
            </span>
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center group shadow-lg z-40 cursor-pointer"
            title="Open Settings"
            style={{
              background: 'var(--tq-glass-bg)',
              border: '1px solid var(--tq-glass-border)',
            }}
          >
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'var(--tq-gradient-glass)' }}
            />
            <SettingsIcon
              className="w-5 h-5 transition-colors"
              style={{ color: 'var(--tq-text-secondary)' }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed text-base inset-y-0 right-0 w-[420px] shadow-2xl z-[999] tq-glass"
            style={{
              background: 'var(--tq-glass-bg)',
              borderLeft: '1px solid var(--tq-border-1)',
            }}
          >
            <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'var(--tq-gradient-subtle)' }}
                />
              </div>

              <div className="relative z-100 px-6 py-8">
                <div
                  className="flex justify-between items-center mb-8 pb-4"
                  style={{ borderBottom: '1px solid var(--tq-border-1)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-xl"
                      style={{ background: 'rgba(var(--tq-accent-rgb), 0.1)' }}
                    >
                      <SettingsIcon
                        className="w-6 h-6"
                        style={{ color: 'var(--tq-accent)' }}
                      />
                    </div>
                    <motion.h2
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-xl font-semibold tracking-tight"
                      style={{ color: 'var(--tq-text-primary)' }}
                    >
                      Settings
                    </motion.h2>
                  </div>
                  <motion.button
                    aria-label="Close Settings"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg transition-all cursor-pointer"
                    title="Close Settings"
                    style={{ color: 'var(--tq-text-secondary)' }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-14">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User
                        className="w-3.5 h-3.5 opacity-60"
                        style={{ color: 'var(--tq-accent)' }}
                      />
                      <h3
                        className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-70"
                        style={{ color: 'var(--tq-text-primary)' }}
                      >
                        Profile
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="relative group">
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-[var(--tq-accent)]"
                          style={{ color: 'var(--tq-text-muted)' }}
                        />
                        <input
                          type="text"
                          value={formState.userName}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              userName: e.target.value,
                            })
                          }
                          placeholder="Username"
                          className={inputClass}
                          style={inputStyle}
                          data-no-theme-transition="true"
                        />
                      </div>
                      <div className="relative group">
                        <Briefcase
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-[var(--tq-accent)]"
                          style={{ color: 'var(--tq-text-muted)' }}
                        />
                        <input
                          type="text"
                          value={formState.userRole}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              userRole: e.target.value,
                            })
                          }
                          placeholder="Role"
                          className={inputClass}
                          style={inputStyle}
                          data-no-theme-transition="true"
                        />
                      </div>
                      <div className="relative group">
                        <Globe
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-[var(--tq-accent)]"
                          style={{ color: 'var(--tq-text-muted)' }}
                        />
                        <input
                          type="text"
                          value={formState.userPortfolioUrl}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              userPortfolioUrl: e.target.value,
                            })
                          }
                          placeholder="Portfolio URL"
                          className={inputClass}
                          style={inputStyle}
                          data-no-theme-transition="true"
                        />
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Layout
                        className="w-3.5 h-3.5 opacity-60"
                        style={{ color: 'var(--tq-accent)' }}
                      />
                      <h3
                        className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-70"
                        style={{ color: 'var(--tq-text-primary)' }}
                      >
                        {!isChrome ? 'Weather & Search' : 'Weather'}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {!isChrome && (
                        <div className="relative w-full">
                          <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--tq-text-muted)' }}
                          />
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-left focus:outline-none cursor-pointer text-sm font-medium"
                            title="Select Search Engine"
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--tq-border-1)',
                              color: 'var(--tq-text-primary)',
                            }}
                          >
                            {formState.searchEngine
                              ? formState.searchEngine
                              : 'Select Search Engine'}
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </span>
                          </button>

                          {isDropdownOpen && (
                            <ul
                              className="absolute w-full mt-2 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden tq-surface-overlay"
                              style={{
                                border: '1px solid var(--tq-border-1)',
                                backdropFilter: 'blur(40px)',
                                WebkitBackdropFilter: 'blur(40px)',
                              }}
                            >
                              {['Google', 'Bing', 'DuckDuckGo'].map(
                                (engine) => (
                                  <li
                                    key={engine}
                                    onClick={() => {
                                      setFormState({
                                        ...formState,
                                        searchEngine: engine,
                                      });
                                      setIsDropdownOpen(false);
                                    }}
                                    className="px-4 py-3.5 cursor-pointer transition-all text-[14px] font-semibold border-b border-white/5 last:border-b-0 hover:pl-6"
                                    title={`Select ${engine}`}
                                    style={{
                                      color: 'var(--tq-text-primary)',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        'var(--tq-hover-bg)';
                                      e.currentTarget.style.color =
                                        'var(--tq-accent)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        'transparent';
                                      e.currentTarget.style.color =
                                        'var(--tq-text-primary)';
                                    }}
                                  >
                                    {engine}
                                  </li>
                                ),
                              )}
                            </ul>
                          )}
                        </div>
                      )}

                      <div className="relative">
                        <MapPin
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: 'var(--tq-text-muted)' }}
                        />
                        <input
                          type="text"
                          value={formState.weatherLocation}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              weatherLocation: e.target.value,
                            })
                          }
                          placeholder="Weather Location"
                          className={inputClass}
                          style={inputStyle}
                          data-no-theme-transition="true"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.12 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Palette
                        className="w-3.5 h-3.5 opacity-60"
                        style={{ color: 'var(--tq-accent)' }}
                      />
                      <h3
                        className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-70"
                        style={{ color: 'var(--tq-text-primary)' }}
                      >
                        Theme Appearance
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {THEME_LIST.map((theme) => {
                        const isSelected =
                          (formState.theme || initialState.theme) === theme.key;
                        return (
                          <button
                            key={theme.key}
                            type="button"
                            onClick={() => {
                              setFormState({ ...formState, theme: theme.key });
                              dispatch(updateTheme(theme.key));
                            }}
                            className="rounded-xl p-2 transition-all cursor-pointer"
                            title={`Switch to ${theme.label} theme`}
                            style={{
                              border: isSelected
                                ? `2px solid var(--tq-accent)`
                                : '1px solid var(--tq-border-1)',
                              background: isSelected
                                ? 'var(--tq-surface-elevated)'
                                : 'var(--tq-surface-3)',
                              boxShadow: isSelected
                                ? '0 0 12px var(--tq-accent-glow)'
                                : 'none',
                            }}
                          >
                            <div
                              className="h-9 w-full rounded-md"
                              style={{
                                background: `linear-gradient(to right, ${theme.preview[0]}, ${theme.preview[1]}, ${theme.preview[2]})`,
                              }}
                            />
                            <p
                              className="mt-1 text-[11px] font-medium flex items-center justify-center gap-1.5"
                              style={{ color: 'var(--tq-text-secondary)' }}
                            >
                              {theme.label}
                              {theme.isDefault && (
                                <span
                                  className="px-1.5 py-0.5 rounded-md text-[7.5px] font-bold uppercase tracking-wider"
                                  style={{
                                    background:
                                      'rgba(var(--tq-accent-rgb),.15)',
                                    color: 'var(--tq-accent)',
                                    border:
                                      '1px solid rgba(var(--tq-accent-rgb),.30)',
                                  }}
                                >
                                  Default
                                </span>
                              )}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Background Section */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.14 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon
                        className="w-3.5 h-3.5 opacity-60"
                        style={{ color: 'var(--tq-accent)' }}
                      />
                      <h3
                        className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-70"
                        style={{ color: 'var(--tq-text-primary)' }}
                      >
                        Background
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      {(['theme', 'gradient', 'image'] as BackgroundType[]).map(
                        (type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              const config: BackgroundConfig =
                                type === 'gradient'
                                  ? {
                                      type: 'gradient',
                                      gradient: GRADIENT_PRESETS[0].value,
                                    }
                                  : type === 'image'
                                    ? {
                                        type: 'image',
                                        imageUrl: '',
                                        overlayOpacity: 0.4,
                                        blur: 0,
                                      }
                                    : { type: 'theme' };
                              dispatch(updateBackground(config));
                            }}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all capitalize cursor-pointer ${
                              currentBackground.type === type
                                ? 'border-[var(--tq-accent)] text-[var(--tq-accent)]'
                                : 'border-[var(--tq-border-1)] text-[var(--tq-text-muted)] hover:text-[var(--tq-text-primary)]'
                            }`}
                          >
                            {type}
                          </button>
                        ),
                      )}
                    </div>
                    {currentBackground.type === 'gradient' && (
                      <div className="grid grid-cols-4 gap-2">
                        {GRADIENT_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            title={preset.name}
                            onClick={() =>
                              dispatch(
                                updateBackground({
                                  type: 'gradient',
                                  gradient: preset.value,
                                }),
                              )
                            }
                            className={`h-10 rounded-lg border-2 transition-all cursor-pointer ${
                              currentBackground.gradient === preset.value
                                ? 'border-[var(--tq-accent)] scale-105'
                                : 'border-transparent hover:border-white/30'
                            }`}
                            style={{ background: preset.value }}
                          />
                        ))}
                      </div>
                    )}
                    {currentBackground.type === 'image' && (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="bg-image-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 3 * 1024 * 1024) {
                              alert('Image must be under 3MB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (ev) =>
                              dispatch(
                                updateBackground({
                                  type: 'image',
                                  imageUrl: ev.target?.result as string,
                                  overlayOpacity: 0.4,
                                  blur: 0,
                                }),
                              );
                            reader.readAsDataURL(file);
                          }}
                        />
                        <label
                          htmlFor="bg-image-upload"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs transition-all hover:opacity-80"
                          style={{
                            borderColor: 'var(--tq-border-1)',
                            color: 'var(--tq-text-secondary)',
                          }}
                        >
                          <Upload size={14} />
                          {currentBackground.imageUrl
                            ? 'Change image'
                            : 'Choose image (max 3MB)'}
                        </label>
                        {currentBackground.imageUrl && (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-12 h-8 rounded border"
                              style={{
                                backgroundImage: `url(${currentBackground.imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderColor: 'var(--tq-border-1)',
                              }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: 'var(--tq-text-muted)' }}
                            >
                              Image loaded
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs w-20"
                            style={{ color: 'var(--tq-text-secondary)' }}
                          >
                            Overlay
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="0.9"
                            step="0.05"
                            value={currentBackground.overlayOpacity ?? 0.4}
                            onChange={(e) =>
                              dispatch(
                                updateBackground({
                                  ...currentBackground,
                                  overlayOpacity: parseFloat(e.target.value),
                                }),
                              )
                            }
                            className="flex-1"
                            style={{ accentColor: 'var(--tq-accent)' }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock3
                        className="w-3.5 h-3.5 opacity-60"
                        style={{ color: 'var(--tq-accent)' }}
                      />
                      <h3
                        className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-70"
                        style={{ color: 'var(--tq-text-primary)' }}
                      >
                        Clock Preferences
                      </h3>
                    </div>
                    <div className="flex flex-row gap-3">
                      <div
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                        style={{
                          background: 'var(--tq-surface-3)',
                          border: '1px solid var(--tq-border-1)',
                        }}
                      >
                        <span
                          className="text-sm font-medium"
                          style={{ color: 'var(--tq-text-primary)' }}
                        >
                          12-hour
                        </span>
                        <button
                          onClick={() => handleClockSettingToggle('use12Hour')}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
                          title="Toggle 12/24 hour format"
                          style={{
                            backgroundColor: formState.use12Hour
                              ? 'rgba(var(--tq-accent-rgb),.50)'
                              : 'var(--tq-surface-elevated)',
                          }}
                        >
                          <span
                            className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                            style={{
                              transform: formState.use12Hour
                                ? 'translateX(1.5rem)'
                                : 'translateX(0.25rem)',
                            }}
                          />
                        </button>
                      </div>

                      <div
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                        style={{
                          background: 'var(--tq-surface-3)',
                          border: '1px solid var(--tq-border-1)',
                        }}
                      >
                        <span
                          className="text-sm font-medium"
                          style={{ color: 'var(--tq-text-primary)' }}
                        >
                          Hide seconds
                        </span>
                        <button
                          onClick={() =>
                            handleClockSettingToggle('hideSeconds')
                          }
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
                          title="Toggle seconds visibility"
                          style={{
                            backgroundColor: formState.hideSeconds
                              ? 'rgba(var(--tq-accent-rgb),.50)'
                              : 'var(--tq-surface-elevated)',
                          }}
                        >
                          <span
                            className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                            style={{
                              transform: formState.hideSeconds
                                ? 'translateX(1.5rem)'
                                : 'translateX(0.25rem)',
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Share2
                        className="w-3.5 h-3.5 opacity-60"
                        style={{ color: 'var(--tq-accent)' }}
                      />
                      <h3
                        className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-70"
                        style={{ color: 'var(--tq-text-primary)' }}
                      >
                        Social Profiles
                      </h3>
                    </div>

                    <div className="flex flex-col gap-2">
                      {Object.entries(formState.socialProfiles).map(
                        ([platform, value]) => {
                          const IconComponent =
                            {
                              github: FaGithub,
                              twitter: FaXTwitter,
                              linkedin: FaLinkedin,
                              instagram: FaInstagram,
                              reddit: RiRedditLine,
                            }[platform] || Link;

                          const displayName =
                            platform === 'twitter'
                              ? 'X'
                              : platform.charAt(0).toUpperCase() +
                                platform.slice(1);

                          return (
                            <motion.div
                              key={platform}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="group relative p-3 rounded-xl transition-all border"
                              style={{
                                background: 'var(--tq-surface-3)',
                                borderColor: 'var(--tq-border-1)',
                              }}
                              whileHover={{
                                borderColor: 'rgba(var(--tq-accent-rgb), 0.4)',
                                background: 'var(--tq-surface-elevated)',
                              }}
                            >
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <IconComponent
                                    className="w-4 h-4"
                                    style={{ color: 'var(--tq-accent)' }}
                                  />
                                  <span
                                    className="text-sm font-semibold"
                                    style={{ color: 'var(--tq-text-primary)' }}
                                  >
                                    {displayName}
                                  </span>
                                </div>
                                <input
                                  type="url"
                                  value={value as string}
                                  onChange={(e) =>
                                    setFormState({
                                      ...formState,
                                      socialProfiles: {
                                        ...formState.socialProfiles,
                                        [platform]: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Paste link..."
                                  className="w-full bg-transparent border-b border-[var(--tq-border-1)]/30 pb-1 text-xs focus:outline-none focus:border-[var(--tq-accent)]/40 transition-all placeholder:opacity-30"
                                  style={{ color: 'var(--tq-text-secondary)' }}
                                  data-no-theme-transition="true"
                                />
                              </div>
                            </motion.div>
                          );
                        },
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-1.5 rounded-lg"
                          style={{
                            background: 'rgba(var(--tq-accent-rgb), 0.1)',
                          }}
                        >
                          <Star
                            className="w-3.5 h-3.5"
                            style={{ color: 'var(--tq-accent)' }}
                          />
                        </div>
                        <h3
                          className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-70"
                          style={{ color: 'var(--tq-text-primary)' }}
                        >
                          Favourites{' '}
                          <span className="text-[10px] ml-1 opacity-50">
                            ({formState.bookmarks.length}/8)
                          </span>
                        </h3>
                      </div>
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          background: 'rgba(var(--tq-accent-rgb), 0.1)',
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addBookmark}
                        disabled={formState.bookmarks.length >= 8}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed border"
                        style={{
                          color: 'var(--tq-text-primary)',
                          borderColor: 'var(--tq-border-1)',
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Add
                        </span>
                      </motion.button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {formState.bookmarks.map(
                        (bookmark: BookmarkLink, index: number) => (
                          <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative p-3 rounded-xl transition-all border"
                            style={{
                              background: 'var(--tq-surface-3)',
                              borderColor: 'var(--tq-border-1)',
                            }}
                            whileHover={{
                              borderColor: 'rgba(var(--tq-accent-rgb), 0.4)',
                              background: 'var(--tq-surface-elevated)',
                            }}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center gap-2">
                                  <Tag
                                    className="w-4 h-4"
                                    style={{ color: 'var(--tq-accent)' }}
                                  />
                                  <input
                                    type="text"
                                    value={bookmark.name}
                                    onChange={(e) => {
                                      const newBookmarks = [
                                        ...formState.bookmarks,
                                      ];
                                      newBookmarks[index] = {
                                        ...bookmark,
                                        name: e.target.value,
                                      };
                                      setFormState({
                                        ...formState,
                                        bookmarks: newBookmarks,
                                      });
                                    }}
                                    placeholder="Site Name"
                                    className="w-full bg-transparent border-b border-[var(--tq-border-1)]/30 pb-0.5 text-sm font-semibold focus:outline-none focus:border-[var(--tq-accent)]/80 transition-all placeholder:opacity-20"
                                    style={{ color: 'var(--tq-text-primary)' }}
                                    data-no-theme-transition="true"
                                  />
                                </div>
                                <motion.button
                                  whileHover={{
                                    scale: 1.1,
                                    color: 'var(--tq-danger)',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                  }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeBookmark(index)}
                                  className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                  style={{ color: 'var(--tq-text-secondary)' }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link
                                  className="w-3.5 h-3.5 opacity-50"
                                  style={{ color: 'var(--tq-text-secondary)' }}
                                />
                                <input
                                  type="url"
                                  value={bookmark.url}
                                  onChange={(e) => {
                                    const newBookmarks = [
                                      ...formState.bookmarks,
                                    ];
                                    newBookmarks[index] = {
                                      ...bookmark,
                                      url: e.target.value,
                                    };
                                    setFormState({
                                      ...formState,
                                      bookmarks: newBookmarks,
                                    });
                                  }}
                                  placeholder="URL"
                                  className="w-full bg-transparent border-b border-[var(--tq-border-1)]/30 pb-0.5 text-xs focus:outline-none focus:border-[var(--tq-accent)]/80 transition-all placeholder:opacity-20"
                                  style={{ color: 'var(--tq-text-secondary)' }}
                                  data-no-theme-transition="true"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ),
                      )}
                      {formState.bookmarks.length === 0 && (
                        <div
                          className="w-full py-8 rounded-2xl border border-dashed flex flex-col items-center justify-center opacity-40"
                          style={{ borderColor: 'var(--tq-border-1)' }}
                        >
                          <Star className="w-8 h-8 mb-2 opacity-20" />
                          <p className="text-[11px] font-medium uppercase tracking-widest opacity-30">
                            No favourites added yet
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className="flex-1 px-4 py-2.5 rounded-xl backdrop-blur-sm flex items-center justify-center gap-2 group cursor-pointer text-sm font-semibold"
                        title="Save all changes"
                        style={{
                          background: 'var(--tq-gradient-subtle)',
                          border: '1px solid var(--tq-border-1)',
                          color: 'var(--tq-text-primary)',
                        }}
                      >
                        <Save
                          className="w-4 h-4"
                          style={{ color: 'var(--tq-text-secondary)' }}
                        />
                        Save Changes
                      </motion.button>

                      <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReset}
                        className="flex-1 px-4 py-2.5 rounded-xl backdrop-blur-sm flex items-center justify-center gap-2 group cursor-pointer text-sm font-semibold"
                        title="Reset settings to default"
                        style={{
                          background: 'rgba(var(--tq-accent-rgb),.06)',
                          border: '1px solid var(--tq-border-1)',
                          color: 'var(--tq-text-primary)',
                        }}
                      >
                        <RotateCcw
                          className="w-4 h-4"
                          style={{ color: 'var(--tq-text-secondary)' }}
                        />
                        Reset Settings
                      </motion.button>
                    </div>

                    <motion.a
                      id="feedback-btn"
                      onClick={() => setIsFeedbackPopup(true)}
                      rel="noopener noreferrer"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        scale: isHighlightingFeedback
                          ? [1, 1.05, 1, 1.05, 1]
                          : 1,
                      }}
                      transition={{
                        delay: 0.5,
                        scale: {
                          duration: 0.5,
                          repeat: isHighlightingFeedback ? 2 : 0,
                        },
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2.5 rounded-xl flex items-center justify-center gap-3 group cursor-pointer transition-all duration-300 text-sm font-semibold"
                      title="Submit Feedback"
                      style={{
                        background: 'rgba(var(--tq-accent-sec-rgb),.10)',
                        border: isHighlightingFeedback
                          ? '2px solid var(--tq-accent-secondary)'
                          : '1px solid rgba(var(--tq-accent-sec-rgb),.25)',
                        color: 'var(--tq-text-primary)',
                        boxShadow: isHighlightingFeedback
                          ? '0 0 20px rgba(var(--tq-accent-sec-rgb),.50)'
                          : 'none',
                      }}
                    >
                      <MousePointer2
                        className="w-5 h-5"
                        style={{ color: 'var(--tq-accent-secondary)' }}
                      />
                      <span className="text-sm font-semibold">
                        Submit Feedback
                      </span>
                    </motion.a>

                    {/* Data Import / Export */}
                    <div
                      className="space-y-3 pt-4 border-t"
                      style={{ borderColor: 'var(--tq-border-1)' }}
                    >
                      <div className="flex items-center gap-2">
                        <Database
                          size={16}
                          style={{ color: 'var(--tq-accent)' }}
                        />
                        <h3
                          className="text-sm font-semibold"
                          style={{ color: 'var(--tq-text-primary)' }}
                        >
                          Data
                        </h3>
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: 'var(--tq-text-muted)' }}
                      >
                        Export all your data or restore from a backup.
                      </p>
                      {importExportMessage && (
                        <p
                          className="text-xs font-medium"
                          style={{ color: 'var(--tq-accent)' }}
                        >
                          {importExportMessage}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleExport}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer hover:opacity-80"
                          style={{
                            borderColor: 'var(--tq-border-1)',
                            color: 'var(--tq-text-secondary)',
                          }}
                        >
                          <Download size={13} /> Export
                        </button>
                        <label
                          htmlFor="import-file"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer hover:opacity-80"
                          style={{
                            borderColor: 'var(--tq-border-1)',
                            color: 'var(--tq-text-secondary)',
                          }}
                        >
                          <Upload size={13} /> Import
                        </label>
                        <input
                          id="import-file"
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleImport}
                        />
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full flex flex-col items-center gap-4 mt-6 pt-6 border-t tq-border-1"
                    >
                      <motion.a
                        href="https://github.com/tabquest/tabquest"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{
                          y: -1,
                          background: 'rgba(251, 191, 36, 0.1)',
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all group relative overflow-hidden"
                        style={{
                          background: 'rgba(251, 191, 36, 0.05)',
                          border: '1px solid rgba(251, 191, 36, 0.15)',
                        }}
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-200/80 group-hover:text-amber-400 transition-colors">
                          Star us on GitHub
                        </span>
                        <FaGithub className="w-3 h-3 text-white/20 group-hover:text-white/60 transition-colors ml-1" />
                      </motion.a>

                      <div className="flex items-center justify-center">
                        <img
                          src={TabQuestLogo}
                          alt="TabQuest Logo"
                          className="w-4 h-4 mr-2 object-contain"
                        />
                        <span
                          className="text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: 'var(--tq-text-muted)' }}
                        >
                          TabQuest{' '}
                          <span className="opacity-80 ml-1 font-medium">
                            v{APP_VERSION}
                          </span>
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;
