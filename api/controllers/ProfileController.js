'use strict';
const {Profile,validate} = require('../models/Profile');
const _ = require('lodash');

exports.create_profile = async function(req, res) {
  const { error } = validate(req.body); 
  if (error) return res.status(400).json(error.details[0].message);
  
  let existing = await Profile.findOne({"email":req.body.email});
  if(existing) return res.status(400).json("Profile already created");

  let profile = new Profile(req.body);
  profile = await profile.save();
  res.send(profile);
};


exports.load_profile = async function(req, res) {
    let profile =  await Profile.findOne({ email: req.params.email });
    if (!profile) return res.status(404).json('The profile with the given email was not found.');
    res.send(profile);
};


