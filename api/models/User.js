'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');


var UserSchema = new Schema({
  name: {
    type: String,
    required: 'name is required',
    minlength:5,
    maxlength:50
  },
  email: {
    type: String,
    required: 'email is required',
    minlength:5,
    maxlength:300,
    unique:true
  },
  password: {
    type: String,
    required: 'password is required',
    minlength:5,
    maxlength:1024,
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type:Boolean,
    default:false
  }
  
});

function validateUser(user){
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(300).required().email(),
    password: Joi.string().min(5).max(300).required(),
    isAdmin:Joi.boolean()
  }
  return Joi.validate(user, schema);
}

function validateUserForUpdate(user){
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(300).required().email(),
    isAdmin:Joi.boolean()
  }
  return Joi.validate(user, schema);
}

module.exports.User = mongoose.model('User', UserSchema);
module.exports.validate = validateUser;
module.exports.validateUpdate = validateUserForUpdate;