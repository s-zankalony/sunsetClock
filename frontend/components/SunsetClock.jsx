import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SunsetClock = ({ sunsetTime, timezone, name, country }) => {
  SunsetClock.propTypes = {
    sunsetTime: PropTypes.number,
    timezone: PropTypes.number,
    name: PropTypes.string,
    country: PropTypes.string,
  };

  const sanitizedTimezone = Number(timezone);
  if (isNaN(sanitizedTimezone)) {
    throw new Error('Invalid timezone');
  }
  const timezoneOffset = sanitizedTimezone / 3600;

  const [time, setTime] = useState(new Date());
  const [sunsetClock, setSunsetClock] = useState(new Date(sunsetTime * 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setSunsetClock(new Date(sunsetTime * 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sunsetTime]);

  if (
    sunsetTime === null ||
    sunsetTime === undefined ||
    timezone === null ||
    timezone === undefined
  ) {
    return <h1>Enter City to Begin...</h1>;
  }

  const hours =
    time.getUTCHours() + timezoneOffset >= 24
      ? time.getUTCHours() + timezoneOffset - 24
      : time.getUTCHours() + timezoneOffset;
  const minutes = time.getUTCMinutes();
  const seconds = time.getUTCSeconds();

  const sunsetTimeHours =
    sunsetClock.getUTCHours() + timezoneOffset >= 24
      ? sunsetClock.getUTCHours() + timezoneOffset - 24
      : sunsetClock.getUTCHours() + timezoneOffset;
  const sunsetTimeMinutes = sunsetClock.getUTCMinutes();
  const sunsetTimeSeconds = sunsetClock.getUTCSeconds();

  const sunsetHours =
    hours - sunsetTimeHours < 0
      ? hours - sunsetTimeHours + 24
      : hours - sunsetTimeHours;
  const sunsetMinutes =
    minutes - sunsetTimeMinutes < 0
      ? minutes - sunsetTimeMinutes + 60
      : minutes - sunsetTimeMinutes;
  const sunsetSeconds =
    seconds - sunsetTimeSeconds < 0
      ? seconds - sunsetTimeSeconds + 60
      : seconds - sunsetTimeSeconds;

  const sanitizedName = validateAndSanitize(name);

  const sanitizedCountry = validateAndSanitize(country);

  function validateAndSanitize(input) {
    if (typeof input !== 'string') {
      throw new Error('Invalid input type');
    }

    // Escaping special HTML characters to prevent XSS
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    const reg = /[&<>"'/]/gi;
    return input.replace(reg, (match) => map[match]);
  }

  return (
    <>
      <h2 className="city-info">
        {sanitizedName}, {sanitizedCountry}
      </h2>

      <div className="clock-container">
        <div className="clock-label">Regular Clock</div>
        <h2 className="digital-clock">
          {hours < 10 ? `0${hours}` : hours} :{' '}
          {minutes < 10 ? `0${minutes}` : minutes} :{' '}
          {seconds < 10 ? `0${seconds}` : seconds}
        </h2>
      </div>

      <div className="clock-container">
        <div className="clock-label">Sunset Clock</div>
        <h2 className="digital-clock">
          {sunsetHours < 10 ? `0${sunsetHours}` : sunsetHours} :{' '}
          {sunsetMinutes < 10 ? `0${sunsetMinutes}` : sunsetMinutes} :{' '}
          {sunsetSeconds < 10 ? `0${sunsetSeconds}` : sunsetSeconds}
        </h2>
      </div>
    </>
  );
};

export default SunsetClock;
