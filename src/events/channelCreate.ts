import { GuildChannel } from 'discord.js';

import { log } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'channelCreate',
  once: false,
  execute: async (channel: GuildChannel) => {
    log(`[${channel.guild.name}] Channel ${channel.name} created.`);
    // TODO: Trigger stats update
  },
};

export default event;