import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Message from "App/Models/Message"
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

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

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
