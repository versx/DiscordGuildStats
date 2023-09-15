import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { updateGuildStats } from './services';
import { GuildStatsConfig } from './types';

const config: GuildStatsConfig = require('./config.json');
const clients: Client[] = [];

const loadHandlers = (client: Client) => {
  const handlersDir = join(__dirname, './handlers');
  readdirSync(handlersDir).forEach((handler: string) => {
    if (!handler.endsWith('.js')) {
      return;
    }
    require(`${handlersDir}/${handler}`)(client);
  });
};

const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits;
const intents = [Guilds, MessageContent, GuildMessages, GuildMembers];

for (const guildId in config.servers) {
  const client = new Client({intents});
  client.cooldowns = new Collection<string, number>();

  loadHandlers(client);

  const guildConfig = config.servers[guildId];
  client.login(guildConfig.token);
  clients.push(client);
}

setInterval(async () => {
  for (const client of clients) {
    if (!client.isReady()) {
      continue;
    }
    await updateGuildStats(client, false);
  }
}, config.updateIntervalM * 60 * 1000);