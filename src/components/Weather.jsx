import React, { useState, useEffect } from 'react';
import { Cloud, WifiOff, MapPin, AlertCircle } from 'lucide-react';
import { OPENWEATHER_API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';

const Weather = () => {
  const city = useSelector((state) => state.settings.weatherLocation);
  const [weatherData, setWeatherData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = `${OPENWEATHER_API_URL}${city}`;

  const getCacheKey = () => {
    const today = new Date().toISOString().split('T')[0];
    return `weather_cache_${today}_${city}`;
  };

  const cleanupOldCache = () => {
    const today = new Date().toISOString().split('T')[0];
    const keysToDelete = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('weather_cache_')) {
        const [, date] = key.match(/weather_cache_(\d{4}-\d{2}-\d{2})/) || [];
        if (date && date !== today) {
          keysToDelete.push(key);
        }
      }
    }

    keysToDelete.forEach(key => localStorage.removeItem(key));
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
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
    cleanupOldCache();
  };

  const fetchWeatherInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const cachedData = getCache();
      if (cachedData) {
        setWeatherData(cachedData);
        setIsLoading(false);
        return;
      }

      const result = await fetch(API_URL);
      if (!result.ok) throw new Error(`City not found`);

      const data = await result.json();
      setWeatherData(data);
      setCache(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    cleanupOldCache();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) fetchWeatherInfo();
  }, [city, isOnline]);

  const kelvinToCelsius = (kelvin) => {
    if (!kelvin) return null;
    return Math.round(kelvin - 273.15);
  };

  const renderWeatherContent = () => {
    if (!isOnline) {
      const cachedTemp = getCache()?.main?.temp;
      const temp = kelvinToCelsius(cachedTemp);

      if (!temp) {
        return (
          <div className="flex items-center gap-2">
            <WifiOff
              className="w-4 h-4"
              style={{ color: 'var(--tq-text-secondary)' }}
              data-testid="wifi-off-icon"
            />
            <span className="text-sm" style={{ color: 'var(--tq-text-secondary)' }}>
              Weather info unavailable
            </span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6" style={{ color: 'var(--tq-text-primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--tq-text-primary)' }}>
              {temp}°
            </span>
          </div>
          <WifiOff
            className="w-4 h-4"
            style={{ color: 'var(--tq-text-secondary)' }}
            data-testid="wifi-off-icon"
          />
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="flex w-[160px] m-auto justify-center items-center gap-2 text-sm p-2 rounded-md"
          style={{
            background: 'var(--tq-danger)',
            color: '#ffffff',
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-center" style={{ color: 'var(--tq-text-secondary)' }}>
          Loading weather...
        </div>
      );
    }

    if (!weatherData) {
      return null;
    }

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-6 h-6" style={{ color: 'var(--tq-text-primary)' }} />
          <span className="text-lg font-semibold" style={{ color: 'var(--tq-text-primary)' }}>
            {kelvinToCelsius(weatherData?.main?.temp)}°
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" style={{ color: 'var(--tq-text-primary)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--tq-text-primary)' }}>
            {weatherData?.name}, {weatherData?.sys?.country}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-6">
      {renderWeatherContent()}
    </div>
  );
};

export default Weather;