import { Client } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { color } from '../services/utils';
import { BotEvent } from '../types';

module.exports = (client: Client) => {
  const eventsDir = join(__dirname, '../events');

  readdirSync(eventsDir).forEach(file => {
    if (!file.endsWith('.js')) {
      return;
    }
    const event: BotEvent = require(`${eventsDir}/${file}`).default;
    event.once
      ? client.once(event.name, (...args) => event.execute(...args))
      : client.on(event.name, (...args) => event.execute(...args));
    console.log(color('text', `🌠 Successfully loaded event ${color('variable', event.name)}`));
  });
};