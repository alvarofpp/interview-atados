import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import StoreValidator from "App/Validators/BlockUser/StoreValidator";
import Database from "@ioc:Adonis/Lucid/Database";
import Block from "App/Models/Block";
import User from "App/Models/User";
import BlockUser from "App/Models/BlockUser";

export default class BlockUserController {
  /**
   * Display a listing of the resource.
   *
   * @param request
   * @param auth
   * @param response
   */
  public async index({auth, response}: HttpContextContract) {
    const user = await auth.authenticate()
    const blocks = await BlockUser.query()
      .where('user_id', user.id)
      .preload('block')

    return response.status(200)
      .send({
        data: blocks
      })
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param response
   * @param params
   */
  public async store({request, response}: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const user = await User.query()
      .where('email', data.user_email)
      .firstOrFail()
    const block = await Block.query()
      .where('slug', data.block_slug)
      .firstOrFail()
    const trx = await Database.transaction()

    try {
      const message = await BlockUser.updateOrCreate({
        blockId: block.id,
        userId: user.id,
      }, {}, {client: trx})
      await trx.commit()

      return response.status(200)
        .send({
          message: 'Block assigned to the user successfully!',
          data: message,
        })
    } catch (error) {
      await trx.rollback()
      return response.status(500)
        .send({
          message: 'An error occurred during the block assignment to the user.',
          error: error,
        })
    }
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param params
   * @param response
   */
  public async destroy({params, response}: HttpContextContract) {
    const blockUser = await BlockUser.findOrFail(params.id)
    await blockUser.delete()

    return response.status(200)
      .send({
        message: `Block the user successfully deleted.`,
      })
  }
}
