import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Message from "App/Models/Message"

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Message, {
    localKey: 'uuid',
    foreignKey: 'userFromId',
  })
  public messages_send: HasMany<typeof Message>

  @hasMany(() => Message, {
    localKey: 'uuid',
    foreignKey: 'userToId',
  })
  public messages_receive: HasMany<typeof Message>
}
