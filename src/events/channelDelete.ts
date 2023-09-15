import { GuildChannel } from 'discord.js';

import { log } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'channelDelete',
  once: false,
  execute: async (channel: GuildChannel) => {
    log(`[${channel.guild.name}] Channel ${channel.name} deleted.`);
    // TODO: Trigger stats update
  },
};

export default event;