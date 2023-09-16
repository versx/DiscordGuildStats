import { GuildChannel } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'channelUpdate',
  once: false,
  execute: async (oldChannel: GuildChannel, newChannel: GuildChannel) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    if (
      oldChannel.members.size !== newChannel.members.size ||
      oldChannel.name !== newChannel.name ||
      oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
    logDebug(`[${newChannel.guild.name}] Channel ${newChannel.name} updated.`);
    await updateGuilds(newChannel.client, false);
  }
  },
};

export default event;