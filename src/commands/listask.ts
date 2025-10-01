import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { SlashCommand } from '../types/command';

export const listTaskCommand: SlashCommand = {
  data: new SlashCommandBuilder().setName('listask').setDescription('列出与你相关的任务').toJSON(),
  handle: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply({
      content: '任务列表功能正在开发中。',
      ephemeral: true,
    });
  },
};
