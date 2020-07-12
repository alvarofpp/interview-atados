import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import ResponsePattern from "../../Helpers/ResponsePattern";
import StoreValidator from "App/Validators/Message/StoreValidator";
import Database from "@ioc:Adonis/Lucid/Database";
import Message from "App/Models/Message";

export default class MessageController {
  public async store({request, auth}: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const trx = await Database.transaction()
    const user = await auth.authenticate()

    try {
      const message = await Message.create({
        text: data.text,
        readed: false,
        scheduled_at: data.scheduled_at,
        user_from_id: user.id,
        user_to_id: data.user_to_id,
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
}
