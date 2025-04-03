import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Location } from '../api/location';
import { fetchHourlyForecast } from '../api/weather';
import { globalStyles, colors } from '../styles/theme';

// Note: The free OpenWeatherMap API only provides a 5-day forecast
// We'll use the same API endpoint as the hourly forecast but process it differently

// Define the param list for all screens
type RootTabParamList = {
  Now: { location: Location };
  Hourly: { location: Location };
  '10 Day': { location: Location };
  Maps: { location: Location };
};

type TenDayScreenProps = BottomTabScreenProps<RootTabParamList, '10 Day'>;

// Define the forecast item interface
interface DailyForecast {
  date: Date;
  dayOfWeek: string;
  dateFormatted: string;
  highTemp: number;
  lowTemp: number;
  weatherIcon: string;
  description: string;
  precipitation: number;
}

// Add a proper interface for API forecast items
interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number; // Probability of precipitation
  dt_txt: string;
}

const TenDayScreen: React.FC<TenDayScreenProps> = ({ route }) => {
  const { location } = route.params;
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getDailyForecast = async () => {
      try {
        setLoading(true);
        const data = await fetchHourlyForecast(location);

        // Validate data structure
        if (!data || !data.list || !Array.isArray(data.list)) {
          console.error('Invalid API response format:', data);
          throw new Error('Invalid forecast data format');
        }

        // Process the 3-hour forecast data into daily forecasts
        const dailyForecasts = processDailyForecasts(data.list);
        setForecast(dailyForecasts);
        setError('');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Forecast error details:', errorMessage);
        setError('Failed to load forecast data');
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      getDailyForecast();
    }
  }, [location]);

  // Process the 3-hour forecast data into daily forecasts
  const processDailyForecasts = (forecastList: any[]): DailyForecast[] => {
    const dailyData: { [day: string]: ForecastItem[] } = {}; // Type this properly

    // Group forecasts by day
    forecastList.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0];

      if (!dailyData[day]) {
        dailyData[day] = [];
      }

      dailyData[day].push(item as ForecastItem);
    });

    // For each day, calculate high/low temps and choose midday forecast for other data
    return Object.entries(dailyData).map(([day, items]) => {
      // Use proper typing for temperature calculations
      const tempsMax = items.map((item: ForecastItem) => item.main.temp_max);
      const tempsMin = items.map((item: ForecastItem) => item.main.temp_min);

      const highTemp = Math.max(...tempsMax);
      const lowTemp = Math.min(...tempsMin);

      // Find forecast closest to noon for the day's "representative" forecast
      const noonForecast = items.reduce((closest, current) => {
        const date = new Date(current.dt * 1000);
        const hourDiff = Math.abs(12 - date.getHours());
        const closestDate = new Date(closest.dt * 1000);
        const closestHourDiff = Math.abs(12 - closestDate.getHours());

        return hourDiff < closestHourDiff ? current : closest;
      }, items[0]);

      // Rest of your function unchanged...
      const avgPrecipitation = items.reduce((sum, item) => sum + (item.pop || 0), 0) / items.length;
      const date = new Date(noonForecast.dt * 1000);

      return {
        date,
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        highTemp,
        lowTemp,
        weatherIcon: noonForecast.weather[0].icon,
        description: noonForecast.weather[0].description,
        precipitation: avgPrecipitation
      };
    });
  };

  // Get the weather icon URL
  const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (loading) {
    return (
      <View style={globalStyles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.loading}>
        <Text style={globalStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.scrollView}>
      <View style={globalStyles.contentContainer}>
        {/* Location header */}
        <View style={globalStyles.headerSection}>
          <Text style={globalStyles.locationName}>{location.name}</Text>
          <Text style={globalStyles.description}>5-Day Forecast</Text>
        </View>

        {/* Daily forecast list */}
        <View style={globalStyles.card}>
          {forecast.map((day, index) => (
            <View
              key={`${day.dateFormatted}-${index}`}  // Added index to make each key unique
              style={[
                globalStyles.listItem,
                index === forecast.length - 1 ? { borderBottomWidth: 0 } : {}
              ]}
            >
              {/* Day and date */}
              <View style={styles.dayContainer}>
                <Text style={styles.dayText}>{day.dayOfWeek}</Text>
                <Text style={styles.dateText}>{day.dateFormatted}</Text>
              </View>

              {/* Weather icon and precipitation */}
              <View style={styles.weatherContainer}>
                <Image
                  source={{ uri: getWeatherIconUrl(day.weatherIcon) }}
                  style={styles.weatherIcon}
                />
                <View style={styles.weatherTextContainer}>
                  <Text style={styles.weatherDesc} numberOfLines={2}>
                    {day.description}
                  </Text>
                  <View style={styles.precipRow}>
                    <MaterialCommunityIcons
                      name="water"
                      size={12}
                      color={colors.primary}
                    />
                    <Text style={styles.precipText}>
                      {Math.round(day.precipitation * 100)}%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Temperature range */}
              <View style={styles.tempContainer}>
                <View style={styles.tempRow}>
                  <MaterialCommunityIcons
                    name="arrow-up"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.highTempText}>
                    {Math.round(day.highTemp)}°
                  </Text>
                </View>
                <View style={styles.tempRow}>
                  <MaterialCommunityIcons
                    name="arrow-down"
                    size={16}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.lowTempText}>
                    {Math.round(day.lowTemp)}°
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  noteText: {
    color: colors.text.light,
    marginTop: 5,
    textAlign: 'center'
  },
  dayContainer: {
    flex: 2
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600'
  },
  dateText: {
    color: colors.text.secondary
  },
  weatherContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 40,
    height: 40
  },
  weatherTextContainer: {
    flex: 1,
    marginLeft: 4,
  },
  weatherDesc: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16, // Add this for better spacing between lines
    flexWrap: 'wrap', // Allow text to wrap
    // Remove maxWidth or increase it:
    // maxWidth: 100, // Increased from 80
  },
  precipRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  precipText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 2
  },
  tempContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  highTempText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 2
  },
  lowTempText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 2
  }
});

export default TenDayScreen;
