import { Sticker } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'stickerCreate',
  once: false,
  execute: async (sticker: Sticker) => {
    logDebug(`[${sticker.guild?.name}] Sticker ${sticker.name} created.`);
    await updateGuilds(sticker.client, false);
  },
};

export default event;