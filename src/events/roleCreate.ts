import { Role } from 'discord.js';

import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'roleCreate',
  once: false,
  execute: async (role: Role) => {
    console.log('Role', role.name, 'created for guild', role.guild.name);
    // TODO: Trigger stats update
  },
};

export default event;