// Import modules

const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const { error } = require('console');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({ error: 'City parameter is required'});
        }

        // OpenWeatherMap API call 
        const apiKey = process.env.WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;


        const response = await axios.get(url);

        // Extract relevant weather data
        const WeatherData = {
            city: response.data.name,
            country: response.data.sys.country,
            temperature: response.data.main.temp,
            feels_like: response.data.main.humidity,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            wind_speed: response.data.wind.speed
        };

        res.json(WeatherData);

    }catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'City not found' });
        }
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});