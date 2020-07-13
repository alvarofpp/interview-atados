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

  test('Como usuário eu devo conseguir enviar uma mensagem para outro usuário', async (assert) => {
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

  test('Como usuário eu devo conseguir agendar o envio de uma mensagem', async (assert) => {
    /**
     * Send message scheduled
     */
    const response = await supertest(BASE_URL)
      .post('/messages')
      .send({
        text: '01 to 02 again',
        user_to_id: this.users[1]['id'],
        scheduled_at: '25/07/2020 14:00',
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
        scheduled_at: '',
        id: ''
      }
    })
    this.ctx.message_scheduled_id = response.body.data.id
  })

  test('Como usuário eu devo conseguir enviar uma mensagem somente se estiver autorizado', async (assert) => {
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
     * Block Tester 01
     */
    response = await supertest(BASE_URL)
      .post('/block_user')
      .send({
        block_slug: 'messages_send',
        user_email: this.users[0]['email']
      })
      .set('Authorization', 'Bearer ' + this.users[1]['token'])
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
        user_id: '',
        block_id: '',
        created_at: '',
        updated_at: ''
      }
    })
    this.ctx.block_id = response.body.data.id

    /**
     * Tester 01 try to send a message to Tester 02
     */
    response = await supertest(BASE_URL)
      .post('/messages')
      .send({
        text: '01 to 02 again (but blocked)',
        user_to_id: this.users[1]['id'],
      })
      .set('Authorization', 'Bearer ' + this.users[0]['token'])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)

    /**
     * Check response
     */
    assert.containsAllKeys(response.body, {
      message: '',
    })

    /**
     * Removes block of Tester 01
     */
    response = await supertest(BASE_URL)
      .delete('/block_user/' + this.ctx.block_id)
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

    /**
     * Tester 01 try to send a message to Tester 02
     */
    response = await supertest(BASE_URL)
      .post('/messages')
      .send({
        text: '01 to 02 again (without block)',
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
    this.ctx.message_delete_id = response.body.data.id
  })

  test('Como usuário eu devo conseguir deletar os mensagens enviadas por mim', async (assert) => {
    /**
     * Delete message (Tester 01)
     */
    const response = await supertest(BASE_URL)
      .delete('/messages/'+this.ctx.message_delete_id)
      .set('Authorization', 'Bearer ' + this.users[0]['token'])
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

  test('Como usuário eu não devo ter acesso para deletar mensagens que não foram criados por mim', async (assert) => {
    /**
     * Tester 02 try delete a message that not belongs to him
     */
    const response = await supertest(BASE_URL)
      .delete('/messages/'+this.ctx.message_id)
      .set('Authorization', 'Bearer ' + this.users[1]['token'])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)

    /**
     * Check response
     */
    assert.containsAllKeys(response.body, {
      message: '',
    })
  })

  test('Como usuário eu devo conseguir marcar uma mensagem como lido', async (assert) => {
    /**
     * Send message to Tester 02
     */
    const response = await supertest(BASE_URL)
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

  test('Como usuário eu devo conseguir filtrar as mensagens por lido ou não', async (assert) => {
    /**
     * Get messages
     */
    var response = await supertest(BASE_URL)
      .get('/messages?readed=true')
      .set('Authorization', 'Bearer ' + this.users[1]['token'])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    /**
     * Check response
     */
    assert.containsAllDeepKeys(response.body, {
      data: [{
        id: '',
        text: '',
        readed: '',
        scheduled_at: '',
        user_from_id: '',
        user_to_id: '',
        created_at: '',
        updated_at: ''
      }]
    })
    assert.lengthOf(response.body.data, 1)

    /**
     * Get messages
     */
    response = await supertest(BASE_URL)
      .get('/messages?readed=false')
      .set('Authorization', 'Bearer ' + this.users[1]['token'])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    /**
     * Check response
     */
    assert.containsAllDeepKeys(response.body, {
      data: [{
        id: '',
        text: '',
        readed: '',
        scheduled_at: '',
        user_from_id: '',
        user_to_id: '',
        created_at: '',
        updated_at: ''
      }]
    })
    assert.lengthOf(response.body.data, 0)
  })
})
