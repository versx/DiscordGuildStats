import { GuildMember } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildMemberAdd',
  once: false,
  execute: async (member: GuildMember) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${member.guild.name}] Member ${member.user.username} joined.`);
    await updateGuilds(member.client);
  },
};

export default event;