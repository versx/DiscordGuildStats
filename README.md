[![Build](https://github.com/versx/DiscordGuildStats/workflows/.NET%205.0/badge.svg)](https://github.com/versx/DiscordGuildStats/actions)
[![GitHub Release](https://img.shields.io/github/release/versx/DiscordGuildStats.svg)](https://github.com/versx/DiscordGuildStats/releases/)
[![GitHub Contributors](https://img.shields.io/github/contributors/versx/DiscordGuildStats.svg)](https://github.com/versx/DiscordGuildStats/graphs/contributors/)
[![Discord](https://img.shields.io/discord/552003258000998401.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/zZ9h9Xa)  

# Discord Guild Statistics Bot  

Displays Discord Guild statistics for members, bots, roles, channels, and role counts. Supports multiple Discord servers.  

## Features  
- Statistics for:
  * Member counts  
  * Bot counts  
  * Role counts  
  * Channel counts  
  * Assigned member role counts  
- Automatically updates every specified minutes  

## Prerequisites
- [Node.js v18 or higher](https://nodejs.org/en/download)  

## Installation
1. Clone repository: `git clone https://github.com/versx/DiscordGuildStats`  
1. Install packages `npm install`  
1. Build in root project folder (same folder `src`, `build`, etc are in): `npm run build`  
1. Copy example config `cp src/config.example.json build/config.json`  
1. Fill out config options.  
1. Run `npm run start`  

## Updating  
1. Pull latest changes in root folder `git pull`  
1. Build project `npm run build`  
1. Run `npm run start`  

## Preview  
![Image Preview](https://raw.githubusercontent.com/versx/GuildStats/master/example.png)  