import { Emoji } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'emojiDelete',
  once: false,
  execute: async (emoji: Emoji) => {
    //logDebug(`[${emoji.guild?.name}] Emoji ${emoji.name} created.`);
    logDebug(`[${emoji.id}] Emoji ${emoji.name} deleted.`);
    await updateGuilds(emoji.client, false);
  },
};

export default event;