[![Build](https://github.com/versx/DiscordGuildStats/actions/workflows/node.js.yml/badge.svg)](https://github.com/versx/DiscordGuildStats/actions/workflows/node.js.yml)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)
[![GitHub Release](https://img.shields.io/github/release/versx/DiscordGuildStats.svg)](https://github.com/versx/DiscordGuildStats/releases/)
[![GitHub Contributors](https://img.shields.io/github/contributors/versx/DiscordGuildStats.svg)](https://github.com/versx/DiscordGuildStats/graphs/contributors/)
[![Discord](https://img.shields.io/discord/552003258000998401.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/zZ9h9Xa)  

# Discord Guild Statistics Bot  

Displays Discord Guild statistics for members, bots, roles, channels, assigned member roles, invites, bans, reactions, stickers, and scheduled events counts.  

_**This is a rewrite in Typescript of my original [`GuildStats`](https://github.com/versx/GuildStats) project.**_  

## Features  
- Statistics for:
  * Member counts  
  * Bot counts  
  * Role counts  
  * Channel counts  
  * Invite counts
  * Ban counts
  * Reaction counts
  * Sticker counts
  * Scheduled event counts
  * Assigned member role counts  
- Automatically updates every specified minutes  
- Supports multiple Discord servers  
- Log level filtering  

## Preview  
![Image Preview](https://raw.githubusercontent.com/versx/DiscordGuildStats/master/.github/images/preview.png)  

## Prerequisites
- [Node.js v16 or higher](https://nodejs.org/en/download)  

## Installation
1. Clone repository: `git clone https://github.com/versx/DiscordGuildStats`  
1. Install packages: `npm install`  
1. Copy example config: `cp src/config.example.json src/config.json`  
1. Fill out config options.  
1. Build in root project folder: `npm run build`  
1. Run: `npm run start`  

## Updating  
1. Pull latest changes in root folder `git pull`  
1. Build project `npm run build`  
1. Run `npm run start`  

## Configuration  
```json
{
  // Discord Guild Statistics
  "dumpStatistics": {
    // Determines whether to dump Discord guild statistics every interval.
    "enabled": false,
    // The statistics data to include in the dumps.
    "data": [
      "members", "bots", "roles", "channels",
      "invites", "bans", "reactions", "stickers",
      "scheduledEvents", "memberRoles"
    ],
    // File name of the statistics dump. Leaving the `fileName` blank/empty
    // will default to the date. (i.e. `2023-09-15.csv`)
    "fileName": "dumps.csv"
  },
  // Logging configuration.
  "logs": {
    // Log level to filter logs by.
    // Available values:
    //  - trace (log everything)
    //  - debug (only log debug, info, warnings, and errors)
    //  - info (only log info, warnings, and errors)
    //  - warn (only log warnings and errors)
    //  - error (only log errors)
    //  - none (disable logging)
    "level": "info",
    // Log color dictionary.
    "colors": {
      // Normal text
      "text": "#ffffff",
      // Variables
      "variable": "#ff624d",
      // Dates
      "date": "#4287f5",
      // Errors
      "error": "#ff0000"
    }
  },
  // Delay between each channel update in milliseconds.
  "sleepBetweenChannels": 250,
  // Delay between each guild update in milliseconds.
  "sleepBetweenGuilds": 3000,
  // Discord bot status.
  "status": null,
  // Discord bot token.
  "token": "<DISCORD_BOT_TOKEN>",
  // Update interval in minutes. Specify `0` will only rely on
  // Discord events to check for Discord guild changes.
  "updateIntervalM": 15,
  // Discord servers to include for updating statistics.
  "servers": {
    // Discord guild ID
    "<DISCORD_GUILD1_ID>": {
      // Descriptive name for Discord guild. (not actually used, just for your reference.)
      "name": "<DESCRIPTIVE_NAME>",
      // Channel ID for member counts.
      "memberCountChannelId": "00000000000001",
      // Channel ID for bot counts.
      "botCountChannelId": "00000000000002",
      // Channel ID for role counts.
      "roleCountChannelId": "00000000000003",
      // Channel ID for channel counts.
      "channelCountChannelId": "00000000000004",
      // Channel ID for invite counts.
      "inviteCountChannelId": "00000000000005",
      // Channel ID for ban counts.
      "banCountChannelId": "00000000000006",
      // Channel ID for reaction/emoji counts.
      "reactionCountChannelId": "00000000000007",
      // Channel ID for sticker counts.
      "stickerCountChannelId": "00000000000008",
      // Channel ID for scheduled event counts.
      "eventCountChannelId": "00000000000009",
      // Roles assigned to Discord members.
      "memberRoles": {
        // Channel ID for specific roles statistic count.
        "<DISCORD_ROLE_CHANNEL1_ID>": {
          // Role IDs to include in statistic.
          "roleIds": ["<DISCORD_ROLE1_ID>"],
          // Text/name of channel for role statistic.
          "text": "Administators"
        },
        // Channel ID for specific roles statistic count.
        "<DISCORD_ROLE_CHANNEL2_ID>": {
          // Role IDs to include in statistic.
          "roleIds": ["<DISCORD_ROLE2_ID>"],
          // Text/name of channel for role statistic.
          "text": "Moderators"
        },
        // Channel ID for specific roles statistic count.
        "<DISCORD_ROLE_CHANNEL3_ID>": {
          // Role IDs to include in statistic.
          "roleIds": ["<DISCORD_ROLE3_ID>"],
          // Text/name of channel for role statistic.
          "text": "Supporters"
        }
      }
    }
  }
}
```

## Notes  
- Not specifying a channel ID (i.e. `null`) for a statistics count in the config will omit that statistic from being updated.  
- Not specifying a file name for the guild statistics dump will use the date (i.e. `2023-09-15.csv`) by default.  
- Specifying `0` for `updateIntervalM` will disable the interval timer and only rely on Discord events to check for Discord guild changes.  