import { GuildChannel } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'channelCreate',
  once: false,
  execute: async (channel: GuildChannel) => {
    logDebug(`[${channel.guild.name}] Channel ${channel.name} created.`);
    await updateGuilds(channel.client, false);
  },
};

export default event;