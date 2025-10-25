# Weather MCP Server

A Model Context Protocol (MCP) server that provides weather forecasts and alerts using the U.S. National Weather Service (NWS) API. This server enables AI assistants to retrieve real-time weather information for locations within the United States.

## Features

- 🌦️ **Weather Forecasts**: Get detailed weather forecasts for any location in the US
- ⚠️ **Weather Alerts**: Retrieve active weather alerts and warnings for any state
- 🔍 **Location Geocoding**: Automatically geocode location names to coordinates
- 📊 **Structured Data**: Returns well-formatted, structured weather information

## Prerequisites

- **Node.js**: v20.x or higher
- **pnpm**: v10.19.0 or higher (as specified in package.json)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd weather-mcp
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the project:

```bash
pnpm build
```

## Usage

### Running as an MCP Server

This server is designed to be used with MCP-compatible clients (such as Claude Desktop). Configure your MCP client to use the compiled server:

```json
{
  "mcpServers": {
    "weather-mcp": {
      "command": "node",
      "args": ["path/to/weather-mcp/build/index.js"]
    }
  }
}
```

### Available Tools

#### 1. Get Forecast

Retrieves a weather forecast for a given location.

**Parameters:**

- `location` (string): The location to get a forecast for
  - Examples: "California", "Los Angeles, CA", "San Francisco"

**Returns:**

- Formatted forecast with temperature, wind, and conditions for each period

#### 2. Get Alerts

Retrieves active weather alerts for a specific state.

**Parameters:**

- `state` (string): Two-letter state code
  - Examples: "CA", "TX", "NY"

**Returns:**

- List of active weather alerts with details (severity, area, event type, etc.)

## Development

### Project Structure

```
weather-mcp/
├── src/
│   ├── index.ts              # Entry point
│   ├── server/               # Server configuration
│   │   └── index.ts          # MCP server setup
│   ├── handlers/             # Request handlers
│   │   └── tools.ts          # Tool handlers
│   ├── services/             # Business logic
│   │   └── weather-service.ts # Weather API services
│   ├── utils/                # Utility functions
│   │   ├── http-client.ts    # HTTP request utilities
│   │   └── formatters.ts     # Data formatting
│   ├── config/               # Configuration
│   │   └── constants.ts      # Constants and config
│   └── types/                # TypeScript types
│       └── index.ts          # Type definitions
├── build/                    # Compiled JavaScript output
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

### Build

Compile TypeScript to JavaScript:

```bash
pnpm build
```

### Development Workflow

1. Make changes to relevant files in the `src/` directory structure
2. Run `pnpm build` to compile
3. Test with your MCP client
4. Restart the MCP server to see changes

### Code Organization

The project follows a modular architecture:

- **`src/server/`**: MCP server configuration and setup
- **`src/handlers/`**: Request handlers for each tool
- **`src/services/`**: Business logic and API interactions
- **`src/utils/`**: Reusable utility functions
- **`src/config/`**: Configuration constants
- **`src/types/`**: TypeScript type definitions

This structure ensures:

- ✅ **Separation of concerns**: Each module has a single responsibility
- ✅ **Reusability**: Utilities and services can be easily reused
- ✅ **Testability**: Each module can be tested independently
- ✅ **Maintainability**: Changes are localized to specific modules

## Technical Details

### Dependencies

- **@modelcontextprotocol/sdk**: MCP SDK for building the server
- **zod**: Runtime type validation for tool parameters
- **TypeScript**: Type-safe development

### Data Sources

- **National Weather Service API**: Primary data source for forecasts and alerts
- **OpenStreetMap Nominatim**: Geocoding service for location resolution

### Architecture

The server implements the MCP (Model Context Protocol) specification:

- Uses Stdio server transport for communication
- Implements tool-based functionality
- Validates input parameters using Zod schemas
- Returns structured, formatted responses

## Limitations

- **Geographic Coverage**: Only covers locations within the United States and its territories
- **International Locations**: Cannot provide forecasts for locations outside US jurisdiction
- **API Rate Limits**: Subject to NWS API rate limiting (please use responsibly)

## Error Handling

The server handles various error conditions:

- Invalid locations (geocoding failures)
- API unavailability
- Invalid state codes
- Network errors

All errors are logged to stderr and return user-friendly error messages.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Maintain type safety with TypeScript
2. Follow existing code style
3. Add appropriate error handling
4. Update documentation for new features

## License

ISC

## Author

Created as an example MCP server implementation.

## Additional Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [National Weather Service API](https://www.weather.gov/documentation/services-web-api)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs)
