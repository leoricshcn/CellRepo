import { REST, Routes } from 'discord.js';
import { commands } from '../commands';
import { env } from '../config/env';

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(env.discordToken);

  try {
    console.log('Registering application commands...');
    await rest.put(Routes.applicationCommands(env.discordApplicationId), {
      body: commands.map((command) => command.data),
    });
    console.log('✅ Successfully registered application commands');
  } catch (error) {
    console.error('❌ Failed to register application commands', error);
    process.exitCode = 1;
  }
}

void registerCommands();
