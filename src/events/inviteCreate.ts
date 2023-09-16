import { Invite } from 'discord.js';

import { logDebug, updateGuilds } from '../services';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: 'inviteCreate',
  once: false,
  execute: async (invite: Invite) => {
    logDebug(`[${invite.guild?.name}] Invite ${invite.code} created.`);
    await updateGuilds(invite.client, false);
  },
};

export default event;