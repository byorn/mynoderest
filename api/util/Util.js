const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

class Util{

  static async hashPassword(password){
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }

  static async passwordsMatch(requestPassword, storedPasswordWithSalt){
      return await bcrypt.compare(requestPassword,storedPasswordWithSalt)
  }

  static generateAuthToken(user){
    return jwt.sign({_id:user._id, isAdmin:user.isAdmin},config.get("jwtPrivateKey"));
  }
}
module.exports=Util;