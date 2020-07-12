import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Blocks extends BaseSchema {
  protected tableName = 'blocks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
      table.string('slug')
        .notNullable()
        .unique()
      table.text('description')
        .notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
