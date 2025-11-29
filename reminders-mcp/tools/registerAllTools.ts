import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getReminderTool } from "./getReminder.js";
import { getActiveRemindersTool } from "./getActiveReminders.js";

export function registerAllTools(server: McpServer): void {
  getActiveRemindersTool(server);
  getReminderTool(server);
}
