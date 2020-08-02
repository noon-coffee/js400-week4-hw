const mongoose = require('mongoose');
const User = require('../models/user');


module.exports = {};

module.exports.create = async(userData) => {
  const created = await User.create(userData);
  return created;
}

module.exports.getById = async(userId) => {
  return User.findOne( { _id: userId } ).lean();
}

module.exports.getByEmail = async(email) => {
  return User.findOne( { email: email } ).lean();
}

module.exports.updateById = async(userId, newObj) => {
  await User.updateOne( { _id: userId }, newObj );
  return true;
}