import { Client, Events, GatewayIntentBits, type Interaction } from 'discord.js';
import { commands } from './commands';
import { env } from './config/env';
import { logger } from './utils/logger';

const commandMap = new Map(commands.map((command) => [command.data.name, command]));

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
  logger.info({ user: readyClient.user.tag }, 'Bot is ready');
});

const handleInteraction = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = commandMap.get(interaction.commandName);

  if (!command) {
    logger.warn({ commandName: interaction.commandName }, 'Received unknown command');
    await interaction.reply({
      content: '无法识别的命令，请联系管理员。',
      ephemeral: true,
    });
    return;
  }

  try {
    await command.handle(interaction);
  } catch (error) {
    logger.error({ err: error, commandName: interaction.commandName }, 'Command execution failed');
    const replyPayload = {
      content: '命令执行失败，请稍后再试或联系管理员。',
      ephemeral: true,
    } as const;

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(replyPayload);
    } else {
      await interaction.reply(replyPayload);
    }
  }
};

client.on(Events.InteractionCreate, (interaction) => {
  void handleInteraction(interaction);
});

client.login(env.discordToken).catch((error: unknown) => {
  logger.error({ err: error }, 'Failed to login to Discord');
  process.exit(1);
});
