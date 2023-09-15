import { GuildMember } from 'discord.js';

import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberRemove',
  once: false,
  execute: async (member: GuildMember) => {
    console.log('User', member.user.username, 'left guild', member.guild.name);
    // TODO: Trigger stats update
  },
};

export default event;

// TODO: Invites
// TODO: Bans
// TODO: Events
// TODO: Threads
// TODO: Reactions