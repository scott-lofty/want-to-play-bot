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
        let data =  {"TableName" : "want-to-play", "Item" : {"guild" : {"S" : gameToPlay.guildId}, "discord_name" : {"S" : gameToPlay.discordName}, "game_profile" :  {"S" : gameToPlay.game + "|" + gameToPlay.profileId}, "game_alias" : {"S" : gameToPlay.game + "|" + gameToPlay.alias}}};
        let command = new PutItemCommand(data);
        console.log("PutItemCommand:" + command);
        this.awsDataStore.save(data);
        return "You have successfully registered your interest in " + gameToPlay.game + ".";
    } catch(error) {
        return "Unfortunately, an error occurred while attempting to register your interest in game " + gameToPlay.game + ".";
    }
  }
  whoPlays(gamesToFind : WantToPlay) : Promise<string> {
    let alias = '';
    if (!gamesToFind.alias) {
      alias = gamesToFind.alias;
    }
    console.log("Building data packet");
    let criteria = {
        TableName: "want-to-play",
        IndexName: "guild-game_alias-index",
        KeyConditionExpression: "guild = :guild and begins_with(game_alias,:game_alias)",
        ExpressionAttributeValues: {
              ":game_alias": {"S" : gamesToFind.game + '|'},
              ":guild" : {"S" : gamesToFind.guildId},
              ":profile_id" : {"S" : gamesToFind.profileId}
        },
        FilterExpression: "profile_id <> :profile_id",
    }
    console.log("Calling find with data packet");
    console.log(criteria);
    const peopleWhoPlay = this.awsDataStore.find(criteria).then((resolved) => {
/*      if (rejected) {
        Promise.reject("Unfortunately, something went wrong and I can't read the stored data.")
      }*/
      let discordIds = '';
      for(let i = 0; i < resolved.Items.length;++i) {
        console.log("Items");
        console.log(resolved.Items);
        discordIds = discordIds + " " + resolved.Items[i].discord_name.S + ",";
      }
      if (!discordIds) {
        discordIds = "No one wants to play game " + gamesToFind.game + ".";
      } else {
        discordIds = discordIds.slice(0,discordIds.lastIndexOf('.'));
      }
      return Promise.resolve(discordIds);
    });
    return peopleWhoPlay;
  }
}
