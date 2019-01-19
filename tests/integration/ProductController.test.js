const request = require('supertest');
const mongoose = require('mongoose');
const Util = require('../../api/util/Util');
const {User} = require('../../api/models/User');
const {Product} = require('../../api/models/Product');
const {Category} = require('../../api/models/Category');

let server;

describe('ProductControllerTest Tests', () => {

    beforeEach(() => { server = require('../../server'); });
    afterEach(async () => { 
      server.close(); 
      await Product.remove({});
      await Category.remove({});
    });
  
      
    describe('GET /products', () => {
      test('should return all products', async () => {
        
        const cat = new Category({ name: 'cat2' });
        cat.save();
        
        const product1 = new Product({ name: 'product1',description: 'product1 description', category:cat._id,price: '23.50', qty:10,pics:[]});
        await product1.save();
        
        const res = await request(server).get('/products');
        
         expect(res.status).toBe(200);
         expect(res.body.length).toBe(1);
         expect(res.body.some(t => t.name === 'product1')).toBeTruthy();
        
      });

    });

    describe('GET /products/:id', () => {
      test('should return a product if valid id is passed', async () => {
        const cat = new Category({ name: 'cat2' });
        cat.save();
        
        const product1 = new Product({ name: 'product1',description: 'product1 description', category:cat._id,price: '23.50', qty:10,pics:[]});
        await product1.save();
      
        const res = await request(server).get('/products/' + product1._id);
  
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', product1.name);     
      });

      test('should return 404 if invalid id is passed', async () => {
        const res = await request(server).get('/products/1');
  
        expect(res.status).toBe(404);
      });

      test('should return 404 if no product with the given id exists', async () => {
        const id = mongoose.Types.ObjectId();
        const res = await request(server).get('/products/' + id);

        expect(res.status).toBe(404);
      });

    });

    
    describe('POST /products', () => {

        let token; 
        let name; 
        let description;
        let category;
        let price;
        let qty;
        let pics = [];

        const exec = async () => {
          return await request(server)
            .post('/products')
            .set('x-auth-token', token)
            .send({ name, description,category, price, qty });
        }
    
        beforeEach(() => {

          token = Util.generateAuthToken(new User());
          name = 'camera xyz';
          description = '<b>some long description about xyz camera</b>';
          const cat = new Category({ name: 'Electronics' });
          cat.save();
          category = cat._id;
          price = 200.45;
          qty = 400;

        })

        afterEach(async () => { 
          await Category.remove({});
          await Product.remove({});
        });
    
        test('should save the product', async () => {
          const res = await exec();
    
          const product = await Product.find({ name: 'camera xyz' });
    
          expect(product).not.toBeNull();

          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('name', 'camera xyz');
          expect(res.body).toHaveProperty('description', '<b>some long description about xyz camera</b>');

        });

        test('should return 401 if client is not logged in', async () => {
          token = ''; 
          const res = await exec();
          expect(res.status).toBe(401);
        });

        test('should return 409 if product already exists', async () => {
          const cat = new Category({ name: 'cat2' });
          cat.save();

          const product1 = new Product({ name: 'camera xyz',description: 'product1 description', category:cat._id,price: '23.50', qty:10,pics:[]});
          await product1.save();

          const res = await exec();
          expect(res.text).toMatch("Product already exists");
          expect(res.status).toBe(409);
        });

    });

   describe('PUT /:id', () => {
    let token; 
    let name; 
    let description;
    let category;
    let price;
    let qty;
    let pics = [];
    let id;
  
      const exec = async () => {
        
        return await request(server)
          .put('/products/' + id)
          .set('x-auth-token', token)
          .send({ name:newName, description,category, price, qty });
      }
  
      beforeEach(async () => {
             
        const cat = new Category({ name: 'cat2' });
        cat.save();

        const product1 = new Product({ name: 'camera xyz',description: 'product1 description', category:cat._id,price: '23.50', qty:10,pics:[]});
        await product1.save();
        
        token = Util.generateAuthToken(new User());     
        id = product1._id; 
        newName = 'mobile phone xyz'; 
      });

      afterEach(async () => { 
        await Category.remove({});
        await Product.remove({});
      });

      test('should return 409 if update product to an existing product', async () => {
     
        const cat = new Category({ name: 'cat3' });
        cat.save();

        const product1 = new Product({ name: 'camera abc',description: 'product1 description', category:cat._id,price: '23.50', qty:10,pics:[]});
        await product1.save();
      
        newName='camera abc';
        const res = await exec();

        expect(res.text).toMatch("Product already exists");
        expect(res.status).toBe(409);
  
      });

      test('should update successfully when updating name to the same name', async () => {
          
        newName='camera xyz';
        const res = await exec();

        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', newName);
      });

      test('should return the updated product', async () => {
        const res = await exec();
  
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', newName);
      });

      it('should return 404 if product with the given id was not found', async () => {
        id = mongoose.Types.ObjectId();
  
        const res = await exec();
  
        expect(res.status).toBe(404);
      });

      it('should return 404 if product with the given id is invalid', async () => {
        id = '1'
  
        const res = await exec();
  
        expect(res.status).toBe(404);
      });
    
    }); 
    
    describe('DELETE /:id', () => {
      let token; 
     let id; 
     let product;
  
      const exec = async () => {
        return await request(server)
          .delete('/products/' + id)
          .set('x-auth-token', token)
          .send();
      }
  
      beforeEach(async () => {
      
        const cat = new Category({ name: 'cat2' });
        cat.save();

        product = new Product({ name: 'camera xyz',description: 'product1 description', category:cat._id,price: '23.50', qty:10,pics:[]});
        await product.save();
        
        id = product._id; 
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
  
      it('should return 404 if no prodict with the given id was found', async () => {
        id = mongoose.Types.ObjectId();
  
        const res = await exec();
  
        expect(res.status).toBe(404);
      });
  
      it('should delete the product if input is valid', async () => {
        const res = await exec();
  
        const productInDB = await Product.findById(id);
  
        expect(productInDB).toBeNull();
        expect(res.body).toHaveProperty('_id', product._id.toHexString());
        expect(res.body).toHaveProperty('name', product.name);
      });
  
      
    }); 




}); 