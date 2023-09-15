import { Client } from 'discord.js';

import config from '../config.json';
import { color, log, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    log(color('text', `💪 Logged in as ${color('variable', client.user?.tag)}`));
    log(color('text', `🤖 Bot has started, with ${color('variable', client.users.cache.size)} users, in ${color('variable', client.channels.cache.size)} channels of ${color('variable', client.guilds.cache.size)} guilds.`));

    if (config?.status) {
      client.user?.setActivity(config.status);
      //client.user?.setPresence({
      //  status: 'online',
      //  afk: false,
      //  activities: [{
      //    name: config.status,
      //    url: 'https://www.twitch.tv/versx',
      //    type: ActivityType.Streaming,
      //  }],
      //});
    }

    await updateGuilds(client, false);
  },
};

export default event;