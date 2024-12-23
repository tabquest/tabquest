import React, { useEffect, useState } from 'react';
import { Cloud, WifiOff } from 'lucide-react';

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
            
            // Check cache first
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
        if (cachedData) {
            return (
                <div className="bg-gradient-to-br from-purple-900/30 backdrop-blur-md rounded-2xl p-4 mt-4 w-80 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Cloud className="w-8 h-8 mr-2 text-white" />
                            <div className="text-4xl font-semibold text-white">
                                {kelvinToCelsius(cachedData.main.temp)}°C
                            </div>
                        </div>
                        <div className="text-xs text-white/70 font-medium"><WifiOff></WifiOff></div>
                    </div>
                    <div className="flex justify-end items-center mt-2">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-sm text-white font-medium">{cachedData.name}</h2>
                            <span className="text-sm text-white/70">IN</span>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2 text-white/70 text-sm p-2">
                <WifiOff className="w-4 h-4" />
                <span>Offline</span>
            </div>
        );
    }

    if (error) {
        const cachedData = getCache();
        if (cachedData) {
            return (
                <div className="bg-gradient-to-br from-purple-900/30 backdrop-blur-md rounded-2xl p-4 mt-4 w-80 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Cloud className="w-8 h-8 mr-2 text-white" />
                            <div className="text-4xl font-semibold text-white">
                                {kelvinToCelsius(cachedData.main.temp)}°C
                            </div>
                        </div>
                        <div className="text-xs text-white/70">Cached data</div>
                    </div>
                    <div className="flex justify-end items-center mt-2">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-sm text-white font-medium">{cachedData.name}</h2>
                            <span className="text-sm text-white/70">IN</span>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="bg-gradient-to-br from-red-900/30 backdrop-blur-md rounded-2xl p-4 mt-4 w-80 border border-white/10">
                <div className="flex items-center gap-2 text-white">
                    <Cloud className="w-5 h-5" />
                    <p className="text-sm">Unable to load weather</p>
                </div>
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div className="bg-gradient-to-br from-purple-900/30 backdrop-blur-md rounded-2xl p-4 mt-4 w-80 border border-white/10">
                <div className="flex items-center gap-2 text-white">
                    <Cloud className="w-5 h-5 animate-pulse" />
                    <span className="text-sm">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-purple-900/30 backdrop-blur-md rounded-2xl p-4 mt-4 w-80 border border-white/10">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Cloud className="w-8 h-8 mr-2 text-white" />
                    <div className="text-4xl font-semibold text-white">
                        {kelvinToCelsius(weatherData.main.temp)}°C
                    </div>
                </div>
                <div className="text-lg text-white/90">
                    {weatherData.weather[0].main}
                </div>
            </div>
            <div className="flex justify-end items-center mt-2">
                <div className="flex items-center space-x-2">
                    <h2 className="text-sm text-white font-medium">{weatherData.name}</h2>
                    <span className="text-sm text-white/70">IN</span>
                </div>
            </div>
        </div>
    );
};

export default Weather;