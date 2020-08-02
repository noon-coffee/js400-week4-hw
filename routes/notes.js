const { Router } = require("express");
const router = Router();
const noteDAO = require('../daos/note');
const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');
const utils = require('./utils');


// Middleware to enforce authentication on (protect) Notes routes
router.use(async (req, res, next) => { 
  // verify user auth Token
  const reqToken = req.headers.authorization;
  if (!reqToken || reqToken === '') {
    res.sendStatus(401); return;
  }
  const tokenString = utils.parseToken(reqToken);
  const token = await tokenDAO.get(tokenString);
  if (!token) { 
    res.sendStatus(401); return;
  }

  // identify user using token, so User can be correlated with Notes
  const user = await userDAO.getById(token.userId);
  req.user = user;

  // call next middleware function
  next();
});


// Create:
// POST /notes
router.post("/", async (req, res, next) => {
  try
  {
    const reqNoteText = req.body.text;
    if (!reqNoteText || reqNoteText === '') { 
      res.status(400).send('text is required'); return; 
    }

    const noteToCreate = { text: reqNoteText, userId: req.user._id };
    const createdNote = await noteDAO.create(noteToCreate);
    res.json(createdNote);
  }
  catch(err)
  {
    next(err);
  }
});


// Get a single note:
// GET /notes/:id
router.get("/:id", async (req, res, next) => {
  try 
  {
    const noteId = req.params.id;
    if (!noteId || noteId === '') { 
      res.status(400).send('id param value is required'); return; 
    }

    const note = await noteDAO.getById(req.user._id, noteId);
    if (!note) {
      res.sendStatus(404); return;
    }

    res.json(note);
  } 
  catch(err) 
  {
    next(err);
  }
});


// Get all of my notes:
// GET /notes
router.get("/", async (req, res, next) => {
  try
  {
    const notes = await noteDAO.getAll(req.user._id);
    res.json(notes);
  }
  catch(err)
  {
    next(err);
  }
});


module.exports = router;