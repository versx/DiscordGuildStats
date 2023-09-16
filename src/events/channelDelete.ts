import { GuildChannel } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'channelDelete',
  once: false,
  execute: async (channel: GuildChannel) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${channel.guild.name}] Channel ${channel.name} deleted.`);
    await updateGuilds(channel.client, false);
  },
};

export default event;