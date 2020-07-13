import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";

export default class UserRelationshipMiddleware {
  public async handle(
    {auth, response, params}: HttpContextContract,
    next: () => Promise<void>,
    args: string[2]
  ) {
    const user = await auth.authenticate()

    /*
     * Check if exists element for user.
     */
    const [{total}] = await Database.query()
      .count('* AS total')
      .from(args[0])
      .where('id', params.id)
      .where(args[1], user.id)

    if (total === 0) {
      return response.status(401)
        .send({
          message: 'Unauthorized',
        })
    }

    await next()
  }
}
