declare module '@ioc:Adonis/Core/Validator' {
  import {Rule} from '@ioc:Adonis/Core/Validator'

  export interface Rules {
    belongs_user(options: { table: string, column: string, userId }): Rule
  }
}
