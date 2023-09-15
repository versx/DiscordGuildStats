import { Role } from 'discord.js';

import { log } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'roleCreate',
  once: false,
  execute: async (role: Role) => {
    log(`[${role.guild.name}] Role ${role.name} created.`);
    // TODO: Trigger stats update
  },
};

export default event;