const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  //_id

  email: {
    type: String,
    required: true,
    //create unique index
    index: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  }
});


module.exports = mongoose.model("users", userSchema);