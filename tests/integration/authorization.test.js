const {User} = require('../../api/models/User');
const Util = require('../../api/util/Util');
const {Task} = require('../../api/models/Task');
const request = require('supertest');

describe('Authrization middleware integration test', () => {
  beforeEach(() => { server = require('../../server'); })
  afterEach(async () => { 
    await Task.remove({});
    server.close(); 
  });

  let token; 

  const exec = () => {
    return request(server)
      .post('/tasks')
      .set('x-auth-token', token)
      .send({ name: 'task05' });
  }

  beforeEach(() => {
    token = Util.generateAuthToken(new User());
  });

  test('should return 401 if no token is provided', async () => {
    token = ''; 

    const res = await exec();

    expect(res.status).toBe(401);
  });

  test('should return 400 if token is invalid', async () => {
    token = 'a'; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  test('should return 200 if token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});