/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return {hello: 'world'}
})

Route
  .group(() => {
    Route.resource('users', 'UserController')
      .apiOnly()

    Route.resource('users.messages', 'MessageController')
      .apiOnly()

    Route.get('/logout', 'AuthController.logout')
      .as('auth.logout')
  }).middleware('auth:api')

Route.post('auth/register', 'AuthController.register')
  .as('auth.register')
Route.post('/login', 'AuthController.login')
  .as('auth.login')

