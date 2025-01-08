import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Settings, X, Plus, Trash2, Save, RotateCcw, BookOpen, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    updateUserInfo,
    updateSearchPreferences,
    updateSocialProfiles,
    updateBookmarks
} from '../utils/redux/settingsSlice';
import { initialState } from '../utils/constants';
import FeedbackForm from './FeedbackForm';
import useExtensionVersion from '../utils/hooks/useExtensionVersion';

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
            weatherLocation: formState.weatherLocation || settings.weatherLocation || ''
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
            weatherLocation: formState.weatherLocation
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

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-12 h-12 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center group shadow-lg"
            >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Settings className="w-5 h-5 text-white/70 group-hover:text-white/90 transition-colors" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-[400px] bg-black/40 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-30"
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
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-sm font-medium text-white/50">User Details</h3>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={formState.userName}
                                                onChange={(e) => setFormState({ ...formState, userName: e.target.value })}
                                                placeholder="Username"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300"
                                            />
                                            <input
                                                type="text"
                                                value={formState.userRole}
                                                onChange={(e) => setFormState({ ...formState, userRole: e.target.value })}
                                                placeholder="Role"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300"
                                            />

                                            <input
                                                type="text"
                                                value={formState.userPortfolioUrl}
                                                onChange={(e) => setFormState({ ...formState, userPortfolioUrl: e.target.value })}
                                                placeholder="Portfolio URL"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300"
                                            />

                                        </div>
                                    </motion.div>

                                    {/* Search Preferences */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-sm font-medium text-white/50">Search Preferences</h3>
                                        <div className="space-y-3">

                                            <div className="relative w-full">
                                                {/* Selected Value */}
                                                <button
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/10 text-white/90 text-left focus:outline-none focus:border-white/20 transition-all duration-300"
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
                                                                className="px-4 py-3 cursor-pointer text-inherit hover:bg-white/20 transition-all duration-300"
                                                            >
                                                                {engine}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>



                                            <input
                                                type="text"
                                                value={formState.weatherLocation}
                                                onChange={(e) => setFormState({ ...formState, weatherLocation: e.target.value })}
                                                placeholder="Weather Location"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Social Profiles */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-sm font-medium text-white/50">Social Profiles</h3>
                                        <div className="space-y-3">
                                            {Object.keys(formState.socialProfiles).map((platform) => (
                                                <input
                                                    key={platform}
                                                    type="url"
                                                    value={formState.socialProfiles[platform]}
                                                    onChange={(e) => setFormState({
                                                        ...formState,
                                                        socialProfiles: {
                                                            ...formState.socialProfiles,
                                                            [platform]: e.target.value
                                                        }
                                                    })}
                                                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Bookmarks */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-sm font-medium text-white/50">Favourites (upto 8)</h3>
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
                                                            className="w-1/2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300"
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
                                                            className="w-1/2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300"
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
                                        <motion.button
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSave}
                                            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm text-white/90 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 group"
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
                                            className="w-full px-4 py-3 rounded-xl bg-red-500/10 backdrop-blur-sm text-white/90 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 group"
                                        >
                                            <RotateCcw className="w-4 h-4 text-white/70 group-hover:text-white/90" />
                                            Reset Settings
                                        </motion.button>

                                        {/* Future use for document ref */}
                                        <motion.a
                                            onClick={() => setIsFeedbackPopup(true)}
                                            rel="noopener noreferrer"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-transform duration-300 flex items-center justify-center gap-2 group"
                                        >
                                            <Send className="w-5 h-5 text-white/70 group-hover:text-white" />
                                            Submit Feedback
                                        </motion.a>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full text-center mt-4 text-gray-400"
                                        >
                                            <span className="text-sm font-medium mr-2">
                                                TabQuest
                                            </span>
                                            <span className="text-xs bg-gray-800/50 px-2 py-1 rounded-full">
                                                {version}
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