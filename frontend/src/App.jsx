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

      <div className="card">
        <GetCityForm
          onSunsetTime={handleSunsetTime}
          onTimezone={handleTimezone}
          onName={handleName}
          onCountry={handleCountry}
        />
      </div>

      <div className="card sunset-info">
        <SunsetClock
          sunsetTime={sunsetTime}
          timezone={timezone}
          name={name}
          country={country}
        />
      </div>

      <div className="card">
        <p>
          This is a simple clock that displays the sunset clock of a given city
          by considering sunset as midnight.
        </p>
        <p>
          Enter a city name in the input field and click the "Get Sunset Clock"
          button to see both the regular time and sunset-relative time.
        </p>
      </div>

      <small>
        <a target="_blank" href="https://icons8.com/icon/63250/clock">
          Clock
        </a>{' '}
        icon by{' '}
        <a target="_blank" href="https://icons8.com">
          Icons8
        </a>
      </small>
    </>
  );
}

export default App;
