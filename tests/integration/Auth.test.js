const request = require('supertest');
const mongoose = require('mongoose');
const Util = require('../../api/util/Util');
const {User} = require('../../api/models/User');


let server;

describe('Auth Login Tests', () => {
    
    beforeEach(async () => { 
      server = require('../../server'); 
      const hashedPassword = await Util.hashPassword('password1234');
      const user = new User({ name: 'username1',email: 'u@g.com', password:hashedPassword });
      await user.save();
    })
    afterEach(async () => { 
      server.close(); 
      await User.remove({});
    });
  
    describe('POST /login', () => {

        let email;
        let password; 
    
        const exec = async () => {
          return await request(server)
            .post('/login')
            .send({ email, password });
        }
    
        test('should return 401 if unauthorized due to username not exists', async () => {
          email='notexists@gmail.com';
          password='password1234';
          const res = await exec();
    
          expect(res.status).toBe(401);
          expect(res.body).toContain('Incorrect login credentials');
        });
    
        test('should return 401 if unauthorized due to incorrect password', async () => {
          
          email='u@g.com';
          password='password12345';
           
          const res = await exec();
         
          expect(res.status).toBe(401);
          expect(res.body).toContain('Incorrect login credentials');
        });

        test('should return 200 for success login with valid user object', async () => {
          
          email='u@g.com';
          password='password1234';
           
          const res = await exec();
         
          expect(res.status).toBe(200);
          const authToken = Util.generateAuthToken(res.body);
          expect(res.headers['x-auth-token']).toEqual(authToken);
          expect(res.body).toHaveProperty('_id');
          expect(res.body).not.toHaveProperty('password');
     
        });
          

      });

  

});