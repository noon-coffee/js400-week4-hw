const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');


module.exports = {};

// Middleware to enforce authentication on protected routes
module.exports.isUserAuth = (async (req, res, next) => { 
  try
  {
    // User should already have user auth Token (already be authenticated)
    const reqToken = req.headers.authorization;
    if (!reqToken || reqToken === '') {
      res.sendStatus(401); return;
    }

    // verify token
    const tokenString = parseToken(reqToken);
    const token = await tokenDAO.get(tokenString);
    if (!token) { 
      res.sendStatus(401); return;
    }
    //note: there's probably a more straightforward way of accomplishing this. it's
    //essentially replacing the bearer token sans prefix, so that just the token
    //string can be referenced by any downstream middleware functions.
    req.headers.authorization = tokenString;

    // identify user using token (e.g., so User can be correlated with Notes)
    const user = await userDAO.getById(token.userId);
    req.userId = user._id;

    // call next middleware function
    next();
  }
  catch(err)
  {
    next(err)
  }
});

const parseToken = (reqHeaderToken) => {
  return reqHeaderToken.startsWith('Bearer ') 
    ? reqHeaderToken.slice(7, reqHeaderToken.length).trimLeft() : reqHeaderToken;
}