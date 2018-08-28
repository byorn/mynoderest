'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');


var ProfileSchema = new Schema({
  email: {
    type: String,
    required: 'email is required',
    minlength:5,
    maxlength:300,
    unique:true
  },
  firstName: {
    type: String,
    minlength:5,
    maxlength:50
  },
  lastName: {
    type: String,
    minlength:5,
    maxlength:50
  },
  pic: {
    type: String,
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

function validateProfile(profile){
  const schema = {
    email: Joi.string().min(5).max(300).required().email(),
    firstName: Joi.string().min(5).max(50),
    lastName: Joi.string().min(5).max(50),
    pic:Joi.string().valid('').optional()
  }
  return Joi.validate(profile, schema);
}



module.exports.Profile = mongoose.model('Profile', ProfileSchema);
module.exports.validate = validateProfile;
