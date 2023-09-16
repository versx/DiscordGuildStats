import { Invite } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'inviteDelete',
  once: false,
  execute: async (invite: Invite) => {
    logDebug(`[${invite.guild?.name}] Invite ${invite.code} deleted.`);
    await updateGuilds(invite.client, false);
  },
};

export default event;