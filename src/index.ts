import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-mcp/1.0";

const server = new McpServer({
  name: "weather-mcp",
  version: "1.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function makeNWSRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
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
 *
 * @param feature - The alert feature to format
 * @returns - The formatted alert
 */
function formatAlert(feature: AlertFeature): string {
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

interface AlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
  };
}

interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

interface AlertsResponse {
  features: AlertFeature[];
}

interface PointsResponse {
  properties: {
    forecast?: string;
  };
}

interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}

server.tool(
  "get_alerts",
  "Get weather alerts for a state",
  {
    state: z
      .string()
      .length(2)
      .describe("The two-letter state code to get alerts for (e.g. 'CA', NY)"),
  },
  async ({ state }) => {
    const stateCode = state.toUpperCase();
    const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
    const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

    if (!alertsData) {
      return {
        content: [
          {
            type: "text",
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
            type: "text",
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
          type: "text",
          text: alertsText,
        },
      ],
    };
  }
);

server.tool(
  "get_forecast",
  "Get weather forecast for a location",
  {
    location: z
      .string()
      .describe(
        "The location to get a forecast for (e.g., 'California', 'Los Angeles', 'San Francisco, CA')"
      ),
  },
  async ({ location }) => {
    // Geocode the location to get coordinates
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json&limit=1`;

    let latitude: number;
    let longitude: number;

    try {
      const geocodeResponse = await fetch(geocodeUrl, {
        headers: { "User-Agent": USER_AGENT },
      });
      const geocodeData = (await geocodeResponse.json()) as Array<{
        lat: string;
        lon: string;
      }>;

      if (!geocodeData || geocodeData.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Could not find location: ${location}. Please provide a more specific location (e.g., 'Los Angeles, CA' or 'San Francisco, California').`,
            },
          ],
        };
      }

      latitude = parseFloat(geocodeData[0].lat);
      longitude = parseFloat(geocodeData[0].lon);
    } catch (error) {
      console.error("Error geocoding location:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error geocoding location: ${location}. Please try again or provide more specific coordinates.`,
          },
        ],
      };
    }

    // Get grid point data
    const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(
      4
    )},${longitude.toFixed(4)}`;
    const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

    if (!pointsData) {
      return {
        content: [
          {
            type: "text",
            text: `No weather forecast found for ${latitude}, ${longitude}. This location is not covered by the NWS forecast grid.`,
          },
        ],
      };
    }

    const forecastUrl = pointsData.properties?.forecast;

    if (!forecastUrl) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve forecast data for this location.`,
          },
        ],
      };
    }

    // Get forecast data
    const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
    if (!forecastData) {
      return {
        content: [
          {
            type: "text",
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
            type: "text",
            text: "No forecast periods available for this location.",
          },
        ],
      };
    }

    // Format forecast periods
    const formattedForecast = periods.map((period: ForecastPeriod) =>
      [
        `${period.name || "Unknown"}:`,
        `Temperature: ${period.temperature || "Unknown"}°${
          period.temperatureUnit || "F"
        }`,
        `Wind: ${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
        `${period.shortForecast || "No forecast available"}`,
        "---",
      ].join("\n")
    );

    const forecastText = `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join(
      "\n"
    )}`;

    return {
      content: [
        {
          type: "text",
          text: forecastText,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
