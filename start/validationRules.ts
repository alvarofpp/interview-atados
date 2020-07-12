import {validator} from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
validator.rule('belongs_user', async (
  value, [{table, column}],
  {pointer, arrayExpressionPointer, errorReporter, root, tip}
) => {
  console.log('------------BELONGS TO THE USER------------');
  /**
   * Skip validation when value is not a number. The number
   * schema rule will handle it
   */
  if (typeof (value) !== 'number') {
    return
  }

  /**
   * Get user id
   */
  validator.helpers.getFieldValue('user_from_id', root, tip)
  const userId = tip.user_from_id

  /**
   * Parse phone number from a string
   */
  const [{total}] = await Database.query()
    .count('* AS total')
    .from(table)
    .where('id', value)
    .where(column, userId)

  console.log("VALUE: ", value);
  console.log("TABLE: ", table);
  console.log("COLUMN: ", column);
  console.log("UserID: ", userId);
  console.log("TOTAL: ", total)
  console.log("IF: ", total == 0, total === 0)
  console.log('------------------------------------------------');

  if (total === 0) {
    console.log('CHAMOU')
    errorReporter.report(pointer, 'belongs_user', 'Message does not belong to the user in the session.', arrayExpressionPointer)
    console.log(errorReporter, pointer, arrayExpressionPointer)
    console.log('CHAMOU')
  }

})
