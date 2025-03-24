import axios from 'axios';
import { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

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
  }
};

// Reverse geocoding function to get city name from coordinates
const getCityFromCoords = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${
        import.meta.env.VITE_OPENWEATHERMAP_API_KEY
      }`
    );
    if (response.data && response.data.length > 0) {
      return response.data[0].name;
    }
    return null;
  } catch (error) {
    console.error('Error getting city name:', error);
    return null;
  }
};

const GetCityForm = ({ onSunsetTime, onTimezone, onName, onCountry }) => {
  const cityInputRef = useRef(null);

  const setDefaultCity = useCallback(async () => {
    const defaultCity = 'Alexandria, EG';
    if (cityInputRef.current) {
      cityInputRef.current.value = defaultCity;
    }
    await fetchSunsetData(defaultCity);
  }, [fetchSunsetData]);

  const fetchSunsetData = useCallback(async (city) => {

    if (city !== '') {
      const cityData = await getSunsetTime(city);
      if (cityData !== undefined && cityData !== null) {
        if (Object.prototype.hasOwnProperty.call(cityData, 'sys') &&
          Object.prototype.hasOwnProperty.call(cityData.sys, 'sunset') &&
          Object.prototype.hasOwnProperty.call(cityData, 'timezone') &&
          Object.prototype.hasOwnProperty.call(cityData, 'name') &&
          Object.prototype.hasOwnProperty.call(cityData.sys, 'country')

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
  }, [onSunsetTime, onTimezone, onName, onCountry]);

  useEffect(() => {
    // Try to get user location when component mounts
    if (navigator.geolocation) {
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Success - got coordinates
          const { latitude, longitude } = position.coords;
          try {
            // Get city name from coordinates
            const cityName = await getCityFromCoords(latitude, longitude);
            if (cityName) {
              // Set the input value to the detected city
              if (cityInputRef.current) {
                cityInputRef.current.value = cityName;
              }
              // Automatically fetch sunset data for detected city
              await fetchSunsetData(cityName);
            } else {
              // If reverse geocoding failed, use default
              await setDefaultCity();
            }
          } catch (error) {
            console.error('Error processing geolocation:', error);
            await setDefaultCity();
          }
        },
        async (error) => {
          // Error or permission denied
          console.log('Geolocation error:', error.message);
          await setDefaultCity();
        }
      );
    } else {
      // Browser doesn't support geolocation
      console.log("Browser doesn't support geolocation");      
      setDefaultCity();
    }
  }, [fetchSunsetData, setDefaultCity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const city = e.target.city.value;
    await fetchSunsetData(city);
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
          ref={cityInputRef}
          placeholder="e.g. Tokyo, New York, Paris"
        />
        <input className="input" type="submit" value="Get Sunset Clock" />
      </form>
    </>
  );
};

GetCityForm.propTypes = {
  onSunsetTime: PropTypes.func.isRequired,
  onTimezone: PropTypes.func.isRequired,
  onName: PropTypes.func.isRequired,
  onCountry: PropTypes.func.isRequired,
};

export default GetCityForm;
