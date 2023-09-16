import { Invite } from 'discord.js';

import config from '../config.json';
import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'inviteCreate',
  once: false,
  execute: async (invite: Invite) => {
    if (config.updateIntervalM > 0) {
      return;
    }

    logDebug(`[${invite.guild?.name}] Invite ${invite.code} created.`);
    await updateGuilds(invite.client, false);
  },
};

export default event;