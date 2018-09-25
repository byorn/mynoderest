'use strict';
const {Category, validate} = require('../models/Category');


exports.list_all_categorys = async (req, res) => {
  const category = await Category.find();
 
  res.send(category);
};


exports.create_a_category = async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).json(error.details[0].message);
  
  let newCat = new Category(req.body);
  newCat = await newCat.save();
  res.send(newCat);
};


exports.read_a_category = async function(req, res) {
 let category =  await Category.findById(req.params.id);
 if (!category) return res.status(404).send('The category with the given ID was not found.');
 res.send(category);
};


exports.update_a_category = async function(req, res) {
  const { error } = validate(req.body); 
  if (error) return res.status(400).json(error.details[0].message);

  let cat = await Category.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});

  if (!cat) return res.status(404).send('The category with the given ID was not found.');
  
  res.send(cat);
};


exports.delete_a_category = async function(req, res) {
  const cat = await Category.findByIdAndRemove(req.params.id);
  if (!cat) return res.status(404).send('The category with the given ID was not found.');

  res.send(cat);

};
