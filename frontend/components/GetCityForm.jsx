import axios from 'axios';
import SunsetClock from './SunsetClock';

const getSunsetTime = async (city) => {
  const searchParams = new URLSearchParams({ city: city }).toString();
  const customAxios = axios.create({
    baseURL: `http://localhost:3000/`,
  });
  try {
    const response = await customAxios.get(`/?${searchParams}`);
    const data = await response.data;
    console.log(data);
    return data.sunset;
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
    {
    }
  }
};

const GetCityForm = ({ onSunsetTime }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const city = e.target.city.value;
    const sunsetTime = await getSunsetTime(city);
    console.log(`Sunset Time: ${sunsetTime}`);

    onSunsetTime(sunsetTime);
  };

  return (
    <>
      <form className="form" action="submit" onSubmit={handleSubmit}>
        <label className="label" htmlFor="city">
          Enter your city
        </label>
        <input className="input" type="text" name="city" />
        <input className="input" type="submit" value="Get Sunset Clock" />
      </form>
    </>
  );
};

export let sunsetTime;
export default GetCityForm;
