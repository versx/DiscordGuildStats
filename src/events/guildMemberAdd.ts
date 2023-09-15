import { GuildMember } from 'discord.js';

import { log } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberAdd',
  once: false,
  execute: async (member: GuildMember) => {
    log(`[${member.guild.name}] Member ${member.user.username} joined.`);
    // TODO: Trigger stats update
  },
};

export default event;