import { GuildMember } from 'discord.js';

import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberAdd',
  once: false,
  execute: async (member: GuildMember) => {
    console.log('User', member.user.username, 'joined guild', member.guild.name);
    // TODO: Trigger stats update
  },
};

export default event;