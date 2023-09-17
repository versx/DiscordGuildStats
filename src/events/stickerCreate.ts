import { Sticker } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'stickerCreate',
  once: false,
  execute: async (sticker: Sticker) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${sticker.guild?.name}] Sticker ${sticker.name} created.`);
    await updateGuilds(sticker.client);
  },
};

export default event;