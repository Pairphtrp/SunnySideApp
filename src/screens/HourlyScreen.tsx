import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, FlatList, Image, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Location } from '../api/location';
import { fetchHourlyForecast } from '../api/weather';
import { globalStyles, colors } from '../styles/theme';

// The weather api we choose doesnt allow us to get an hourly forecast of the location. 
// We instead use the Api to get a forecast every 3 hours and display first 8 to get a 24 hour forecast.

// Define the param list for all screens - same as in NowScreen
type RootTabParamList = {
  Now: { location: Location };
  Hourly: { location: Location };
  '10 Day': { location: Location };
  Maps: { location: Location };
};

type HourlyScreenProps = BottomTabScreenProps<RootTabParamList, 'Hourly'>;

// Define the forecast item interface
interface ForecastItem {
  dt: number; // Unix timestamp
  dt_txt: string; // Date and time text
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number; // Probability of precipitation (0-1)
}

const HourlyScreen: React.FC<HourlyScreenProps> = ({ route }) => {
  const { location } = route.params;
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getHourlyForecast = async () => {
      try {
        setLoading(true);
        const data = await fetchHourlyForecast(location);

        // API returns forecast in 3-hour increments, for up to 5 days (40 entries)
        // We'll take the first 24 hours (8 entries)
        setForecast(data.list.slice(0, 8));
        setError('');
      } catch (err) {
        setError('Failed to load forecast data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      getHourlyForecast();
    }
  }, [location]);

  // Format the time from the API's timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for section headers
  const formatDate = (dateText: string): string => {
    const date = new Date(dateText);
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get the weather icon URL
  const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Group forecast items by day
  const groupByDay = (forecastItems: ForecastItem[]) => {
    const groups: { [day: string]: ForecastItem[] } = {};

    forecastItems.forEach(item => {
      const day = item.dt_txt.split(' ')[0]; // Get date part
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(item);
    });

    return Object.entries(groups);
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

  const groupedForecast = groupByDay(forecast);

  return (
    <ScrollView style={globalStyles.scrollView}>
      <View style={globalStyles.contentContainer}>
        {/* Location header */}
        <View style={styles.locationHeader}>
          <Text style={styles.locationName}>{location.name}</Text>
          <Text style={styles.forecastTitle}>3-Hour Forecast</Text>
        </View>

        {/* Show forecast by day */}
        {groupedForecast.map(([day, items]) => (
          <View key={day} style={globalStyles.card}>
            <Text style={globalStyles.sectionTitle}>
              {formatDate(day)}
            </Text>

            <FlatList
              data={items}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.dt.toString()}
              contentContainerStyle={styles.forecastList}
              renderItem={({ item }) => (
                <View style={styles.hourlyItem}>
                  {/* Time */}
                  <Text style={styles.timeText}>
                    {formatTime(item.dt)}
                  </Text>

                  {/* Temperature */}
                  <Text style={styles.tempText}>
                    {Math.round(item.main.temp)}°C
                  </Text>

                  {/* Weather icon */}
                  <Image
                    source={{ uri: getWeatherIconUrl(item.weather[0].icon) }}
                    style={styles.weatherIcon}
                  />

                  {/* Weather description */}
                  <Text style={styles.weatherDesc}>
                    {item.weather[0].description}
                  </Text>

                  {/* Precipitation chance */}
                  <View style={styles.precipRow}>
                    <MaterialCommunityIcons
                      name="water"
                      size={14}
                      color={colors.primary}
                    />
                    <Text style={styles.precipText}>
                      {Math.round(item.pop * 100)}%
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  locationHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  forecastTitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 5,
  },
  forecastList: {
    paddingVertical: 10,
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: colors.detailBox,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 90,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  tempText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherDesc: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
    textAlign: 'center',
    marginBottom: 8,
    height: 32, // Fixed height for multiline descriptions
  },
  precipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  precipText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  }
});

export default HourlyScreen;
