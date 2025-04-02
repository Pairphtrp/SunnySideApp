import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loadLocations, saveLocations, loadCurrentLocation, saveCurrentLocation } from './src/utils/locationStorage';

// Screens
import NowScreen from './src/screens/NowScreen';
import HourlyScreen from './src/screens/HourlyScreen';
import TenDayScreen from './src/screens/TenDayScreen';
import MapScreen from './src/screens/MapScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    const initializeLocations = async () => {
      // Load saved locations
      const storedLocations = await loadLocations();
      let current = await loadCurrentLocation();

      // If no saved locations, use a default
      if (storedLocations.length === 0) {
        const defaultLocation: Location = {
          name: 'Calgary',
          lat: 51.0447,
          lon: -114.0719,
          country: 'CA',
          state: 'Alberta'
        };
        setSavedLocations([defaultLocation]);
        setCurrentLocation(defaultLocation);
        await saveLocations([defaultLocation]);
        await saveCurrentLocation(defaultLocation);
      } else {
        setSavedLocations(storedLocations);
        setCurrentLocation(current || storedLocations[0]);
      }
    };

    initializeLocations();
  }, []);

  const addLocation = async (location: Location) => {
    if (!savedLocations.some(loc => loc.lat === location.lat && loc.lon === location.lon)) {
      const newLocations = [...savedLocations, location];
      setSavedLocations(newLocations);
      await saveLocations(newLocations);
    }
    setCurrentLocation(location);
    await saveCurrentLocation(location);
    setIsAddingLocation(false);
    setIsDropdownVisible(false);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007aff',
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: { paddingVertical: 8, height: 60 },
        }}
      >
        <Tab.Screen
          name="Now"
          component={NowScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="weather-sunny" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Hourly"
          component={HourlyScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="weather-partly-cloudy" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="10 Day"
          component={TenDayScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-range" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Maps"
          component={MapScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="map" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>

    </NavigationContainer>
  );
}
