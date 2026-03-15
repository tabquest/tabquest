import React, { useState, useEffect, useRef } from 'react';
import { Search, Youtube, Globe, Cloud, WifiOff, ChevronDown, Locate, LocateFixed, MapPin } from 'lucide-react';

const IntegratedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');
  const [isTyping, setIsTyping] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const API_URL = 'https://api.openweathermap.org/data/2.5/weather?q=Chennai&APPID=9f54dfbb87f696b1730f1a1d791e4d57';

  // Weather-related functions remain the same...
  const getCacheKey = () => {
    const today = new Date().toISOString().split('T')[0];
    return `weather_cache_${today}`;
  };

  const getCache = () => {
    const cacheData = localStorage.getItem(getCacheKey());
    if (!cacheData) return null;
    try {
      const { data, timestamp } = JSON.parse(cacheData);
      const isToday = new Date(timestamp).toDateString() === new Date().toDateString();
      return isToday ? data : null;
    } catch {
      return null;
    }
  };

  const setCache = (data) => {
    const cacheData = {
      data,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
  };

  const fetchWeatherInfo = async () => {
    try {
      setError(null);
      const cachedData = getCache();
      if (cachedData) {
        setWeatherData(cachedData);
        console.log(cachedData);
        
        return;
      }
      const result = await fetch(API_URL);
      if (!result.ok) throw new Error(`HTTP error! status: ${result.status}`);
      const data = await result.json();
      console.log(data);
      setWeatherData(data);
      setCache(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching weather data:', err);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!weatherData && isOnline) {
      fetchWeatherInfo();
    }
  }, [isOnline]);

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

  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);

  const renderWeatherInfo = () => {
    if (!isOnline) {
      const cachedData = getCache();
      if (!cachedData) return null;
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 tq-text-primary" />
            <span className="text-sm font-semibold tq-text-primary">
              {kelvinToCelsius(cachedData.main.temp)}°
            </span>
          </div>
          <WifiOff className="w-4 h-4 tq-text-secondary" />
        </div>
      );
    }

    if (error || !weatherData) return null;

    return (
      <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-2">
          <Cloud className="w-6 h-6 tq-text-primary" />
          <span className="text-2xl font-semibold tq-text-primary">
            {kelvinToCelsius(weatherData.main.temp)}°C
          </span>
        </div>
        <span className="flex justify-evenly items-center text-md tq-text-secondary">
            <MapPin size={18}/>
          <span className='pl-1'>{weatherData.name}</span>, 
          <span className='pl-1'>{weatherData.sys.country}</span>
        </span>
      </div>
    );
  };

  return (
    <div className="relative">
      {isTyping && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-10 transition-all duration-300" />
      )}

      <div className="relative w-full max-w-3xl mx-auto px-4 mt-28 z-30">
        <div className="relative tq-surface-1 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/5">
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'var(--tq-gradient-subtle)' }} />
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'var(--tq-gradient-glass)', opacity: 0.5 }} />

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
                  tq-surface-3 backdrop-blur-md rounded-l-xl
                  border-r border-white/5
                  hover:tq-hover-bg transition-all duration-200 cursor-pointer"
                title="Change Search Engine"
              >
                <div className="flex items-center gap-2">
                  {searchEngine === 'google' ? (
                    <Globe size={20} className="tq-text-primary" />
                  ) : (
                    <Youtube size={20} className="tq-text-primary" />
                  )}
                  <span className="tq-text-primary font-medium">
                    {searchEngine === 'google' ? 'Google' : 'YouTube'}
                  </span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`tq-text-primary transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full 
                  tq-surface-2 backdrop-blur-xl 
                  rounded-xl border border-white/10 overflow-hidden z-50
                  shadow-xl shadow-black/20">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchEngine('google');
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 
                      tq-text-primary hover:tq-surface-3 transition-all duration-200 cursor-pointer"
                    title="Search via Google"
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
                    className="flex items-center gap-2 w-full px-4 py-3 
                      tq-text-primary hover:tq-surface-3 transition-all duration-200 cursor-pointer"
                    title="Search via YouTube"
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
              className="flex-1 px-4 py-4 tq-surface-3 backdrop-blur-md
                tq-text-primary placeholder:tq-text-muted
                focus:outline-none focus:ring-0"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="px-6 tq-surface-3 backdrop-blur-md rounded-r-xl
                border-l border-white/5
              hover:tq-hover-bg transition-all duration-200 cursor-pointer"
              title="Search"
            >
              <Search size={20} className="tq-text-primary" />
            </button>
          </form>
        </div>

        {/* Weather Info Below */}
        <div className="mt-4">
          {renderWeatherInfo()}
        </div>
      </div>
    </div>
  );
};

export default IntegratedSearch;