import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import StoreValidator from "App/Validators/Message/StoreValidator";
import Database from "@ioc:Adonis/Lucid/Database";
import Message from "App/Models/Message";
import DestroyValidator from "App/Validators/Message/DestroyValidator";
import ReadValidator from "App/Validators/Message/ReadValidator";
import Filter from "App/Helpers/Filter";

export default class MessageController {
  /**
   * Display a listing of the resource.
   *
   * @param request
   * @param auth
   * @param response
   */
  public async index({request, auth, response}: HttpContextContract) {
    const user = await auth.authenticate()
    var clauses: any = {
      user_to_id: user.id,
    }
    const queryString = request.get()
    const filters = [{
      'column': 'readed',
      'type': 'boolean',
    },]

    clauses = Filter.apply(queryString, filters, clauses)
    if ('hasError' in clauses) {
      return response.status(400)
        .send({
          message: clauses.message,
          error: clauses.error,
      })
    }

    const messagesQuery = await Database.query()
      .select('*')
      .from('messages')
      .where(clauses)

    return response.status(200)
      .send(messagesQuery)
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param request
   * @param auth
   * @param response
   */
  public async store({request, auth, response}: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const trx = await Database.transaction()
    const user = await auth.authenticate()

    try {
      const message = await Message.create({
        text: data.text,
        readed: false,
        scheduledAt: data.scheduled_at,
        userFromId: user.id,
        userToId: data.user_to_id,
      }, {client: trx})
      await trx.commit()

      return response.status(200)
        .send({
          message: 'Message registered successfully!',
          data: message,
        })
    } catch (error) {
      await trx.rollback()
      return response.status(500)
        .send({
          message: 'An error occurred during message registration.',
          error: error,
        })
    }
  }

  /**
   * Marks a message as read.
   *
   * @param request
   * @param params
   * @param response
   */
  public async read({request, params, response}: HttpContextContract) {
    const messageId = params.id
    request.updateBody({
      message_id: messageId,
    })

    await request.validate(ReadValidator)
    const message = await Message.findOrFail(messageId)
    if (message.readed) {
      return response.status(400)
        .send({
          message: 'Message is already marked as read.',
        })
    }

    message.readed = true
    await message.save()

    return response.status(200)
      .send({
        message: 'Message marked as read.',
      })
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param request
   * @param params
   * @param response
   */
  public async destroy({request, params, response}: HttpContextContract) {
    request.updateBody({
      message_id: params.id,
    })
    const data = await request.validate(DestroyValidator)
    console.log('data:', data)
    const message = await Message.findOrFail(data.message_id)
    // await message.delete()

    return response.status(200)
      .send({
        message: `Message successfully deleted.`,
        data: message,
      })
  }
}
