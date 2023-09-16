import { Emoji } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'emojiCreate',
  once: false,
  execute: async (emoji: Emoji) => {
    //logDebug(`[${emoji.guild?.name}] Emoji ${emoji.name} created.`);
    logDebug(`[${emoji.id}] Emoji ${emoji.name} created.`);
    await updateGuilds(emoji.client, false);
  },
};

export default event;