import {
  McpServer,
  type ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  RemindersOutputSchema,
  type TRemindersOutput,
  CreateReminderInputSchema,
  type TCreateReminderInput,
  ReminderOutputSchema,
} from "../schemas.js";

const apiKey = process.env.API_KEY;
const remindersAppBaseUrl =
  process.env.REMINDERS_APP_BASE_URL || "http://localhost:8080";

export function createReminderTool(server: McpServer): void {
  const getHandler: ToolCallback<typeof CreateReminderInputSchema> = async ({
    title,
    date,
    reminders,
    alerts,
    is_recurring,
    description,
  }: TCreateReminderInput) => {
    try {
      const response = await fetch(`${remindersAppBaseUrl}/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey!,
        },
        body: JSON.stringify({
          title,
          date,
          reminders,
          alerts,
          is_recurring,
          description,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorOutput: TRemindersOutput = {
          error: `Failed to create a reminder. Status: ${response.status} ${response.statusText} - ${errorText}`,
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
    "reminder_create",
    {
      title: "Create a new reminder",
      description: "Create a new reminder with the provided details",
      inputSchema: CreateReminderInputSchema,
      outputSchema: ReminderOutputSchema,
    },
    getHandler
  );
}
