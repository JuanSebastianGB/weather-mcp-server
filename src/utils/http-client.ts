import { WEATHER_CONFIG } from "../config/constants.js";

/**
 * Makes an HTTP request to the NWS API
 * @param url - The URL to fetch
 * @returns The response data or null on error
 */
export async function makeNWSRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": WEATHER_CONFIG.userAgent,
    Accept: "application/geo+json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

/**
 * Makes an HTTP request to a geocoding service
 * @param location - The location to geocode
 * @returns The geocode results or null on error
 */
export async function geocodeLocation(
  location: string
): Promise<Array<{ lat: string; lon: string }> | null> {
  const url = `${WEATHER_CONFIG.geocodingService}/search?q=${encodeURIComponent(
    location
  )}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": WEATHER_CONFIG.userAgent },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as Array<{ lat: string; lon: string }>;
  } catch (error) {
    console.error("Error geocoding location:", error);
    return null;
  }
}

