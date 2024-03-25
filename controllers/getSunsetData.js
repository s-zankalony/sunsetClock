const axios = require('axios');
require('dotenv').config();

const getSunsetData = async (req, res) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const city = req.query.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    console.log(error);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send(error.message);
    }
    {
    }
  }
};

module.exports = getSunsetData;
