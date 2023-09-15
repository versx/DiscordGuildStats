import {
  Client,
  Guild,
  GuildMember,
  Snowflake,
} from 'discord.js';

import { color, dumpStatistics, getTime, isAlreadyUpdated, sleep } from '.';
import { lastUpdated } from '../data';
import { GuildStatsConfig, RoleStatistics } from '../types';
const config: GuildStatsConfig = require('../config.json');

const SleepBetweenGuilds = 5; // 5
const SleepBetweenChannels = 3; // 2

export const updateGuildStats = async (client: Client, reset: boolean) => {
  const guilds = client.guilds.cache.filter((guild) => !!config.servers[guild.id]);
  if (guilds.size === 0) {
    console.error(`[${client.user?.id}] Bot is not in any guilds, skipping...`);
    return;
  }

  for (const [guildId, guild] of guilds) {
    if (isAlreadyUpdated(guildId, config.updateIntervalM)) {
      //console.debug(`[${guildId}] Guild already updated within ${config.updateIntervalM} minutes, skipping...`);
      continue;
    }

    //const category = await getOrCreateCategory(guild, config.servers[guildId]);
    const guildConfig = config.servers[guildId];
    if (!guildConfig) {
      console.warn(`[${guildId}] Failed to get guild config.`);
      continue;
    }

    if (guildConfig?.status) {
      guild.client.user?.setActivity(guildConfig.status);
      //guild.client.user?.setPresence({
      //  status: 'online',
      //  afk: false,
      //  activities: [{
      //    name: 'TEST STATUS',
      //    url: 'https://www.twitch.tv/versx',
      //    type: ActivityType.Streaming,
      //  }],
      //});
    }

    // Fetch full list of members so bots are included
    //await guild.members.fetch();

    console.log(`${color('text', `Checking guild ${color('variable', guild.name)} for updates...`)}`);

    const members = await guild.members.fetch();
    const memberCount = reset ? 0 : guild.memberCount;
    //const botCount = reset ? 0 : guild.members.cache.filter(member => !!member.user.bot).size.toLocaleString();
    const botCount = reset ? 0 : members.filter(member => !!member.user.bot).size;
    const roleCount = reset ? 0 : guild.roles.cache.size;
    const channelCount = reset ? 0 : guild.channels.cache.size;

    // TODO: Voice Channels/Text Channels count
    await updateChannelName(guild, guildConfig.memberCountChannelId, `Members: ${memberCount.toLocaleString()}`);
    await updateChannelName(guild, guildConfig.botCountChannelId, `Bots: ${botCount.toLocaleString()}`);
    await updateChannelName(guild, guildConfig.roleCountChannelId, `Roles: ${roleCount.toLocaleString()}`);
    await updateChannelName(guild, guildConfig.channelCountChannelId, `Channels: ${channelCount.toLocaleString()}`);

    const roleStats = await getGuildMemberRoleCounts(guild, reset);
    const roleChannelIds = Object.keys(roleStats);
    for (const roleChannelId of roleChannelIds) {
      const roleStat = roleStats[roleChannelId];
      await updateChannelName(guild, roleChannelId, roleStat.name);
    }

    console.log(`${color('text', `Updated guild ${color('variable', guild.name)} channel names...`)}`);

    lastUpdated[guildId] = getTime();

    if (config.dumpStatistics) {
      // Dump guild statistics
      dumpStatistics(memberCount, botCount, roleCount, channelCount, roleStats);
    }

    // Wait 5 seconds between each guild update
    await sleep(SleepBetweenGuilds * 1000);
  }
};

export const updateChannelName = async (guild: Guild, channelId: Snowflake, newName: string) => {
  const channel = await guild.channels.fetch(channelId); //.cache.get(channelId);
  if (!channel) {
    console.warn(`[${channelId}] Failed to get channel.`);
    return;
  }

  if (channel.name === newName) {
    //console.debug(`[${channelId}] Channel name already set to '${newName}', skipping...`);
    return;
  }
  
  console.log(`[${new Date().toLocaleTimeString()}] [${guild.name}, ${channelId}] Channel name changed, updating from '${channel.name}' to '${newName}'.`);
  await channel.setName(newName, 'update channel name');

  // Wait three seconds between each channel update
  await sleep(SleepBetweenChannels * 1000);
};

export const getGuildMemberRoleCounts = async (guild: Guild, reset: boolean): Promise<RoleStatistics> => {
  const guildConfig = config.servers[guild.id];
  if (!guildConfig.memberRoles) {
    return {};
  }

  const roles: RoleStatistics = {};
  const memberRoles = guildConfig.memberRoles;
  for (const roleChannelId of Object.keys(memberRoles)) {
    await sleep(250);

    const channel = await guild.channels.fetch(roleChannelId);
    if (!channel) {
      console.warn(`[${roleChannelId}] Failed to get role channel.`);
      continue;
    }

    const { text, roleIds } = memberRoles[roleChannelId];
    const members = await guild.members.fetch();
    const count = reset ? 0 : members.filter((member) => hasRole(member, roleIds)).size;
    const newName = `${text}: ${count.toLocaleString()}`;
    roles[roleChannelId] = { name: newName, count, text };
    //await updateChannelName(guild, roleChannelId, newName);
  }
  return roles;
};

export const hasRole = (member: GuildMember, roleIds: Snowflake[]) => {
  const count = roleIds.filter((roleId) => member.roles.cache.has(roleId)).length;
  return count;
};

//export const getOrCreateCategory = async (guild: Guild, guildConfig: DiscordGuildConfig) => {
//  let category = guild.channels.cache.find((category) => category.type === ChannelType.GuildCategory && category.name === guildConfig.category.name);
//  console.log('category:', category);
//  if (!category) {
//    category = await guild.channels.create({
//      name: guildConfig.category?.name!,
//      type: ChannelType.GuildCategory,
//      //topic: '',
//      position: 1,
//      permissionOverwrites: [{
//        allow: ['ViewChannel'],
//        deny: ['Connect'],
//        id: guild.id,
//        type: OverwriteType.Role,
//      }],
//    });
//  }
//  return category;
//};