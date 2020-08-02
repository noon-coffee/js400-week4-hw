const mongoose = require('mongoose');


const tokenSchema = new mongoose.Schema({
  //_id

  token: {
    type: String,
    required: true,
    // token values should be unique
    index: true,
    unique: true,
  },

  userId: { 
    type: String,
    required: true,
  },
});


module.exports = mongoose.model("tokens", tokenSchema);