import { Emoji } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'emojiCreate',
  once: false,
  execute: async (emoji: Emoji) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    //logDebug(`[${emoji.guild?.name}] Emoji ${emoji.name} created.`);
    logDebug(`[${emoji.id}] Emoji ${emoji.name} created.`);
    await updateGuilds(emoji.client);
  },
};

export default event;