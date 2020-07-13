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

  test('Register', async (assert) => {
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

    /**
     * Check database
     */
    const user = await User.find(response.body.data.id)
    assert.isNotNull(user)
    assert.notStrictEqual(user?.password, userData.password)
  })

  test('Login', async (assert) => {
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
