import { GuildScheduledEvent } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildScheduledEventCreate',
  once: false,
  execute: async (guildScheduledEvent: GuildScheduledEvent) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${guildScheduledEvent.guild?.name}] Scheduled event ${guildScheduledEvent.name} created.`);
    await updateGuilds(guildScheduledEvent.client, false);
  },
};

export default event;