import axios from "axios";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.weatherApiKey;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

export interface Location {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

/**
 * Search for locations by query string using OpenWeatherMap Geocoding API
 * @param query Search term (city name)
 * @param limit Maximum number of results (default: 5)
 * @returns Array of location results
 */
export const searchLocations = async (query: string, limit: number = 5): Promise<Location[]> => {
    try {
        const response = await axios.get(GEO_URL, {
            params: {
                q: query,
                limit: limit,
                appid: API_KEY
            }
        });

        return response.data.map((item: any) => ({
            name: item.name,
            lat: item.lat,
            lon: item.lon,
            country: item.country,
            state: item.state
        }));
    } catch (error) {
        console.error("Error searching locations:", error);
        return [];
    }
};

/**
 * Get location by coordinates
 * @param lat Latitude
 * @param lon Longitude
 * @returns Location information
 */
export const getLocationByCoords = async (lat: number, lon: number): Promise<Location | null> => {
    try {
        const response = await axios.get("https://api.openweathermap.org/geo/1.0/reverse", {
            params: {
                lat: lat,
                lon: lon,
                limit: 1,
                appid: API_KEY
            }
        });

        if (response.data && response.data.length > 0) {
            const item = response.data[0];
            return {
                name: item.name,
                lat: item.lat,
                lon: item.lon,
                country: item.country,
                state: item.state
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting location by coordinates:", error);
        return null;
    }
};