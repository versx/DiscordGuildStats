import { Client } from 'discord.js';

import { color, log, updateGuildStats } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    log(color('text', `💪 Logged in as ${color('variable', client.user?.tag)}`));
    log(color('text', `🤖 Bot has started, with ${color('variable', client.users.cache.size)} users, in ${color('variable', client.channels.cache.size)} channels of ${color('variable', client.guilds.cache.size)} guilds.`));
    await updateGuildStats(client, false);
  },
};

export default event;