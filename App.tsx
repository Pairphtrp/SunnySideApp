import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation, CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Location, searchLocations } from './src/api/location';
import { loadLocations, saveLocations, loadCurrentLocation, saveCurrentLocation } from './src/utils/locationStorage';
import { globalStyles, colors } from './src/styles/theme';
import { useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Screens
import NowScreen from './src/screens/NowScreen';
import HourlyScreen from './src/screens/HourlyScreen';
import TenDayScreen from './src/screens/TenDayScreen';
import MapScreen from './src/screens/MapScreen';

const Tab = createBottomTabNavigator<{
  Now: { location: Location };
  Hourly: { location: Location };
  '10 Day': { location: Location };
  Maps: { location: Location; addMode?: boolean };
}>();

// Define the RootParamList type
type RootParamList = {
  Now: { location: Location };
  Hourly: { location: Location };
  '10 Day': { location: Location };
  Maps: { location: Location; addMode?: boolean };
};

// Main app content component
function AppContent() {
  // Now we can use navigation hooks here safely
  const navigation = useNavigation<BottomTabNavigationProp<RootParamList>>();

  // Add state variables
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);

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

  useFocusEffect(
    React.useCallback(() => {
      const reloadLocations = async () => {
        const loaded = await loadLocations();
        setSavedLocations(loaded);

        // Also reload current location
        const current = await loadCurrentLocation();
        if (current) {
          setCurrentLocation(current);
        }
      };

      reloadLocations();
    }, [])
  );

  useEffect(() => {
    if (currentLocation && navigation) {
      navigation.setParams({ location: currentLocation } as any);
    }
  }, [currentLocation, navigation]);

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

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      const results = await searchLocations(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Location header with dropdown
  const LocationHeader = () => (
    <TouchableOpacity
      onPress={() => setIsDropdownVisible(true)}
      style={globalStyles.locationHeader}
    >
      <Text style={globalStyles.locationText}>
        {currentLocation?.name || 'Select Location'} ▼
      </Text>
    </TouchableOpacity>
  );

  if (!currentLocation) {
    return (
      <View style={globalStyles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Return the tab navigator and modals
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: { paddingVertical: 8, height: 60 },
          headerTitle: () => <LocationHeader />,
        }}
      >
        <Tab.Screen
          name="Now"
          component={NowScreen}
          initialParams={{ location: currentLocation }}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="weather-sunny" color={color} size={24} />
            ),
          }}
        />
        {/* Other tab screens remain the same */}
        <Tab.Screen
          name="Hourly"
          component={HourlyScreen}
          initialParams={{ location: currentLocation }}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="weather-partly-cloudy" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="10 Day"
          component={TenDayScreen}
          initialParams={{ location: currentLocation }}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-range" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Maps"
          component={MapScreen}
          initialParams={{ location: currentLocation }}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="map" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Location Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        {/* Modal content remains the same */}
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.modalTitle}>Your Locations</Text>

            <FlatList
              data={savedLocations}
              keyExtractor={(item) => `${item.lat}-${item.lon}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={globalStyles.listItem}
                  onPress={() => {
                    setCurrentLocation(item);
                    saveCurrentLocation(item).then(() => {
                      // Close the dropdown
                      setIsDropdownVisible(false);

                      // Use proper navigation state access
                      const state = navigation.getState();
                      const currentRoute = state.routes[state.index];
                      const currentScreen = currentRoute?.name || 'Now';

                      // Use the specific type for the current screen
                      if (currentScreen === 'Now') {
                        navigation.navigate('Now', { location: item });
                      } else if (currentScreen === 'Hourly') {
                        navigation.navigate('Hourly', { location: item });
                      } else if (currentScreen === '10 Day') {
                        navigation.navigate('10 Day', { location: item });
                      } else if (currentScreen === 'Maps') {
                        navigation.navigate('Maps', { location: item });
                      }
                    });
                  }}
                >
                  <Text style={globalStyles.subtitle}>{item.name}</Text>
                  <Text style={globalStyles.detailLabel}>
                    {item.state ? `${item.state}, ` : ''}{item.country}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={globalStyles.button}
              onPress={() => {
                setIsAddingLocation(true);
                setIsDropdownVisible(false);
              }}
            >
              <Text style={globalStyles.buttonText}>Search for City</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.button, { backgroundColor: colors.secondary }]}
              onPress={() => {
                setIsDropdownVisible(false);
                navigation.navigate('Maps', {
                  location: currentLocation!,  // Add non-null assertion
                  addMode: true
                });
              }}
            >
              <MaterialCommunityIcons name="map-marker-plus" size={16} color="white" style={{ marginRight: 6 }} />
              <Text style={globalStyles.buttonText}>Add from Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.button, { backgroundColor: 'transparent', marginTop: 10 }]}
              onPress={() => setIsDropdownVisible(false)}
            >
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Location Modal */}
      <Modal
        visible={isAddingLocation}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddingLocation(false)}
      >
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalContent}>
            {/* Modal content remains the same */}
            <Text style={globalStyles.modalTitle}>Search Location</Text>

            <TextInput
              style={globalStyles.input}
              placeholder="Search for a city"
              value={searchQuery}
              onChangeText={handleSearch}
            />

            <FlatList
              data={searchResults}
              keyExtractor={(item) => `${item.lat}-${item.lon}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={globalStyles.listItem}
                  onPress={() => addLocation(item)}
                >
                  <Text style={globalStyles.subtitle}>{item.name}</Text>
                  <Text style={globalStyles.detailLabel}>
                    {item.state ? `${item.state}, ` : ''}{item.country}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={globalStyles.button}
              onPress={() => {
                setIsAddingLocation(false);
                navigation.navigate('Maps', {
                  location: currentLocation!,  // Add non-null assertion
                  addMode: true
                });
              }}
            >
              <Text style={globalStyles.buttonText}>Add Location from Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.button, { backgroundColor: 'transparent' }]}
              onPress={() => setIsAddingLocation(false)}
            >
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

// Main App component that provides NavigationContainer
export default function App() {
  return (
    <NavigationContainer>
      <AppContent />
    </NavigationContainer>
  );
}
