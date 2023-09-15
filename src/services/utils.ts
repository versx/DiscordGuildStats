import chalk from 'chalk';

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