import AsyncStorage from '@react-native-async-storage/async-storage';  /* npm install @react-native-async-storage/async-storage */
import { Location } from '../api/location';

const LOCATIONS_STORAGE_KEY = 'saved_weather_locations';
const CURRENT_LOCATION_KEY = 'current_weather_location';

/**
 * Save a list of locations to AsyncStorage
 */
export const saveLocations = async (locations: Location[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(locations));
    } catch (error) {
        console.error('Error saving locations:', error);
    }
};

/**
 * Load saved locations from AsyncStorage
 */
export const loadLocations = async (): Promise<Location[]> => {
    try {
        const locationsJson = await AsyncStorage.getItem(LOCATIONS_STORAGE_KEY);
        return locationsJson ? JSON.parse(locationsJson) : [];
    } catch (error) {
        console.error('Error loading locations:', error);
        return [];
    }
};

/**
 * Save current location to AsyncStorage
 */
export const saveCurrentLocation = async (location: Location): Promise<void> => {
    try {
        await AsyncStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(location));
    } catch (error) {
        console.error('Error saving current location:', error);
    }
};

/**
 * Load current location from AsyncStorage
 */
export const loadCurrentLocation = async (): Promise<Location | null> => {
    try {
        const locationJson = await AsyncStorage.getItem(CURRENT_LOCATION_KEY);
        return locationJson ? JSON.parse(locationJson) : null;
    } catch (error) {
        console.error('Error loading current location:', error);
        return null;
    }
};