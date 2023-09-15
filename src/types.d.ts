import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Collection,
  CommandInteraction,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
  Snowflake,
} from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>
    commands: Collection<string, Command>,
    cooldowns: Collection<string, number>,
  };
};

export interface BotEvent {
  name: string,
  once?: boolean | false,
  execute: (...args?) => void,
};

export type DiscordGuildStatsConfig = {
  dumpStatistics: {
    enabled: boolean;
    fileName: string;
  };
  servers: {
    [guildId: Snowflake]: DiscordGuildConfig;
  };
  sleepBetweenGuilds: number;
  sleepBetweenChannels: number;
  status?: string | null;
  token: string;
  updateIntervalM: number;
};

export type DiscordGuildConfig = {
  name?: string;
  memberCountChannelId: Snowflake | null;
  botCountChannelId: Snowflake | null;
  roleCountChannelId: Snowflake | null;
  channelCountChannelId: Snowflake | null;
  inviteCountChannelId: Snowflake | null;
  banCountChannelId: Snowflake | null;
  eventCountChannelId: Snowflake | null;
  reactionCountChannelId: Snowflake | null;
  stickerCountChannelId: Snowflake | null;
  memberRoles: {
    [roleId: Snowflake]: DiscordMemberRolesConfig;
  };
  //category?: DiscordCategoryConfig;
};

export type DiscordMemberRolesConfig = {
  text: string;
  roleIds: Snowflake[];
};

export type DiscordCategoryConfig = {
  name: string;
  stats: StatType[];
  displayIndex: number;
};

export type RoleStatistics = {
  [channelId: Snowflake]: RoleStatistic;
};

export type RoleStatistic = {
  text: string;
  name: string;
  count: number;
};

export type DumpStats = {
  [guildName: string]: {
    [column: string]: string | number;
  };
};

export type StatType = 'members' | 'bots' | 'roles' | 'channels' | 'memberRoles' | 'invites' | 'bans';

export type ColorType = 'text' | 'variable' | 'error' | 'date';