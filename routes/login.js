const { Router } = require("express");
const router = Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');
const utils = require('./utils');

const numSaltRounds = 12;

// Login:
// POST /login
router.post("/", async (req, res, next) => { 
  try
  {
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;
    if (!reqEmail || reqEmail === '') { 
      res.status(400).send('email is required'); return; 
    }
    if (!reqPassword || reqPassword === '') { 
      res.status(400).send('password is required'); return; 
    }

    // verify User creds - both email and password need to match
    const existingUser = await userDAO.getByEmail(reqEmail);
    if (!existingUser) {
      res.sendStatus(401); return;
    }
    const isMatch = await bcrypt.compare(reqPassword, existingUser.password);
    if (!isMatch) {
      res.sendStatus(401); return;
    }

    // generate and persist user auth Token
    const tokenString = uuidv4();
    const token = { userId: existingUser._id, token: tokenString  };
    await tokenDAO.create(token);

    // respond with user auth Token
    res.json( {token: tokenString} );
  }
  catch (err)
  {
    next(err);
  }
});


// Signup: 
// POST /login/signup
router.post("/signup", async (req, res, next) => {
  try
  {
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;
    if (!reqEmail || reqEmail === '') { 
      res.status(400).send('email is required'); return; 
    }
    if (!reqPassword || reqPassword === '') { 
      res.status(400).send('password is required'); return; 
    }

    // create and persist User using their signup creds
    // (e.g., email and hashed! password)
    const passwordHash = await bcrypt.hash(reqPassword, numSaltRounds);
    const userToCreate = { email: reqEmail, password: passwordHash };
    await userDAO.create(userToCreate);

    res.sendStatus(200);
  }
  catch(err)
  {
    next(err);
  }
});


// Logout:
// POST /login/logout
router.post("/logout", async (req, res, next) => {
  try
  {
    // User should already have user auth Token (already be authenticated)
    const reqToken = req.headers.authorization;
    if (!reqToken || reqToken === '') {
      res.sendStatus(401); return;
    }

    // verify token
    const tokenString = utils.parseToken(reqToken);
    const token = await tokenDAO.get(tokenString);
    if (!token) {
      res.sendStatus(401); return;
    }

    // invalidate token
    await tokenDAO.delete(tokenString);

    res.sendStatus(200);
  }
  catch(err)
  {
    next(err);
  }
});


// Change Password:
// POST /login/password
router.post("/password", async (req, res, next) => { 
  try
  {
    const reqPassword = req.body.password;
    if (!reqPassword || reqPassword === '') { 
      res.status(400).send('password is required'); return; 
    }

    // User should already have user auth Token (already be authenticated)
    const reqToken = req.headers.authorization;
    if (!reqToken || reqToken === '') {
      res.sendStatus(401); return;
    }

    // verify token
    const tokenString = utils.parseToken(reqToken);
    const token = await tokenDAO.get(tokenString);
    if (!token) {
      res.sendStatus(401); return;
    }

    // identify user using token
    const { userId } = token;
    const existingUser = await userDAO.getById(userId);

    // persist new User hashed! password cred
    const passwordHash = await bcrypt.hash(reqPassword, numSaltRounds);
    const userToUpdate = { email: existingUser.email, password: passwordHash };
    await userDAO.updateById(userId, userToUpdate);

    res.sendStatus(200);
  }
  catch(err)
  {
    next(err);
  }
});


module.exports = router;