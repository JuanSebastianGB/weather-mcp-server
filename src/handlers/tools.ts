import {
  getAlerts,
  getCoordinates,
  getForecast,
  getForecastUrl,
  getSunriseSunset,
} from "../services/weather-service.js";
import { formatAlert, formatForecastPeriod } from "../utils/formatters.js";

/**
 * Handles the get_alerts tool request
 */
export async function handleGetAlerts(state: string) {
  const alertsData = await getAlerts(state);
  const stateCode = state.toUpperCase();

  if (!alertsData) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No weather alerts found for ${stateCode}.`,
        },
      ],
    };
  }

  const features = alertsData.features || [];

  if (features.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No weather alerts found for ${stateCode}.`,
        },
      ],
    };
  }

  const formattedAlerts = features.map(formatAlert);
  const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join(
    "\n"
  )}`;

  return {
    content: [
      {
        type: "text" as const,
        text: alertsText,
      },
    ],
  };
}

/**
 * Handles the get_forecast tool request
 */
export async function handleGetForecast(location: string) {
  // Geocode the location
  const coordinates = await getCoordinates(location);

  if (!coordinates) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Could not find location: ${location}. Please provide a more specific location (e.g., 'Los Angeles, CA' or 'San Francisco, California').`,
        },
      ],
    };
  }

  // Get forecast URL
  const forecastUrl = await getForecastUrl(
    coordinates.latitude,
    coordinates.longitude
  );

  if (!forecastUrl) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No weather forecast found for ${coordinates.latitude}, ${coordinates.longitude}. This location is not covered by the NWS forecast grid.`,
        },
      ],
    };
  }

  // Get forecast data
  const forecastData = await getForecast(forecastUrl);

  if (!forecastData) {
    return {
      content: [
        {
          type: "text" as const,
          text: "Failed to retrieve forecast data",
        },
      ],
    };
  }

  const periods = forecastData.properties.periods || [];

  if (periods.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: "No forecast periods available for this location.",
        },
      ],
    };
  }

  // Format forecast periods
  const formattedForecast = periods.map(formatForecastPeriod);

  const forecastText = `Forecast for ${coordinates.latitude}, ${
    coordinates.longitude
  }:\n\n${formattedForecast.join("\n")}`;

  return {
    content: [
      {
        type: "text" as const,
        text: forecastText,
      },
    ],
  };
}

/**
 * Handles the get_sunrise_sunset tool request
 */
export async function handleGetSunriseSunset(location: string) {
  // Geocode the location
  const coordinates = await getCoordinates(location);

  if (!coordinates) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Could not find location: ${location}. Please provide a more specific location (e.g., 'Los Angeles, CA' or 'San Francisco, California').`,
        },
      ],
    };
  }

  // Get sunrise/sunset data
  const sunriseSunsetData = await getSunriseSunset(
    coordinates.latitude,
    coordinates.longitude
  );

  if (!sunriseSunsetData || !sunriseSunsetData.properties) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No sunrise/sunset data available for ${location}.`,
        },
      ],
    };
  }

  const props = sunriseSunsetData.properties;
  const today = new Date().toISOString().split("T")[0];

  // Find today's sunrise and sunset times
  const sunriseToday =
    props.sunrise?.find((time) => time.startsWith(today)) || "Not available";
  const sunsetToday =
    props.sunset?.find((time) => time.startsWith(today)) || "Not available";

  const sunriseSunsetText = `Sunrise and Sunset Times for ${location}:\n\nToday (${today}):\nSunrise: ${sunriseToday}\nSunset: ${sunsetToday}`;

  return {
    content: [
      {
        type: "text" as const,
        text: sunriseSunsetText,
      },
    ],
  };
}
