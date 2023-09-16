import chalk from 'chalk';
import { writeFile } from 'node:fs';
import { resolve } from 'node:path';

import { logDebug } from '.';
import { ColorType, DiscordGuildStatsConfig, DumpStats } from '../types';

const config: DiscordGuildStatsConfig = require('../config.json');
const DefaultHeader = '[Column,Value]\n';

export const color = (color: ColorType, message: any) => chalk.hex(config.logs.colors[color])(message);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getTime = () => Math.floor(Date.now() / 1000);

export const isAlreadyUpdated = (lastUpdate: number, interval: number = 15): boolean => {
  if (lastUpdate === 0) {
    return false;
  }
  const now = getTime();
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

export const dumpGuildStatistics = (fileName: string, stats: DumpStats) => {  
  const name = !fileName || fileName === ''
    ? formatDate(new Date()) + '.csv'
    : fileName; 
  const path = resolve(__dirname, `../../dumps/${name}`);

  let data = '';
  const guildIds = Object.keys(stats);
  for (const guildId of guildIds) {
    const guildStats = stats[guildId];
    const columns = Object.keys(guildStats);

    for (const column of columns) {
      const value = guildStats[column];
      data += `${column},${value}\n`;
    }

    data += '\n';
  }

  // Skip statistics dump if no data
  if (!data || data === '') {
    return;
  }

  writeFile(path, DefaultHeader + data, { encoding: 'utf-8' }, () => {
    logDebug(`Guild statistics dumped to ${path}`);
  });
};