'use strict';
const {Task, validate} = require('../models/Task');


exports.list_all_tasks = async (req, res) => {
  const task = await Task.find();
 
  res.send(task);
};


exports.create_a_task = async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).json(error.details[0].message);
  
  let newTask = new Task(req.body);
  newTask = await newTask.save();
  res.send(newTask);
};


exports.read_a_task = async function(req, res) {
 let task =  await Task.findById(req.params.id);
 if (!task) return res.status(404).send('The task with the given ID was not found.');
 res.send(task);
};


exports.update_a_task = async function(req, res) {
  const { error } = validate(req.body); 
  if (error) return res.status(400).json(error.details[0].message);

  let task = await Task.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});

  if (!task) return res.status(404).send('The task with the given ID was not found.');
  
  res.send(task);
};


exports.delete_a_task = async function(req, res) {
  const task = await Task.findByIdAndRemove(req.params.id);
  if (!task) return res.status(404).send('The task with the given ID was not found.');

  res.send(task);

};
