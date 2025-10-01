import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { DateTime } from 'luxon';
import { z } from 'zod';
import type { SlashCommand } from '../types/command';

const mentionRegex = /^<@!?\d+>$/;

const TaskCommandInputSchema = z.object({
  taskName: z
    .string({ required_error: '任务名称不能为空' })
    .trim()
    .min(1, '任务名称不能为空')
    .max(100, '任务名称不能超过 100 个字符'),
  dueDate: z
    .string({ required_error: '截止时间不能为空' })
    .trim()
    .min(1, '截止时间不能为空')
    .refine(
      (value) => DateTime.fromISO(value, { setZone: true }).isValid,
      '截止时间格式不正确，请使用 ISO 8601 格式，例如 2024-12-31 或 2024-12-31T18:00',
    ),
  assignees: z
    .string({ required_error: '请至少指定一个负责成员' })
    .trim()
    .min(1, '请至少指定一个负责成员')
    .transform((value) => value.split(/\s+/).filter(Boolean))
    .refine((list) => list.length > 0, '请至少指定一个负责成员')
    .refine(
      (list) => list.every((mention) => mentionRegex.test(mention)),
      '请使用 @ 提及合法的用户，例如 <@1234567890>',
    ),
});

export const taskCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('task')
    .setDescription('创建一个新的任务并指派成员')
    .addStringOption((option) =>
      option.setName('task_name').setDescription('任务名称').setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('due_date')
        .setDescription('任务截止时间，例如 2024-12-31 或 2024-12-31T18:00')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('assignees')
        .setDescription('使用 @ 提及的用户列表，多个用户以空格分隔')
        .setRequired(true),
    )
    .toJSON(),
  handle: async (interaction: ChatInputCommandInteraction) => {
    const rawInput = {
      taskName: interaction.options.getString('task_name', true),
      dueDate: interaction.options.getString('due_date', true),
      assignees: interaction.options.getString('assignees', true),
    };

    const parsed = TaskCommandInputSchema.safeParse(rawInput);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => `• ${issue.message}`)
        .join('\n');

      await interaction.reply({
        content: `参数校验失败：\n${errorMessage}`,
        ephemeral: true,
      });
      return;
    }

    const { taskName, dueDate, assignees } = parsed.data;

    await interaction.reply({
      content: `参数校验通过，任务创建功能开发中。\n任务名称：${taskName}\n截止时间：${dueDate}\n指派成员：${assignees.join(' ')}`,
      ephemeral: true,
    });
  },
};
