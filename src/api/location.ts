import axios from "axios";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.weatherApiKey;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export interface Location {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}