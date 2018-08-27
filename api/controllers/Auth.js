const {User} = require('../models/User');
const Util = require('../util/Util');


exports.login = async function (req, res){

    let user = await User.findOne({"email":req.body.email});
    if(!user) return res.status(401).json("Incorrect login credentials");

    if(!await Util.passwordsMatch(req.body.password, user.password)){
        return res.status(401).json("Incorrect login credentials");
    }
    user.password = undefined;
    
    res.header('x-auth-token', Util.generateAuthToken(user))
                .send(user);
    

}

