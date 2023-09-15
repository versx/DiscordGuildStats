import { GuildMember } from 'discord.js';

import { log } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberUpdate',
  once: false,
  execute: async (oldMember: GuildMember, newMember: GuildMember) => {
    log(`[${newMember.guild.name}] Member ${newMember.user.username} updated.`);
    // TODO: Trigger stats update
  },
};

export default event;