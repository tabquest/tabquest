import React, { useState, useRef, useEffect } from 'react';
import Weather from './Weather';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import { Search, Youtube, ChevronDown } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { BiLogoBing } from "react-icons/bi";
import { SiDuckduckgo } from "react-icons/si";

const SearchBar = ({ onSearch }) => {
  const SearchEngineName = useSelector((state) => state.settings.searchEngine);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEngine, setSearchEngine] = useState('webSearch');
  const [isTyping, setIsTyping] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

    const searchQuery = encodeURIComponent(searchTerm);
    const url =
      searchEngine === 'webSearch'
        ? SearchEngineName === 'Google'
          ? `https://www.google.com/search?q=${searchQuery}`
          : SearchEngineName === 'DuckDuckGo'
            ? `https://duckduckgo.com/?q=${searchQuery}`
            : `https://www.bing.com/search?q=${searchQuery}`
        : `https://www.youtube.com/results?search_query=${searchQuery}`;
    window.location.href = url;
  };

  const getAlternateOption = () => {
    const alternateIcon =
      SearchEngineName === 'Google'
        ? <FaGoogle size={16} />
        : SearchEngineName === 'DuckDuckGo'
          ? <SiDuckduckgo size={16} />
          : <BiLogoBing size={16} />;

    return searchEngine === 'webSearch'
      ? { icon: <Youtube size={16} />, text: 'YouTube', value: 'youtube' }
      : { icon: alternateIcon, text: SearchEngineName, value: 'webSearch' };
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
            className="fixed inset-0 z-10"
            style={{
              backgroundColor: 'rgba(0,0,0,.20)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-3xl mx-auto px-4 mt-16 sm:mt-28 z-10 space-y-4">
        <motion.div
          className="relative backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl"
          style={{
            background: 'var(--tq-search-bg)',
            border: '1px solid var(--tq-search-border)',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Subtle inner glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: 'var(--tq-gradient-glass)' }}
          />

          <form
            onSubmit={handleSearch}
            className="relative flex flex-col sm:flex-row gap-2 sm:gap-0"
            onFocus={() => setIsTyping(true)}
            onBlur={() => {
              setTimeout(() => setIsTyping(false), 200);
            }}
          >
            <div className="relative w-full sm:min-w-[140px] sm:w-auto" ref={dropdownRef}>
              <motion.button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-full w-full px-4 py-3 sm:py-4 flex items-center justify-between rounded-xl sm:rounded-l-xl sm:rounded-r-none transition-all duration-200"
                style={{
                  background: 'var(--tq-surface-elevated)',
                  borderRight: '1px solid var(--tq-border-1)',
                  color: 'var(--tq-text-primary)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  {searchEngine === 'webSearch' ? (
                    SearchEngineName === 'Google' ? (
                      <FaGoogle size={18} />
                    ) : SearchEngineName === 'DuckDuckGo' ? (
                      <SiDuckduckgo size={18} />
                    ) : (
                      <BiLogoBing size={20} />
                    )
                  ) : (
                    <Youtube size={18} />
                  )}
                  <span className="text-[16px] font-medium">
                    {searchEngine === 'webSearch' ? SearchEngineName : 'YouTube'}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 w-full rounded-xl overflow-hidden shadow-lg z-30"
                    style={{
                      background: 'var(--tq-glass-bg)',
                      border: '1px solid var(--tq-border-1)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                    }}
                  >
                    <motion.button
                      whileHover={{ backgroundColor: 'var(--tq-hover-bg)' }}
                      type="button"
                      onClick={() => {
                        setSearchEngine(getAlternateOption().value);
                        setIsDropdownOpen(false);
                      }}
                      className="flex text-lg items-center gap-2 w-full px-4 py-3 transition-all duration-200"
                      style={{ color: 'var(--tq-text-primary)' }}
                    >
                      {getAlternateOption().icon}
                      {getAlternateOption().text}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-lg px-4 py-3 sm:py-4 backdrop-blur-md rounded-xl sm:rounded-none focus:outline-none focus:ring-0"
              style={{
                background: 'var(--tq-surface-elevated)',
                color: 'var(--tq-text-primary)',
              }}
              data-no-theme-transition="true"
            />

            <motion.button
              type="submit"
              className="px-6 py-3 sm:py-0 backdrop-blur-md rounded-xl sm:rounded-l-none sm:rounded-r-xl transition-all duration-200"
              style={{
                background: 'var(--tq-surface-elevated)',
                borderLeft: '1px solid var(--tq-border-1)',
                color: 'var(--tq-text-primary)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} />
            </motion.button>
          </form>
        </motion.div>

        <Weather />
      </div>
    </motion.div>
  );
};

export default SearchBar;