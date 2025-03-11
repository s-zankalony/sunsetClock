import { useState } from 'react';
import './App.css';
import SunsetClock from '../components/SunsetClock';
import GetCityForm from '../components/GetCityForm';
import AdSense from '../components/AdSense';

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
    <div className="app">
      <h1 lang="ar" dir="rtl">
        الساعة الغروبية (الزوالية)
      </h1>
      <h1>Sunset Clock</h1>

      <div className="card">
        <GetCityForm
          onSunsetTime={handleSunsetTime}
          onTimezone={handleTimezone}
          onName={handleName}
          onCountry={handleCountry}
        />
      </div>

      <div className="cards-container">
        <div className="card sunset-info">
          <SunsetClock
            sunsetTime={sunsetTime}
            timezone={timezone}
            name={name}
            country={country}
          />
        </div>

        <div className="card description-card">
          <p lang="ar" dir="rtl">
            الساعة الغروبية أو الساعة الزوالية هي نظام لحساب الوقت باعتبار وقت
            المغرب هو منتصف الليل وكان يستخدم في المملكة العربية السعودية قديماً
            وهو يوافق الشريعة الإسلامية من حيث أن بداية اليوم التشريعية تبدأ من
            المغرب وليس من منتصف الليل.
          </p>
          <p lang="ar" dir="rtl">
            أدخل مدينتك لتتعرف على توقيت الساعة الغروبية في بلدك.
          </p>
          <p>
            The Ghurubi (Sunset) Clock or Zawali (Meridian) Clock is a
            timekeeping system that considers sunset as midnight. It was
            historically used in Saudi Arabia and aligns with Islamic law, as
            the religious day begins at sunset rather than at midnight.
          </p>
          <p>
            Enter your city to find out the Ghurubi Clock time in your location.
          </p>
        </div>
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

      <AdSense />
    </div>
  );
}

export default App;
