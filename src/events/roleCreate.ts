import { Role } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'roleCreate',
  once: false,
  execute: async (role: Role) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${role.guild.name}] Role ${role.name} created.`);
    await updateGuilds(role.client);
  },
};

export default event;