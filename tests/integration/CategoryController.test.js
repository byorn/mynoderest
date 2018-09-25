const request = require('supertest');
const mongoose = require('mongoose');
const Util = require('../../api/util/Util');
const {User} = require('../../api/models/User');
const {Category} = require('../../api/models/Category');

let server;

describe('CategoryController Tests', () => {
    beforeEach(() => { server = require('../../server'); })
    afterEach(async () => { 
      server.close(); 
      await Category.remove({});
    });
  
    describe('GET /categories', () => {
      test('should return all categories', async () => {
        const cat1 = new Category({ name: 'cat1' });
        await cat1.save();
        const cat2 = new Category({ name: 'cat2' });
        await cat2.save();
        
        const res = await request(server).get('/categories');
        
         expect(res.status).toBe(200);
         expect(res.body.length).toBe(2);
         expect(res.body.some(t => t.name === 'cat1')).toBeTruthy();
         expect(res.body.some(t => t.name === 'cat2')).toBeTruthy();
      });
    });


    describe('GET /categories/:id', () => {
        test('should return a category if valid id is passed', async () => {
          const cat = new Category({ name: 'cat1' });
          await cat.save();
        
          const res = await request(server).get('/categories/' + cat._id);
    
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('name', cat.name);     
        });
    
        test('should return 404 if invalid id is passed', async () => {
          const res = await request(server).get('/categories/1');
    
          expect(res.status).toBe(404);
        });
    
        test('should return 404 if no category with the given id exists', async () => {
          const id = mongoose.Types.ObjectId();
          const res = await request(server).get('/categories/' + id);

          expect(res.status).toBe(404);
        });
      });

      describe('POST /categories', () => {

        let token; 
        let name; 
    
        const exec = async () => {
          return await request(server)
            .post('/categories')
            .set('x-auth-token', token)
            .send({ name });
        }
    
        beforeEach(() => {

          token = Util.generateAuthToken(new User());
          name = 'cat03'; 
        })
    
        test('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        test('should save the category', async () => {
          const res = await exec();
    
          const cat = await Category.find({ name: 'cat03' });
    
          expect(cat).not.toBeNull();

          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('name', 'cat03');

        });
            
      });

      describe('PUT /:id', () => {
        let token; 
        let newName; 
        let cat; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .put('/categories/' + id)
            .set('x-auth-token', token)
            .send({ name: newName });
        }
    
        beforeEach(async () => {
               
          cat = new Category({ name: 'cat04' });
          await cat.save();
          
          token = Util.generateAuthToken(new User());     
          id = cat._id; 
          newName = 'updatedName'; 
        })
    
        test('should return the updated category', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('name', newName);
        });

        it('should return 404 if category with the given id was not found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });

        it('should return 404 if category with the given id is invalid', async () => {
          id = '1'
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });


      });
    
      describe('DELETE /:id', () => {
        let token; 
        let cat; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .delete('/categories/' + id)
            .set('x-auth-token', token)
            .send();
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          cat = new Category({ name: 'catergory12' });
          await cat.save();
          
          id = cat._id; 
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
    
        it('should return 404 if no category with the given id was found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should delete the category if input is valid', async () => {
          const res = await exec();
    
          const catInDB = await Category.findById(id);
    
          expect(catInDB).toBeNull();
          expect(res.body).toHaveProperty('_id', cat._id.toHexString());
          expect(res.body).toHaveProperty('name', cat.name);
        });
    
        
      }); 

});it