import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Block from "App/Models/Block";
import Database from "@ioc:Adonis/Lucid/Database";

export default class BlockSeeder extends BaseSeeder {
  public async run () {
    const trx = await Database.transaction()
    const uniqueKey = 'slug'

    await Block.updateOrCreateMany(uniqueKey, [
      {
        slug: 'messages_send',
        description: 'User will no longer be able to send messages.',
      },
    ], {client: trx})
  }
}
