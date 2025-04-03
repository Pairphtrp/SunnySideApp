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
    temp_min: number;  // Add this
    temp_max: number;  // Add this
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
  visibility: number;  // Add this
  name: string;
  dt: number;
}

// Add this interface to your weather.ts file

export interface HourlyForecastData {
  list: Array<{
    dt: number; // Unix timestamp
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
      all: number; // Cloud coverage percentage
    };
    wind: {
      speed: number;
      deg: number;
    };
    visibility: number;
    pop: number; // Probability of precipitation (0-1)
    dt_txt: string; // Date and time in text format
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
 * @returns Weather data
 */
export const fetchCurrentWeather = async (location: Location): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: location.lat,
        lon: location.lon,
        units: 'metric', // For Celsius (use 'imperial' for Fahrenheit)
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
 * @returns Hourly forecast data
 */
export const fetchHourlyForecast = async (location: Location): Promise<HourlyForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat: location.lat,
        lon: location.lon,
        units: 'metric',
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
 * @param location Location object with coordinates
 * @returns Daily forecast data
 */
export const fetchDailyForecast = async (location: Location) => {
  try {
    // Using OneCall API (requires subscription) or can use forecast and group by day
    const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall`, {
      params: {
        lat: location.lat,
        lon: location.lon,
        exclude: 'current,minutely,hourly,alerts',
        units: 'metric',
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching daily forecast:", error);
    throw error;
  }
};