import { Role } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'roleUpdate',
  once: false,
  execute: async (oldRole: Role, newRole: Role) => {
    if (
      oldRole.members.size !== newRole.members.size ||
      oldRole.name !== newRole.name ||
      oldRole.permissions !== newRole.permissions) {
      logDebug(`[${newRole.guild.name}] Role ${newRole.name} updated.`);
      await updateGuilds(newRole.client, false);
    }
  },
};

export default event;