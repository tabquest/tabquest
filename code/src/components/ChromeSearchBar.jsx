import React, { useState, useRef, useEffect } from 'react';
import { Search, Youtube, ChevronDown, Camera } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaGoogle, FaSearch } from 'react-icons/fa';
import Weather from './Weather';
import { SiGooglelens } from 'react-icons/si';

const ChromeSearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        // Send message to background script to perform search
        chrome.runtime.sendMessage({
            type: 'PERFORM_SEARCH',
            searchTerm: searchTerm.trim()
        });
        setSearchTerm('');
    };

    // Handle Google Lens click
    const handleGoogleLensClick = () => {
        window.location.href = "https://lens.google.com";
    };

    return (
        <motion.div
            className="relative w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <AnimatePresence>
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-md z-10"
                    />
                )}
            </AnimatePresence>

            <div className="relative w-full max-w-3xl mx-auto px-4 mt-16 sm:mt-28 z-10 space-y-4">
                <motion.div
                    className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-purple-500/20"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <form
                        onSubmit={handleSearch}
                        className="relative flex flex-col sm:flex-row gap-2 sm:gap-0"
                        onFocus={() => setIsTyping(true)}
                        onBlur={() => {
                            setTimeout(() => setIsTyping(false), 200);
                        }}
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="flex-1 text-lg px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-md
                                text-white placeholder-gray-400 rounded-l-xl
                                focus:outline-none focus:ring-0 focus:ring-purple-500/50"
                        />

                        <div className="flex">
                            {/* Google Lens Button */}
                            <motion.button
                                type="button"
                                onClick={handleGoogleLensClick}
                                className="px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-md
                                    border-r border-purple-500/20
                                    hover:bg-white/20 transition-all duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="Search with Google Lens"
                            >
                                <SiGooglelens size={20} className="text-white" />
                            </motion.button>

                            {/* Search Button */}
                            <motion.button
                                type="submit"
                                className="px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-md rounded-r-xl
                                    hover:bg-white/20 transition-all duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Search size={20} className="text-white" />
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
                <Weather/>
            </div>
        </motion.div>
    );
};

export default ChromeSearchBar;