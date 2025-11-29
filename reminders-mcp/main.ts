import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tools/registerAllTools.js";

const server = new McpServer({
  name: "Reminders App",
  version: "1.0.0",
});

registerAllTools(server);

const transport = new StdioServerTransport();

await server.connect(transport);
