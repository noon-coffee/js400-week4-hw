const { Router } = require("express");
const router = Router();
const noteDAO = require('../daos/note');
const utils = require('./utils');


// Create:
// POST /notes
router.post("/", utils.isUserAuth, async (req, res, next) => {
  try
  {
    const reqNoteText = req.body.text;
    if (!reqNoteText || reqNoteText === '') { 
      res.status(400).send('text is required'); 
      return; 
    }

    const noteToCreate = { text: reqNoteText, userId: req.userId };
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
router.get("/:id", utils.isUserAuth, async (req, res, next) => {
  try 
  {
    const noteId = req.params.id;
    if (!noteId || noteId === '') { 
      res.status(400).send('id param value is required'); 
      return; 
    }

    const note = await noteDAO.getById(req.userId, noteId);
    if (!note) {
      res.sendStatus(404); 
      return;
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
router.get("/", utils.isUserAuth, async (req, res, next) => {
  try
  {
    const notes = await noteDAO.getAll(req.userId);
    res.json(notes);
  }
  catch(err)
  {
    next(err);
  }
});


module.exports = router;