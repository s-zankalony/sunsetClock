import { useState } from 'react';
import './App.css';
import SunsetClock from '../components/SunsetClock';
import GetCityForm from '../components/GetCityForm';

function App() {
  const [sunsetTime, setSunsetTime] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const handleSunsetTime = (time) => setSunsetTime(time);
  const handleTimezone = (timezone) => setTimezone(timezone);
  const handleName = (name) => setName(name);
  const handleCountry = (country) => setCountry(country);
  return (
    <>
      <h1>Sunset Clock</h1>
      <GetCityForm
        onSunsetTime={handleSunsetTime}
        onTimezone={handleTimezone}
        onName={handleName}
        onCountry={handleCountry}
      />
      <hr />
      <SunsetClock
        sunsetTime={sunsetTime}
        timezone={timezone}
        name={name}
        country={country}
      />
      <hr />

      <p>
        This is a simple clock that displays the sunset clock of a given city by
        considering sunset as midnight.
      </p>
      <p>
        Enter a city name in the input field and click the "Get Sunset Clock"
      </p>
    </>
  );
}

export default App;
