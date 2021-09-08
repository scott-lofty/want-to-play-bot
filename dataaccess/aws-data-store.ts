import { WantToPlay } from '../models/want-to-play-model';
import { DynamoDB, PutItemInput, QueryCommandInput,QueryCommand } from '@aws-sdk/client-dynamodb';

export class AwsDataStore {
  dynamoDbClient : DynamoDB;
  constructor(config) {
    this.dynamoDbClient = new DynamoDB(config);
  }

  async save(itemToStore : PutItemInput) {
     await this.dynamoDbClient.putItem(itemToStore);
  }

  async find(itemQuery : QueryCommandInput) {
    let queryCommand = new QueryCommand(itemQuery);
    let results = await this.dynamoDbClient.send(queryCommand);
    return results
  }
}
