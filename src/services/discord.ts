import {
  ChannelType,
  Client,
  Guild,
  GuildBasedChannel,
  GuildMember,
  OverwriteType,
  Snowflake,
} from 'discord.js';

import { color, sleep } from '.';
import { DiscordGuildConfig, GuildStatsConfig } from '../types';
const config: GuildStatsConfig = require('../config.json');

export const startUpdate = async (client: Client) => {
  const guilds = client.guilds.cache.filter((guild) => !!config.servers[guild.id]);
  if (guilds.size === 0) {
    console.warn('no guilds available, skipping ready initialization...');
    return;
  }

  for (const [guildId, guild] of guilds) {
    if (!config.servers[guildId]) {
      console.warn(`guild ${guild.name} (${guildId}) not configured, skipping`);
      continue;
    }

    console.log(`${color('text', `Updating guild ${color('variable', guild.name)}`)}`);
    //const category = await getOrCreateCategory(guild, config.servers[guildId]);
    //await updateGuildStats(guild, category);
    await updateGuildStats(guild);
    await sleep(5 * 1000); // Wait 5 seconds between each update
  }
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

export const updateGuildStats = async (guild: Guild) => {
  const guildConfig = config.servers[guild.id];
  if (guildConfig.status) {
    guild.client.user?.setActivity('Generating statistics...');
  }

  // Fetch full list of members so bots are included
  await guild.members.fetch();

  const memberCount = guild.memberCount.toLocaleString();
  const botCount = guild.members.cache.filter(member => !!member.user.bot).size.toLocaleString();
  const roleCount = guild.roles.cache.size.toLocaleString();
  const channelCount = guild.channels.cache.size.toLocaleString();
  await updateChannelName(guild, guildConfig.memberCountChannelId, `Member Count: ${memberCount}`);
  await updateChannelName(guild, guildConfig.botCountChannelId, `Bot Count: ${botCount}`);
  await updateChannelName(guild, guildConfig.roleCountChannelId, `Role Count: ${roleCount}`);
  await updateChannelName(guild, guildConfig.channelCountChannelId, `Channel Count: ${channelCount}`);

  await getGuildMemberRoleCounts(guild);
};

export const updateChannelName = async (guild: Guild, channelId: string, newName: string) => {
  const channel = await guild.channels.fetch(channelId);
  if (!channel) {
    console.warn('failed to get channel with id:', channelId);
    return;
  }

  if (channel.name === newName) {
    console.warn('channel', channel.name, 'name already set to', newName, 'skipping...');
    return;
  }

  //await channel.edit({
  //  name: newName,
  //  //type: ChannelType.GuildVoice,
  //  //position: 0,
  //  topic: newName,
  //  //parent?: CategoryChannelResolvable | null;
  //});
  await channel.setName(newName);
  await sleep(3 * 1000); // Wait three seconds between each update
};

export const getGuildMemberRoleCounts = async (guild: Guild) => {
  const guildConfig = config.servers[guild.id];
  if (!guildConfig.memberRoles) {
    return;
  }

  const memberRoles = guildConfig.memberRoles;
  for (const roleChannelId of Object.keys(memberRoles)) {
    const channel = await guild.channels.fetch(roleChannelId);
    if (!channel) {
      console.warn('failed to get role channel with id', roleChannelId);
      continue;
    }

    const { text, roleIds } = memberRoles[roleChannelId];
    const count = guild.members.cache.filter((member) => hasRole(member, roleIds)).size;
    const newName = `${text}: ${count.toLocaleString()}`;
    if (channel.name === newName) {
      console.warn('channel', channel.name, 'name already set to', newName, 'skipping...');
      continue;
    }

    await channel.setName(newName);
    await sleep(3 * 1000); // Wait three seconds between each update
  }
};

export const hasRole = (member: GuildMember, roleIds: Snowflake[]) => {
  let count = 0;
  const roles = member.roles.cache;
  for (const roleId of roleIds) {
    if (roles.has(roleId)) {
      count++;
    }
  }
  return count;
};