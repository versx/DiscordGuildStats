import { Guild, User } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildBanAdd',
  once: false,
  execute: async (guild: Guild, user: User) => {
    logDebug(`[${guild.name}] User ${user.username} banned.`);
    await updateGuilds(guild.client, false);
  },
};

export default event;