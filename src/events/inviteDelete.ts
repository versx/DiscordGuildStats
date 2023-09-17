import { Invite } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'inviteDelete',
  once: false,
  execute: async (invite: Invite) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${invite.guild?.name}] Invite ${invite.code} deleted.`);
    await updateGuilds(invite.client);
  },
};

export default event;