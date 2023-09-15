import chalk from 'chalk';

import { ColorType } from '../types';

const themeColors = {
  text: '#ff8e4d',
  variable: '#ff624d',
  date: '#ffddee',
  error: '#f5426c',
};

export const color = (color: ColorType, message: any) => {
  return chalk.hex(themeColors[color])(message);
};

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