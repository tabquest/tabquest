import React, { useState, useEffect } from 'react';
import { Search, History, Trash2 } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim()) {
        try {
          const response = await fetch(
            `https://api.datamuse.com/sug?s=${encodeURIComponent(searchTerm)}`
          );
          const data = await response.json();
          const suggestionsArray = data.map(item => item.word);
          setSuggestions(suggestionsArray);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const newHistory = [searchTerm, ...searchHistory.slice(0, 4)];
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    const searchQuery = encodeURIComponent(searchTerm);
    window.location.href = `https://www.google.com/search?q=${searchQuery}`;
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleSuggestionClick = (term) => {
    const searchQuery = encodeURIComponent(term);
    window.location.href = `https://www.google.com/search?q=${searchQuery}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-14">
      <div className="relative bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-purple-500/20">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsTyping(true);
            }}
            onBlur={() => setTimeout(() => setIsTyping(false), 200)}
            placeholder="What would you like to search for?"
            className="w-full px-5 py-4 rounded-xl 
                     bg-white/10 backdrop-blur-md
                     border border-purple-500/20
                     text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-purple-500
                     transition-all duration-300 pr-12"
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

        {/* Auto Suggestions */}
        {suggestions.length > 0 && isTyping && (
          <div className="absolute w-full mt-2 bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/20 overflow-hidden z-50">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-5 py-3 hover:bg-white/10 cursor-pointer text-gray-200 flex items-center gap-3 transition-colors duration-200"
              >
                <Search size={14} className="text-purple-400" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && !isTyping && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <History size={16} className="text-purple-400" />
                <span className="text-sm">Recent searches</span>
              </div>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                <Trash2 size={14} />
                Clear
              </button>
            </div>
            {searchHistory.map((term, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(term)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg
                          bg-white/5 hover:bg-white/10 cursor-pointer
                          transition-colors duration-200"
              >
                <History size={14} className="text-purple-400" />
                <span className="text-gray-300 text-sm">{term}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
