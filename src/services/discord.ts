import {
  Client,
  Guild,
  GuildMember,
  Snowflake,
} from 'discord.js';

import {
  color,
  dumpGuildStatistics,
  formatDate,
  getTime, getTimeRemaining,
  isAlreadyUpdated,
  isPlural,
  log, logDebug, logError, logWarn,
  sleep,
} from '.';
import locales from '../locales.json';
import {
  DiscordGuildStatsConfig,
  DumpStats,
  GuildDumpStats,
  GuildStatistics,
  LastUpdateCache,
  RoleStatistics,
} from '../types';

const GuildChangesRateLimitM = 15;
const ChannelChangesRateLimitM = 10;

const config: DiscordGuildStatsConfig = require('../config.json');
const guildLastUpdate: LastUpdateCache = {};
const channelLastUpdate: LastUpdateCache = {};

/**
 * 
 * @param guild 
 * @param counts 
 * @returns 
 */
export const buildStatistics = async (guild: Guild, counts: GuildStatistics): Promise<GuildDumpStats> => {
  const stats: GuildDumpStats = {
    Date: formatDate(new Date()),
    Guild: guild.name,
  };

  if (config.dumpStatistics.data.includes('members')) {
    stats[locales.Members] = counts.members;
  }
  if (config.dumpStatistics.data.includes('bots')) {
    stats[locales.Bots] = counts.bots;
  }
  if (config.dumpStatistics.data.includes('roles')) {
    stats[locales.Roles] = counts.roles;
  }
  if (config.dumpStatistics.data.includes('channels')) {
    stats[locales.Channels] = counts.channels;
  }
  if (config.dumpStatistics.data.includes('invites')) {
    stats[locales.Invites] = counts.invites;
  }
  if (config.dumpStatistics.data.includes('bans')) {
    stats[locales.Bans] = counts.bans;
  }
  if (config.dumpStatistics.data.includes('reactions')) {
    stats[locales.Reactions] = counts.reactions;
  }
  if (config.dumpStatistics.data.includes('stickers')) {
    stats[locales.Stickers] = counts.stickers;
  }
  if (config.dumpStatistics.data.includes('scheduledEvents')) {
    stats[locales.ScheduledEvents] = counts.scheduledEvents;
  }

  if (config.dumpStatistics.data.includes('memberRoles')) {
    const roleStats = await getGuildMemberRoleCounts(guild);
    for (const roleChannelId in roleStats) {
      const roleStat = roleStats[roleChannelId];
      stats[roleStat.text] = roleStat.count;
    }
  }

  return stats;
};

/**
 * 
 * @param client 
 */
