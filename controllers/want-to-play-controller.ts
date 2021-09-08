import { WantToPlay } from '../models/want-to-play-model';
import { AwsDataStore } from '../dataaccess/aws-data-store';
import { PutItemInput, PutItemCommand } from '@aws-sdk/client-dynamodb';

export class WantToPlayController {
  awsDataStore : AwsDataStore;
  constructor(awsConfig) {
    this.awsDataStore = new AwsDataStore(awsConfig);
  }
  wantsToPlay(gameToPlay : WantToPlay)  : string {
    try {
        let data =  {"TableName" : "want-to-play", "Item" : {"discord-name" : {"S" : gameToPlay.discordName}, "guild-game-alias" :  {"S" : gameToPlay.guildId + "|" + gameToPlay.game + "|" + gameToPlay.alias}, "profile-id" : {"S" : gameToPlay.profileId}}};
        let command = new PutItemCommand(data);
        console.log("PutItemCommand:" + command);
        this.awsDataStore.save(data);
        return "You have successfully registered your interest in " + gameToPlay.game + ".";
    } catch(error) {
        return "Unfortunately, an error occurred while attempting to register your interest in game " + gameToPlay.game + ".";
    }
  }
  whoPlays(gamesToFind : WantToPlay) : string {
    let alias = '';
    if (!gamesToFind.alias) {
      alias = '|' + gamesToFind.alias;
    }
    let data = {
        TableName: "want-to-play",
        KeyConditionExpression: "#guildgamealias begins_with(:guildgamealias)",
        ExpressionAttributeNames: {
          "#guildgamealais" : "guild-game-alias"
        },
        ExpressionAttributeValues: {
              ":guildgamealias": {"S" : gamesToFind.guildId + "|" + gamesToFind.game + alias}
        },
        FilterExpression: "profile-id <> " + gamesToFind.profileId
    }
    let results = this.awsDataStore.find(data);
    return "yay";
  }
}
