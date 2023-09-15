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

export type GuildStatsConfig = {
  updateIntervalM: number;
  servers: {
    [guildId: Snowflake]: DiscordGuildConfig;
  };
};

export type DiscordGuildConfig = {
  name: string;
  memberCountChannelId: Snowflake;
  botCountChannelId: Snowflake;
  roleCountChannelId: Snowflake;
  channelCountChannelId: Snowflake;
  memberRoles: {
    [roleId: Snowflake]: DiscordMemberRolesConfig;
  };
  token: string;
  status?: string | null;

  category?: DiscordCategoryConfig;
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

export type StatType = 'members' | 'bots' | 'roles' | 'channels' | 'memberRoles';

export type ColorType = 'text' | 'variable' | 'error';