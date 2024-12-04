import React, { useEffect } from 'react'

const Weather = () => {
    const [search, setSearch] = React.useState('');
    const [weather, setWeather] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const API_KEY = '9f54dfbb87f696b1730f1a1d791e4d57'; // Replace with your OpenWeatherMap API key
    const API_URL = 'https://api.openweathermap.org/data/3.0/onecall?lat={12.8549426}&lon={80.20703280000001}&appid={9f54dfbb87f696b1730f1a1d791e4d57}';

    useEffect(() =>{
        fetchWeatherInfo();
    });

    const fetchWeatherInfo = async () => {
        const result = await fetch(API_URL);
        const data = await result.json();

        console.log(data);
        
    }
   

    return (
        <div className="p-4 max-w-xl mx-auto">
            <div className="flex items-center space-x-2 mb-6">
                <div className="text-2xl text-white">☀️</div>
                <h1 className="text-2xl font-semibold text-white">Weather Info</h1>
            </div>

           
            {/* {loading && (
                <div className="text-white mt-4">Loading...</div>
            )} */}

            {/* {weather && !loading && (
                <div className="mt-6 bg-gray-800/50 rounded-lg p-4 text-white">
                    <h2 className="text-xl font-semibold">{weather.name}, {weather.sys.country}</h2>
                    <div className="mt-2">
                        <p className="text-3xl">{Math.round(weather.main.temp)}°C</p>
                        <p className="text-gray-400">{weather.weather[0].description}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400">Humidity</p>
                            <p>{weather.main.humidity}%</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Wind Speed</p>
                            <p>{weather.wind.speed} m/s</p>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}

export default Weather