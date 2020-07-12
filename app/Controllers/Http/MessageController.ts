import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import ResponsePattern from "../../Helpers/ResponsePattern";
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
   */
  public async index({request, auth}: HttpContextContract) {
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
      return ResponsePattern.error(clauses)
    }

    const messagesQuery = await Database.query()
      .select('*')
      .from('messages')
      .where(clauses)

    return ResponsePattern.data(messagesQuery)
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param request
   * @param auth
   */
  public async store({request, auth}: HttpContextContract) {
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

      return ResponsePattern.success({
        message: 'Message registered successfully!',
        data: message,
      })
    } catch (error) {
      await trx.rollback()
      return ResponsePattern.error({
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
   */
  public async read({request, params}: HttpContextContract) {
    const messageId = params.id
    request.updateBody({
      message_id: messageId,
    })

    await request.validate(ReadValidator)
    const message = await Message.findOrFail(messageId)
    message.readed = true
    await message.save()

    return ResponsePattern.success({
      message: 'Message marked as read.',
      data: message,
    })
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param request
   * @param params
   */
  public async destroy({request, params}: HttpContextContract) {
    request.updateBody({
      message_id: params.id,
    })
    const data = await request.validate(DestroyValidator)
    console.log('data:', data)
    const message = await Message.findOrFail(data.message_id)
    // await message.delete()

    return ResponsePattern.success({
      message: `Message successfully deleted.`,
      data: message,
    })
  }
}
