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
  public scheduled_at: DateTime

  @column()
  public user_from_id: number

  @column()
  public user_to_id: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

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
