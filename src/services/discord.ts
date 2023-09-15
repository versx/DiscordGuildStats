import {
  Client,
  Guild,
  GuildMember,
  Snowflake,
} from 'discord.js';

import {
  color,
  dumpStatistics,
  getTime,
  isAlreadyUpdated,
  log, logDebug, logError, logWarn,
  sleep,
} from '.';
import { DiscordGuildConfig, DiscordGuildStatsConfig, RoleStatistics } from '../types';

const config: DiscordGuildStatsConfig = require('../config.json');
let lastUpdated: { [guildId: Snowflake]: number } = {};

export const updateGuilds = async (client: Client, reset: boolean) => {
  const guilds = client.guilds.cache.filter((guild) => !!config.servers[guild.id]);
  if (guilds.size === 0) {
    logError(`[${client.user?.id}] Bot is not in any guilds, skipping...`);
    return;
  }

  const guildIds = Object.keys(config.servers);
  for (const guildId of guildIds) {
    const guild = guilds.get(guildId);
    const guildConfig = config.servers[guildId];
    if (!guild) {
      console.warn(`[${guildConfig.name}] Failed to get guild with id: ${guildId}`);
      continue;
    }

    // Check if guild statistics have been updated recently
    if (isAlreadyUpdated(lastUpdated[guildId], config.updateIntervalM)) {
      //logDebug(`[${guild.name}] Guild already updated within ${config.updateIntervalM} minutes, skipping...`);
      continue;
    }

    log(`[${guild.name}] ${color('text', `Checking guild ${color('variable', guild.name)} for updates...`)}`);
    if (!reset) {
      // Fetch all Discord objects
      await guild.fetch();
      await guild.members.fetch();
      await guild.roles.fetch();
      await guild.channels.fetch();
      await guild.invites.fetch();
      await guild.bans.fetch();
      await guild.emojis.fetch();
      await guild.stickers.fetch();
      await guild.scheduledEvents.fetch();
    }

    //const category = await getOrCreateCategory(guild, config.servers[guildId].category?.name);
    if (await updateGuildStats(guild, guildConfig, reset)) {
      log(`[${guild.name}] ${color('text', `Updated guild ${color('variable', guild.name)} channel names...`)}`);

      // Set time of last update for guild
      lastUpdated[guildId] = getTime();

      // Wait 5 seconds between each guild update
      await sleep(config.sleepBetweenGuilds);
    }
  }
};

export const updateGuildStats = async (guild: Guild, guildConfig: DiscordGuildConfig, reset: boolean): Promise<boolean> => {
  const memberCount = reset ? 0 : guild.memberCount;
  const botCount = reset ? 0 : guild.members.cache.filter(member => !!member.user.bot).size;
  const roleCount = reset ? 0 : guild.roles.cache.size;
  const channelCount = reset ? 0 : guild.channels.cache.size;
  const inviteCount = reset ? 0 : guild.invites.cache.size;
  const banCount = reset ? 0 : guild.bans.cache.size;
  const scheduledEventCount = reset ? 0 : guild.scheduledEvents.cache.size;
  const reactionCount = reset ? 0 : guild.emojis.cache.filter(emoji => !emoji.managed).size;
  const stickerCount = reset ? 0 : guild.stickers.cache.size;

  // TODO: const textChannelCount = reset ? 0 : guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size;
  // TODO: const voiceChannelCount = reset ? 0 : guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size;

  let updated = false;
  if (guildConfig.memberCountChannelId) {
    if (await updateChannelName(guild, guildConfig.memberCountChannelId, `Members: ${memberCount.toLocaleString()}`)) {
      updated = true;
      await sleep(config.sleepBetweenChannels);
    }
  }
  if (guildConfig.botCountChannelId) {
    if (await updateChannelName(guild, guildConfig.botCountChannelId, `Bots: ${botCount.toLocaleString()}`)) {
      updated = true;
      await sleep(config.sleepBetweenChannels);
    }
  }
  if (guildConfig.roleCountChannelId) {
    if (await updateChannelName(guild, guildConfig.roleCountChannelId, `Roles: ${roleCount.toLocaleString()}`)) {
      updated = true;
      await sleep(config.sleepBetweenChannels);
    }
  }
  if (guildConfig.channelCountChannelId) {
    if (await updateChannelName(guild, guildConfig.channelCountChannelId, `Channels: ${channelCount.toLocaleString()}`)) {
      updated = true;
      await sleep(config.sleepBetweenChannels);
    }
  }
  if (guildConfig.inviteCountChannelId) {
    if (await updateChannelName(guild, guildConfig.inviteCountChannelId, `Invites: ${inviteCount.toLocaleString()}`)) {
      updated = true;
      await sleep(config.sleepBetweenChannels);
    }
  }
  if (guildConfig.banCountChannelId) {
    if (await updateChannelName(guild, guildConfig.banCountChannelId, `Bans: ${banCount.toLocaleString()}`)) {
      updated = true;
      await sleep(config.sleepBetweenChannels);
    }
  }
  if (guildConfig.eventCountChannelId) {
    if (await updateChannelName(guild, guildConfig.eventCountChannelId, `Scheduled Events: ${scheduledEventCount.toLocaleString()}`)) {
      updated = true;
      await sleep(config.sleepBetweenChannels);
    }
  }
  if (guildConfig.reactionCountChannelId) {
    if (await updateChannelName(guild, guildConfig.reactionCountChannelId, `Reactions: ${reactionCount.toLocaleString()}`)) {
      updated = true;
      await sleep(config.sleepBetweenChannels);
    }
  }
  if (guildConfig.stickerCountChannelId) {
    if (await updateChannelName(guild, guildConfig.stickerCountChannelId, `Stickers: ${stickerCount.toLocaleString()}`)) {
      updated = true;
      await sleep(config.sleepBetweenChannels);
    }
  }
  if (guildConfig.memberRoles) {
    await getGuildMemberRoleCounts(guild, reset);
    await sleep(config.sleepBetweenChannels);
  }
  
  const roleStats = await getGuildMemberRoleCounts(guild, reset);
  const roleChannelIds = Object.keys(roleStats);
  for (const roleChannelId of roleChannelIds) {
    const roleStat = roleStats[roleChannelId];
    await updateChannelName(guild, roleChannelId, roleStat.name);
  }

  if (config.dumpStatistics) {
    logDebug(`[${guild.name}] Dumping guild statistics...`);
    const stats = [memberCount, botCount, roleCount, channelCount];
    dumpStatistics(stats, roleStats);
  }

  return updated;
};

export const updateChannelName = async (guild: Guild, channelId: Snowflake, newName: string): Promise<boolean> => {
  const channel = guild.channels.cache.get(channelId);
  if (!channel) {
    logWarn(`[${guild.name}] [${channelId}] Failed to get channel.`);
    return false;
  }

  if (channel.name === newName) {
    //logDebug(`[${guild.name}, ${channelId}] Channel name already set to '${newName}', skipping...`);
    return false;
  }
  
  log(`[${guild.name}] [${channelId}] Channel name changed, updating from '${channel.name}' to '${newName}'.`);
  await channel.setName(newName, 'update channel name');
  return true;
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

    const channel = guild.channels.cache.get(roleChannelId);
    if (!channel) {
      logWarn(`[${guild.name}] [${roleChannelId}] Failed to get role channel.`);
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

//export const getOrCreateCategory = async (guild: Guild, categoryName: string) => {
//  let category = guild.channels.cache.find((category) => category.type === ChannelType.GuildCategory && category.name === guildConfig.category.name);
//  if (!category) {
//    category = await guild.channels.create({
//      name: categoryName,
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