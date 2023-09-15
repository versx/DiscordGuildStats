import { GuildMember } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberRemove',
  once: false,
  execute: async (member: GuildMember) => {
    logDebug(`[${member.guild.name}] Member ${member.user.username} left.`);
    await updateGuilds(member.client, false);
  },
};

export default event;