import { GuildMember } from 'discord.js';

import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberUpdate',
  once: false,
  execute: async (oldMember: GuildMember, newMember: GuildMember) => {
    // console.log('User', member.user.username, 'left guild', member.guild.name);
    // TODO: Trigger stats update
  },
};

export default event;