import { Guild, User } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildBanRemove',
  once: false,
  execute: async (guild: Guild, user: User) => {
    logDebug(`[${guild.name}] User ${user.username} unbanned.`);
    await updateGuilds(guild.client, false);
  },
};

export default event;