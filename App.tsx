import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import NowScreen from './src/screens/NowScreen';
import HourlyScreen from './src/screens/HourlyScreen';
import TenDayScreen from './src/screens/TenDayScreen';
import MapScreen from './src/screens/MapScreen';

const Tab = createBottomTabNavigator();

export default function App() {
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
