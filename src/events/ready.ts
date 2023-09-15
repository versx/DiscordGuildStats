import { Client } from 'discord.js';

import { color, startUpdate } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    console.log(color('text', `💪 Logged in as ${color('variable', client.user?.tag)}`));
    console.log(color('text', `Bot has started, with ${color('variable', client.users.cache.size)} users, in ${color('variable', client.channels.cache.size)} channels of ${color('variable', client.guilds.cache.size)} guilds.`));
    await startUpdate(client);
  },
};

export default event;