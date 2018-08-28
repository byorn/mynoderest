'use strict';
module.exports = function(app) {
   const taskController = require('../controllers/TaskController');
   const userController = require('../controllers/UserController');
   const profileController = require('../controllers/ProfileController');
   const auth = require('../controllers/Auth');
   const authr = require('../middleware/authorization');
   const adminauthr = require('../middleware/adminauthorization');
   const error = require('../middleware/error');
   const validateID = require('../middleware/validateObjectId');
   const cors = require('../middleware/cors'); 

   app.use(cors);

  app.get("/", function(req, res) {
    res.status(200).send("Welcome to our restful API Byorn s");
  });
  
  app.route('/tasks')
    .get(taskController.list_all_tasks)
    .post(authr,taskController.create_a_task);


  app.route('/tasks/:id')
    .get(validateID,taskController.read_a_task)
    .put([authr,validateID],taskController.update_a_task)
    .delete([authr,adminauthr,validateID],taskController.delete_a_task);

  app.route('/profile')
     .post(authr,profileController.create_profile);

  app.route('/profile/:email')
     .get(profileController.load_profile);

  app.route('/users')
  .get(userController.list_all_users)
  .post(userController.create_a_user);

  app.route('/me')
  .get(authr, userController.me);

  app.route('/users/:id')
  .get(validateID,userController.read_a_user)
  .put([authr,validateID],userController.update_a_user)
  .delete([authr,adminauthr,validateID],userController.delete_a_user);

  app.route('/login').post(auth.login);
  app.use(error);
};
