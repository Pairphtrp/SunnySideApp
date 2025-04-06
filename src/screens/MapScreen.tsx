import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps'; // Remove PROVIDER_GOOGLE
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Location, getLocationByCoords } from '../api/location';
import { saveLocations, loadLocations, saveCurrentLocation } from '../utils/locationStorage';
import { fetchCurrentWeather, WeatherData } from '../api/weather';
import { globalStyles, colors } from '../styles/theme';
import { useUnit } from '../context/UnitContext'; // useUnit for °C/°F toggle

// Tab param types
type RootTabParamList = {
  Now: { location: Location };
  Hourly: { location: Location };
  '10 Day': { location: Location };
  Maps: { location: Location; addMode?: boolean };  // Added addMode optional parameter
};

type MapScreenProps = BottomTabScreenProps<RootTabParamList, 'Maps'>;

const MapScreen: React.FC<MapScreenProps> = ({ route, navigation }) => {
  const { location: currentLocation, addMode: initialAddMode } = route.params || { addMode: false };
  const [region, setRegion] = useState<Region>({
    latitude: currentLocation.lat,
    longitude: currentLocation.lon,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [markerCoords, setMarkerCoords] = useState({
    latitude: currentLocation.lat,
    longitude: currentLocation.lon,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [addMode, setAddMode] = useState(initialAddMode || false);
  const mapRef = useRef<MapView>(null);

  const { unit } = useUnit(); // get current temperature unit (metric or imperial)
  const tempSymbol = unit === 'metric' ? '°C' : '°F'; // used in UI for display

  // Load saved locations
  useEffect(() => {
    const getSavedLocations = async () => {
      const locations = await loadLocations();
      setSavedLocations(locations);
    };
    getSavedLocations();
  }, []);

  // Fetch weather for selected location AND current location
  useEffect(() => {
    const getWeatherForLocation = async () => {
      try {
        setLoadingWeather(true);
        const data = await fetchCurrentWeather(currentLocation, unit); // pass unit to weather API
        setWeatherData(data);
      } catch (err) {
        console.error('Error fetching weather:', err);
      } finally {
        setLoadingWeather(false);
      }
    };

    getWeatherForLocation();
  }, [currentLocation, unit]); // refetch when location or unit changes

  // handle map tap in Add Location mode
  const handleMapPress = async (event: any) => {
    if (!addMode) return;

    const { coordinate } = event.nativeEvent;
    setMarkerCoords(coordinate);

    try {
      setLoadingLocation(true);
      const location = await getLocationByCoords(coordinate.latitude, coordinate.longitude);
      if (location) {
        setSelectedLocation(location);
      }
    } catch (err) {
      console.error('Error getting location:', err);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Save the selected location and navigate to Now tab
  const saveNewLocation = async () => {
    if (!selectedLocation) return;

    const exists = savedLocations.some(
      loc => loc.lat === selectedLocation.lat && loc.lon === selectedLocation.lon
    );

    if (!exists) {
      const newLocations = [...savedLocations, selectedLocation];
      setSavedLocations(newLocations);
      await saveLocations(newLocations);
    }

    await saveCurrentLocation(selectedLocation);
    navigation.navigate('Now', { location: selectedLocation });
    setAddMode(false);
  };

  // Cancel add mode and reset map view
  const cancelAddLocation = () => {
    setAddMode(false);
    setSelectedLocation(null);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.lat,
        longitude: currentLocation.lon,
        latitudeDelta: 10,
        longitudeDelta: 10,
      }, 300);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        {/* Current location marker - simplified */}
        <Marker
          coordinate={{
            latitude: currentLocation.lat,
            longitude: currentLocation.lon,
          }}
          title={currentLocation.name}
          pinColor="red"
        />

        {/* Selected location marker - simplified */}
        {addMode && selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.lat,
              longitude: selectedLocation.lon,
            }}
            title={selectedLocation.name || 'Selected Location'}
            pinColor="blue"
          />
        )}

        {/* Saved locations - simplified */}
        {!addMode && savedLocations.map((loc) => (
          <Marker
            key={`${loc.lat}-${loc.lon}`}
            coordinate={{
              latitude: loc.lat,
              longitude: loc.lon,
            }}
            title={loc.name}
            description={`${loc.state ? `${loc.state}, ` : ''}${loc.country}`}
            pinColor={
              loc.lat === currentLocation.lat && loc.lon === currentLocation.lon ? 'red' : 'orange'
            }
          />
        ))}
      </MapView>

      {/* Add Location Mode UI */}
      {addMode && (
        <View style={styles.addLocationPanel}>
          <View style={styles.locationInfo}>
            {loadingLocation ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : selectedLocation ? (
              <>
                <Text style={styles.locationTitle}>{selectedLocation.name}</Text>
                <Text style={styles.locationSubtitle}>
                  {selectedLocation.state ? `${selectedLocation.state}, ` : ''}
                  {selectedLocation.country}
                </Text>
              </>
            ) : (
              <Text style={styles.locationTitle}>Tap the map to select a location</Text>
            )}
          </View>

          {selectedLocation && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { marginRight: 5 }]}
                onPress={saveNewLocation}
              >
                <Text style={styles.buttonText}>Save Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#999', marginLeft: 5 }]}
                onPress={cancelAddLocation}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Add Location button when not in add mode */}
      {!addMode && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddMode(true)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Location</Text>
        </TouchableOpacity>
      )}

      {/* Weather Info Panel - show temperature with correct unit */}
      {!addMode && weatherData && (
        <View style={styles.weatherPanel}>
          <Text style={styles.weatherTitle}>{currentLocation.name}</Text>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTemp}>{Math.round(weatherData.main.temp)}{tempSymbol}</Text>
            <Text style={{ marginLeft: 10 }}>{weatherData.weather[0].description}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  addLocationPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  locationInfo: { marginBottom: 16, alignItems: 'center' },
  locationTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text.primary },
  locationSubtitle: { fontSize: 14, color: colors.text.secondary },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  weatherPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  weatherTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  weatherInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  weatherTemp: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
});

export default MapScreen;