import {
  McpServer,
  type ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  DeleteReminderOutputSchema,
  type TDeleteReminderOutput,
} from "../schemas.js";

const apiKey = process.env.API_KEY;
const remindersAppBaseUrl =
  process.env.REMINDERS_APP_BASE_URL || "http://localhost:8080";

export function deleteReminderTool(server: McpServer): void {
  const deleteHandler: ToolCallback<{ id: z.ZodString }> = async (args) => {
    try {
      const { id } = args;

      const response = await fetch(`${remindersAppBaseUrl}/reminders/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey!,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorOutput: TDeleteReminderOutput = {
          status: "fail",
          error: `Failed to fetch reminder. Status: ${response.status} ${response.statusText} - ${errorText}`,
        };

        return {
          isError: true,
          content: [{ type: "text", text: JSON.stringify(errorOutput) }],
          structuredContent: errorOutput,
        };
      }

      const data: TDeleteReminderOutput = await response.json();
      const output: TDeleteReminderOutput = data;
      return {
        content: [{ type: "text", text: JSON.stringify(output) }],
        structuredContent: output,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during tool execution.";

      const errorOutput: TDeleteReminderOutput = {
        status: "fail",
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
    "reminder_delete",
    {
      title: "Delete one reminder using ID",
      description: "Delete a single reminder using its unique identifier",
      inputSchema: { id: z.string() },
      outputSchema: DeleteReminderOutputSchema,
    },
    deleteHandler
  );
}
