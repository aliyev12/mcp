import { z } from "zod";

const ReminderModeSchema = z.object({
  mode: z.string().describe("Mode of contact"),
  address: z.string().describe("Contact address"),
});

export const ReminderSchema = z.object({
  id: z.number().describe("Unique identifier of the reminder"),
  title: z.string().describe("Title of the reminder"),
  date: z.string().describe("Date of the reminder"),
  location: z.string().nullable().describe("Location of the reminder"),
  description: z.string().describe("Description of the reminder"),
  reminders: z
    .array(ReminderModeSchema)
    .describe("List of contact modes to use for the reminder"),
  alerts: z
    .array(z.number())
    .describe("List of alert times in milliseconds before the reminder"),
  is_recurring: z.boolean().describe("Indicates if the reminder is recurring"),
  recurrence: z
    .any()
    .nullable()
    .describe("Recurrence pattern of the reminder as a cron expression"),
  start_date: z
    .any()
    .nullable()
    .describe("Start date of the recurrence in ISO format"),
  end_date: z
    .any()
    .nullable()
    .describe("End date of the recurrence in ISO format"),
  last_alert_time: z.any().nullable().describe("Last alert time in ISO format"),
  is_active: z.boolean().describe("Indicates if the reminder is active"),
});

export const RemindersSchema = z
  .array(ReminderSchema)
  .describe("An array of reminder objects.");

export type TReminder = z.infer<typeof ReminderSchema>;

export type TReminderMode = z.infer<typeof ReminderModeSchema>;

// Output Schemas
export const RemindersOutputSchema = z
  .object({
    result: RemindersSchema.optional(),
    error: z.string().optional(),
  })
  .describe("An array of active reminder objects.");

export type TRemindersOutput = z.infer<typeof RemindersOutputSchema>;

export const ReminderOutputSchema = z
  .object({
    result: ReminderSchema.optional(),
    error: z.string().optional(),
  })
  .describe("An array of active reminder objects.");

export type TReminderOutput = z.infer<typeof ReminderOutputSchema>;
