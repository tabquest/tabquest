import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Settings, X, Plus, Save, RotateCcw, Send, Trash2,
    User, Briefcase, Globe, MapPin, Search, AlertCircle,
    Github, Twitter, Linkedin, Instagram,
    Link
} from 'lucide-react';
import { RiRedditLine } from "react-icons/ri";
import { motion, AnimatePresence } from 'framer-motion';
import {
    updateUserInfo,
    updateSearchPreferences,
    updateSocialProfiles,
    updateBookmarks,
    updateTheme
} from '../utils/redux/settingsSlice';
import { FEEDBACK_PROMPT_INTERVAL, initialState } from '../utils/constants';
import useExtensionVersion from '../utils/hooks/useExtensionVersion';

import { APP_VERSION } from '../utils/version';
import { FeedbackForm } from '../features';
import TabQuestLogo from '../images/TabQuest.png';
import { THEME_LIST } from '../utils/themes';

const SettingsPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.settings);
    const [formState, setFormState] = useState(settings);
    const [error, setError] = useState(null);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const panelRef = useRef();
    const dropdownRef = useRef();

    // Feedback Form Popup
    const [isFeedbackPopup, setIsFeedbackPopup] = useState(false);
    const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
    const [isHighlightingFeedback, setIsHighlightingFeedback] = useState(false);

    useEffect(() => {
        const hasSubmitted = localStorage.getItem('tabquest_feedback_submitted');

        if (!hasSubmitted) {
            const lastShown = localStorage.getItem('tabquest_feedback_last_shown');
            const now = Date.now();

            if (!lastShown || (now - parseInt(lastShown) > FEEDBACK_PROMPT_INTERVAL)) {
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
        setIsOpen(true);
        setIsHighlightingFeedback(true);

        setTimeout(() => {
            const btn = document.getElementById('feedback-btn');
            if (btn) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);

        setTimeout(() => {
            setIsHighlightingFeedback(false);
        }, 3000);
    };

    // Reset form state when settings change
    useEffect(() => {
        setFormState(settings);
    }, [settings]);

    // Handle error display and timeout
    useEffect(() => {
        if (error) {
            setIsAlertVisible(true);
            const timer = setTimeout(() => {
                setIsAlertVisible(false);
                setTimeout(() => setError(null), 300);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Handle click outside for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle click outside for panel with auto-save
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                const hasChanges =
                    formState.userName !== settings.userName ||
                    formState.userRole !== settings.userRole ||
                    formState.userPortfolioUrl !== settings.userPortfolioUrl ||
                    formState.searchEngine !== settings.searchEngine ||
                    formState.weatherLocation !== settings.weatherLocation ||
                    formState.theme !== settings.theme ||
                    formState.hideSeconds !== settings.hideSeconds ||
                    formState.use12Hour !== settings.use12Hour ||
                    JSON.stringify(formState.socialProfiles) !== JSON.stringify(settings.socialProfiles) ||
                    JSON.stringify(formState.bookmarks) !== JSON.stringify(settings.bookmarks);

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
    }, [formState, settings]);

    // Handle escape key to close panel
    useEffect(() => {
        const handleEscKey = (event) => {
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
                    JSON.stringify(formState.socialProfiles) !== JSON.stringify(settings.socialProfiles) ||
                    JSON.stringify(formState.bookmarks) !== JSON.stringify(settings.bookmarks);

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
    }, [isOpen, formState, settings]);

    // Handle Clock update
    const handleClockSettingToggle = (settingName) => {
        const currentValue = formState[settingName];
        const newValue = !currentValue;

        setFormState({
            ...formState,
            [settingName]: newValue
        });

        dispatch(updateSearchPreferences({
            ...formState,
            [settingName]: newValue
        }));
    };

    const Alert = ({ message }) => (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 backdrop-blur-md rounded-lg p-4 flex items-center gap-2 text-sm z-50"
            style={{
                background: 'rgba(239,68,68,.10)',
                border: '1px solid rgba(239,68,68,.20)',
                color: 'var(--tq-text-primary)',
            }}
        >
            <AlertCircle className="w-4 h-4" />
            {message}
        </motion.div>
    );

    const handleAutoSave = () => {
        if (!formState.userName.trim() || !formState.userRole.trim() || !formState.weatherLocation.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        dispatch(updateUserInfo({
            userName: formState.userName || settings.userName || '',
            userRole: formState.userRole || settings.userRole || '',
            userPortfolioUrl: formState.userPortfolioUrl || settings.userPortfolioUrl || ''
        }));

        dispatch(updateSearchPreferences({
            searchEngine: formState.searchEngine || settings.searchEngine,
            weatherLocation: formState.weatherLocation || settings.weatherLocation || '',
            hideSeconds: formState.hideSeconds || false,
            use12Hour: formState.use12Hour || false
        }));
        dispatch(updateTheme(formState.theme || settings.theme || initialState.theme));

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

        dispatch(updateUserInfo({
            userName: formState.userName,
            userRole: formState.userRole,
            userPortfolioUrl: formState.userPortfolioUrl
        }));
        dispatch(updateSearchPreferences({
            searchEngine: formState.searchEngine,
            weatherLocation: formState.weatherLocation,
            hideSeconds: formState.hideSeconds,
            use12Hour: formState.use12Hour
        }));
        dispatch(updateTheme(formState.theme || initialState.theme));
        dispatch(updateSocialProfiles(formState.socialProfiles));
        dispatch(updateBookmarks(formState.bookmarks));
        setIsOpen(false);
    };

    const handleReset = () => {
        setFormState(initialState);
        dispatch(updateUserInfo({
            userName: initialState.userName,
            userRole: initialState.userRole,
            userPortfolioUrl: initialState.userPortfolioUrl
        }));
        dispatch(updateSearchPreferences({
            searchEngine: initialState.searchEngine,
            weatherLocation: initialState.weatherLocation,
            hideSeconds: initialState.hideSeconds,
            use12Hour: initialState.use12Hour
        }));
        dispatch(updateTheme(initialState.theme));
        dispatch(updateSocialProfiles(initialState.socialProfiles));
        dispatch(updateBookmarks(initialState.bookmarks));
    };

    const addBookmark = () => {
        if (formState.bookmarks.length < 8) {
            setFormState({
                ...formState,
                bookmarks: [...formState.bookmarks, { name: '', url: '' }]
            });
        }
    };

    const removeBookmark = (index) => {
        setFormState({
            ...formState,
            bookmarks: formState.bookmarks.filter((_, i) => i !== index)
        });
    };

    const version = useExtensionVersion();

    const isChrome = import.meta.env.VITE_BROWSER === 'chrome';

    /* ── Shared input styles (theme-aware) ─── */
    const inputStyle = {
        background: 'var(--tq-surface-3)',
        border: '1px solid var(--tq-border-1)',
        color: 'var(--tq-text-primary)',
    };

    const inputClass =
        'w-full pl-11 pr-4 py-3 rounded-xl focus:outline-none transition-colors';

    return (
        <>
            <AnimatePresence>
                {error && <Alert message={error} />}
            </AnimatePresence>

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
                    transition={{ delay: 1, type: "spring" }}
                    className="fixed bottom-20 right-6 z-40"
                >
                    <motion.button
                        onClick={handlePromptClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                            y: { duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all font-medium"
                        style={{
                            background: 'var(--tq-accent)',
                            color: '#fff',
                            border: '1px solid var(--tq-border-2)',
                            boxShadow: `0 8px 24px var(--tq-accent-glow)`,
                        }}
                    >
                        <span className="text-lg">👋</span>
                        <span className="text-sm">Feedback</span>
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
                        className="fixed bottom-6 right-6 w-12 h-12 rounded-xl backdrop-blur-md flex items-center justify-center group shadow-lg z-40"
                        style={{
                            background: 'var(--tq-glass-bg)',
                            border: '1px solid var(--tq-glass-border)',
                        }}
                    >
                        <div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: 'var(--tq-gradient-glass)' }}
                        />
                        <Settings
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
                        className="fixed text-base inset-y-0 right-0 w-[400px] backdrop-blur-2xl shadow-2xl z-30"
                        style={{
                            background: 'var(--tq-surface-1)',
                            borderLeft: '1px solid var(--tq-border-1)',
                        }}
                    >
                        {/* Main scrollable container */}
                        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full"
                            style={{
                                '--scrollbar-thumb': 'var(--tq-scrollbar-thumb)',
                            }}
                        >
                            {/* Background gradients */}
                            <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--tq-surface-1)' }}>
                                <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--tq-gradient-subtle)' }} />
                                <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--tq-gradient-glass)' }} />
                            </div>

                            {/* Content container */}
                            <div className="relative z-100 px-6 py-8">
                                <div className="flex justify-between items-center mb-8">
                                    <motion.h2
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="text-xl font-semibold"
                                        style={{ color: 'var(--tq-text-primary)' }}
                                    >
                                        Settings
                                    </motion.h2>
                                    <motion.button
                                        aria-label="Close Settings"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-lg transition-colors"
                                        style={{ color: 'var(--tq-text-secondary)' }}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>

                                <div className="space-y-8">
                                    {/* User Details */}
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--tq-text-muted)' }} />
                                            <input
                                                type="text"
                                                value={formState.userName}
                                                onChange={(e) => setFormState({ ...formState, userName: e.target.value })}
                                                placeholder="Username"
                                                className={inputClass}
                                                style={inputStyle}
                                                data-no-theme-transition="true"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--tq-text-muted)' }} />
                                            <input
                                                type="text"
                                                value={formState.userRole}
                                                onChange={(e) => setFormState({ ...formState, userRole: e.target.value })}
                                                placeholder="Role"
                                                className={inputClass}
                                                style={inputStyle}
                                                data-no-theme-transition="true"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--tq-text-muted)' }} />
                                            <input
                                                type="text"
                                                value={formState.userPortfolioUrl}
                                                onChange={(e) => setFormState({ ...formState, userPortfolioUrl: e.target.value })}
                                                placeholder="Portfolio URL"
                                                className={inputClass}
                                                style={inputStyle}
                                                data-no-theme-transition="true"
                                            />
                                        </div>
                                    </div>

                                    {/* Weather / Search Preferences */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-sm font-medium" style={{ color: 'var(--tq-text-secondary)' }}>
                                            {isChrome ? 'Weather' : ""}
                                        </h3>
                                        <div className="space-y-3">
                                            {!isChrome && (
                                                <div className="relative w-full">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--tq-text-muted)' }} />
                                                    <button
                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        className="w-full pl-11 pr-4 py-3 rounded-xl text-left focus:outline-none"
                                                        style={{
                                                            background: 'transparent',
                                                            border: '1px solid var(--tq-border-1)',
                                                            color: 'var(--tq-text-primary)',
                                                        }}
                                                    >
                                                        {formState.searchEngine ? formState.searchEngine : "Select Search Engine"}
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
                                                            className="absolute w-full mt-2 rounded-xl shadow-lg z-20"
                                                            style={{
                                                                background: 'var(--tq-glass-bg)',
                                                                border: '1px solid var(--tq-border-1)',
                                                                backdropFilter: 'blur(24px)',
                                                            }}
                                                        >
                                                            {["Google", "Bing", "DuckDuckGo"].map((engine) => (
                                                                <li
                                                                    key={engine}
                                                                    onClick={() => {
                                                                        setFormState({ ...formState, searchEngine: engine });
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                    className="px-4 py-3 cursor-pointer transition-colors"
                                                                    style={{ color: 'var(--tq-text-primary)' }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--tq-hover-bg)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                >
                                                                    {engine}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}

                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--tq-text-muted)' }} />
                                                <input
                                                    type="text"
                                                    value={formState.weatherLocation}
                                                    onChange={(e) => setFormState({ ...formState, weatherLocation: e.target.value })}
                                                    placeholder="Weather Location"
                                                    className={inputClass}
                                                    style={inputStyle}
                                                    data-no-theme-transition="true"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* ── Theme Selector ── */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.12 }}
                                        className="space-y-3"
                                    >
                                        <h3 className="text-sm font-medium" style={{ color: 'var(--tq-text-secondary)' }}>
                                            Theme
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {THEME_LIST.map((theme) => {
                                                const isSelected = (formState.theme || initialState.theme) === theme.key;
                                                return (
                                                    <button
                                                        key={theme.key}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormState({ ...formState, theme: theme.key });
                                                            dispatch(updateTheme(theme.key));
                                                        }}
                                                        className="rounded-xl p-2 transition-all"
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
                                                        {/* Preview swatch */}
                                                        <div
                                                            className="h-9 w-full rounded-md"
                                                            style={{
                                                                background: `linear-gradient(to right, ${theme.preview[0]}, ${theme.preview[1]}, ${theme.preview[2]})`,
                                                            }}
                                                        />
                                                        <p
                                                            className="mt-1 text-xs flex items-center justify-center gap-1.5"
                                                            style={{ color: 'var(--tq-text-secondary)' }}
                                                        >
                                                            {theme.label}
                                                            {theme.isDefault && (
                                                                <span
                                                                    className="px-1 rounded text-[9px]"
                                                                    style={{
                                                                        background: 'rgba(var(--tq-accent-rgb),.15)',
                                                                        color: 'var(--tq-accent)',
                                                                        border: '1px solid rgba(var(--tq-accent-rgb),.30)',
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

                                    {/* Clock */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium" style={{ color: 'var(--tq-text-secondary)' }}>Clock</h3>
                                        <div className="flex flex-row gap-3">
                                            {/* 12-hour format */}
                                            <div
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                                                style={{
                                                    background: 'var(--tq-surface-3)',
                                                    border: '1px solid var(--tq-border-1)',
                                                }}
                                            >
                                                <span className="text-sm" style={{ color: 'var(--tq-text-primary)' }}>12-hour</span>
                                                <button
                                                    onClick={() => handleClockSettingToggle('use12Hour')}
                                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                                    style={{
                                                        backgroundColor: formState.use12Hour
                                                            ? 'rgba(var(--tq-accent-rgb),.50)'
                                                            : 'var(--tq-surface-elevated)',
                                                    }}
                                                >
                                                    <span
                                                        className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                                                        style={{
                                                            transform: formState.use12Hour ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                                        }}
                                                    />
                                                </button>
                                            </div>

                                            {/* Hide seconds */}
                                            <div
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                                                style={{
                                                    background: 'var(--tq-surface-3)',
                                                    border: '1px solid var(--tq-border-1)',
                                                }}
                                            >
                                                <span className="text-sm" style={{ color: 'var(--tq-text-primary)' }}>Hide seconds</span>
                                                <button
                                                    onClick={() => handleClockSettingToggle('hideSeconds')}
                                                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                                    style={{
                                                        backgroundColor: formState.hideSeconds
                                                            ? 'rgba(var(--tq-accent-rgb),.50)'
                                                            : 'var(--tq-surface-elevated)',
                                                    }}
                                                >
                                                    <span
                                                        className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                                                        style={{
                                                            transform: formState.hideSeconds ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                                                        }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Profiles */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-sm font-medium" style={{ color: 'var(--tq-text-secondary)' }}>Social Profiles</h3>

                                        {Object.entries(formState.socialProfiles).map(([platform, value]) => {
                                            const IconComponent = {
                                                github: Github,
                                                twitter: Twitter,
                                                linkedin: Linkedin,
                                                instagram: Instagram,
                                                reddit: RiRedditLine
                                            }[platform] || Link;

                                            return (
                                                <div key={platform} className="relative">
                                                    <IconComponent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--tq-text-muted)' }} />
                                                    <input
                                                        type="url"
                                                        value={value}
                                                        onChange={(e) => setFormState({
                                                            ...formState,
                                                            socialProfiles: {
                                                                ...formState.socialProfiles,
                                                                [platform]: e.target.value
                                                            }
                                                        })}
                                                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                                                        className={inputClass}
                                                        style={inputStyle}
                                                        data-no-theme-transition="true"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </motion.div>

                                    {/* Bookmarks - Favourites */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-sm font-medium" style={{ color: 'var(--tq-text-secondary)' }}>
                                                Favourites (upto 8)
                                            </h3>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={addBookmark}
                                                disabled={formState.bookmarks.length >= 8}
                                                className="p-2 rounded-lg transition-colors disabled:opacity-50"
                                                style={{ color: 'var(--tq-text-secondary)' }}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                        <div className="space-y-3">
                                            {formState.bookmarks.map((bookmark, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <div className="flex-1 flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={bookmark.name}
                                                            onChange={(e) => {
                                                                const newBookmarks = [...formState.bookmarks];
                                                                newBookmarks[index] = { ...bookmark, name: e.target.value };
                                                                setFormState({ ...formState, bookmarks: newBookmarks });
                                                            }}
                                                            placeholder="Name"
                                                            className="w-1/2 px-4 py-3 rounded-xl focus:outline-none transition-colors"
                                                            style={inputStyle}
                                                            data-no-theme-transition="true"
                                                        />
                                                        <input
                                                            type="url"
                                                            value={bookmark.url}
                                                            onChange={(e) => {
                                                                const newBookmarks = [...formState.bookmarks];
                                                                newBookmarks[index] = { ...bookmark, url: e.target.value };
                                                                setFormState({ ...formState, bookmarks: newBookmarks });
                                                            }}
                                                            placeholder="Website URL"
                                                            className="w-1/2 px-4 py-3 rounded-xl focus:outline-none transition-colors"
                                                            style={inputStyle}
                                                            data-no-theme-transition="true"
                                                        />
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeBookmark(index)}
                                                        className="p-3 rounded-xl transition-colors"
                                                        style={{ color: 'var(--tq-text-secondary)' }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <motion.button
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSave}
                                                className="flex-1 px-4 py-3 rounded-xl backdrop-blur-sm flex items-center justify-center gap-2 group"
                                                style={{
                                                    background: 'var(--tq-gradient-subtle)',
                                                    border: '1px solid var(--tq-border-1)',
                                                    color: 'var(--tq-text-primary)',
                                                }}
                                            >
                                                <Save className="w-4 h-4" style={{ color: 'var(--tq-text-secondary)' }} />
                                                Save Changes
                                            </motion.button>

                                            <motion.button
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.45 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleReset}
                                                className="flex-1 px-4 py-3 rounded-xl backdrop-blur-sm flex items-center justify-center gap-2 group"
                                                style={{
                                                    background: 'rgba(var(--tq-accent-rgb),.06)',
                                                    border: '1px solid var(--tq-border-1)',
                                                    color: 'var(--tq-text-primary)',
                                                }}
                                            >
                                                <RotateCcw className="w-4 h-4" style={{ color: 'var(--tq-text-secondary)' }} />
                                                Reset Settings
                                            </motion.button>
                                        </div>

                                        {/* Feedback submit btn */}
                                        <motion.a
                                            id="feedback-btn"
                                            onClick={() => setIsFeedbackPopup(true)}
                                            rel="noopener noreferrer"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{
                                                y: 0,
                                                opacity: 1,
                                                scale: isHighlightingFeedback ? [1, 1.05, 1, 1.05, 1] : 1,
                                            }}
                                            transition={{
                                                delay: 0.5,
                                                scale: { duration: 0.5, repeat: isHighlightingFeedback ? 2 : 0 },
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 group cursor-pointer transition-all duration-300"
                                            style={{
                                                background: 'rgba(var(--tq-accent-sec-rgb),.10)',
                                                border: isHighlightingFeedback
                                                    ? '1px solid var(--tq-accent-secondary)'
                                                    : '1px solid rgba(var(--tq-accent-sec-rgb),.25)',
                                                color: 'var(--tq-text-primary)',
                                                boxShadow: isHighlightingFeedback
                                                    ? '0 0 15px rgba(var(--tq-accent-sec-rgb),.40)'
                                                    : 'none',
                                            }}
                                        >
                                            <Send className="w-5 h-5" style={{ color: 'var(--tq-text-secondary)' }} />
                                            Submit Feedback
                                        </motion.a>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full flex items-center justify-center mt-4"
                                            style={{ color: 'var(--tq-text-muted)' }}
                                        >
                                            <img
                                                src={TabQuestLogo}
                                                alt="TabQuest Logo"
                                                className="w-5 h-4.5 mr-2 object-contain"
                                            />
                                            <span
                                                className="text-sm font-bold tracking-wide mr-2"
                                                style={{ color: 'var(--tq-text-primary)' }}
                                            >
                                                TabQuest
                                            </span>
                                            <span
                                                className="text-xs px-2 py-1 rounded-full"
                                                style={{
                                                    background: 'var(--tq-surface-1)',
                                                    color: 'var(--tq-text-muted)',
                                                }}
                                            >
                                                {APP_VERSION}
                                            </span>
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
