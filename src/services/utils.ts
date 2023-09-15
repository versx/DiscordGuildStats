import chalk from 'chalk';
import { Snowflake } from 'discord.js';
import { appendFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { lastUpdated } from '../data';
import { ColorType, RoleStatistics } from '../types';

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

export const formatDate = (date: Date) => {
  // Get year, month, and day part from the date
  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', { month: '2-digit' });
  const day = date.toLocaleString('default', { day: '2-digit' });

  // Generate yyyy-mm-dd date string
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const dumpStatistics = (members: number, bots: number, roles: number, channels: number, assignedRoles: RoleStatistics) => {  
  const date = formatDate(new Date());
  const path = resolve(__dirname, `../../dumps/${date}.csv`);
  const roleChannelIds = Object.keys(assignedRoles);
  if (!existsSync(path)) {
    let header = '[Members,Bots,Roles,Channels';
    for (const roleChannelId of roleChannelIds) {
      const role = assignedRoles[roleChannelId];
      header += `,${role.text}`;
    }
    header += ']\n';
    writeFileSync(path, header, { encoding: 'utf-8' });
  }

  let data = `${members},${bots},${roles},${channels}`;
  for (const roleChannelId of roleChannelIds) {
    const role = assignedRoles[roleChannelId];
    data += `,${role.count}`;
  }
  data += '\n';
  appendFileSync(path, data, { encoding: 'utf-8' });
};