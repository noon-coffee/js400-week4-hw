const { Router } = require("express");
const router = Router();


router.use("/login", require('./login'));
router.use("/notes", require('./notes'));

// Middleware for error handling
router.use(async (err, req, res, next) => {
  if (err.message.includes("Cast to ObjectId failed")) 
  {    
    res.status(400).send('Invalid id provided.');
  } 
  else if (err.message.includes("E11000 duplicate key error"))
  {
    res.sendStatus(409);
  } 
  else 
  {    
    res.status(500).send('An unexpected error occurred.')  
  } 
});


module.exports = router;