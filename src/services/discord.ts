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
  getTime,
  isAlreadyUpdated,
  log, logDebug, logError, logWarn,
  sleep,
} from '.';
import locales from '../locales.json';
import {
  DiscordGuildStatsConfig,
  DumpStats,
  GuildDumpStats,
  GuildStatistics,
  RoleStatistics,
} from '../types';

const config: DiscordGuildStatsConfig = require('../config.json');
let lastUpdated: { [guildId: Snowflake]: number } = {};

export const buildStatistics = async (guild: Guild, counts: GuildStatistics, reset: boolean): Promise<GuildDumpStats> => {
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
    const roleStats = await getGuildMemberRoleCounts(guild, reset);
    for (const roleChannelId in roleStats) {
      const roleStat = roleStats[roleChannelId];
      stats[roleStat.text] = roleStat.count;
    }
  }

  return stats;
};

export const updateGuilds = async (client: Client, reset: boolean) => {
  const guilds = client.guilds.cache.filter((guild) => !!config.servers[guild.id]);
  if (guilds.size === 0) {
    logError(`[${color('variable', client.user?.id)}] Bot is not in any guilds, skipping...`);
    return;
  }

  const stats: DumpStats = {};
  const guildIds = Object.keys(config.servers);
  for (const guildId of guildIds) {
    const guild = guilds.get(guildId);
    const guildConfig = config.servers[guildId];
    if (!guild) {
      logWarn(`[${color('variable', guildConfig.name)}] Failed to get guild with id: ${color('variable', guildId)}`);
      continue;
    }

    // Check if guild statistics have been updated recently
    if (isAlreadyUpdated(lastUpdated[guildId], config.updateIntervalM)) {
      logDebug(`[${color('variable', guild.name)}] Guild already updated within ${config.updateIntervalM} minutes, skipping...`);
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

    const counts: GuildStatistics = {
      members: reset ? 0 : guild.memberCount,
      bots: reset ? 0 : guild.members.cache.filter(member => !!member.user.bot).size,
      roles: reset ? 0 : guild.roles.cache.size,
      channels: reset ? 0 : guild.channels.cache.size,
      invites: reset ? 0 : guild.invites.cache.size,
      bans: reset ? 0 : guild.bans.cache.size,
      reactions: reset ? 0 : guild.emojis.cache.filter(emoji => !emoji.managed).size,
      stickers: reset ? 0 : guild.stickers.cache.size,
      scheduledEvents: reset ? 0 : guild.scheduledEvents.cache.size,
    };
  
    // TODO: const textChannelCount = reset ? 0 : guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size;
    // TODO: const voiceChannelCount = reset ? 0 : guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size;
  
    let updated = false;
    if (guildConfig.memberCountChannelId) {
      if (await updateChannelName(guild, guildConfig.memberCountChannelId, `${locales.Members}: ${counts.members.toLocaleString()}`)) {
        updated = true;
      }
    }
    if (guildConfig.botCountChannelId) {
      if (await updateChannelName(guild, guildConfig.botCountChannelId, `${locales.Bots}: ${counts.bots.toLocaleString()}`)) {
        updated = true;
      }
    }
    if (guildConfig.roleCountChannelId) {
      if (await updateChannelName(guild, guildConfig.roleCountChannelId, `${locales.Roles}: ${counts.roles.toLocaleString()}`)) {
        updated = true;
      }
    }
    if (guildConfig.channelCountChannelId) {
      if (await updateChannelName(guild, guildConfig.channelCountChannelId, `${locales.Channels}: ${counts.channels.toLocaleString()}`)) {
        updated = true;
      }
    }
    if (guildConfig.inviteCountChannelId) {
      if (await updateChannelName(guild, guildConfig.inviteCountChannelId, `${locales.Invites}: ${counts.invites.toLocaleString()}`)) {
        updated = true;
      }
    }
    if (guildConfig.banCountChannelId) {
      if (await updateChannelName(guild, guildConfig.banCountChannelId, `${locales.Bans}: ${counts.bans.toLocaleString()}`)) {
        updated = true;
      }
    }
    if (guildConfig.reactionCountChannelId) {
      if (await updateChannelName(guild, guildConfig.reactionCountChannelId, `${locales.Reactions}: ${counts.reactions.toLocaleString()}`)) {
        updated = true;
      }
    }
    if (guildConfig.stickerCountChannelId) {
      if (await updateChannelName(guild, guildConfig.stickerCountChannelId, `${locales.Stickers}: ${counts.stickers.toLocaleString()}`)) {
        updated = true;
      }
    }
    if (guildConfig.eventCountChannelId) {
      if (await updateChannelName(guild, guildConfig.eventCountChannelId, `${locales.ScheduledEvents}: ${counts.scheduledEvents.toLocaleString()}`)) {
        updated = true;
      }
    }

    if (guildConfig.memberRoles) {
      const roleStats = await getGuildMemberRoleCounts(guild, reset);
      for (const roleChannelId in roleStats) {
        const roleStat = roleStats[roleChannelId];
        if (await updateChannelName(guild, roleChannelId, roleStat.name)) {
          updated = true;
        }
      }
    }

    // Build statistics dump for each guild
    if (config.dumpStatistics.enabled) {
      stats[guildId] = await buildStatistics(guild, counts, reset);
    }

    //const category = await getOrCreateCategory(guild, config.servers[guildId].category?.name);
    if (updated) {
      log(`[${color('variable', guild.name)}] ${color('text', `Updated guild ${color('variable', guild.name)} channel names...`)}`);

      // Set time of last update for guild
      lastUpdated[guildId] = getTime();

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

export const updateChannelName = async (guild: Guild, channelId: Snowflake, newName: string): Promise<boolean> => {
  const channel = guild.channels.cache.get(channelId);
  if (!channel) {
    logWarn(`[${color('variable', guild.name)}] [${color('variable', channelId)}] Failed to get channel.`);
    return false;
  }

  if (channel.name === newName) {
    logDebug(`[${color('variable', guild.name)}] [${color('variable', channelId)}] Channel name already set to '${color('variable', newName)}', skipping...`);
    return false;
  }
  
  log(`[${color('variable', guild.name)}] [${color('variable', channelId)}] Channel name changed, updating from '${color('variable', channel.name)}' to '${color('variable', newName)}'.`);
  await channel.setName(newName, 'update channel name');
  await sleep(config.sleepBetweenChannels);

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
    await sleep(config.sleepBetweenChannels);

    const channel = guild.channels.cache.get(roleChannelId);
    if (!channel) {
      logWarn(`[${color('variable', guild.name)}] [${color('variable', roleChannelId)}] Failed to get role channel.`);
      continue;
    }

    const { text, roleIds } = memberRoles[roleChannelId];
    const count = reset ? 0 : guild.members.cache.filter((member) => hasRole(member, roleIds)).size;
    const newName = `${text}: ${count.toLocaleString()}`;
    roles[roleChannelId] = { name: newName, count, text };
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