import {
  McpServer,
  type ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ReminderOutputSchema,
  UpdateReminderInputSchema,
  type TRemindersOutput,
  type TUpdateReminderInput,
} from "../schemas.js";

const apiKey = process.env.API_KEY;
const remindersAppBaseUrl =
  process.env.REMINDERS_APP_BASE_URL || "http://localhost:8080";

export function updateReminderTool(server: McpServer): void {
  const putHandler: ToolCallback<typeof UpdateReminderInputSchema> = async ({
    id,
    title,
    date,
    location,
    description,
    reminders,
    alerts,
    is_recurring,
    recurrence,
    start_date,
    end_date,
    is_active,
  }: TUpdateReminderInput) => {
    try {
      const response = await fetch(`${remindersAppBaseUrl}/reminders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey!,
        },
        body: JSON.stringify({
          title,
          date,
          location,
          description,
          reminders,
          alerts,
          is_recurring,
          recurrence,
          start_date,
          end_date,
          is_active,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorOutput: TRemindersOutput = {
          error: `Failed to update a reminder. Status: ${response.status} ${response.statusText} - ${errorText}`,
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
    "reminder_update",
    {
      title: "Update an existing reminder",
      description: "Update an existing reminder with the provided details",
      inputSchema: UpdateReminderInputSchema,
      outputSchema: ReminderOutputSchema,
    },
    putHandler
  );
}
