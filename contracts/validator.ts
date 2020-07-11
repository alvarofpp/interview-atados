declare module '@ioc:Adonis/Core/Validator' {
  import {Rule} from '@ioc:Adonis/Core/Validator'

  export interface Rules {
    date_format(options: { format: string }): Rule
  }
}
