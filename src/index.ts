import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { updateGuildStats } from './services';
import { GuildStatsConfig } from './types';

const config: GuildStatsConfig = require('./config.json');

const loadHandlers = (client: Client) => {
  const handlersDir = join(__dirname, './handlers');
  readdirSync(handlersDir).forEach((handler: string) => {
    if (!handler.endsWith('.js')) {
      return;
    }
    require(`${handlersDir}/${handler}`)(client);
  });
};

const { MessageContent, GuildBans, GuildEmojisAndStickers, GuildInvites, GuildMembers, GuildMessages, GuildPresences, Guilds, GuildScheduledEvents, GuildVoiceStates } = GatewayIntentBits;
const intents = [
  MessageContent,
  GuildBans,
  GuildEmojisAndStickers,
  GuildInvites,
  GuildMembers,
  GuildMessages,
  GuildPresences,
  Guilds,
  GuildScheduledEvents,
  GuildVoiceStates,
];

const client = new Client({intents});
client.cooldowns = new Collection<string, number>();
loadHandlers(client);
client.login(config.token);

setInterval(async () => await updateGuildStats(client, false), config.updateIntervalM * 60 * 1000);