import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getReminderTool } from "./getReminder.js";
import { getActiveRemindersTool } from "./getActiveReminders.js";
import { getAllRemindersTool } from "./getAllReminders.js";
import { createReminderTool } from "./createReminder.js";
import { updateReminderTool } from "./updateReminder.js";
import { deleteReminderTool } from "./deleteReminder.js";

export function registerAllTools(server: McpServer): void {
  getActiveRemindersTool(server);
  getAllRemindersTool(server);
  createReminderTool(server);
  getReminderTool(server);
  updateReminderTool(server);
  deleteReminderTool(server);
}
