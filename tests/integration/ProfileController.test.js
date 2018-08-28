const request = require('supertest');
const mongoose = require('mongoose');
const Util = require('../../api/util/Util');
const {User} = require('../../api/models/User');
const {Profile} = require('../../api/models/Profile');

let server;

describe('ProfileController Tests', () => {
    beforeEach(() => { server = require('../../server'); })
    afterEach(async () => { 
      server.close(); 
      await Profile.remove({});
    });
    
    
    describe('POST /profile', () => {

      let token;
      let email; 
      let firstName
      let lastName;
      let pic; 
  
      const exec = async () => {
        return await request(server)
          .post('/profile')
          .set('x-auth-token', token)
          .send({ email,firstName, lastName, pic });
      }

      beforeEach(() => {
        token = Util.generateAuthToken(new User());
        email='u@g.com';
        firstName='Jenniffer';
        lastName='Lopez';
        pic='';
      })

      test('should create a profile', async () => {
        const res = await exec();

        const profile = await Profile.find({ email: 'u@g.com' });
       
        expect(profile).not.toBeNull();
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('email', 'u@g.com');
      });

      test('should return 400 if creating a duplicate email', async () => {
        
        const profile = new Profile({ email:'u@g.com',firstName:'Nataliya',lastName:'Imbruglia',pic:''});
        await profile.save();
       
        const res = await exec();
        expect(res.status).toBe(400);
      });

      test('should return 401 if client is not logged in', async () => {
        token = ''; 
        const res = await exec();
  
        expect(res.status).toBe(401);
      });
          
    });

    describe('GET /profile/:email', () => {
      test('should return a profile for a given email', async () => {
        const profile = new Profile({ email:'e@b.com',firstName:'Nataliya',lastName:'Imbruglia',pic:''});
        await profile.save();
      
        const res = await request(server).get('/profile/' + profile.email);
  
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('email', profile.email);   
      });
      
      test('should return 404 if no profile with the given email exists', async () => {
        const email = 'something@somewhere.com';
        const res = await request(server).get('/profile/' + email);

        expect(res.status).toBe(404);
      });
    });

   

});