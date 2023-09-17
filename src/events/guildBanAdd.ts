import { Guild, User } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildBanAdd',
  once: false,
  execute: async (guild: Guild, user: User) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${guild.name}] User ${user.username} banned.`);
    await updateGuilds(guild.client);
  },
};

export default event;