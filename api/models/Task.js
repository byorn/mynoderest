'use strict';
var mongoose = require('mongoose');
var Joi = require('joi');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task',
    minlength:5,
    maxlength:300
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

function validate(task) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  };

  return Joi.validate(task, schema);
}

exports.Task = mongoose.model('Task', TaskSchema);
exports.validate = validate;