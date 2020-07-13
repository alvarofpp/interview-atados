import {rules, schema} from '@ioc:Adonis/Core/Validator'
import ValidatorDesign from "App/Validators/ValidatorDesign";

export default class RegisterValidator extends ValidatorDesign {
  /**
   * Defining a schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({trim: true}, [
      rules.minLength(3),
      rules.maxLength(255),
    ]),
    email: schema.string({trim: true}, [
      rules.maxLength(255),
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [
      rules.confirmed(),
      rules.minLength(6),
      rules.maxLength(20),
    ]),
  })
}
