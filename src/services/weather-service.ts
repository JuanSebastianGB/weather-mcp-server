import { WEATHER_CONFIG } from "../config/constants.js";
import type {
  AlertsResponse,
  ForecastResponse,
  PointsResponse,
  SunriseSunsetResponse,
} from "../types/index.js";
import { geocodeLocation, makeNWSRequest } from "../utils/http-client.js";

/**
 * Gets weather alerts for a specific state
 * @param state - Two-letter state code
 * @returns Alerts data or null
 */
export async function getAlerts(state: string): Promise<AlertsResponse | null> {
  const stateCode = state.toUpperCase();
  const alertsUrl = `${WEATHER_CONFIG.nwsApiBase}/alerts?area=${stateCode}`;
  return await makeNWSRequest<AlertsResponse>(alertsUrl);
}

/**
 * Geocodes a location string to coordinates
 * @param location - The location string to geocode
 * @returns Coordinates or null
 */
export async function getCoordinates(location: string): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  const geocodeData = await geocodeLocation(location);

  if (!geocodeData || geocodeData.length === 0) {
    return null;
  }

  return {
    latitude: parseFloat(geocodeData[0].lat),
    longitude: parseFloat(geocodeData[0].lon),
  };
}

/**
 * Gets the forecast URL for a location
 * @param latitude - The latitude
 * @param longitude - The longitude
 * @returns Forecast URL or null
 */
export async function getForecastUrl(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const pointsUrl = `${WEATHER_CONFIG.nwsApiBase}/points/${latitude.toFixed(
    4
  )},${longitude.toFixed(4)}`;

  const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

  if (!pointsData || !pointsData.properties?.forecast) {
    return null;
  }

  return pointsData.properties.forecast;
}

/**
 * Gets the weather forecast for a location
 * @param forecastUrl - The forecast URL
 * @returns Forecast data or null
 */
export async function getForecast(
  forecastUrl: string
): Promise<ForecastResponse | null> {
  return await makeNWSRequest<ForecastResponse>(forecastUrl);
}

/**
 * Gets sunrise and sunset times for a location
 * Note: This is a simple calculation based on coordinates.
 * For more accurate results, consider using a dedicated astronomical calculation library.
 * @param latitude - The latitude
 * @param longitude - The longitude
 * @returns Sunrise/sunset data or null
 */
export async function getSunriseSunset(
  latitude: number,
  longitude: number
): Promise<SunriseSunsetResponse | null> {
  // Simple sunrise/sunset calculation (approximation)
  // Using a basic formula: sunrise/sunset times vary based on latitude and time of year

  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      1000 /
      60 /
      60 /
      24
  );

  // Approximate equation of time
  const approximateSunrise = 6.5 + (latitude / 15) * 0.5; // Hours from midnight
  const approximateSunset = 18.5 - (latitude / 15) * 0.5; // Hours from midnight

  // Format as ISO strings (using today's date)
  const sunriseTime = new Date(today);
  sunriseTime.setHours(Math.floor(approximateSunrise));
  sunriseTime.setMinutes(Math.round((approximateSunrise % 1) * 60));

  const sunsetTime = new Date(today);
  sunsetTime.setHours(Math.floor(approximateSunset));
  sunsetTime.setMinutes(Math.round((approximateSunset % 1) * 60));

  // Return mock structure compatible with the expected response
  return {
    properties: {
      sunrise: [sunriseTime.toISOString()],
      sunset: [sunsetTime.toISOString()],
      civilTwilightBegin: [sunriseTime.toISOString()],
      civilTwilightEnd: [sunsetTime.toISOString()],
      nauticalTwilightBegin: [sunriseTime.toISOString()],
      nauticalTwilightEnd: [sunsetTime.toISOString()],
      astronomicalTwilightBegin: [sunriseTime.toISOString()],
      astronomicalTwilightEnd: [sunsetTime.toISOString()],
    },
  };
}
