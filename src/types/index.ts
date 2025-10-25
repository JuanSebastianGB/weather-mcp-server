/**
 * Type definitions for the Weather MCP Server
 */

export interface AlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
  };
}

export interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

export interface GeocodeResult {
  lat: string;
  lon: string;
  display_name?: string;
}

export interface AlertsResponse {
  features: AlertFeature[];
}

export interface PointsResponse {
  properties: {
    forecast?: string;
    observation?: string;
  };
}

export interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}

export interface WeatherConfig {
  nwsApiBase: string;
  userAgent: string;
  geocodingService: string;
}

export interface SunriseSunsetResponse {
  properties: {
    sunrise: string[];
    sunset: string[];
    civilTwilightBegin: string[];
    civilTwilightEnd: string[];
    nauticalTwilightBegin: string[];
    nauticalTwilightEnd: string[];
    astronomicalTwilightBegin: string[];
    astronomicalTwilightEnd: string[];
  };
}
