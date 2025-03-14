import axios from 'axios';
import SunsetClock from './SunsetClock';

const getSunsetTime = async (city) => {
  const searchParams = new URLSearchParams({ city: city }).toString();
  const customAxios = axios.create({
    baseURL: `/api/v1`,
  });
  try {
    const response = await customAxios.get(`/?${searchParams}`);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    {
    }
  }
};

const GetCityForm = ({ onSunsetTime, onTimezone, onName, onCountry }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const city = e.target.city.value;
    if (city !== '') {
      const cityData = await getSunsetTime(city);
      if (cityData !== undefined && cityData !== null) {
        if (
          cityData.hasOwnProperty('sys') &&
          cityData.sys.hasOwnProperty('sunset') &&
          cityData.hasOwnProperty('timezone') &&
          cityData.hasOwnProperty('name') &&
          cityData.sys.hasOwnProperty('country')
        ) {
          const sunsetTime = cityData.sys.sunset;
          const timezone = cityData.timezone;
          const name = cityData.name;
          const country = cityData.sys.country;
          console.log(`Sunset Time: ${sunsetTime}`);
          console.log(`timezone: ${timezone}`);
          console.log(`name: ${name}`);
          console.log(`country: ${country}`);
          onSunsetTime(sunsetTime);
          onTimezone(timezone);
          onName(name);
          onCountry(country);
        } else {
          console.log('Invalid city data');
        }
      } else {
        console.log('cityData is undefined or null');
      }
    }
  };

  return (
    <>
      <form className="form" action="submit" onSubmit={handleSubmit}>
        <label className="label" htmlFor="city">
          Enter your city
        </label>
        <input
          className="input"
          type="text"
          name="city"
          placeholder="e.g. Tokyo, New York, Paris"
        />
        <input className="input" type="submit" value="Get Sunset Clock" />
      </form>
    </>
  );
};

export default GetCityForm;
