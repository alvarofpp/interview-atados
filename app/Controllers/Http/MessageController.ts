import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import ResponsePattern from "../../Helpers/ResponsePattern";
import StoreValidator from "App/Validators/Message/StoreValidator";
import Database from "@ioc:Adonis/Lucid/Database";
import Message from "App/Models/Message";
import DestroyValidator from "App/Validators/Message/DestroyValidator";

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

  public async destroy({request, params, auth}: HttpContextContract) {
    const user = await auth.authenticate()
    request.updateBody({
      message_id: params.id,
      user_from_id: user.id,
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