export const updateGuilds = async (client: Client): Promise<void> => {
  // Filter list of Discord guilds by those that are configured
  const guilds = client.guilds.cache.filter((guild) => !!config.servers[guild.id]);
  if (guilds.size === 0) {
    logError(`[${color('variable', client.user?.id)}] Bot is not in any configured guilds, exiting...`);
    process.exit(-1);
  }

  log(`${color('text', `Starting sequence to check ${guilds.size.toLocaleString()} guild${isPlural(guilds.size)} for changes...`)}`);

  const stats: DumpStats = {};
  const guildIds = Object.keys(config.servers);
  for (const guildId of guildIds) {
    const guild = guilds.get(guildId);
    if (!guild) {
      logWarn(`[${color('variable', config.servers[guildId].name)}] Failed to get guild with id: ${color('variable', guildId)}`);
      continue;
    }

    const logPrefix = getLogPrefix(guild);
    // Check if guild statistics have been updated recently
    if (isAlreadyUpdated(guildLastUpdate[guildId], config.updateIntervalM > 0 ? config.updateIntervalM : GuildChangesRateLimitM)) {
      logDebug(`${logPrefix} Guild already updated within ${config.updateIntervalM} minute${isPlural(config.updateIntervalM)}, skipping...`);
      continue;
    }

    log(`${logPrefix} ${color('text', `Checking guild for updates...`)}`);

    const counts: GuildStatistics = {
      members: guild.memberCount,
      bots: guild.members.cache.filter(member => !!member.user.bot).size,
      roles: guild.roles.cache.size,
      channels: guild.channels.cache.size,
      invites: guild.invites.cache.size,
      bans: guild.bans.cache.size,
      reactions: guild.emojis.cache.filter(emoji => !emoji.managed).size,
      stickers: guild.stickers.cache.size,
      scheduledEvents: guild.scheduledEvents.cache.size,
    };
  
    let updated = false;
    let updateCount = 0;
    const guildConfig = config.servers[guildId];
    if (guildConfig.memberCountChannelId) {
      if (await updateChannelName(guild, guildConfig.memberCountChannelId, `${locales.Members}: ${counts.members.toLocaleString()}`)) {
        updated = true;
        updateCount++;
      }
    }
    if (guildConfig.botCountChannelId) {
      if (await updateChannelName(guild, guildConfig.botCountChannelId, `${locales.Bots}: ${counts.bots.toLocaleString()}`)) {
        updated = true;
        updateCount++;
      }
    }
    if (guildConfig.roleCountChannelId) {
      if (await updateChannelName(guild, guildConfig.roleCountChannelId, `${locales.Roles}: ${counts.roles.toLocaleString()}`)) {
        updated = true;
        updateCount++;
      }
    }
    if (guildConfig.channelCountChannelId) {
      if (await updateChannelName(guild, guildConfig.channelCountChannelId, `${locales.Channels}: ${counts.channels.toLocaleString()}`)) {
        updated = true;
        updateCount++;
      }
    }
    if (guildConfig.inviteCountChannelId) {
      if (await updateChannelName(guild, guildConfig.inviteCountChannelId, `${locales.Invites}: ${counts.invites.toLocaleString()}`)) {
        updated = true;
        updateCount++;
      }
    }
    if (guildConfig.banCountChannelId) {
      if (await updateChannelName(guild, guildConfig.banCountChannelId, `${locales.Bans}: ${counts.bans.toLocaleString()}`)) {
        updated = true;
        updateCount++;
      }
    }
    if (guildConfig.reactionCountChannelId) {
      if (await updateChannelName(guild, guildConfig.reactionCountChannelId, `${locales.Reactions}: ${counts.reactions.toLocaleString()}`)) {
        updated = true;
        updateCount++;
      }
    }
    if (guildConfig.stickerCountChannelId) {
      if (await updateChannelName(guild, guildConfig.stickerCountChannelId, `${locales.Stickers}: ${counts.stickers.toLocaleString()}`)) {
        updated = true;
        updateCount++;
      }
    }
    if (guildConfig.eventCountChannelId) {
      if (await updateChannelName(guild, guildConfig.eventCountChannelId, `${locales.ScheduledEvents}: ${counts.scheduledEvents.toLocaleString()}`)) {
        updated = true;
        updateCount++;
      }
    }

    if (guildConfig.memberRoles) {
      const roleStats = await getGuildMemberRoleCounts(guild);
      for (const roleChannelId in roleStats) {
        const { text, count } = roleStats[roleChannelId];
        const newName = `${text}: ${count.toLocaleString()}`;
        if (await updateChannelName(guild, roleChannelId, newName)) {
          //updated = true;
          updateCount++;
        }
      }
    }

    // Build statistics dump for each guild
    if (config.dumpStatistics.enabled) {
      stats[guildId] = await buildStatistics(guild, counts);
    }

    if (updated) {
      log(`${logPrefix} ${color('text', `Updated ${updateCount.toLocaleString()} channel name${isPlural(updateCount)}...`)}`);

      // Set time of last update for guild
      guildLastUpdate[guildId] = getTime();

      // Wait between each guild update
      await sleep(config.sleepBetweenGuilds);
    }
  }

  // Dump guild statistics if enabled
  if (config.dumpStatistics.enabled) {
    logDebug(`Dumping guild statistics...`);
    dumpGuildStatistics(config.dumpStatistics.fileName, stats);
  }
};

