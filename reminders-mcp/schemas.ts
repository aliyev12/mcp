import { z } from "zod";

export const ContactSchema = z.object({
  mode: z
    .union([z.literal("email"), z.literal("sms")])
    .describe("Mode of contact"),
  address: z.string().describe("Contact address"),
});

export const ReminderSchema = z.object({
  id: z.number().optional().describe("Unique identifier of the reminder"),
  title: z.string().describe("Title of the reminder"),
  date: z.string().describe("Date of the reminder in ISO format"),
  location: z
    .nullable(z.any())
    .optional()
    .describe("Location of the reminder (can be a string, object, or null)"),
  description: z.string().describe("Description of the reminder"),
  reminders: z
    .array(ContactSchema)
    .describe("List of contact modes to use for the reminder"),
  alerts: z
    .array(z.number())
    .describe("List of alert times in milliseconds before the reminder"),
  is_recurring: z.boolean().describe("Indicates if the reminder is recurring"),
  recurrence: z
    .nullable(z.string().optional())
    .describe("Recurrence pattern of the reminder as a cron expression"),
  start_date: z
    .nullable(z.string().optional())
    .describe("Start date of the recurrence in ISO format"),
  end_date: z
    .nullable(z.string().optional())
    .describe("End date of the recurrence in ISO format"),
  last_alert_time: z
    .union([z.string(), z.null()])
    .optional()
    .describe(
      "The last time an alert was sent for the reminder in ISO 8601 format (e.g., 2025-11-28T14:00:00Z)"
    ),
  is_active: z
    .boolean()
    .optional()
    .describe("Indicates if the reminder is active"),
});

export type Reminder = z.infer<typeof ReminderSchema>;

export type Contact = z.infer<typeof ContactSchema>;
