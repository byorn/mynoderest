'use strict';
const {User,validate,validateUpdate} = require('../models/User');
const _ = require('lodash');
const Util = require('../util/Util')

exports.list_all_users = async function(req, res) {
  let user = await User.find().select('-password');
  res.send(user);
};



exports.create_a_user = async function(req, res) {

    const {error} = validate(req.body);
      //if validation fails
    if(error) return res.status(400).json(error.details[0].message);
      
      //if user already registered
    let user = await User.findOne({"email":req.body.email});
    if(user) return res.status(400).json("User already registered");

    //user = new User({"name":req.body.name, "email":req.body.email, "password":req.body.password});
    user = new User(_.pick(req.body,['name','email','password','isAdmin']));
    user.password = await Util.hashPassword(user.password);

    await user.save();
    
    const token = Util.generateAuthToken(user);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email','isAdmin']));
    
};


exports.read_a_user = async function(req, res) {
  let user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).send('The user with the given ID was not found.');
  res.send(user);
};


exports.update_a_user = async function(req, res) {
  const {error} = validateUpdate(req.body);
  if(error) return res.status(400).json(error.details[0].message);
  
  let userObjToUpdate = req.body;
  userObjToUpdate.password = await Util.hashPassword(req.body.password);

  let existingUser = await User.findOne({"email":userObjToUpdate.email, "_id": { $ne: req.params.id } });
  if(existingUser) return res.status(400).json(`${userObjToUpdate.email} already exists in system`);


  let user = await User.findOneAndUpdate({_id: req.params.id}, userObjToUpdate, {new: true});

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
};

exports.update_profile_pic = async function(req, res){
  let userObjToUpdate = req.body;

  let user = await User.findOneAndUpdate({_id: req.params.id}, userObjToUpdate, {new: true});

  res.send(user);
};


exports.delete_a_user = async function(req, res) {

  let user = await User.findByIdAndRemove({ _id: req.params.id });
  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
};
