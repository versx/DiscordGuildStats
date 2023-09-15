import { GuildChannel } from 'discord.js';

import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'channelDelete',
  once: false,
  execute: async (channel: GuildChannel) => {
    console.log('Channel', channel.name, 'deleted for guild', channel.guild.name);
    // TODO: Trigger stats update
  },
};

export default event;