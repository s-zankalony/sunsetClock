const axios = require('axios');
require('dotenv').config();

const getCityFromCoords = async (req, res) => {
  // If called directly with coordinates (for testing)
  if (!res && typeof req === 'number') {
    const lat = req;
    const lon = arguments[1];

    if (lat === null || lon === null) return undefined;

    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
      );

      if (response.data && response.data.length > 0) {
        return response.data[0].name;
      }
      return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  // Normal API route handler
  const apiKey = process.env.WEATHER_API_KEY;
  const lat = req.query.lat;
  const lon = req.query.lon;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    );
    if (response.data && response.data.length > 0) {
      res.send(response.data);
    } else {
      res.status(404).send({ message: 'No location found' });
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

module.exports = getCityFromCoords;
