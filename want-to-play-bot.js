const { DynamoDBClient, PutItemCommand} = require("@aws-sdk/client-dynamodb");
const { fromEnv } = require("@aws-sdk/credential-provider-ini");

const dynamoClient = new DynamoDBClient({"region":"us-east-1", "credentials" : fromIni()});

class WantToPlayBot {
  wantToPlay(item) {
      let putItemCommand = new PutItemCommand({"tableName" : "want-to-play", "item": item});
      console.log(putItemCommand);
      dynamoClient.send(putItemCommand);
  }
}

module.exports.WantToPlayBot = WantToPlayBot;
