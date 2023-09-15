import { color } from '.';

export const log = (message: string) => {
  const date = new Date().toLocaleTimeString();
  console.log(`[${color('date', date)}] ${message}.`);
};

export const logDebug = (message: string) => {
  const date = new Date().toLocaleTimeString();
  console.debug(`[${color('date', date)}] ${message}.`);
};

export const logTrace = (message: string) => {
  const date = new Date().toLocaleTimeString();
  console.trace(`[${color('date', date)}] ${message}.`);
};

export const logWarn = (message: string) => {
  const date = new Date().toLocaleTimeString();
  console.warn(`[${color('date', date)}] ${message}.`);
};

export const logError = (message: string) => {
  const date = new Date().toLocaleTimeString();
  console.error(`[${color('date', date)}] ${message}.`);
};