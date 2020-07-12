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
  value, [{table, column, userId}],
  {pointer, arrayExpressionPointer, errorReporter}
) => {
  /**
   * Skip validation when value is not a number. The number
   * schema rule will handle it
   */
  if (typeof (value) !== 'number') {
    return
  }

  /**
   * Check if exists element
   */
  const [{total}] = await Database.query()
    .count('* AS total')
    .from(table)
    .where('id', value)
    .where(column, userId)

  if (total === 0) {
    errorReporter.report(pointer, 'belongs_user', 'Message does not belong to the user in the session.', arrayExpressionPointer)
    console.log('ATIVOU ERRO')
  }

})
