import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getReminderTool } from "./getReminder.js";
import { getActiveRemindersTool } from "./getActiveReminders.js";
import { getAllRemindersTool } from "./getAllReminders.js";

export function registerAllTools(server: McpServer): void {
  getActiveRemindersTool(server);
  getAllRemindersTool(server);
  getReminderTool(server);
}
