import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BlocksUsers extends BaseSchema {
  protected tableName = 'blocks_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()

      table.integer('block_id')
        .unsigned()
        .references('id')
        .inTable('blocks')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
