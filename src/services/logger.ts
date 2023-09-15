import { color } from '.';
import { DiscordGuildStatsConfig, LogLevel } from '../types';
const config: DiscordGuildStatsConfig = require('../config.json');

export const log = (message: string) => {
  if (!isLogLevel(config.logLevel, 'info')) {
    console.log('skipping log:', config.logLevel, 'info');
    return;
  }
  const date = new Date().toLocaleTimeString();
  console.log(`[${color('date', date)}] ${message}.`);
};

export const logDebug = (message: string) => {
  if (!isLogLevel(config.logLevel, 'debug')) {
    return;
  }
  const date = new Date().toLocaleTimeString();
  console.debug(`[${color('date', date)}] ${message}.`);
};

export const logTrace = (message: string) => {
  if (!isLogLevel(config.logLevel, 'trace')) {
    return;
  }
  const date = new Date().toLocaleTimeString();
  console.trace(`[${color('date', date)}] ${message}.`);
};

export const logWarn = (message: string) => {
  if (!isLogLevel(config.logLevel, 'warn')) {
    return;
  }
  const date = new Date().toLocaleTimeString();
  console.warn(`[${color('date', date)}] ${message}.`);
};

export const logError = (message: string) => {
  if (!isLogLevel(config.logLevel, 'error')) {
    return;
  }
  const date = new Date().toLocaleTimeString();
  console.error(`[${color('date', date)}] ${message}.`);
};

const isLogLevel = (desiredLogLevel: LogLevel, logLevel: LogLevel) => {
  const desiredPriority = getLogPriority(desiredLogLevel);
  const actualPriority = getLogPriority(logLevel);
  const result = desiredPriority <= actualPriority;
  return result;
};

const getLogPriority = (logLevel: LogLevel) => {
  switch (logLevel) {
    case 'trace': return 0;
    case 'debug': return 1;
    case 'info': return 2;
    case 'warn': return 3;
    case 'error': return 4;
    case 'none': return 5;
  }
};