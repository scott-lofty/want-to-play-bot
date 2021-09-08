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
  console.log('Bot is ready')
});

client.on('messageCreate', message => {
    console.log(message);
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

        let registerMessage =  wantToPlayController.wantsToPlay({"guildId" : guildId, "profileId" : profileId,
            "discordName" : discordName, "game" : game, "alias" : alias});
        message.reply(registerMessage);
        break;
      case 'whoplays':
        let findMessage = wantToPlayController.whoPlays({"guildId": guildId, "profileId" : profileId, "discordName" : discordName, "game" : game, "alias" : alias});
        console.log(findMessage);
        //message.reply(findMessage);
    }
});
client.login(token);
