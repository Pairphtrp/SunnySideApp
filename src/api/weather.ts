import axios from 'axios';
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.weatherApiKey;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchCurrentWeather = async (city: string) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      units: 'metric', // for Fahrenheit -"imperial" — change to metric if you want Celsius
      appid: API_KEY,
    },
  });
  return response.data;
};
