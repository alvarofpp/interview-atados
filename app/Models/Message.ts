import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Message extends BaseModel {
  public static table = 'messages'

  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public readed: boolean

  @column.dateTime()
  public scheduledAt: DateTime

  @column()
  public userFromId: number

  @column()
  public userToId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
