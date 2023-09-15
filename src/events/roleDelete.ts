import { Role } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'roleDelete',
  once: false,
  execute: async (role: Role) => {
    logDebug(`[${role.guild.name}] Role ${role.name} deleted.`);
    await updateGuilds(role.client, false);
  },
};

export default event;