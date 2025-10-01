import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required'),
  DISCORD_PUBLIC_KEY: z.string().min(1, 'DISCORD_PUBLIC_KEY is required'),
  DISCORD_APPLICATION_ID: z.string().min(1, 'DISCORD_APPLICATION_ID is required'),
  TASKS_CHANNEL_ID: z.string().min(1, 'TASKS_CHANNEL_ID is required'),
  DEFAULT_TIMEZONE: z.string().default('UTC'),
  DEFAULT_DATE_FORMAT: z.string().default('yyyy-LL-dd HH:mm'),
  ALLOWED_TASK_ROLES: z.string().optional(),
  LOG_LEVEL: z.string().default('info'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map(({ path, message }) => {
    const key = path.length > 0 ? path.join('.') : '(root)';
    return `${key}: ${message}`;
  });
  throw new Error(`Invalid environment configuration:\n${issues.join('\n')}`);
}

export const env = {
  discordToken: parsed.data.DISCORD_TOKEN,
  discordPublicKey: parsed.data.DISCORD_PUBLIC_KEY,
  discordApplicationId: parsed.data.DISCORD_APPLICATION_ID,
  tasksChannelId: parsed.data.TASKS_CHANNEL_ID,
  defaultTimezone: parsed.data.DEFAULT_TIMEZONE,
  defaultDateFormat: parsed.data.DEFAULT_DATE_FORMAT,
  allowedTaskRoles: parsed.data.ALLOWED_TASK_ROLES
    ? parsed.data.ALLOWED_TASK_ROLES.split(',')
        .map((role) => role.trim())
        .filter(Boolean)
    : [],
  logLevel: parsed.data.LOG_LEVEL,
};
