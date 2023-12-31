import { Role } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'roleUpdate',
  once: false,
  execute: async (oldRole: Role, newRole: Role) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    if (
      oldRole.members.size !== newRole.members.size ||
      oldRole.name !== newRole.name ||
      oldRole.permissions !== newRole.permissions) {
      logDebug(`[${newRole.guild.name}] Role ${newRole.name} updated.`);
      await updateGuilds(newRole.client);
    }
  },
};

export default event;