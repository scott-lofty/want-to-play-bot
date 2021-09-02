import { WantToPlay } from '../models/want-to-play-model';
import { DynamoDB, PutItemInput, ScanCommand } from '@aws-sdk/client-dynamodb';

export class AwsDataStore {
  dynamoDbClient : DynamoDB;
  constructor(config) {
    this.dynamoDbClient = new DynamoDB(config);
  }
  async save(itemToStore : PutItemInput) {
     await this.dynamoDbClient.putItem(itemToStore);
  }
  async find(itemQuery : games : QueryCommand) {
    let queryCommand = new QueryCommand(games);
    let results = await this.dynamoDbClient.send(scanCommand);
    results
  }
}
