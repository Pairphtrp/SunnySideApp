import React, { useEffect, useState } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { WeatherData, fetchCurrentWeather } from '../api/weather';
import { Location } from '../api/location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles/theme';
import { useUnit } from '../context/UnitContext'; // ✅ import temperature unit context

// Define the param list for all screens
type RootTabParamList = {
  Now: { location: Location };
  Hourly: { location: Location };
  '10 Day': { location: Location };
  Maps: { location: Location };
};

// Create the proper navigation type
type NowScreenProps = BottomTabScreenProps<RootTabParamList, 'Now'>;

const NowScreen: React.FC<NowScreenProps> = ({ route }) => {
  const { location } = route.params;
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const { unit } = useUnit(); // ✅ access current unit setting from context
  const tempSymbol = unit === 'metric' ? '°C' : '°F'; // ✅ display correct unit symbol

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      setCurrentTime(timeString);
    };

    updateTime(); // set time initially
    const timeInterval = setInterval(updateTime, 60000); // update time every minute

    const getWeather = async () => {
      try {
        setLoading(true);
        const data = await fetchCurrentWeather(location, unit); // ✅ fetch weather using current unit
        setWeather(data);
        setError('');
      } catch (err) {
        setError('Failed to load weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      getWeather(); // ✅ get weather when component mounts or location/unit changes
    }

    return () => clearInterval(timeInterval); // cleanup interval
  },[location, unit]); // ✅ refetch when unit changes

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
        {/* Header section with location and main weather */}
        <View style={globalStyles.headerSection}>
          {/* Location and time row */}
          <View style={globalStyles.locationTimeRow}>
            <Text style={globalStyles.locationName}>{location.name}</Text>
            <Text style={globalStyles.currentTime}>{currentTime}</Text>
          </View>

          {weather && (
            <>
              {/* Main temperature */}
              <Text style={globalStyles.temperature}>{Math.round(weather.main.temp)}{tempSymbol}</Text>

              {/* Weather description */}
              <Text style={globalStyles.description}>{weather.weather[0].description}</Text>

              {/* Feels like temperature */}
              <Text style={globalStyles.feelsLike}>
                Feels like {Math.round(weather.main.feels_like)}{tempSymbol}
              </Text>

              {/* High and low temperatures */}
              <View style={globalStyles.highLowContainer}>
                <View style={globalStyles.highLowItem}>
                  <MaterialCommunityIcons name="arrow-up" size={18} color={colors.text.primary} />
                  <Text style={globalStyles.highLowText}>
                    {Math.round(weather.main.temp_max)}{tempSymbol}
                  </Text>
                </View>

                <View style={globalStyles.highLowItem}>
                  <MaterialCommunityIcons name="arrow-down" size={18} color={colors.text.primary} />
                  <Text style={globalStyles.highLowText}>
                    {Math.round(weather.main.temp_min)}{tempSymbol}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Detailed observations section */}
        {weather && (
          <View style={globalStyles.card}>
            <Text style={globalStyles.sectionTitle}>Detailed Observations</Text>

            <View style={globalStyles.detailBoxesContainer}>
              {/* Humidity */}
              <View style={globalStyles.detailBox}>
                <MaterialCommunityIcons name="water-percent" size={24} color={colors.primary} />
                <Text style={globalStyles.detailLabel}>Humidity</Text>
                <Text style={globalStyles.detailValue}>{weather.main.humidity}%</Text>
              </View>

              {/* Wind */}
              <View style={globalStyles.detailBox}>
                <MaterialCommunityIcons name="weather-windy" size={24} color={colors.primary} />
                <Text style={globalStyles.detailLabel}>Wind</Text>
                <Text style={globalStyles.detailValue}>{weather.wind.speed} m/s</Text>
              </View>

              {/* Pressure */}
              <View style={globalStyles.detailBox}>
                <MaterialCommunityIcons name="gauge" size={24} color={colors.primary} />
                <Text style={globalStyles.detailLabel}>Pressure</Text>
                <Text style={globalStyles.detailValue}>{weather.main.pressure} hPa</Text>
              </View>

              {/* Visibility */}
              <View style={globalStyles.detailBox}>
                <MaterialCommunityIcons name="eye" size={24} color={colors.primary} />
                <Text style={globalStyles.detailLabel}>Visibility</Text>
                <Text style={globalStyles.detailValue}>
                  {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default NowScreen;