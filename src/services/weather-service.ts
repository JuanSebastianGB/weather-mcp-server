import { WEATHER_CONFIG } from "../config/constants.js";
import type {
  AlertsResponse,
  ForecastResponse,
  PointsResponse,
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

