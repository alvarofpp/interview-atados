import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import {MessageFactory} from "Database/factories/MessageFactory";

export default class MessageSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run () {
    await MessageFactory.createMany(100)
  }
}
