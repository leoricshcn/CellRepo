import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { SlashCommand } from '../types/command';

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
    await interaction.reply({
      content: '任务创建功能正在开发中。',
      ephemeral: true,
    });
  },
};
