'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');


var ProductSchema = new Schema({
  name: {
    type: String,
    required: 'name is required',
    minlength:1,
    maxlength:50,
    unique:true,
   },
  description: {
    type: String,
    minlength:1,
    maxlength:500,
  },
  category : { type: Schema.Types.ObjectId, ref: 'Category' },
  price: { type: Schema.Types.Decimal128 },
  qty: {type:Number, min:1, max:99999},
  pics: [{type: Schema.Types.ObjectId, ref: 'Image'}]
  
    
});

function validateProduct(product){
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    description: Joi.string().min(1).max(500),
    category: Joi.string(),
    price: Joi.number(),
    qty: Joi.number(),
    pics: [Joi.string()]
  }
  return Joi.validate(product, schema);
}



module.exports.Product = mongoose.model('Product', ProductSchema);
module.exports.validate = validateProduct;
