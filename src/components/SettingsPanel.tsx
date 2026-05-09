import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/redux/hooks';
import {
  Settings as SettingsIcon,
  X,
  Plus,
  Save,
  Trash2,
  User,
  Globe,
  MapPin,
  Search,
  AlertCircle,
  Palette,
  Clock3,
  Star,
  Database,
  Download,
  Upload,
  Image as ImageIcon,
  Sliders,
  ChevronDown,
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

type TabId = 'profile' | 'appearance' | 'widgets' | 'data';

interface AlertProps {
  message: string;
}

// ─── Style constants ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '13px',
  background: 'var(--tq-surface-2)',
  border: '1px solid var(--tq-border-1)',
  color: 'var(--tq-text-primary)',
  outline: 'none',
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: 'var(--tq-text-muted)',
  marginBottom: '8px',
  marginTop: '16px',
};

const TABS: { id: TabId; icon: React.ReactNode; label: string }[] = [
  { id: 'profile', icon: <User size={15} />, label: 'Profile' },
  { id: 'appearance', icon: <Palette size={15} />, label: 'Theme' },
  { id: 'widgets', icon: <Sliders size={15} />, label: 'Widgets' },
  { id: 'data', icon: <Database size={15} />, label: 'Data' },
];

const WALLPAPERS = [
  { label: 'City Night', path: '/backgrounds/city-night.jpg' },
  { label: 'Mountains', path: '/backgrounds/mountains.jpg' },
  { label: 'Galaxy', path: '/backgrounds/galaxy.jpg' },
  { label: 'Forest', path: '/backgrounds/forest.jpg' },
  { label: 'Ocean', path: '/backgrounds/ocean.jpg' },
  { label: 'Neon City', path: '/backgrounds/neon-city.jpg' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('profile');
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

  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  const isChrome = import.meta.env.VITE_BROWSER === 'chrome';

  // ─── Effects ────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        const hasChanges = detectChanges();
        if (hasChanges) {
          handleAutoSave();
        } else {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState, settings]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        const hasChanges = detectChanges();
        if (hasChanges) {
          handleAutoSave();
        } else {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, formState, settings]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const detectChanges = () =>
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
    JSON.stringify(formState.bookmarks) !== JSON.stringify(settings.bookmarks);

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

  // ─── Save / Reset ────────────────────────────────────────────────────────────

  const validateAndCollect = () => {
    if (
      !formState.userName.trim() ||
      !formState.userRole.trim() ||
      !formState.weatherLocation.trim()
    ) {
      setError('Please fill in all required fields');
      return false;
    }
    for (const bookmark of formState.bookmarks) {
      if (!bookmark.name.trim() || !bookmark.url.trim()) {
        setError('All favourites must have a name and URL');
        return false;
      }
      if (!isValidUrl(bookmark.url)) {
        setError(`Invalid URL format for "${bookmark.name}"`);
        return false;
      }
    }
    for (const [platform, url] of Object.entries(formState.socialProfiles)) {
      const urlStr = url as string;
      if (urlStr.trim() && !isValidUrl(urlStr)) {
        setError(`Invalid URL format for ${platform}`);
        return false;
      }
    }
    return true;
  };

  const dispatchAllSettings = () => {
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
    if (formState.socialProfiles)
      dispatch(updateSocialProfiles(formState.socialProfiles));
    if (formState.bookmarks) dispatch(updateBookmarks(formState.bookmarks));
  };

  const handleAutoSave = () => {
    if (!validateAndCollect()) return;
    dispatchAllSettings();
    setIsOpen(false);
  };

  const handleSaveProfile = () => {
    if (!formState.userName.trim()) {
      setError('Username is required');
      return;
    }
    if (!formState.userRole.trim()) {
      setError('User role is required');
      return;
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
    dispatch(updateSocialProfiles(formState.socialProfiles));
  };

  const handleSaveWidgets = () => {
    if (!formState.weatherLocation.trim()) {
      setError('Weather location is required');
      return;
    }
    dispatch(
      updateSearchPreferences({
        searchEngine: formState.searchEngine,
        weatherLocation: formState.weatherLocation,
        hideSeconds: formState.hideSeconds,
        use12Hour: formState.use12Hour,
      }),
    );
  };

  const handleSaveBookmarks = () => {
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
    dispatch(updateBookmarks(formState.bookmarks));
  };

  const handleClockToggle = (key: 'use12Hour' | 'hideSeconds') => {
    const newValue = !formState[key];
    setFormState({ ...formState, [key]: newValue });
    dispatch(updateSearchPreferences({ ...formState, [key]: newValue }));
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

  // ─── Export / Import ─────────────────────────────────────────────────────────

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

  // ─── Tab content renderers ───────────────────────────────────────────────────

  const renderProfile = () => (
    <div style={{ padding: '16px 0' }}>
      {/* Avatar placeholder */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(var(--tq-accent-rgb), 0.15)',
            border: '2px solid rgba(var(--tq-accent-rgb), 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={28} style={{ color: 'var(--tq-accent)', opacity: 0.7 }} />
        </div>
      </div>

      <p style={sectionHeaderStyle}>Personal Info</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          type="text"
          value={formState.userName}
          onChange={(e) =>
            setFormState({ ...formState, userName: e.target.value })
          }
          placeholder="Name"
          style={inputStyle}
          data-no-theme-transition="true"
        />
        <input
          type="text"
          value={formState.userRole}
          onChange={(e) =>
            setFormState({ ...formState, userRole: e.target.value })
          }
          placeholder="Role"
          style={inputStyle}
          data-no-theme-transition="true"
        />
        <div style={{ position: 'relative' }}>
          <Globe
            size={13}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--tq-text-muted)',
            }}
          />
          <input
            type="text"
            value={formState.userPortfolioUrl}
            onChange={(e) =>
              setFormState({ ...formState, userPortfolioUrl: e.target.value })
            }
            placeholder="Portfolio URL"
            style={{ ...inputStyle, paddingLeft: '30px' }}
            data-no-theme-transition="true"
          />
        </div>
      </div>

      <p style={sectionHeaderStyle}>Social Links</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(
          [
            { key: 'linkedin', Icon: FaLinkedin, placeholder: 'LinkedIn URL' },
            { key: 'github', Icon: FaGithub, placeholder: 'GitHub URL' },
            {
              key: 'twitter',
              Icon: FaXTwitter,
              placeholder: 'X (Twitter) URL',
            },
            {
              key: 'instagram',
              Icon: FaInstagram,
              placeholder: 'Instagram URL',
            },
            { key: 'reddit', Icon: RiRedditLine, placeholder: 'Reddit URL' },
          ] as const
        ).map(({ key, Icon, placeholder }) => (
          <div key={key} style={{ position: 'relative' }}>
            <Icon
              size={13}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--tq-accent)',
                opacity: 0.7,
              }}
            />
            <input
              type="url"
              value={(formState.socialProfiles[key] as string) ?? ''}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  socialProfiles: {
                    ...formState.socialProfiles,
                    [key]: e.target.value,
                  },
                })
              }
              placeholder={placeholder}
              style={{ ...inputStyle, paddingLeft: '30px' }}
              data-no-theme-transition="true"
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleSaveProfile}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            background: 'var(--tq-accent)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Save size={14} />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div style={{ padding: '16px 0' }}>
      <p style={{ ...sectionHeaderStyle, marginTop: 0 }}>Theme</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
        }}
      >
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
              title={`Switch to ${theme.label} theme`}
              style={{
                borderRadius: '10px',
                padding: '8px',
                cursor: 'pointer',
                border: isSelected
                  ? '2px solid var(--tq-accent)'
                  : '1px solid var(--tq-border-1)',
                background: isSelected
                  ? 'var(--tq-surface-elevated)'
                  : 'var(--tq-surface-3)',
                boxShadow: isSelected
                  ? '0 0 12px var(--tq-accent-glow)'
                  : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  height: '32px',
                  borderRadius: '6px',
                  background: `linear-gradient(to right, ${theme.preview[0]}, ${theme.preview[1]}, ${theme.preview[2]})`,
                }}
              />
              <p
                style={{
                  marginTop: '4px',
                  fontSize: '10px',
                  fontWeight: 500,
                  color: 'var(--tq-text-secondary)',
                  textAlign: 'center',
                }}
              >
                {theme.label}
                {theme.isDefault && (
                  <span
                    style={{
                      marginLeft: '3px',
                      fontSize: '7px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      background: 'rgba(var(--tq-accent-rgb),.15)',
                      color: 'var(--tq-accent)',
                      border: '1px solid rgba(var(--tq-accent-rgb),.3)',
                      borderRadius: '4px',
                      padding: '1px 3px',
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

      <p style={sectionHeaderStyle}>Background</p>

      {/* Theme vs Image toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {(['theme', 'image'] as BackgroundType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              dispatch(
                updateBackground(
                  type === 'image'
                    ? {
                        type: 'image',
                        imageUrl: '/backgrounds/city-night.jpg',
                        overlayOpacity: 0.3,
                        blur: 0,
                      }
                    : { type: 'theme' },
                ),
              );
            }}
            style={{
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
              background: 'transparent',
              border:
                currentBackground.type === type
                  ? '1px solid var(--tq-accent)'
                  : '1px solid var(--tq-border-1)',
              color:
                currentBackground.type === type
                  ? 'var(--tq-accent)'
                  : 'var(--tq-text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            {type === 'theme' ? 'Default' : 'Custom'}
          </button>
        ))}
      </div>

      {currentBackground.type === 'image' && (
        <div>
          <p
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--tq-text-muted)',
              opacity: 0.6,
              marginBottom: '8px',
            }}
          >
            Built-in wallpapers
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            {WALLPAPERS.map((bg) => (
              <button
                key={bg.path}
                type="button"
                title={bg.label}
                onClick={() =>
                  dispatch(
                    updateBackground({
                      ...currentBackground,
                      type: 'image',
                      imageUrl: bg.path,
                    }),
                  )
                }
                style={{
                  position: 'relative',
                  height: '52px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundImage: `url(${bg.path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border:
                    currentBackground.imageUrl === bg.path
                      ? '2px solid var(--tq-accent)'
                      : '2px solid transparent',
                  transform:
                    currentBackground.imageUrl === bg.path
                      ? 'scale(1.03)'
                      : 'scale(1)',
                  transition: 'all 0.15s ease',
                }}
              >
                {currentBackground.imageUrl === bg.path && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--tq-accent)',
                      opacity: 0.18,
                    }}
                  />
                )}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: '8px',
                    color: 'rgba(255,255,255,0.75)',
                    fontWeight: 500,
                  }}
                >
                  {bg.label}
                </span>
              </button>
            ))}
          </div>

          <p
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--tq-text-muted)',
              opacity: 0.6,
              marginBottom: '8px',
            }}
          >
            Or upload your own
          </p>
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
                    overlayOpacity: currentBackground.overlayOpacity ?? 0.3,
                    blur: currentBackground.blur ?? 0,
                  }),
                );
              reader.readAsDataURL(file);
            }}
          />
          <label
            htmlFor="bg-image-upload"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
              border: '1px solid var(--tq-border-1)',
              color: 'var(--tq-text-secondary)',
              marginBottom: '16px',
              transition: 'opacity 0.15s ease',
            }}
          >
            <Upload size={13} />
            {currentBackground.imageUrl &&
            !currentBackground.imageUrl.startsWith('/backgrounds/')
              ? 'Change custom image'
              : 'Upload custom image (max 3MB)'}
          </label>

          {/* Overlay slider */}
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <span
                style={{ fontSize: '12px', color: 'var(--tq-text-secondary)' }}
              >
                <ImageIcon
                  size={12}
                  style={{
                    display: 'inline',
                    marginRight: '4px',
                    verticalAlign: 'middle',
                  }}
                />
                Overlay
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  color: 'var(--tq-text-muted)',
                }}
              >
                {Math.round((currentBackground.overlayOpacity ?? 0.3) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.85"
              step="0.05"
              value={currentBackground.overlayOpacity ?? 0.3}
              onChange={(e) =>
                dispatch(
                  updateBackground({
                    ...currentBackground,
                    overlayOpacity: parseFloat(e.target.value),
                  }),
                )
              }
              style={{ width: '100%', accentColor: 'var(--tq-accent)' }}
            />
          </div>

          {/* Blur slider */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <span
                style={{ fontSize: '12px', color: 'var(--tq-text-secondary)' }}
              >
                Blur
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  color: 'var(--tq-text-muted)',
                }}
              >
                {currentBackground.blur ?? 0}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={currentBackground.blur ?? 0}
              onChange={(e) =>
                dispatch(
                  updateBackground({
                    ...currentBackground,
                    blur: parseInt(e.target.value),
                  }),
                )
              }
              style={{ width: '100%', accentColor: 'var(--tq-accent)' }}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderWidgets = () => (
    <div style={{ padding: '16px 0' }}>
      {!isChrome && (
        <>
          <p style={{ ...sectionHeaderStyle, marginTop: 0 }}>Search</p>
          <div
            ref={dropdownRef}
            style={{ position: 'relative', marginBottom: '12px' }}
          >
            <Search
              size={13}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--tq-text-muted)',
                zIndex: 1,
              }}
            />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Select Search Engine"
              style={{
                ...inputStyle,
                paddingLeft: '30px',
                paddingRight: '32px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'block',
              }}
            >
              {formState.searchEngine || 'Select Search Engine'}
            </button>
            <ChevronDown
              size={14}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: `translateY(-50%) rotate(${isDropdownOpen ? '180deg' : '0deg'})`,
                color: 'var(--tq-text-muted)',
                transition: 'transform 0.2s ease',
                pointerEvents: 'none',
              }}
            />
            {isDropdownOpen && (
              <ul
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  borderRadius: '10px',
                  border: '1px solid var(--tq-border-1)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  background: 'var(--tq-glass-bg)',
                  zIndex: 100,
                  overflow: 'hidden',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                }}
              >
                {['Google', 'Bing', 'DuckDuckGo'].map((engine) => (
                  <li
                    key={engine}
                    onClick={() => {
                      setFormState({ ...formState, searchEngine: engine });
                      setIsDropdownOpen(false);
                    }}
                    title={`Select ${engine}`}
                    style={{
                      padding: '10px 14px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--tq-text-primary)',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--tq-hover-bg)';
                      e.currentTarget.style.color = 'var(--tq-accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--tq-text-primary)';
                    }}
                  >
                    {engine}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <p style={{ ...sectionHeaderStyle, marginTop: isChrome ? 0 : undefined }}>
        <MapPin
          size={11}
          style={{
            display: 'inline',
            marginRight: '4px',
            verticalAlign: 'middle',
          }}
        />
        Weather
      </p>
      <input
        type="text"
        value={formState.weatherLocation}
        onChange={(e) =>
          setFormState({ ...formState, weatherLocation: e.target.value })
        }
        placeholder="City name (e.g. London)"
        style={{ ...inputStyle, marginBottom: '12px' }}
        data-no-theme-transition="true"
      />

      <p style={sectionHeaderStyle}>
        <Clock3
          size={11}
          style={{
            display: 'inline',
            marginRight: '4px',
            verticalAlign: 'middle',
          }}
        />
        Clock
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        {(
          [
            { key: 'use12Hour', label: '12-hour format' },
            { key: 'hideSeconds', label: 'Hide seconds' },
          ] as const
        ).map(({ key, label }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'var(--tq-surface-2)',
              border: '1px solid var(--tq-border-1)',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: 'var(--tq-text-primary)',
                fontWeight: 500,
              }}
            >
              {label}
            </span>
            <button
              onClick={() => handleClockToggle(key)}
              title={`Toggle ${label}`}
              style={{
                position: 'relative',
                width: '40px',
                height: '22px',
                borderRadius: '11px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: formState[key]
                  ? 'rgba(var(--tq-accent-rgb), 0.6)'
                  : 'var(--tq-surface-elevated)',
                transition: 'background-color 0.2s ease',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: formState[key] ? '20px' : '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.2s ease',
                }}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveWidgets}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 600,
          background: 'var(--tq-accent)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <Save size={14} />
        Save
      </button>
    </div>
  );

  const renderData = () => (
    <div style={{ padding: '16px 0' }}>
      <p style={{ ...sectionHeaderStyle, marginTop: 0 }}>
        <Star
          size={11}
          style={{
            display: 'inline',
            marginRight: '4px',
            verticalAlign: 'middle',
          }}
        />
        Bookmark Bar
        <span style={{ opacity: 0.5, marginLeft: '4px', fontWeight: 400 }}>
          ({formState.bookmarks.length}/8)
        </span>
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginBottom: '10px',
        }}
      >
        {formState.bookmarks.map((bookmark: BookmarkLink, index: number) => (
          <div
            key={index}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'var(--tq-surface-2)',
              border: '1px solid var(--tq-border-1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                value={bookmark.name}
                onChange={(e) => {
                  const newBookmarks = [...formState.bookmarks];
                  newBookmarks[index] = { ...bookmark, name: e.target.value };
                  setFormState({ ...formState, bookmarks: newBookmarks });
                }}
                placeholder="Site Name"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  outline: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--tq-text-primary)',
                  padding: '2px 0',
                }}
                data-no-theme-transition="true"
              />
              <button
                onClick={() => removeBookmark(index)}
                title="Remove bookmark"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--tq-text-muted)',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0.6,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
              >
                <Trash2 size={13} />
              </button>
            </div>
            <input
              type="url"
              value={bookmark.url}
              onChange={(e) => {
                const newBookmarks = [...formState.bookmarks];
                newBookmarks[index] = { ...bookmark, url: e.target.value };
                setFormState({ ...formState, bookmarks: newBookmarks });
              }}
              placeholder="https://..."
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                outline: 'none',
                fontSize: '11px',
                color: 'var(--tq-text-secondary)',
                width: '100%',
                padding: '2px 0',
              }}
              data-no-theme-transition="true"
            />
          </div>
        ))}

        {formState.bookmarks.length === 0 && (
          <div
            style={{
              padding: '24px',
              borderRadius: '10px',
              border: '1px dashed var(--tq-border-1)',
              textAlign: 'center',
              opacity: 0.4,
            }}
          >
            <Star size={24} style={{ margin: '0 auto 6px', opacity: 0.3 }} />
            <p
              style={{
                fontSize: '11px',
                color: 'var(--tq-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              No bookmarks yet
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={addBookmark}
          disabled={formState.bookmarks.length >= 8}
          title="Add bookmark"
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'transparent',
            border: '1px solid var(--tq-border-1)',
            color: 'var(--tq-text-secondary)',
            cursor: formState.bookmarks.length >= 8 ? 'not-allowed' : 'pointer',
            opacity: formState.bookmarks.length >= 8 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'all 0.15s ease',
          }}
        >
          <Plus size={13} />
          Add link
        </button>
        <button
          onClick={handleSaveBookmarks}
          title="Save bookmarks"
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'var(--tq-accent)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Save size={13} />
          Save
        </button>
      </div>

      <p style={sectionHeaderStyle}>Data</p>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--tq-text-muted)',
          marginBottom: '10px',
        }}
      >
        Export all your data or restore from a backup.
      </p>
      {importExportMessage && (
        <p
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--tq-accent)',
            marginBottom: '8px',
          }}
        >
          {importExportMessage}
        </p>
      )}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
        <button
          onClick={handleExport}
          title="Export data"
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 500,
            background: 'transparent',
            border: '1px solid var(--tq-border-1)',
            color: 'var(--tq-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Download size={13} />
          Export JSON
        </button>
        <label
          htmlFor="import-file"
          title="Import data"
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 500,
            background: 'transparent',
            border: '1px solid var(--tq-border-1)',
            color: 'var(--tq-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <Upload size={13} />
          Import JSON
        </label>
        <input
          id="import-file"
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
      </div>

      <p style={sectionHeaderStyle}>About</p>
      <div
        style={{
          padding: '14px',
          borderRadius: '10px',
          background: 'var(--tq-surface-2)',
          border: '1px solid var(--tq-border-1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={TabQuestLogo}
            alt="TabQuest"
            style={{ width: '18px', height: '18px', objectFit: 'contain' }}
          />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--tq-text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            TabQuest
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--tq-text-muted)',
              fontWeight: 500,
            }}
          >
            v{APP_VERSION}
          </span>
        </div>

        <motion.a
          href="https://github.com/tabquest/tabquest"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            background: 'rgba(251,191,36,0.07)',
            border: '1px solid rgba(251,191,36,0.2)',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(253,230,138,0.85)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          <Star size={13} className="fill-amber-400 text-amber-500" />
          Star on GitHub
          <FaGithub size={12} style={{ opacity: 0.5, marginLeft: 'auto' }} />
        </motion.a>

        <button
          onClick={() => setIsFeedbackPopup(true)}
          id="feedback-btn"
          title="Submit Feedback"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'rgba(var(--tq-accent-sec-rgb), 0.1)',
            border: '1px solid rgba(var(--tq-accent-sec-rgb), 0.25)',
            color: 'var(--tq-text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span>👋</span>
          Feedback
        </button>
      </div>
    </div>
  );

  const TAB_RENDERERS: Record<TabId, () => React.ReactNode> = {
    profile: renderProfile,
    appearance: renderAppearance,
    widgets: renderWidgets,
    data: renderData,
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

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
            onClick={() => setIsFeedbackPopup(true)}
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

      {/* Trigger button — glass pill */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 cursor-pointer"
            title="Open Settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: '24px',
              background: 'var(--tq-glass-bg)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid var(--tq-glass-border)',
              color: 'var(--tq-text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            <SettingsIcon
              size={15}
              style={{ color: 'var(--tq-text-secondary)' }}
            />
            <span>Settings</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Side panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            style={{
              position: 'fixed',
              insetBlock: 0,
              right: 0,
              width: '320px',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--tq-glass-bg)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--tq-glass-border)',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 16px 0',
                flexShrink: 0,
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div
                  style={{
                    padding: '6px',
                    borderRadius: '8px',
                    background: 'rgba(var(--tq-accent-rgb), 0.12)',
                  }}
                >
                  <SettingsIcon
                    size={16}
                    style={{ color: 'var(--tq-accent)' }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--tq-text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Settings
                </span>
              </div>
              <motion.button
                aria-label="Close Settings"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const hasChanges = detectChanges();
                  if (hasChanges) handleAutoSave();
                  else setIsOpen(false);
                }}
                title="Close Settings"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  color: 'var(--tq-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={17} />
              </motion.button>
            </div>

            {/* Tab bar */}
            <div
              style={{
                display: 'flex',
                padding: '12px 16px 0',
                gap: '4px',
                flexShrink: 0,
                borderBottom: '1px solid var(--tq-border-1)',
                paddingBottom: '0',
              }}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.label}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 4px 10px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: isActive
                        ? '2px solid var(--tq-accent)'
                        : '2px solid transparent',
                      cursor: 'pointer',
                      color: isActive
                        ? 'var(--tq-accent)'
                        : 'var(--tq-text-muted)',
                      fontSize: '10px',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.04em',
                      transition: 'all 0.15s ease',
                      marginBottom: '-1px',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 16px 24px',
              }}
              className="[&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {TAB_RENDERERS[activeTab]()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;
