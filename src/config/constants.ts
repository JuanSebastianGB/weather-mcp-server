import type { WeatherConfig } from "../types/index.js";

export const WEATHER_CONFIG: WeatherConfig = {
  nwsApiBase: "https://api.weather.gov",
  userAgent: "weather-mcp/1.0",
  geocodingService: "https://nominatim.openstreetmap.org",
};

export const SERVER_CONFIG = {
  name: "weather-mcp",
  version: "1.0",
};

