import { useState, useEffect, useCallback } from 'react';
import { MapPin, WifiOff, AlertCircle } from 'lucide-react';
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
  weather: { description: string; icon: string }[];
}

interface CacheEntry {
  data: WeatherData;
  timestamp: string;
}

const kelvinToCelsius = (k: number | null | undefined): number | null =>
  k != null ? Math.round(k - 273.15) : null;

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
  fontSize: 'clamp(0.68rem, 1.1vw, 0.82rem)',
  fontWeight: 300,
  color: 'rgba(255,255,255,.28)',
};

const Weather = () => {
  const city = useSelector(
    (state: RootState) => state.settings.weatherLocation,
  );
  const [data, setData] = useState<WeatherData | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getCacheKey = () => `weather_cache_v2_${city}`;

  const getCache = (): WeatherData | null => {
    try {
      const raw = localStorage.getItem(getCacheKey());
      if (!raw) return null;
      const { data: d, timestamp } = JSON.parse(raw) as CacheEntry;
      const fresh =
        Date.now() - new Date(timestamp).getTime() < WEATHER_CACHE_DURATION;
      return fresh ? d : null;
    } catch {
      return null;
    }
  };

  const setCache = (d: WeatherData) =>
    localStorage.setItem(
      getCacheKey(),
      JSON.stringify({ data: d, timestamp: new Date().toISOString() }),
    );

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    const cached = getCache();
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${OPENWEATHER_API_URL}${city}`);
      if (!res.ok) throw new Error('City not found');
      const json = (await res.json()) as WeatherData;
      setData(json);
      setCache(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
      setData(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    if (isOnline) fetch_();
  }, [city, isOnline, fetch_]);

  if (!isOnline) {
    const temp = kelvinToCelsius(getCache()?.main?.temp);
    return (
      <div style={row}>
        <WifiOff size={10} />
        {temp != null ? `${temp}°C · offline` : 'Offline'}
      </div>
    );
  }

  if (error)
    return (
      <div style={{ ...row, color: 'var(--tq-danger)', opacity: 0.7 }}>
        <AlertCircle size={10} />
        {error}
      </div>
    );

  if (loading || !data)
    return <div style={{ ...row, opacity: 0.35 }}>Loading weather…</div>;

  const temp = kelvinToCelsius(data.main.temp);

  return (
    <div style={row}>
      <MapPin size={10} />
      <span>
        {data.name}, {data.sys.country}
      </span>
      <span
        style={{
          padding: '1px 8px',
          borderRadius: '9999px',
          background: 'rgba(255,255,255,.05)',
          border: '1px solid rgba(255,255,255,.07)',
          color: 'rgba(255,255,255,.38)',
        }}
      >
        {temp}°C
      </span>
    </div>
  );
};

export default Weather;
