import type { AlertFeature, ForecastPeriod } from "../types/index.js";

/**
 * Formats an alert feature into a readable string
 * @param feature - The alert feature to format
 * @returns The formatted alert string
 */
export function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `Event: ${props.event || "Unknown"}`,
    `Area: ${props.areaDesc || "Unknown"}`,
    `Severity: ${props.severity || "Unknown"}`,
    `Status: ${props.status || "Unknown"}`,
    `Headline: ${props.headline || "No headline"}`,
    "---",
  ].join("\n");
}

/**
 * Formats a forecast period into a readable string
 * @param period - The forecast period to format
 * @returns The formatted forecast string
 */
export function formatForecastPeriod(period: ForecastPeriod): string {
  return [
    `${period.name || "Unknown"}:`,
    `Temperature: ${period.temperature || "Unknown"}°${
      period.temperatureUnit || "F"
    }`,
    `Wind: ${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
    `${period.shortForecast || "No forecast available"}`,
    "---",
  ].join("\n");
}

