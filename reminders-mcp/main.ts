import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";
import { Reminder, ReminderSchema } from "./schemas.ts";

const server = new McpServer({
  name: "Reminders App",
  version: "1.0.0",
});

server.registerTool(
  "reminders",
  {
    title: "Reminders App",
    description: "Create and update reminders",
    inputSchema: { id: z.string() },
    outputSchema: ReminderSchema,
  },
  async ({ id }) => {
    const response = await fetch(`http://localhost:8080/reminders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "SECRET_KEY",
      },
    });
    const data: Reminder = await response.json();
    const output = data;
    return {
      content: [{ type: "text", text: JSON.stringify(output) }],
      structuredContent: output,
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
