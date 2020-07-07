import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'userFromId',
    foreignKey: 'id',
  })
  public userFrom: BelongsTo<typeof User>

  @belongsTo(() => User, {
    localKey: 'userToId',
    foreignKey: 'id',
  })
  public userTo: BelongsTo<typeof User>
}
