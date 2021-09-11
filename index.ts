 import { Client, Intents } from 'discord.js';
 import { WantToPlayController } from './controllers/want-to-play-controller';

import { fromIni } from '@aws-sdk/credential-provider-ini';
const {token,prefix} = require('../config.json');
const {parse} = require('discord-command-parser');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const wantToPlayController = new WantToPlayController({"region": "us-east-1","credentials": fromIni()});
const GAME = 0;
const ALIAS = 1;


client.on('ready', () => {
  console.log('2.0.0 Bot is ready')
});

client.on('messageCreate', message => {
    let parsed = parse(message,prefix);
    if (!parsed.success) { return; }
    let game = parsed.arguments[GAME];
    let alias = parsed.arguments[ALIAS];
    let guildId = message.guildId;
    let profileId = message.author.id;
    let discordName = message.author.username;
    switch(parsed.command) {
      case 'shutdown':
          client.destroy();
          break;
      case 'wanttoplay':
      console.log("1.0.3 Attempting to write to dynamodb");
        let registerMessage =  wantToPlayController.wantsToPlay({"guildId" : guildId, "profileId" : profileId,
            "discordName" : discordName, "game" : game, "alias" : alias});
        message.reply(registerMessage);
        break;
      case 'whoplays':
        console.log("1.0.0 Attempting to find players for game " + game + " on guild " + guildId);
        wantToPlayController.whoPlays({"guildId": guildId,
          "profileId" : profileId,
          "discordName" : discordName,
           "game" : game,
           "alias" : alias}).then((resolved) => {
             if (resolved) {
               message.reply(resolved);
             }
           });
        console.log("1.0.2 Completed find operation");
    }
});
client.login(token);
