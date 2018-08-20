const Joi = require('joi');
const {User} = require('../models/User');
const Util = require('../util/Util');


exports.login = async function (req, res){

    const { error } = validate(req);
    if(error) return res.status(400).send(error.details[0].message);
   
    let user = await User.findOne({"email":req.body.email});
    if(!user) return res.status(400).send("Invalid email or password");

    if(!await Util.passwordsMatch(req.body.password, user.password)){
        return res.status(400).send("Invalid email or password");
    }
    
    return res.send(Util.generateAuthToken(user));

}

function validate(req){
    const schema = {
        email: Joi.string().min(5).max(300).required().email(),
        password: Joi.string().min(5).max(300).required(),
      }
      return Joi.validate(req.body, schema);
}