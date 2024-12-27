import React, { useState, useEffect } from 'react';
import { Cloud, WifiOff, MapPin } from 'lucide-react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState(null);

  const API_URL = 'https://api.openweathermap.org/data/2.5/weather?q=Chennai&APPID=9f54dfbb87f696b1730f1a1d791e4d57';

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
        return;
      }
      const result = await fetch(API_URL);
      if (!result.ok) throw new Error(`HTTP error! status: ${result.status}`);
      const data = await result.json();
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

  const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);

  if (!isOnline) {
    const cachedData = getCache();
    if (!cachedData) return null;
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Cloud className="w-6 h-6 text-white" />
          <span className="text-sm font-semibold text-white">
            {kelvinToCelsius(cachedData.main.temp)}°
          </span>
        </div>
        <WifiOff className="w-4 h-4 text-white/70" />
      </div>
    );
  }

  if (error || !weatherData) return null;

  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-2">
        <Cloud className="w-6 h-6 text-white" />
        <span className="text-2xl font-semibold text-white">
          {kelvinToCelsius(weatherData.main.temp)}°C
        </span>
      </div>
      <span className="flex justify-evenly items-center text-md text-white/70">
        <MapPin size={18}/>
        <span className='pl-1'>{weatherData.name}</span>, 
        <span className='pl-1'>{weatherData.sys.country}</span>
      </span>
    </div>
  );
};

export default Weather;