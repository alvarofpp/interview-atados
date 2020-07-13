import test from 'japa'
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Message flow', () => {
  this.users = [{
    name: "Tester 01",
    email: "tester01@gmail.com",
    password: "tester01",
  }, {
    name: "Tester 02",
    email: "tester02@gmail.com",
    password: "tester02",
  }]
  this.ctx = {
    message_id: null,
  }

  test('Tester 01 send a message to Tester 02', async (assert) => {
    await User.createMany(this.users)
    // Tester 01 ID
    var userDb = await User.query()
      .where('email', this.users[0].email)
      .firstOrFail()
    this.users[0]['id'] = userDb['id']
    // Tester 02 ID
    userDb = await User.query()
      .where('email', this.users[1].email)
      .firstOrFail()
    this.users[1]['id'] = userDb['id']

    /**
     * Get token
     */
    var response = await supertest(BASE_URL)
      .post('/auth/login')
      .send({
        email: this.users[0].email,
        password: this.users[0].password,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    this.users[0]['token'] = response.body.data.token

    /**
     * Send message to Tester 02
     */
    response = await supertest(BASE_URL)
      .post('/messages')
      .send({
        text: '01 to 02',
        user_to_id: this.users[1]['id'],
      })
      .set('Authorization', 'Bearer ' + this.users[0]['token'])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    /**
     * Check response
     */
    assert.containsAllKeys(response.body, {
      message: '',
      data: {
        text: '',
        readed: '',
        user_from_id: '',
        user_to_id: '',
        created_at: '',
        updated_at: '',
        id: ''
      }
    })
    this.ctx.message_id = response.body.data.id
  })

  test('Tester 02 mark as read the message', async (assert) => {
    /**
     * Get token
     */
    var response = await supertest(BASE_URL)
      .post('/auth/login')
      .send({
        email: this.users[1].email,
        password: this.users[1].password,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    this.users[1]['token'] = response.body.data.token

    /**
     * Send message to Tester 02
     */
    response = await supertest(BASE_URL)
      .put('/messages/'+this.ctx.message_id+'/read')
      .set('Authorization', 'Bearer ' + this.users[1]['token'])
      .set('Accept', 'application/json')
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
