const request = require('supertest');
const mongoose = require('mongoose');
const Util = require('../../api/util/Util');
const {User} = require('../../api/models/User');


let server;

describe('UserController Tests', () => {
    beforeEach(() => { server = require('../../server'); })
    afterEach(async () => { 
      server.close(); 
      await User.remove({});
    });
  
    describe('GET /users', () => {
      test('should return all users', async () => {
        const user1 = new User({ name: 'username1',email:'u@g.com',password:'abcd1234' });
        await user1.save();
        const user2 = new User({ name: 'username2',email:'u1@g.com',password:'abcd1234' });
        await user2.save();
        
        const res = await request(server).get('/users');
        
         expect(res.status).toBe(200);
         expect(res.body.length).toBe(2);
         expect(res.body.some(t => t.name === 'username1')).toBeTruthy();
         expect(res.body.some(t => t.name === 'username2')).toBeTruthy();
         expect(res.body[0]).not.toHaveProperty('password','abcd1234');
      });
    });


    describe('GET /users/:id', () => {

        let token = '';
        beforeEach(() => {

          token = Util.generateAuthToken(new User());
        });

        test('should return a user if valid id is passed', async () => {
          const user1 = new User({ name: 'username1',email:'u@g.com',password:'abcd1234' });
          await user1.save();
        
          const res = await request(server)
                            .get('/users/' + user1._id).set('x-auth-token', token);
    
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('name', user1.name);   
          expect(res.body).not.toHaveProperty('password', user1.password);       
        });
    
        test('should return 404 if invalid id is passed', async () => {
          const res = await request(server)
                            .get('/users/1').set('x-auth-token', token);
    
          expect(res.status).toBe(404);
        });
    
        test('should return 404 if no user with the given id exists', async () => {
          const id = mongoose.Types.ObjectId();
          const res = await request(server)
                            .get('/users/' + id).set('x-auth-token', token);

          expect(res.status).toBe(404);
        });
       });

      describe('POST /users', () => {

        let token; 
        let name;
        let email;
        let password; 
    
        const exec = async () => {
          return await request(server)
            .post('/users')
            .set('x-auth-token', token)
            .send({ name,email, password });
        }
    
        beforeEach(() => {

          token = Util.generateAuthToken(new User());
          name = 'username01'; 
          email='u@g.com';
          password='password1234';
        })
    
          
        test('should return 400 if user name is less than 5 characters', async () => {
          name = '1234'; 
          
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        test('should return 400 if user name is more than 50 characters', async () => {
          name = new Array(52).join('a');
    
          const res = await exec();
          expect(res.body).toContain('50');
          expect(res.status).toBe(400);
         
        });
    
        test('should save the user if it is valid', async () => {
          await exec();
    
          const user = await User.find({ email: 'u@g.com' });
    
          expect(user).not.toBeNull();
        });
    
        test('should return the user if it is valid', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('name', 'username01');
        });

        test('should return 400 if email already exists', async () => {
          const user1 = new User({ name: 'username1',email:'u@g.com',password:'abcd1234' });
          await user1.save();
          
          const res = await exec();
    
          expect(res.status).toBe(400);
          expect(res.body).toContain('already registered');
        });

      });

      describe('PUT /:id', () => {
        let token; 
        let newName; 
        let newEmail;
        let newAdmin;
        let user; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .put('/users/' + id)
            .set('x-auth-token', token)
            .send({ name: newName, email:newEmail,isAdmin:newAdmin,password:'abcd1234'});
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          user = new User({ name: 'username01',email:'e@g.com',password:'password1234' });
          await user.save();
          
          token = Util.generateAuthToken(new User());     
          id = user._id; 
          newName = 'username01NewName'; 
          newEmail = 'u@gmail.com';
          newAdmin = true;
        })
    
        test('should return the updated user if it is valid', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('name', newName);
        });

        test('should return 400 if updated new user name is less than 5 characters', async () => {
          newName = '1234'; 
          
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        test('should return 400 if updated new user name is more than 50 characters', async () => {
          newName = new Array(52).join('a');
    
          const res = await exec();
    
          expect(res.status).toBe(400);
        });

        it('should return 404 if user with the given id was not found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
        
          expect(res.status).toBe(404);
        });

        it('should return 404 if user with the given id is invalid', async () => {
          id = '1'
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });


      });
    
      describe('DELETE /:id', () => {
        let token; 
        let user; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .delete('/users/' + id)
            .set('x-auth-token', token)
            .send();
        }
    
        beforeEach(async () => {
             
          user = new User({ name: 'username01',email:'e@g.com',password:'password1234' });
          await user.save();
          
          id = user._id; 
          token = Util.generateAuthToken(new User({ isAdmin: true }));     
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 403 if the user is not an admin', async () => {
          token = Util.generateAuthToken(new User({ isAdmin: false }));   
    
          const res = await exec();
    
          expect(res.status).toBe(403);
        });
    
        it('should return 404 if id is invalid', async () => {
          id = 1; 
          
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should return 404 if no user with the given id was found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should delete the user if input is valid', async () => {
          await exec();
    
          const userInDB = await User.findById(id);
    
          expect(userInDB).toBeNull();
        });
    
        it('should return the removed user', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', user._id.toHexString());
          expect(res.body).toHaveProperty('name', user.name);
        });
      }); 

});