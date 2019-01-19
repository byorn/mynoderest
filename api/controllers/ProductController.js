'use strict';
const {Product,validate} = require('../models/Product');


exports.list_all_products = async (req, res) => {
  const products = await Product.find();
 
  res.send(products);
};

exports.read_a_product = async function(req, res) {
  let product =  await Product.findById(req.params.id);
  if (!product) return res.status(404).send('The product with the given ID was not found.');
  res.send(product);
};

exports.create_a_product = async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).json(error.details[0].message);
  

  //if product  already exists
  let product = await Product.findOne({"name":req.body.name});
  if(product) return res.status(409).json("Product already exists");

  //save
  let newProduct = new Product(req.body);
  newProduct = await newProduct.save();
  res.send(newProduct);
};

exports.update_a_product = async function(req, res) {
  const { error } = validate(req.body); 
  if (error) return res.status(400).json(error.details[0].message);
  
  
  let productExists = await Product.findOne({"name":req.body.name, "_id": { $ne: req.params.id } });
  if(productExists) return res.status(409).json("Product already exists");

  //update
  let product = await Product.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});

  if (!product) return res.status(404).send('The product with the given ID was not found.');
  
  res.send(product);
};

exports.delete_a_product = async function(req, res) {
  const prd = await Product.findByIdAndRemove(req.params.id);
  if (!prd) return res.status(404).send('The product with the given ID was not found.');

  res.send(prd);

};



