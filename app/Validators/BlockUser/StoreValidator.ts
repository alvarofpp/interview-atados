import {rules, schema} from '@ioc:Adonis/Core/Validator'
import ValidatorDesign from "App/Validators/ValidatorDesign";

export default class StoreValidator extends ValidatorDesign {
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
    block_slug: schema.string({}, [
      rules.exists({table: 'blocks', column: 'slug'})
    ]),
    user_email: schema.string({}, [
      rules.exists({table: 'users', column: 'email'})
    ]),
  })
}
