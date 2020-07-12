import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import Message from 'App/Models/Message'

export const MessageFactory = Factory
  .define(Message, async ({faker}) => {
    const users = await User.all()
    const usersIds = users.map((user) => user.id)
    const usersIdsLen = usersIds.length

    return {
      text: faker.lorem.words(20),
      readed: faker.random.boolean(),
      scheduled_at: undefined,
      user_from_id: usersIds[Math.floor(Math.random() * usersIdsLen)],
      user_to_id: usersIds[Math.floor(Math.random() * usersIdsLen)],
    }
  })
  .build()
