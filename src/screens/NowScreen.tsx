import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { fetchCurrentWeather } from '../api/weather';

const NowScreen = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const city = 'New York';

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await fetchCurrentWeather(city);
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  const currentDateTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Weather Card */}
      <View style={styles.weatherCard}>
        <Feather name="sun" size={60} color="#fff" />
        <Text style={styles.temperature}>{Math.round(weather.main.temp)}°</Text>
        <Text style={styles.city}>{weather.name}</Text>
        <Text style={styles.time}>{currentDateTime}</Text>
        <Text style={styles.feels}>
          Feels like: {Math.round(weather.main.feels_like)}°
        </Text>
      </View>

      {/* Detailed Observations */}
      <Text style={styles.sectionTitle}>Detailed Observations</Text>
      <View style={styles.grid}>
        <InfoCard icon="wind" label="Wind" value={`${weather.wind.speed} mph`} />
        <InfoCard icon="weather-sunny-alert" label="UV Index" value="6 (High)" />
        <InfoCard icon="weather-rainy" label="Precipitation" value="10%" />
        <InfoCard icon="thermometer" label="Humidity" value={`${weather.main.humidity}%`} />
        <InfoCard icon="weather-cloudy" label="Cloud Cover" value="40%" />
        <InfoCard icon="gauge" label="Pressure" value={`${weather.main.pressure} hPa`} />
      </View>
    </ScrollView>
  );
};

type InfoCardProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
};

const InfoCard = ({ icon, label, value }: InfoCardProps) => (
  <View style={styles.card}>
    <MaterialCommunityIcons name={icon} size={28} color="#007aff" />
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherCard: {
    backgroundColor: '#007aff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  temperature: {
    fontSize: 64,
    color: '#fff',
    fontWeight: 'bold',
  },
  city: {
    fontSize: 20,
    color: '#fff',
    marginTop: 8,
  },
  time: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  feels: {
    marginTop: 4,
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardLabel: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
});

export default NowScreen;
