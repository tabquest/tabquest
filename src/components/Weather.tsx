import { useState, useEffect, useCallback } from 'react';
import { Cloud, WifiOff, MapPin, AlertCircle } from 'lucide-react';
import {
  OPENWEATHER_API_URL,
  WEATHER_CACHE_DURATION,
} from '../utils/constants';
import { useSelector } from 'react-redux';
import type { RootState } from '../utils/redux/store';

interface WeatherData {
  main: { temp: number };
  name: string;
  sys: { country: string };
}

interface CacheEntry {
  data: WeatherData;
  timestamp: string;
}

const Weather = () => {
  const city = useSelector(
    (state: RootState) => state.settings.weatherLocation,
  );
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = `${OPENWEATHER_API_URL}${city}`;

  const getCacheKey = (): string => `weather_cache_v2_${city}`;

  const cleanupOldCache = () => {
    const keysToDelete: string[] = [];
    const now = new Date().getTime();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('weather_cache_')) continue;

      if (!key.startsWith('weather_cache_v2_')) {
        keysToDelete.push(key);
      } else {
        try {
          const { timestamp } = JSON.parse(
            localStorage.getItem(key) || '{}',
          ) as CacheEntry;
          const age = now - new Date(timestamp).getTime();
          if (!timestamp || age >= WEATHER_CACHE_DURATION) {
            keysToDelete.push(key);
          }
        } catch {
          keysToDelete.push(key);
        }
      }
    }
    keysToDelete.forEach((key) => localStorage.removeItem(key));
  };

  const getCache = (): WeatherData | null => {
    const cacheData = localStorage.getItem(getCacheKey());
    if (!cacheData) return null;
    try {
      const { data, timestamp } = JSON.parse(cacheData) as CacheEntry;
      const isFresh =
        new Date().getTime() - new Date(timestamp).getTime() <
        WEATHER_CACHE_DURATION;
      return isFresh ? data : null;
    } catch {
      return null;
    }
  };

  const setCache = (data: WeatherData) => {
    const cacheData: CacheEntry = { data, timestamp: new Date().toISOString() };
    localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
  };

  const fetchWeatherInfo = useCallback(async () => {
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
      if (!result.ok) throw new Error('City not found');

      const data = (await result.json()) as WeatherData;
      setWeatherData(data);
      setCache(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, isOnline]);

  const kelvinToCelsius = (
    kelvin: number | null | undefined,
  ): number | null => {
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
            <span
              className="text-sm"
              style={{ color: 'var(--tq-text-secondary)' }}
            >
              Weather info unavailable
            </span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cloud
              className="w-6 h-6"
              style={{ color: 'var(--tq-text-primary)' }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--tq-text-primary)' }}
            >
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
          style={{ background: 'var(--tq-danger)', color: '#ffffff' }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div
          className="text-center"
          style={{ color: 'var(--tq-text-secondary)' }}
        >
          Loading weather...
        </div>
      );
    }

    if (!weatherData) return null;

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud
            className="w-6 h-6"
            style={{ color: 'var(--tq-text-primary)' }}
          />
          <span
            className="text-lg font-semibold"
            style={{ color: 'var(--tq-text-primary)' }}
          >
            {kelvinToCelsius(weatherData?.main?.temp)}°
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin
            className="w-5 h-5"
            style={{ color: 'var(--tq-text-primary)' }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--tq-text-primary)' }}
          >
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
