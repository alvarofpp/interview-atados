import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator';
import User from 'App/Models/User';
import Database from '@ioc:Adonis/Lucid/Database'
import LoginValidator from "App/Validators/Auth/LoginValidator";

export default class AuthController {
  /**
   * Handle a registration request for the application.
   *
   * @param request
   * @param response
   * @return JSON
   */
  public async register({request, response}: HttpContextContract) {
    const data = await request.validate(RegisterValidator)
    const trx = await Database.transaction()

    try {
      const user = await User.create(data, {client: trx})
      await trx.commit()

      return response.status(200)
        .send({
          message: 'User registered successfully!',
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        })
    } catch (error) {
      await trx.rollback()
      return response.status(500)
        .send({
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
   * @param response
   */
  public async login({request, auth, response}: HttpContextContract) {
    const data = await request.validate(LoginValidator)
    const token = await auth.use('api').attempt(data.email, data.password)

    return response.status(200)
      .send({
        data: token.toJSON(),
      })
  }

  /**
   * Application logout.
   *
   * @param auth
   * @param response
   */
  public async logout({auth, response}: HttpContextContract) {
    await auth.logout()

    return response.status(200)
      .send({
        message: "Come back often!",
      })
  }
}
