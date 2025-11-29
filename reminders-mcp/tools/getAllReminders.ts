import {
  McpServer,
  type ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { RemindersOutputSchema, type TRemindersOutput } from "../schemas.js";

const apiKey = process.env.API_KEY;
const remindersAppBaseUrl =
  process.env.REMINDERS_APP_BASE_URL || "http://localhost:8080";

export function getAllRemindersTool(server: McpServer): void {
  const getHandler: ToolCallback<undefined> = async (_) => {
    try {
      const response = await fetch(`${remindersAppBaseUrl}/reminders/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey!,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorOutput: TRemindersOutput = {
          error: `Failed to fetch reminders. Status: ${response.status} ${response.statusText} - ${errorText}`,
        };

        return {
          isError: true,
          content: [{ type: "text", text: JSON.stringify(errorOutput) }],
          structuredContent: errorOutput,
        };
      }

      const data = await response.json();
      const output: TRemindersOutput = { result: data };
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during tool execution.";

      const errorOutput: TRemindersOutput = {
        error: `Tool execution failed. Reason: ${errorMessage}`,
      };

      return {
        isError: true,
        content: [{ type: "text", text: JSON.stringify(errorOutput) }],
        structuredContent: errorOutput,
      };
    }
  };

  server.registerTool(
    "reminders_get_all",
    {
      title: "Get all of the reminders",
      description: "Retrieve all reminders",
      outputSchema: RemindersOutputSchema,
    },
    getHandler
  );
}
