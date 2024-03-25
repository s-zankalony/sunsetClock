import React, { useState, useEffect } from 'react';

const SunsetClock = ({ sunsetTime, timezone, name, country }) => {
  const timezoneOffset = timezone / 3600;

  const [time, setTime] = useState(new Date());
  const [sunsetClock, setSunsetClock] = useState(new Date(sunsetTime * 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      // console.log(`time variable: ${time}`);
      setSunsetClock(new Date(sunsetTime * 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (sunsetTime === null || timezone === null) {
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

  return (
    <>
      <h1>
        {name}, {country}
      </h1>
      <h2>Regular Clock</h2>
      <h2 className="digital-clock">
        {hours} : {minutes} : {seconds}
      </h2>
      <hr />
      <h2>Sunset Clock</h2>
      <h2 className="digital-clock">
        {sunsetHours} : {sunsetMinutes} : {sunsetSeconds}
      </h2>
    </>
  );
};

export default SunsetClock;
