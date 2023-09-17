import { GuildScheduledEvent } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildScheduledEventDelete',
  once: false,
  execute: async (guildScheduledEvent: GuildScheduledEvent) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${guildScheduledEvent.guild?.name}] Scheduled event ${guildScheduledEvent.name} deleted.`);
    await updateGuilds(guildScheduledEvent.client);
  },
};

export default event;