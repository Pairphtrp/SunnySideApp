import 'dotenv/config';

export default {
  expo: {
    name: 'WeatherApp',
    slug: 'weather-app',
    extra: {
      weatherApiKey: process.env.OPEN_WEATHER_API_KEY,
    },
  },
};