/**
 * Updates a Discord Guild channel name if it differs from the new name.
 * @param guild Discord guild.
 * @param channelId Discord channel ID.
 * @param newName New name of channel.
 * @returns Returns a value indicating whether the channel name was updated or not.
 */
export const updateChannelName = async (guild: Guild, channelId: Snowflake, newName: string): Promise<boolean> => {
  const logPrefix = getLogPrefix(guild, channelId);
  const channel = guild.channels.cache.get(channelId);
  if (!channel) {
    logWarn(`${logPrefix} Failed to get channel.`);
    return false;
  }

  if (channel.name === newName) {
    logDebug(`${logPrefix} Channel name already set to '${color('variable', newName)}', skipping...`);
    return false;
  }

  // Check if the channel has been updated within the last 5 minutes, if so skip it to comply with Discord
  // Channel names can only be updated 2 within 10 minutes
  const lastChannelUpdate = channelLastUpdate[channelId];
  if (isAlreadyUpdated(lastChannelUpdate, ChannelChangesRateLimitM)) {
     const remaining = getTimeRemaining(lastChannelUpdate, ChannelChangesRateLimitM);
    logWarn(`${logPrefix} Channel name already updated within the last ${ChannelChangesRateLimitM} minutes (${remaining} minutes remaining), skipping...`);
    return false;
  }

  log(`${logPrefix} Channel name changed from '${color('variable', channel.name)}' to '${color('variable', newName)}'.`);
  await channel.setName(newName, 'update channel name');
  channelLastUpdate[channelId] = getTime();

  await sleep(config.sleepBetweenChannels);
  return true;
};

/**
 * 
 * @param guild 
 * @returns 
 */
export const getGuildMemberRoleCounts = async (guild: Guild): Promise<RoleStatistics> => {
  const roles: RoleStatistics = {};
  const { memberRoles } = config.servers[guild.id];
  if (!memberRoles) {
    return {};
  }

  for (const roleChannelId in memberRoles) {
    const channel = guild.channels.cache.get(roleChannelId);
    if (!channel) {
      logWarn(`${getLogPrefix(guild, roleChannelId)} Failed to get role channel.`);
      continue;
    }

    const { text, roleIds } = memberRoles[roleChannelId];
    const count = guild.members.cache.filter((member) => hasRole(member, roleIds)).size;
    roles[roleChannelId] = { text, count };
  }
  return roles;
};

/**
 * 
 * @param member 
 * @param roleIds 
 * @returns 
 */
export const hasRole = (member: GuildMember, roleIds: Snowflake[]): boolean => {
  const count = roleIds.filter((roleId) => member.roles.cache.has(roleId)).length > 0;
  return count;
};

/**
 * Fetches all Discord guild data.
 * @param guild 
 */
export const fetchGuild = async (guild: Guild): Promise<void> => {
  await guild.fetch();
  await guild.members.fetch();
  await guild.roles.fetch();
  await guild.channels.fetch();
  await guild.invites.fetch();
  await guild.bans.fetch();
  await guild.emojis.fetch();
  await guild.stickers.fetch();
  await guild.scheduledEvents.fetch();
};

/**
 * Builds a prefix used for logs.
 * @param guild 
 * @param channelId 
 * @returns Returns a string used as a prefix for logs.
 */
export const getLogPrefix = (guild: Guild, channelId?: Snowflake): string => {
  const prefixGuild = `[${color('variable', guild.name)}]`;
  if (!channelId) {
    return prefixGuild;
  }
  const prefixChannel = `[${color('variable', channelId)}]`;
  return `${prefixGuild} ${prefixChannel}`;
};