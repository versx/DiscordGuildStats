import { Sticker } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'stickerDelete',
  once: false,
  execute: async (sticker: Sticker) => {
    logDebug(`[${sticker.guild?.name}] Sticker ${sticker.name} deleted.`);
    await updateGuilds(sticker.client, false);
  },
};

export default event;