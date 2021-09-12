import process from 'process';

export class EnvironmentService {

  private discordToken : string = '';
  private commandPrefix : string = '';

  getDiscordToken() : string {
    let value = '';

    if (process.env.DISCORD_TOKEN) {
      value = process.env.DISCORD_TOKEN;
    }
    return value;
  }

  getCommandPrefix() : string {
    let value = '!';
    if (process.env.COMMAND_PREFIX) {
      value = process.env.COMMAND_PREFIX;
    }
    return value;
  }
}
