import { Client } from 'discord.js';

import config from '../config.json';
import { color, log, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    const user = client.user?.tag;
    const users = client.users.cache.size.toLocaleString();
    const guilds = client.guilds.cache.size.toLocaleString();
    const channels = client.channels.cache.size.toLocaleString();
    log(color('text', `💪 Logged in as ${color('variable', user)}`));
    log(color('text', `🤖 Bot has started, with ${color('variable', users)} users, in ${color('variable', channels)} channels of ${color('variable', guilds)} guilds.`));

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