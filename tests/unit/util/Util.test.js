const Util = require('../../../api/util/Util')
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('Util.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const userObj = { 
      _id: new mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true 
    };
    const token = Util.generateAuthToken(userObj);
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(userObj);
  });
});