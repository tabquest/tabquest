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
    updateBookmarks
} from '../utils/redux/settingsSlice';
import { initialState } from '../utils/constants';
import useExtensionVersion from '../utils/hooks/useExtensionVersion';

import { APP_VERSION } from '../utils/version';
import { FeedbackForm } from '../features';

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
            // Show roughly twice a week (every 3.5 days = 302400000ms)
            // Using 3.5 days ensures it doesn't feel spammy
            const REMINDER_INTERVAL = 3.5 * 24 * 60 * 60 * 1000;

            if (!lastShown || (now - parseInt(lastShown) > REMINDER_INTERVAL)) {
                setShowFeedbackPrompt(true);
                localStorage.setItem('tabquest_feedback_last_shown', now.toString());
            } else {
                setShowFeedbackPrompt(false);
            }
        } else {
            setShowFeedbackPrompt(false);
        }
    }, [isOpen]); // Re-check when panel closes

    const handlePromptClick = () => {
        setIsOpen(true);
        setIsHighlightingFeedback(true);

        // Wait for panel to open and render
        setTimeout(() => {
            const btn = document.getElementById('feedback-btn');
            if (btn) {
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);

        // Turn off highlight after animation
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

        // Update the local form state
        setFormState({
            ...formState,
            [settingName]: newValue
        });

        // Dispatch the update immediately to Redux
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
            className="fixed top-4 right-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-lg p-4 flex items-center gap-2 text-sm text-white/90 z-50"
        >
            <AlertCircle className="w-4 h-4" />
            {message}
        </motion.div>
    );

    const handleAutoSave = () => {
        // Validate required fields before auto-saving
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
            weatherLocation: initialState.weatherLocation
        }));
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
                    className="fixed bottom-20 right-6 z-40 flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={handlePromptClick}
                >
                    <div className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity absolute right-12 top-1/2 -translate-y-1/2">
                        Give Feedback
                    </div>
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                        className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30 border border-white/20 hover:bg-purple-500 transition-colors"
                    >
                        <span className="text-xl">👋</span>
                    </motion.div>
                </motion.div>
            )}

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-12 h-12 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center group shadow-lg z-40"
            >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Settings className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={panelRef}
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed text-base inset-y-0 right-0 w-[400px] bg-black/40 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-30"
                    >
                        {/* Main scrollable container */}
                        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-track]:bg-neutral-800 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600">
                            {/* Background and gradient container - fixed position */}
                            <div className="absolute inset-0 bg-black/40">
                                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-blue-500/5 pointer-events-none" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />
                            </div>

                            {/* Content container */}
                            <div className="relative z-100 px-6 py-8">
                                <div className="flex justify-between items-center mb-8">
                                    <motion.h2
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="text-xl font-semibold text-white/90"
                                    >
                                        Settings
                                    </motion.h2>
                                    <motion.button
                                        aria-label="Close Settings"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white/70" />
                                    </motion.button>
                                </div>

                                <div className="space-y-8">
                                    {/* User Details */}
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                                            <input
                                                type="text"
                                                value={formState.userName}
                                                onChange={(e) => setFormState({ ...formState, userName: e.target.value })}
                                                placeholder="Username"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                                            <input
                                                type="text"
                                                value={formState.userRole}
                                                onChange={(e) => setFormState({ ...formState, userRole: e.target.value })}
                                                placeholder="Role"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                                            <input
                                                type="text"
                                                value={formState.userPortfolioUrl}
                                                onChange={(e) => setFormState({ ...formState, userPortfolioUrl: e.target.value })}
                                                placeholder="Portfolio URL"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10"
                                            />
                                        </div>
                                    </div>

                                    {/* Weather Preferences */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-4"
                                    >

                                        <h3 className="text-sm font-medium text-white/70">{isChrome ? 'Weather' : ""}</h3>
                                        <div className="space-y-3">

                                            {!isChrome && <div className="relative w-full">
                                                {/* Selected Value */}
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                                                <button
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent border border-white/10 text-white/90 text-left focus:outline-none focus:border-white/20"
                                                >
                                                    {formState.searchEngine ? formState.searchEngine : "Select Search Engine"}
                                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                        {/* Dropdown Arrow Icon */}
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

                                                {/* Dropdown Options */}
                                                {isDropdownOpen && (
                                                    <ul className="absolute w-full mt-2 bg-[#2d2d2dd5] border border-white/10 rounded-xl shadow-lg z-20">
                                                        {["Google", "Bing", "DuckDuckGo"].map((engine) => (
                                                            <li
                                                                key={engine}
                                                                onClick={() => {
                                                                    setFormState({ ...formState, searchEngine: engine });
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                className="px-4 py-3 cursor-pointer text-inherit hover:bg-white/20"
                                                            >
                                                                {engine}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>}



                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                                                <input
                                                    type="text"
                                                    value={formState.weatherLocation}
                                                    onChange={(e) => setFormState({ ...formState, weatherLocation: e.target.value })}
                                                    placeholder="Weather Location"
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Clock */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-white/70">Clock</h3>
                                        <div className="flex flex-row gap-3">
                                            {/* 12-hour format */}
                                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-sm text-white/90">12-hour</span>
                                                <button
                                                    onClick={() => handleClockSettingToggle('use12Hour')}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formState.use12Hour ? 'bg-emerald-500/50' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formState.use12Hour ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Hide seconds */}
                                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-sm text-white/90">Hide seconds</span>
                                                <button
                                                    onClick={() => handleClockSettingToggle('hideSeconds')}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formState.hideSeconds ? 'bg-emerald-500/50' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formState.hideSeconds ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
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
                                        <h3 className="text-sm font-medium text-white/70">Social Profiles</h3>

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
                                                    <IconComponent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
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
                                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </motion.div>

                                    {/* Bookmarks - Favourites  */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-sm font-medium text-white/70">Favourites (upto 8)</h3>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={addBookmark}
                                                disabled={formState.bookmarks.length >= 8}
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                                            >
                                                <Plus className="w-4 h-4 text-white/70" />
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
                                                            className="w-1/2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10"
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
                                                            className="w-1/2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10"
                                                        />
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeBookmark(index)}
                                                        className="p-3 rounded-xl hover:bg-white/10 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-white/70" />
                                                    </motion.button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        {/* Save and Reset in a Row */}
                                        <div className="flex gap-3">
                                            <motion.button
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSave}
                                                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm text-white/90 hover:text-white border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 group"
                                            >
                                                <Save className="w-4 h-4 text-white/70 group-hover:text-white/90" />
                                                Save Changes
                                            </motion.button>

                                            <motion.button
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.45 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleReset}
                                                className="flex-1 px-4 py-3 rounded-xl bg-red-500/10 backdrop-blur-sm text-white/90 hover:text-white border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 group"
                                            >
                                                <RotateCcw className="w-4 h-4 text-white/70 group-hover:text-white/90" />
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
                                                borderColor: isHighlightingFeedback ? ['rgba(147, 51, 234, 0.3)', 'rgba(255, 255, 255, 0.8)', 'rgba(147, 51, 234, 0.3)'] : 'rgba(147, 51, 234, 0.3)'
                                            }}
                                            transition={{
                                                delay: 0.5,
                                                scale: { duration: 0.5, repeat: isHighlightingFeedback ? 2 : 0 },
                                                borderColor: { duration: 0.5, repeat: isHighlightingFeedback ? 2 : 0 }
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full px-4 py-3 rounded-xl bg-purple-800/20 text-white/90 hover:text-white border ${isHighlightingFeedback ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-purple-800/30'} hover:border-white/20 flex items-center justify-center gap-2 group cursor-pointer transition-all duration-300`}
                                        >
                                            <Send className="w-5 h-5 text-white/70 group-hover:text-white" />
                                            Submit Feedback
                                        </motion.a>




                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            // transition={{ duration: 0.3 }}
                                            className="w-full text-center mt-4 text-gray-400"
                                        >
                                            <span className="text-sm font-medium mr-2">
                                                TabQuest
                                            </span>
                                            <span className="text-xs bg-gray-800/50 px-2 py-1 rounded-full">
                                                {APP_VERSION}
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                        </div>



                        <div
                            className="relative h-full overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-track]:bg-neutral-800 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 rounded-[4px]">
                            {/* 
                            // Fixed background wrapper that extends full height 
                            <div className="absolute inset-0 bg-black/40">
                                <div className="relative h-full">

                                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-blue-500/5 pointer-events-none" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />

                                   

                                </div>
                            </div> */}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SettingsPanel;