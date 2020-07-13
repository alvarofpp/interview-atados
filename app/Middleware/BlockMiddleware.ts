import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Block from "App/Models/Block";
import BlockUser from "App/Models/BlockUser";

export default class BlockMiddleware {
  public async handle (
    {auth, response}: HttpContextContract,
    next: () => Promise<void>,
    arg: string
  ) {
    const user = await auth.authenticate()
    const block = await Block.query()
      .where('slug', arg)
      .firstOrFail()

    /*
     * Check if user is blocked.
     */
    const [{total}] = await BlockUser.query()
      .count('* AS total')
      .where('block_id', block.id)
      .where('user_id', user.id)

    if (total !== 0) {
      return response.status(401)
        .send({
          message: 'Unauthorized.',
        })
    }

    await next()
  }
}
