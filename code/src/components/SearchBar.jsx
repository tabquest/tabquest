import React, { useState, useRef, useEffect } from 'react';
import { Search, Youtube, Globe, ChevronDown } from 'lucide-react';
import Weather from './Weather';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');
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
  }, [dropdownRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const searchQuery = encodeURIComponent(searchTerm);
    const url = searchEngine === 'google'
      ? `https://www.google.com/search?q=${searchQuery}`
      : `https://www.youtube.com/results?search_query=${searchQuery}`;
    window.location.href = url;
  };

  return (
    <div className="relative">
      {isTyping && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-10 transition-all duration-300" />
      )}

      <div className="relative w-full max-w-3xl mx-auto px-4 mt-28 z-30">
        <div className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-purple-500/20">
          <form
            onSubmit={handleSearch}
            className="relative flex"
            onFocus={() => setIsTyping(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsTyping(false);
              }, 200);
            }}
          >
            {/* Search Engine Select */}
            <div className="relative min-w-[140px]" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-full w-full px-4 py-4 flex items-center justify-between 
                  bg-white/10 backdrop-blur-md rounded-l-xl
                  border-r border-purple-500/20
                  hover:bg-white/20 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  {searchEngine === 'google' ? (
                    <Globe size={20} className="text-white" />
                  ) : (
                    <Youtube size={20} className="text-white" />
                  )}
                  <span className="text-white  text-[16px] font-medium">
                    {searchEngine === 'google' ? 'Google' : 'YouTube'}
                  </span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-white transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full 
                  bg-gradient-to-br from-purple-900/80 to-blue-900/80 backdrop-blur-xl 
                  rounded-xl border border-purple-500/20 overflow-hidden z-50
                  shadow-lg shadow-purple-500/20">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchEngine('google');
                      setIsDropdownOpen(false);
                    }}
                    className="flex text-lg items-center gap-2 w-full px-4 py-3 
                      text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Globe size={16} />
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchEngine('youtube');
                      setIsDropdownOpen(false);
                    }}
                    className="flex text-lg items-center gap-2 w-full px-4 py-3 
                      text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Youtube size={16} />
                    YouTube
                  </button>
                </div>
              )}
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-lg px-4 py-4 bg-white/10 backdrop-blur-md
                text-white placeholder-gray-400
                focus:outline-none focus:ring-0 focus:ring-purple-500/50"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="px-6 bg-white/10 backdrop-blur-md rounded-r-xl
                border-l border-purple-500/20
                hover:bg-white/20 transition-all duration-200"
            >
              <Search size={20} className="text-white" />
            </button>
          </form>
          
        </div>
        <div className="mt-4">
            <Weather />
          </div>
      </div>
    </div>
  );
};

export default SearchBar;