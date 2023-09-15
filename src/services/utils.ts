import chalk from 'chalk';
import { Snowflake } from 'discord.js';

import { lastUpdated } from '../data';
import { ColorType } from '../types';

const themeColors = {
  text: '#ff8e4d',
  variable: '#ff624d',
  error: '#f5426c',
};

export const color = (color: ColorType, message: any) => {
  return chalk.hex(themeColors[color])(message);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getTime = () => Math.floor(Date.now() / 1000);

export const isAlreadyUpdated = (guildId: Snowflake, interval: number = 15): boolean => {
  if (!lastUpdated[guildId]) {
    return false;
  }
  const now = getTime();
  const lastUpdate = lastUpdated[guildId];
  const delta = interval * 60
  const minsAgo = now - lastUpdate;
  const result = lastUpdate === 0 || minsAgo <= 0 || minsAgo <= delta;
  return result;
};