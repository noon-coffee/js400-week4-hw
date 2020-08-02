const mongoose = require('mongoose');
const Note = require('../models/note');


module.exports = {};

module.exports.create = async(noteData) => {
  const created = await Note.create(noteData);
  return created;
}

module.exports.getById = async(userId, noteId) => {
  return Note.findOne( { userId: userId, _id: noteId } );
}

module.exports.getAll = async(userId) => {
  return Note.find( { userId: userId } ).lean();
}