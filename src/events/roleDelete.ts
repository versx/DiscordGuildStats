import { Role } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'roleDelete',
  once: false,
  execute: async (role: Role) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${role.guild.name}] Role ${role.name} deleted.`);
    await updateGuilds(role.client, false);
  },
};

export default event;