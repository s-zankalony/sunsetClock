import axios from 'axios';
import { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const getSunsetTime = async (city) => {
  const searchParams = new URLSearchParams({ city: city }).toString();
  const customAxios = axios.create({
    baseURL: `/api/v1/sunsetData`,
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
    // Return null or a default error object when an error occurs
    return null;
  }
};

// Reverse geocoding function to get city name from coordinates
const getCity = async (lat, lon) => {
  try {
    const response = await axios.get(`/api/v1/getCity?lat=${lat}&lon=${lon}`);
    if (response.data && response.data.length > 0) {
      return `${response.data[0].name}, ${response.data[0].country}`;
    }
    return null;
  } catch (error) {
    console.error('Error getting city name:', error);
    return null;
  }
};

const GetCityForm = ({ onSunsetTime, onTimezone, onName, onCountry }) => {
  const cityInputRef = useRef(null);
  const initialPermissionDenied = useRef(true);

  const fetchSunsetData = useCallback(
    async (city) => {
      if (city !== '') {
        const cityData = await getSunsetTime(city);
        if (cityData !== undefined && cityData !== null) {
          if (
            Object.prototype.hasOwnProperty.call(cityData, 'sys') &&
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
    },
    [onSunsetTime, onTimezone, onName, onCountry]
  );

  const setDefaultCity = useCallback(async () => {
    const defaultCity = 'Alexandria, EG';
    if (cityInputRef.current) {
      cityInputRef.current.value = defaultCity;
    }
    await fetchSunsetData(defaultCity);
  }, [fetchSunsetData]);

  useEffect(() => {
    // Try to get user location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          initialPermissionDenied.current = false;
          const { latitude, longitude } = position.coords;
          try {
            const cityName = await getCity(latitude, longitude);
            if (cityName) {
              if (cityInputRef.current) {
                cityInputRef.current.value = cityName;
                console.log(cityName);
                // Submit the form automatically after setting city
                await handleSubmit();
              }
            } else if (initialPermissionDenied.current) {
              await setDefaultCity();
            } else {
              // Preserve existing city if permission denied after initial load
              const currentCity = cityInputRef.current.value;
              if (currentCity) {
                await fetchSunsetData(currentCity);
              }
            }
          } catch (error) {
            console.error('Error processing geolocation:', error);
            if (initialPermissionDenied.current) {
              await setDefaultCity();
            }
          }
        },
        async (error) => {
          console.log('Geolocation error:', error.message);
          if (
            error.code === error.PERMISSION_DENIED &&
            initialPermissionDenied.current
          ) {
            await setDefaultCity();
            initialPermissionDenied.current = false;
          }
        }
      );
    } else {
      console.log("Browser doesn't support geolocation");
      setDefaultCity();
    }
  }, []); // Add empty dependency array here

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const city = cityInputRef.current?.value.trim();
    if (city) {
      await fetchSunsetData(city);
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
