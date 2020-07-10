import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator';
import User from 'App/Models/User';
import ResponsePattern from 'App/Helpers/ResponsePattern';
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
  /**
   * 
   * @param request
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

  public async login({request, auth}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password)
    return token.toJSON()
  }

  public async logout({request, auth}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password)
    return token.toJSON()
  }
}
