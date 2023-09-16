import { GuildScheduledEvent } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'guildScheduledEventDelete',
  once: false,
  execute: async (guildScheduledEvent: GuildScheduledEvent) => {
    logDebug(`[${guildScheduledEvent.guild?.name}] Scheduled event ${guildScheduledEvent.name} deleted.`);
    await updateGuilds(guildScheduledEvent.client, false);
  },
};

export default event;