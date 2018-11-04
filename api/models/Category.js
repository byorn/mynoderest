'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');


var CategorySchema = new Schema({
  name: {
    type: String,
    required: 'name is required',
    minlength:1,
    maxlength:50,
    unique:true
  },
  description: {
    type: String,
    minlength:1,
    maxlength:500,
  },
  pic: {
    type: String,
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
    
});

function validateCategory(category){
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(1).max(500),
    pic: Joi.string()
  }
  return Joi.validate(category, schema);
}


module.exports.Category = mongoose.model('Category', CategorySchema);
module.exports.validate = validateCategory;
