import {
  Client,
  Guild,
  GuildMember,
  Snowflake,
} from 'discord.js';

import {
  color,
  getTime,
  isAlreadyUpdated,
  log, logDebug, logError, logWarn,
  sleep,
} from '.';
import { GuildStatsConfig } from '../types';
const config: GuildStatsConfig = require('../config.json');

const SleepBetweenGuilds = 5; // 5
const SleepBetweenChannels = 250; // 2

export let lastUpdated: { [guildId: Snowflake]: number } = {};

export const updateGuildStats = async (client: Client, reset: boolean) => {
  const guilds = client.guilds.cache.filter((guild) => !!config.servers[guild.id]);
  if (guilds.size === 0) {
    logError(`[${client.user?.id}] Bot is not in any guilds, skipping...`);
    return;
  }

  for (const [guildId, guild] of guilds) {
    const lastUpdate = lastUpdated[guildId];
    if (isAlreadyUpdated(lastUpdate, config.updateIntervalM)) {
      //logDebug(guild, `Guild already updated within ${config.updateIntervalM} minutes, skipping...`);
      continue;
    }

    //const category = await getOrCreateCategory(guild, config.servers[guildId]);
    const guildConfig = config.servers[guildId];
    if (!guildConfig) {
      logWarn(`[${guild.name}] Failed to get guild config.`);
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

    log(`[${guild.name}] ${color('text', `Checking guild ${color('variable', guild.name)} for updates...`)}`);

    if (!reset) {
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

    const memberCount = reset ? 0 : guild.memberCount;
    const botCount = reset ? 0 : guild.members.cache.filter(member => !!member.user.bot).size;
    const roleCount = reset ? 0 : guild.roles.cache.size;
    const channelCount = reset ? 0 : guild.channels.cache.size;
    const inviteCount = reset ? 0 : guild.invites.cache.size;
    const banCount = reset ? 0 : guild.bans.cache.size;
    const scheduledEventCount = reset ? 0 : guild.scheduledEvents.cache.size;
    const reactionCount = reset ? 0 : guild.emojis.cache.filter(emoji => !emoji.managed).size;
    const stickerCount = reset ? 0 : guild.stickers.cache.size;

    let updated = false;
    // TODO: Voice Channels/Text Channels count
    if (guildConfig.memberCountChannelId) {
      if (await updateChannelName(guild, guildConfig.memberCountChannelId, `Members: ${memberCount.toLocaleString()}`)) {
        updated = true;
        await sleep(SleepBetweenChannels);
      }
    }
    if (guildConfig.botCountChannelId) {
      if (await updateChannelName(guild, guildConfig.botCountChannelId, `Bots: ${botCount.toLocaleString()}`)) {
        updated = true;
        await sleep(SleepBetweenChannels);
      }
    }
    if (guildConfig.roleCountChannelId) {
      if (await updateChannelName(guild, guildConfig.roleCountChannelId, `Roles: ${roleCount.toLocaleString()}`)) {
        updated = true;
        await sleep(SleepBetweenChannels);
      }
    }
    if (guildConfig.channelCountChannelId) {
      if (await updateChannelName(guild, guildConfig.channelCountChannelId, `Channels: ${channelCount.toLocaleString()}`)) {
        updated = true;
        await sleep(SleepBetweenChannels);
      }
    }
    if (guildConfig.inviteCountChannelId) {
      if (await updateChannelName(guild, guildConfig.inviteCountChannelId, `Invites: ${inviteCount.toLocaleString()}`)) {
        updated = true;
        await sleep(SleepBetweenChannels);
      }
    }
    if (guildConfig.banCountChannelId) {
      if (await updateChannelName(guild, guildConfig.banCountChannelId, `Bans: ${banCount.toLocaleString()}`)) {
        updated = true;
        await sleep(SleepBetweenChannels);
      }
    }
    if (guildConfig.eventCountChannelId) {
      if (await updateChannelName(guild, guildConfig.eventCountChannelId, `Scheduled Events: ${scheduledEventCount.toLocaleString()}`)) {
        updated = true;
        await sleep(SleepBetweenChannels);
      }
    }
    if (guildConfig.reactionCountChannelId) {
      if (await updateChannelName(guild, guildConfig.reactionCountChannelId, `Reactions: ${reactionCount.toLocaleString()}`)) {
        updated = true;
        await sleep(SleepBetweenChannels);
      }
    }
    if (guildConfig.stickerCountChannelId) {
      if (await updateChannelName(guild, guildConfig.stickerCountChannelId, `Stickers: ${stickerCount.toLocaleString()}`)) {
        updated = true;
        await sleep(SleepBetweenChannels);
      }
    }
    if (guildConfig.memberRoles) {
      await getGuildMemberRoleCounts(guild, reset);
      await sleep(SleepBetweenChannels);
    }

    lastUpdated[guildId] = getTime();
    if (updated) {
      log(`[${guild.name}] ${color('text', `Updated guild ${color('variable', guild.name)} channel names...`)}`);

      // Wait 5 seconds between each guild update
      await sleep(SleepBetweenGuilds * 1000);
    }
  }
};

export const updateChannelName = async (guild: Guild, channelId: Snowflake, newName: string): Promise<boolean> => {
  const channel = await guild.channels.fetch(channelId); //.cache.get(channelId);
  if (!channel) {
    logWarn(`[${guild.name}] [${channelId}] Failed to get channel.`);
    return false;
  }

  if (channel.name === newName) {
    //debug(guild, channelId, `Channel name already set to '${newName}', skipping...`);
    return false;
  }
  
  log(`[${guild.name}] [${channelId}] Channel name changed, updating from '${channel.name}' to '${newName}'.`);
  await channel.setName(newName, 'update channel name');
  return true;
};

export const getGuildMemberRoleCounts = async (guild: Guild, reset: boolean) => {
  const guildConfig = config.servers[guild.id];
  if (!guildConfig.memberRoles) {
    return;
  }

  const memberRoles = guildConfig.memberRoles;
  for (const roleChannelId of Object.keys(memberRoles)) {
    await sleep(250);

    const channel = await guild.channels.fetch(roleChannelId);
    if (!channel) {
      logWarn(`[${guild.name}] [${roleChannelId}] Failed to get role channel.`);
      continue;
    }

    const { text, roleIds } = memberRoles[roleChannelId];
    const members = await guild.members.fetch();
    const count = reset ? 0 : members.filter((member) => hasRole(member, roleIds)).size;
    const newName = `${text}: ${count.toLocaleString()}`;
    await updateChannelName(guild, roleChannelId, newName);
  }
};

export const hasRole = (member: GuildMember, roleIds: Snowflake[]) => {
  const count = roleIds.filter((roleId) => member.roles.cache.has(roleId)).length;
  return count;
};

//export const getOrCreateCategory = async (guild: Guild, guildConfig: DiscordGuildConfig) => {
//  let category = guild.channels.cache.find((category) => category.type === ChannelType.GuildCategory && category.name === guildConfig.category.name);
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