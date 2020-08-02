const mongoose = require('mongoose');
const Token = require('../models/token');


module.exports = {};

module.exports.create = async(tokenData) => {
  const created = await Token.create(tokenData);
  return created;
}

module.exports.get = async(tokenString) => {
  return Token.findOne( { token: tokenString } );
}

module.exports.delete = async(tokenString) => {
  await Token.deleteOne( { token: tokenString } );
  return true;
}