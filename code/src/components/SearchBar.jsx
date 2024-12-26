import React, { useState } from 'react';
import { Search, Youtube, Globe } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');
  const [isTyping, setIsTyping] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const searchQuery = encodeURIComponent(searchTerm);
    const url =
      searchEngine === 'google'
        ? `https://www.google.com/search?q=${searchQuery}`
        : `https://www.youtube.com/results?search_query=${searchQuery}`;
    window.location.href = url;
  };

  return (
    <div className="relative">
      {/* Background Blur Overlay */}
      {isTyping && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md z-10 transition-all duration-300"
        />
      )}

      {/* Search Bar Container */}
      <div className="relative w-full max-w-3xl mx-auto px-4 mt-28 z-30">
        <div className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-purple-500/20">
          <form
            onSubmit={handleSearch}
            className="relative"
            onFocus={() => setIsTyping(true)}
            onBlur={() => setTimeout(() => setIsTyping(false), 200)}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="What would you like to search for?"
              className="w-full px-5 py-4 rounded-xl 
       bg-white/10 backdrop-blur-md
       border border-purple-500/20
       text-white placeholder-gray-400
       focus:outline-none focus:ring-2 focus:ring-purple-500
       transition-all duration-300 pr-12 text-white text-lg"
            />

            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2
                   w-8 h-8 flex items-center justify-center
                   rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
                   text-white transition-all duration-200
                   shadow-lg shadow-purple-500/20"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Search Engine Buttons */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => setSearchEngine('google')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
      ${searchEngine === 'google'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
        >
          <Globe size={18} />
          Google
        </button>
        <button
          onClick={() => setSearchEngine('youtube')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
      ${searchEngine === 'youtube'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
        >
          <Youtube size={18} />
          YouTube
        </button>
      </div>
    </div>

  );
};

export default SearchBar;
