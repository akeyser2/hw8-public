const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // Ensure dotenv is configured at the top

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// backend just for api call, seperates data into 4 different variables for script.js to use
app.get('/weather', async (req, res) => {
  const { city, state } = req.query;
  if (!city || !state) {
    return res.status(400).json({ error: 'City and state are required' });
  }

  try {
    const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`);
    const { lat, lon } = geoResponse.data[0];

    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`);
    const { temp } = weatherResponse.data.main;
    const { description } = weatherResponse.data.weather[0];
    const { speed } = weatherResponse.data.wind;

    res.json({
      temperature: temp,
      weatherDescription: description,
      windSpeed: speed,
      condition: weatherResponse.data.weather[0].main
    });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
