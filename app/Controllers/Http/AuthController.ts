import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator';
import User from 'App/Models/User';
import ResponsePattern from 'App/Helpers/ResponsePattern';
import Database from '@ioc:Adonis/Lucid/Database'
import LoginValidator from "App/Validators/Auth/LoginValidator";

export default class AuthController {
  /**
   * Handle a registration request for the application.
   *
   * @param request
   * @return JSON
   */
  public async register({request}: HttpContextContract) {
    const data = await request.validate(RegisterValidator)
    const trx = await Database.transaction()

    try {
      const user = await User.create(data, {client: trx})
      await trx.commit()
      return ResponsePattern.success({
        message: 'User registered successfully!',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    } catch (error) {
      await trx.rollback()
      return ResponsePattern.error({
        message: 'An error occurred during user registration.',
        error: error,
      })
    }
  }

  /**
   * Login to the application.
   *
   * @param request
   * @param auth
   */
  public async login({request, auth}: HttpContextContract) {
    const data = await request.validate(LoginValidator)

    const token = await auth.use('api').attempt(data.email, data.password)
    return ResponsePattern.data({
      data: token.toJSON()
    })
  }

  /**
   * Application logout.
   *
   * @param auth
   */
  public async logout({auth}: HttpContextContract) {
    await auth.logout()
    return ResponsePattern.success({
      message: "Come back often!",
    })
  }
}
