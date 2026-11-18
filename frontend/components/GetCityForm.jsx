import axios from 'axios';
import { useEffect, useRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { lookupErrorMessage, validCityData } from '../lib/cityLookup';

const GetCityForm = ({ onSunsetTime, onTimezone, onName, onCountry }) => {
  const cityInputRef = useRef(null);
  const requestId = useRef(0);
  const userInteracted = useRef(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSunsetData = useCallback(async (city) => {
    const id = ++requestId.current;
    setError('');
    onSunsetTime(null);
    onTimezone(null);
    onName('');
    onCountry('');
    if (!city) {
      setLoading(false);
      setError('Please enter a city name.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/sunsetData', { params: { city }, timeout: 15000 });
      if (id !== requestId.current) return;
      if (!validCityData(data)) {
        setError('The weather service returned incomplete city data. Please try again.');
        return;
      }
      onSunsetTime(data.sys.sunset);
      onTimezone(data.timezone);
      onName(data.name);
      onCountry(data.sys.country);
    } catch (err) {
      if (id === requestId.current) setError(lookupErrorMessage(err));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [onSunsetTime, onTimezone, onName, onCountry]);

  useEffect(() => {
    let active = true;
    const requests = requestId;
    const applyInitialCity = async (city) => {
      if (!active || userInteracted.current) return;
      cityInputRef.current.value = city;
      await fetchSunsetData(city);
    };
    const fallback = () => applyInitialCity('Alexandria, EG');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        if (!active || userInteracted.current) return;
        try {
          const { data } = await axios.get('/api/v1/getCity', {
            params: { lat: coords.latitude, lon: coords.longitude }, timeout: 15000,
          });
          if (data?.[0]?.name && data[0].country) {
            await applyInitialCity(`${data[0].name}, ${data[0].country}`);
          } else await fallback();
        } catch { await fallback(); }
      }, fallback, { timeout: 10000 });
    } else fallback();
    return () => { active = false; ++requests.current; };
  }, [fetchSunsetData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    userInteracted.current = true;
    fetchSunsetData(cityInputRef.current.value.trim());
  };

  return (
    <form className="form" onSubmit={handleSubmit} aria-busy={loading}>
      <label className="label" htmlFor="city">Enter your city</label>
      <input className="input" id="city" type="text" name="city" ref={cityInputRef}
        placeholder="e.g. Tokyo, New York, Paris" aria-invalid={Boolean(error)}
        aria-describedby={error ? 'city-error' : undefined}
        onChange={() => { userInteracted.current = true; }} />
      <input className="input" type="submit" value={loading ? 'Searching…' : 'Get Sunset Clock'} />
      {loading && <p role="status">Loading sunset time…</p>}
      {error && <p id="city-error" role="alert" style={{ color: '#fff', background: '#702b16', padding: '12px', borderRadius: '8px' }}>{error}</p>}
    </form>
  );
};
GetCityForm.propTypes = {
  onSunsetTime: PropTypes.func.isRequired, onTimezone: PropTypes.func.isRequired,
  onName: PropTypes.func.isRequired, onCountry: PropTypes.func.isRequired,
};
export default GetCityForm;
