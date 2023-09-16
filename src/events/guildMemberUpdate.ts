import { GuildMember } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberUpdate',
  once: false,
  execute: async (oldMember: GuildMember, newMember: GuildMember) => {
    if (
      oldMember.user.username !== newMember.user.username ||
      oldMember.roles.cache.size !== newMember.roles.cache.size ||
      oldMember.permissions !== newMember.permissions) {
      logDebug(`[${newMember.guild.name}] Member ${newMember.user.username} updated.`);
      await updateGuilds(newMember.client, false);
    }
  },
};

export default event;