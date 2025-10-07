const axios = require('axios');

exports.getWeather = async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({ message: 'City parameter is required.' });
    }

    if (!apiKey) {
        return res.status(500).json({ message: 'Weather API key is not configured on the server.' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const weatherData = {
            city: response.data.name,
            country: response.data.sys.country,
            temperature: response.data.main.temp,
            feels_like: response.data.main.feels_like,
            humidity: response.data.main.humidity,
            description: response.data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        };
        res.json(weatherData);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'City not found.' });
        }
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ message: 'Failed to fetch weather data.' });
    }
};