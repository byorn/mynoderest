const authorizationMiddleware = require('../../../api/middleware/authorization');
const Util = require('../../../api/util/Util');
const mongoose = require('mongoose');

describe('Authorization Middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = { 
      _id: mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true 
    };
    const token = Util.generateAuthToken(user);
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {};
    const next = jest.fn();
    
    authorizationMiddleware(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});