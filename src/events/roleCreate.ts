import { Role } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'roleCreate',
  once: false,
  execute: async (role: Role) => {
    logDebug(`[${role.guild.name}] Role ${role.name} created.`);
    await updateGuilds(role.client, false);
  },
};

export default event;