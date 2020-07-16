import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Block from "App/Models/Block";

export default class BlockSeeder extends BaseSeeder {
  public async run () {
    await Block.createMany([
      {
        slug: 'messages_send',
        description: 'User will no longer be able to send messages.',
      },
    ])
  }
}
