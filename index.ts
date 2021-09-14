 import { Client, Intents } from 'discord.js';
 import { WantToPlayController } from './controllers/want-to-play-controller';
 import {EnvironmentService} from './service/environment-service';


import { fromIni } from '@aws-sdk/credential-provider-ini';
const {parse} = require('discord-command-parser');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const wantToPlayController = new WantToPlayController({"region": "us-east-1","credentials": fromIni()});
const GAME = 0;
const ALIAS = 1;
const envServices = new EnvironmentService();
const BOT_CHANNEL = envServices.getBotChannel();

client.on('ready', () => {
  console.log('2.0.0 Bot is ready')
});

client.on('messageCreate', message => {
  console.log("message");
    let parsed = parse(message,envServices.getCommandPrefix());
    if (!parsed.success) { return; }
    let game = parsed.arguments[GAME];
    let alias = parsed.arguments[ALIAS];
    let guildId = message.guildId;
    let profileId = message.author.id;
    let discordName = message.author.username;

      if (!BOT_CHANNEL) && {
          return;
      }
      switch(parsed.command) {
      case 'shutdown':
          client.destroy();
          break;
      case 'play':
      case 'wanttoplay':
      console.log("1.0.3 Attempting to write to dynamodb");
        let registerMessage =  wantToPlayController.wantsToPlay({"guildId" : guildId, "profileId" : profileId,
            "discordName" : discordName, "game" : game, "alias" : alias});
        message.reply(registerMessage);
        break;
      case 'Plays':
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
        break;
      default:
        message.reply("Sorry, I don't understand command " + parsed.command);
    }
});
client.login(envServices.getDiscordToken());
