import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import config from './config.json';
import { color, isPlural, log, updateGuilds } from './services';

const loadHandlers = (client: Client) => {
  const handlersDir = join(__dirname, './handlers');
  readdirSync(handlersDir).forEach((handler: string) => {
    if (!handler.endsWith('.js')) {
      return;
    }
    require(`${handlersDir}/${handler}`)(client);
  });
};

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.cooldowns = new Collection<string, number>();
loadHandlers(client);
client.login(config.token);

if (config.updateIntervalM > 0) {
  log(color('text', `Update interval specified to check every ${color('variable', config.updateIntervalM)} minute${isPlural(config.updateIntervalM)} for Discord guild changes...`));
  setInterval(async () => await updateGuilds(client), config.updateIntervalM * 60 * 1000);
} else {
  log(color('text', `Update interval not specified, defaulting to Discord events to check for Discord guild changes...`));
}