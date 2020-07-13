import test from 'japa'
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
const userData = {
  "name": "Sr Testando",
  "email": "testando@gmail.com",
  "password": "testando",
  "password_confirmation": "testando"
}

test.group('Auth flow', () => {
  this.accessToken = ''

  test('Implementar criação de usuários com os campos email, nome e senha', async (assert) => {
    /**
     * Make request
     */
    const response = await supertest(BASE_URL)
      .post('/auth/register')
      .send(userData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    /**
     * Check response
     */
    assert.containsAllKeys(response.body, {
      message: '',
      data: {
        id: '',
        name: '',
        email: '',
      }
    })
  })

  test('Implementar hash de senha', async (assert) => {
    const user = await User.query()
      .where('email', userData.email)
      .firstOrFail()

    /**
     * Check database
     */
    assert.isNotNull(user)
    assert.notStrictEqual(user.password, userData.password)
  })

  test('Como usuário eu devo conseguir gerar um token de acesso com uma combinação de email e senha', async (assert) => {
    /**
     * Make request
     */
    const response = await supertest(BASE_URL)
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    /**
     * Check response
     */
    assert.containsAllKeys(response.body, {
      data: {
        type: '',
        token: '',
      }
    })

    this.accessToken = response.body.data.token
  })

  test('Como usuário eu devo conseguir me registrar somente se meu email não estiver registrado', async (assert) => {
    /**
     * Make request
     */
    const response = await supertest(BASE_URL)
      .post('/auth/register')
      .send(userData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)

    /**
     * Check response
     */
    assert.containsAllKeys(response.body, {
      email: '',
    })
  })

  test('Logout', async (assert) => {
    /**
     * Make request
     */
    const response = await supertest(BASE_URL)
      .get('/auth/logout')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + this.accessToken)
      .expect('Content-Type', /json/)
      .expect(200)

    /**
     * Check response
     */
    assert.containsAllKeys(response.body, {
      message: '',
    })
  })
})
