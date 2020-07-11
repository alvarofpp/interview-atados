import {validator} from '@ioc:Adonis/Core/Validator'
import moment = require('moment')

/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
validator.rule('date_format', (
  value, [{format = 'YYYY-MM-DD HH:mm:ss'}],
  {pointer, arrayExpressionPointer, errorReporter}
) => {
  /**
   * Skip validation when value is not a string. The string
   * schema rule will handle it
   */
  if (typeof (value) !== 'string') {
    return
  }

  /**
   * Parse phone number from a string
   */
  const valid = moment(value, format, true);

  if (!valid.isValid()) {
    errorReporter.report(pointer, 'date_format', 'Invalid format', arrayExpressionPointer)
  }

})
