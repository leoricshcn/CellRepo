import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import type { ChatInputCommandInteraction } from 'discord.js';

export interface SlashCommand {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  handle: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
