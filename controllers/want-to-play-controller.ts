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
        let data =  {"TableName" : "want-to-play", "Item" : {"discordName" : {"S" : gameToPlay.discordName}, "guildId" :  {"S" : gameToPlay.guildId}, "profileId" : {"S" : gameToPlay.profileId}, "game" : {"S" : gameToPlay.game}, "alias" : {"S" : gameToPlay.alias}}};
        let command = new PutItemCommand(data);
        console.log("PutItemCommand:" + command);
        this.awsDataStore.save(data);
        return "You have successfully registered your interest in " + gameToPlay.game + ".";
    } catch(error) {
        return "Unfortunately, an error occurred while attempting to register your interest in game " + gameToPlay.game + ".";
    }
  }
}
