import React, { useState, useEffect } from 'react';
import { Cloud, WifiOff, MapPin, AlertCircle } from 'lucide-react';
import { OPENWEATHER_API_URL } from '../utils/constants';
import { useSelector } from 'react-redux';

const Weather = () => {
  const city = useSelector((state) => state.settings.weatherLocation);

  const [weatherData, setWeatherData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState(null);

  const API_URL = `${OPENWEATHER_API_URL}${city}`;

  const getCacheKey = () => {
    const today = new Date().toISOString().split('T')[0];
    return `weather_cache_${today}_${city}`;
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
  };

  const fetchWeatherInfo = async () => {
    try {
      setError(null);
      const cachedData = getCache();
      if (cachedData) {
        setWeatherData(cachedData);
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
    if (isOnline) fetchWeatherInfo();
  }, [city, isOnline]);

  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);

  return (
    <div className="relative w-full max-w-3xl mx-auto px-6 -z-20">
      {error && (
        <div className="absolute top-4 right-4 bg-red-600 text-white text-sm p-3 rounded-md shadow-lg flex items-center gap-2 z-20">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!isOnline ? (
        <div className="flex items-center gap-4 -z-20">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-white" />
            <span className="text-sm font-semibold text-white">
              {kelvinToCelsius(getCache()?.main?.temp || 0)}°
            </span>
          </div>
          <WifiOff className="w-4 h-4 text-white/70" />
        </div>
      ) : weatherData ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-white" />
            <span className="text-lg font-semibold text-white">
              {kelvinToCelsius(weatherData?.main?.temp)}°
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">
              {weatherData?.name}, {weatherData?.sys?.country}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-white text-center mt-4">Loading weather...</div>
      )}
    </div>
  );
};

export default Weather;
