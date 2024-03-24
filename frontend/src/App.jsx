import { useState } from 'react';
import './App.css';
import SunsetClock from '../components/SunsetClock';
import GetCityForm from '../components/GetCityForm';

function App() {
  const [sunsetTime, setSunsetTime] = useState(null);
  const handleSunsetTime = (time) => setSunsetTime(time);
  return (
    <>
      <GetCityForm onSunsetTime={handleSunsetTime} />
      <hr />
      <SunsetClock sunsetTime={sunsetTime} />
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
