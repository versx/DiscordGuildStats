import { Role } from 'discord.js';

import { log } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'roleDelete',
  once: false,
  execute: async (role: Role) => {
    log(`[${role.guild.name}] Role ${role.name} deleted.`);
    // TODO: Trigger stats update
  },
};

export default event;