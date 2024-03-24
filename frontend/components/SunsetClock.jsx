import React, { useState, useEffect } from 'react';

const SunsetClock = ({ sunsetTime }) => {
  console.log(`prob sunsetTime: ${sunsetTime}`);
  const dateNow = Date.now();
  const timeToSunset = dateNow - sunsetTime;
  console.log(`timeToSunset ${timeToSunset}`);
  // const sunsetClock = new Date(timeToSunset * 1000);

  const [time, setTime] = useState(new Date());
  const [sunsetClock, setSunsetClock] = useState(new Date(timeToSunset * 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setSunsetClock(new Date(timeToSunset * 1000));
    }, 1000);
    return () => clearInterval(interval);
  });

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const sunsetHours = sunsetClock.getHours();
  const sunsetMinutes = sunsetClock.getMinutes();
  const sunsetSeconds = sunsetClock.getSeconds();

  return (
    <>
      <h1>Sunset Clock</h1>
      <h2>Normal Clock</h2>
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
