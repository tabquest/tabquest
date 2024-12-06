import React, { useEffect, useState } from 'react';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const API_URL = 'https://api.openweathermap.org/data/2.5/weather?q=Chennai&APPID=9f54dfbb87f696b1730f1a1d791e4d57';

    useEffect(() => {
        if (!weatherData)
            fetchWeatherInfo();
    }, []);

    const fetchWeatherInfo = async () => {
        const result = await fetch(API_URL);
        const data = await result.json();
        setWeatherData(data);
    };

    const kelvinToCelsius = (kelvin) => {
        return Math.round(kelvin - 273.15);
    };

    if (!weatherData) return <div className="text-white">Loading...</div>;

    return (
        <div className="backdrop-blur-md rounded-2xl p-4 mt-4 w-80 border border-white/10">
            
            
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-6 h-6 mr-2">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                            <path d="M3 15H21M3 12H21M3 9H21" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </div>
                    <div className="text-4xl font-semibold text-white">
                        {kelvinToCelsius(weatherData.main.temp)}°C
                    </div>
                </div>
                <div className="text-lg text-white/90">
                    {weatherData.weather[0].main}
                </div>
            </div>
            <div className="flex justify-end items-center mb-2">
                <div className="flex items-center space-x-2">
                    <h2 className="text-sm text-white font-medium">{weatherData.name}</h2>
                    <span className="text-sm text-white/70">IN</span>
                </div>
                {/* <div className="text-sm text-white/70">
                    {new Date().toLocaleDateString()}
                </div> */}
            </div>
        </div>
    );
};

export default Weather;