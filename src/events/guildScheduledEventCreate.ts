import { GuildScheduledEvent } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildScheduledEventCreate',
  once: false,
  execute: async (guildScheduledEvent: GuildScheduledEvent) => {
    logDebug(`[${guildScheduledEvent.guild?.name}] Scheduled event ${guildScheduledEvent.name} created.`);
    await updateGuilds(guildScheduledEvent.client, false);
  },
};

export default event;