const request = require('supertest');
const mongoose = require('mongoose');
const Util = require('../../api/util/Util');
const {User} = require('../../api/models/User');
const {Task} = require('../../api/models/Task');

let server;

describe('TaskController Tests', () => {
    beforeEach(() => { server = require('../../server'); })
    afterEach(async () => { 
      server.close(); 
      await Task.remove({});
    });
  
    describe('GET /tasks', () => {
      test('should return all tasks', async () => {
        const task1 = new Task({ name: 'task1' });
        await task1.save();
        const task2 = new Task({ name: 'task2' });
        await task2.save();
        
        const res = await request(server).get('/tasks');
        
         expect(res.status).toBe(200);
         expect(res.body.length).toBe(2);
         expect(res.body.some(t => t.name === 'task1')).toBeTruthy();
         expect(res.body.some(t => t.name === 'task2')).toBeTruthy();
      });
    });


    describe('GET /tasks/:id', () => {
        test('should return a task if valid id is passed', async () => {
          const task = new Task({ name: 'task1' });
          await task.save();
        
          const res = await request(server).get('/tasks/' + task._id);
    
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('name', task.name);     
        });
    
        test('should return 404 if invalid id is passed', async () => {
          const res = await request(server).get('/tasks/1');
    
          expect(res.status).toBe(404);
        });
    
        test('should return 404 if no task with the given id exists', async () => {
          const id = mongoose.Types.ObjectId();
          const res = await request(server).get('/tasks/' + id);

          expect(res.status).toBe(404);
        });
      });

      describe('POST /tasks', () => {

        let token; 
        let name; 
    
        const exec = async () => {
          return await request(server)
            .post('/tasks')
            .set('x-auth-token', token)
            .send({ name });
        }
    
        beforeEach(() => {

          token = Util.generateAuthToken(new User());
          name = 'task03'; 
        })
    
        test('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        test('should return 400 if task name is less than 5 characters', async () => {
          name = '1234'; 
          
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        test('should return 400 if task is more than 300 characters', async () => {
          name = new Array(301).join('a');
    
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        test('should save the task if it is valid', async () => {
          await exec();
    
          const task = await Task.find({ name: 'task03' });
    
          expect(task).not.toBeNull();
        });
    
        test('should return the task if it is valid', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('name', 'task03');
        });
      });

      describe('PUT /:id', () => {
        let token; 
        let newName; 
        let task; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .put('/tasks/' + id)
            .set('x-auth-token', token)
            .send({ name: newName });
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          task = new Task({ name: 'tash07' });
          await task.save();
          
          token = Util.generateAuthToken(new User());     
          id = task._id; 
          newName = 'updatedName'; 
        })
    
        test('should return the updated task if it is valid', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('name', newName);
        });

        test('should return 400 if updated new task name is less than 5 characters', async () => {
          newName = '1234'; 
          
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        test('should return 400 if updated new task name is more than 300 characters', async () => {
          newName = new Array(301).join('a');
    
          const res = await exec();
    
          expect(res.status).toBe(400);
        });

        it('should return 404 if task with the given id was not found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });

        it('should return 404 if task with the given id is invalid', async () => {
          id = '1'
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });


      });
    
      describe('DELETE /:id', () => {
        let token; 
        let genre; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .delete('/tasks/' + id)
            .set('x-auth-token', token)
            .send();
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          task = new Task({ name: 'task12' });
          await task.save();
          
          id = task._id; 
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
    
        it('should return 404 if no task with the given id was found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should delete the task if input is valid', async () => {
          await exec();
    
          const taskInDB = await Task.findById(id);
    
          expect(taskInDB).toBeNull();
        });
    
        it('should return the removed task', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', task._id.toHexString());
          expect(res.body).toHaveProperty('name', task.name);
        });
      }); 

});