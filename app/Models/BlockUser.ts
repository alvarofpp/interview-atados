import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Block from "App/Models/Block";

export default class BlockUser extends BaseModel {
  public static table = 'blocks_users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public blockId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Block)
  public block: BelongsTo<typeof Block>
}
