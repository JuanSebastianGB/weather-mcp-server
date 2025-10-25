import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { SERVER_CONFIG } from "../config/constants.js";
import {
  handleGetAlerts,
  handleGetForecast,
  handleGetSunriseSunset,
} from "../handlers/tools.js";

/**
 * Creates and configures the MCP server with all available tools
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  // Register get_alerts tool
  server.tool(
    "get_alerts",
    "Get weather alerts for a state",
    {
      state: z
        .string()
        .length(2)
        .describe(
          "The two-letter state code to get alerts for (e.g. 'CA', NY)"
        ),
    },
    async ({ state }) => {
      return await handleGetAlerts(state);
    }
  );

  // Register get_forecast tool
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
      return await handleGetForecast(location);
    }
  );

  // Register get_sunrise_sunset tool
  server.tool(
    "get_sunrise_sunset",
    "Get sunrise and sunset times for a location",
    {
      location: z
        .string()
        .describe(
          "The location to get sunrise/sunset times for (e.g., 'California', 'Los Angeles', 'San Francisco, CA')"
        ),
    },
    async ({ location }) => {
      return await handleGetSunriseSunset(location);
    }
  );

  return server;
}

/**
 * Main function to start the server
 */
export async function startServer(): Promise<void> {
  try {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
  } catch (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
  }
}
