import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import StoreValidator from "App/Validators/Message/StoreValidator";
import Database from "@ioc:Adonis/Lucid/Database";
import Message from "App/Models/Message";
import Filter from "App/Helpers/Filter";
import moment from 'moment'

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
      return response.status(422)
        .send({
          message: clauses.message,
          error: clauses.error,
        })
    }

    const messagesQuery = await Database.query()
      .select('*')
      .from('messages')
      .where(clauses)
      .where((query) => {
        return query.whereNull('scheduled_at')
          .orWhere('scheduled_at', '<', moment().format('DD/MM/YYYY hh:mm:ss'))
      })

    return response.status(200)
      .send({
        data: messagesQuery
      })
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
   * @param params
   * @param response
   */
  public async read({params, response}: HttpContextContract) {
    const messageId = params.id
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
   * @param params
   * @param response
   */
  public async destroy({params, response}: HttpContextContract) {
    const message = await Message.findOrFail(params.id)
    await message.delete()

    return response.status(200)
      .send({
        message: `Message successfully deleted.`,
      })
  }
}
