'use strict';
var mongoose = require('mongoose');
var Joi = require('joi');
var Schema = mongoose.Schema;


var ImageSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the image',
    minlength:1,
    maxlength:100
  },
  Created_date: {
    type: Date,
    default: Date.now
  }

});

function validate(image) {
  const schema = {
    name: Joi.string().min(1).max(100).required()
  };

  return Joi.validate(image, schema);
}

exports.Image = mongoose.model('Image', ImageSchema);
exports.validate = validate;