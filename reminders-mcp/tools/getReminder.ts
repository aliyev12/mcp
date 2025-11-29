import {
  McpServer,
  type ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  type TReminder,
  type TReminderOutput,
  ReminderOutputSchema,
} from "../schemas.js";

const apiKey = process.env.API_KEY;
const remindersAppBaseUrl =
  process.env.REMINDERS_APP_BASE_URL || "http://localhost:8080";

export function getReminderTool(server: McpServer): void {
  const getHandler: ToolCallback<{ id: z.ZodString }> = async (args) => {
    try {
      const { id } = args;

      const response = await fetch(`${remindersAppBaseUrl}/reminders/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey!,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorOutput: TReminderOutput = {
          error: `Failed to fetch reminder. Status: ${response.status} ${response.statusText} - ${errorText}`,
        };

        return {
          isError: true,
          content: [{ type: "text", text: JSON.stringify(errorOutput) }],
          structuredContent: errorOutput,
        };
      }

      const data: TReminder = await response.json();
      const output: TReminderOutput = { result: data };
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during tool execution.";

      const errorOutput: TReminderOutput = {
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
    "reminder_get",
    {
      title: "Get one reminder by ID",
      description: "Retrieve a single reminder by its unique identifier",
      inputSchema: { id: z.string() },
      outputSchema: ReminderOutputSchema,
    },
    getHandler
  );
}
