import axios from 'axios';
import Constants from 'expo-constants';
import { Location } from './location';

const API_KEY = Constants.expoConfig?.extra?.weatherApiKey;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  name: string;
  dt: number;
}

export interface HourlyForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    visibility: number;
    pop: number;
    dt_txt: string;
  }>;
  city: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
  };
}

/**
 * Fetch current weather by location
 * @param location Location object with coordinates
 * @param unit 'metric' for °C, 'imperial' for °F
 * @returns Weather data
 */
export const fetchCurrentWeather = async (
  location: Location,
  unit: 'metric' | 'imperial'
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: location.lat,
        lon: location.lon,
        units: unit,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

/**
 * Fetch hourly forecast for a location
 * @param location Location object with coordinates
 * @param unit 'metric' or 'imperial'
 * @returns Hourly forecast data
 */
export const fetchHourlyForecast = async (
  location: Location,
  unit: 'metric' | 'imperial'
): Promise<HourlyForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat: location.lat,
        lon: location.lon,
        units: unit,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hourly forecast:", error);
    throw error;
  }
};

/**
 * Fetch 10-day forecast for a location
 * Note: This requires the One Call API 3.0 (Pro key)
 * @param location Location object with coordinates
 * @param unit 'metric' or 'imperial'
 * @returns Daily forecast data
 */
export const fetchDailyForecast = async (
  location: Location,
  unit: 'metric' | 'imperial'
) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall`, {
      params: {
        lat: location.lat,
        lon: location.lon,
        exclude: 'current,minutely,hourly,alerts',
        units: unit,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily forecast:", error);
    throw error;
  }
};
